import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
    data(){
        return{
            apiUrl: 'https://vue3-course-api.hexschool.io',
            user:{
                username:'',
                password:''
            },
            page:'',
        }
    },
    methods:{
        login(){
            const api = `${this.apiUrl}/admin/signin`
            if(!this.page){
                 return alert('選擇你要的頁面');
            }
            axios.post(api,this.user)
            .then((res)=>{
                if(res.data.success){
                    console.log(res.data);
                    const { token,expired } = res.data;
                    document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
                    window.location = `${this.page}.html`;
                }else{
                    alert(res.data.message);
                }
            })
            .catch((error)=>{
                console.log(error);
            });
        },
    },
}).mount('#app');

