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
            },
            pagination:{},
        }
    },
    //生命週期
    mounted(){
        // //Modal
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
                    this.pagination = res.data.pagination;
                }else{
                    alert(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            })
        },

        updateProduct(tempProduct) {
            let url = `${this.apiUrl}/${this.apiPath}/admin/product`;
            let http = 'post';

            if(!this.isNew){
                url = `${this.apiUrl}/${this.apiPath}/admin/product/${tempProduct.id}`;
                http = 'put'
            }
            axios[http](url, {data: tempProduct}).then((res)=>{
                if(res.data.success){
                    alert(res.data.message);
                    productModal.hide();
                    this.getData();
                }else{
                    alert(res.data.message);
                }
            }).catch((error)=>{
                console.log(error);
            });
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

        
    }
    
})
//分頁元件
    .component('pagination',{
        template: '#pagination',
        props:{
            pages:{
                type: Object,
                default(){
                    return{
                        
                    }
                }
            }
        },
        methods:{
            emitPages(item){
                console.log(item); // 1
                this.$emit('emit-pages', item);
            }
        },
    })
//產品新增編輯元件
    .component('productModal',{
        template: '#productModal',
        props:{
            tempProduct:{
                type: Object,
                default(){
                    return{
                        imagesUrl:[],
                    }
                }
            },
            methods:{
                createImages(){
                    this.products.imagesUrl=[];
                    this.products.imagesUrl.push('');
                }
            }
        },
    })
//產品刪除元件
    .component('delProductModal',{
        template: '#delProductModal',
        props:{
            tempProduct:{
                type: Object,
                default(){
                    return{
                        
                    }
                }
            },
        },
        methods:{
            delProduct(){
                const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
    
                axios.delete(url).then((res)=>{
                    if(res.data.success){
                        alert(res.data.success);
                        this.hideModal();
                        this.$emit('update');
                    }else{
                        alert(res.data.message)
                    }
                }).catch((error)=>{
                    console.log(error);
                });
            },
            openModal(){
                delProductModal.show();
                console.log(delProduct())
            },
            hideModal(){
                delProductModal.hide();
                console.log(delProduct())
            }
        }
    })
.mount('#app');


