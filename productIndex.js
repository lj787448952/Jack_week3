import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
    //資料
    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io/api',
            apiPath: 'lj787448952',
            products:[],
            isNew: false,
            tempProduct:{
                imagesUrl:[],
            }
        }
    },
    //生命週期
    mounted(){
        //Modal
        productModal = new bootstrap.Modal(document.getElementById('productModal'),{
            keyboard:false
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });
       //取出token
       const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
       if(token === ''){
           alert('您尚未登入，請登入')
           window.location = 'login.html';
       }
       //每一次發出請求時可以設定預設值
       axios.defaults.headers.common.Authorization = token;

       this.getData();
    },
    //方法
    methods:{

        getData(page = 1){
            const url = `${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`;
            axios.get(url).then((res)=>{
                if(res.data.success){
                    console.log(res);
                    this.products = res.data.products;
                }else{
                    alert(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            })
        },

        updateProduct() {
            let url = `${this.apiUrl}/${this.apiPath}/admin/product`;
            let http = 'post';

            if(!this.isNew){
                url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put'
            }
            axios[http](url, {data: this.tempProduct}).then((res)=>{
                if(res.data.success){
                    alert(res.data.message);
                    productModal.hide();
                    this.getData();
                }else{
                    alert(res.data.message);
                }
            })
        },

        //1: Bootstrap Modal實體
        //2: 套用Modal.show()方法
        openModal(isNew,item){
            if(isNew === 'new'){
                this.tempProduct = {
                    imagesUrl:[],
                }
                this.isNew = true;
                productModal.show();
            }else if(isNew === 'edit'){
                this.tempProduct = {...item};
                this.isNew = false;
                productModal.show();
            }else if(isNew === 'delete'){
                this.tempProduct = {...item};
                delProductModal.show();
            }
        },

        delProduct(){
            const url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;

            axios.delete(url).then((res)=>{
                if(res.data.success){
                    alert(res.data.success);
                    delProductModal.hide();
                    this.getData();
                }else{
                    alert(res.data.message)
                }
            }).catch((error)=>{
                console.log(error);
            });
        },
        createImages(){
            this.tempProduct.imagesUrl=[];
            this.tempProduct.imagesUrl.push('');
        }
    }
    
}).mount('#app');


