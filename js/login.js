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
                    setTimeout(function () { 
                        location.href="/index.html"
                     },1000)
                }else{
                    mui.toast(res.meta.msg);

                }
             })

          })
    }

 })