$(function () { 
    inti()
    function inti(){
         //判断手机以及密码的合法性
         $("#login_btn").on("tap",function () { 
             //获取到手机号码,密码判断合法性
            var mobile_msg=$("[name='mobile']").val().trim();
            var pwd_msg=$("[name='pwd']").val().trim();
            //判断手机
            if(!$.checkPhone(mobile_msg)){
                mui.toast('手机不合法');
                return;
            }
            //判断密码
            if(pwd_msg.length<6){
                mui.toast('密码不合法');
                return;
            }
            //请求
            $.post("login",{
                username:mobile_msg,	
                password:pwd_msg
            },function (res) { 
                console.log(res);
                if(res.meta.status==200){
                    mui.toast(res.meta.msg);
                    //登陆成功，设置全局的token(token ==>字符串，随请求头随ajax请求到后台，比较cookie更安全，设置到浏览器的本地永久存储)
                    //存的是对象，复杂类型，先转为字符串
                    localStorage.setItem("userinfo",JSON.stringify(res.data))
                    // debugger
                    setTimeout(function () { 
                        //判断会话存储是否有跳转过来的页面，有的话登陆成功后跳转到原来的页面,没有的话跳到首页
                        var pages=sessionStorage.getItem("pages")
                        if(pages){
                          location.href=pages;
                        }else{
                           location.href="/index.html"
                        }
                     },1000)
                }else{
                    mui.toast(res.meta.msg);

                }
             })

          })
    }

 })