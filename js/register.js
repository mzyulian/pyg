$(function(){
    init()
    function init(){
       eventList()   
    }
    //获取验证码
    function eventList() { 
        //1.点击按钮，判断手机号是否合法，不合法提示   2.改变样式，禁用按钮，防止多次点击
         $("#code_btn").on('tap',function () { 
             //判断手机号码
             var mobile_msg=$("[name='mobile']").val().trim();
            //  debugger
             //调用拓展(给$拓展的方法)的方法判断手机的合法性
             if(!$.checkPhone(mobile_msg)){
                mui.toast("请输入正确的手机号码")
                return;
             }
             //手机号码合法则发送请求
             $.post("users/get_reg_code",{mobile:mobile_msg},function(res){
                 console.log(res);
                 if(res.meta.status==200){
                     //数据获取成功，禁用按钮，设置倒计时
                     $("#code_btn").attr("disabled","disabled");
                     var times=5;
                     $("#code_btn").text(""+times+"秒后再获取");
                     //设置计时器
                     var timeId=setInterval(function(){
                        times--;
                        $("#code_btn").text(""+times+"秒后再获取"); 
                        if(times==0){
                            clearInterval(timeId)
                            $("#code_btn").text("获取验证码").removeAttr("disabled"); 
                        }  
                     },1000)
                 }else{
                    mui.toast(res.meta.msg)
                 }
             })
          })
        //点击注册按钮，
        $("#reg_btn").on("tap",function(){
            //获取到表单的值
            var mobile_msg=$("[name='mobile']").val().trim();
            var code_msg=$("[name='code']").val().trim();
            var email_msg=$("[name='email']").val().trim();
            var pwd_msg=$("[name='pwd']").val().trim();
            var pwd_msg1=$("[name='pwd1']").val().trim();
            var gender_msg=$("[name='gender']:checked").val();

            //判断合法性
            //1.手机
            if(!$.checkPhone(mobile_msg)){
                mui.toast("手机不合法") 
                return;
            }
            //2.判断验证码，验证码长度不是4位数就不合法，验证码正不正确交由后台判断
            if(code_msg.length!=4){
                mui.toast("验证码不合法");
                return;
            }
            //3.判断邮箱的合法性，方法拓展到zepto的$对象,直接调用来判断
            if(!$.checkEmail(email_msg)){
                mui.toast("邮箱不合法");
                return;
            }
            //4.判断密码的长度是否小于6位数，6位以下不合法
            if(pwd_msg.length<6){
                mui.toast("密码不合法");
                return;
            }
            //5.判断两次的密码输入是否正确
            if(pwd_msg!=pwd_msg1){
                mui.toast("两次输入的密码不一致");
                return;
            }
            //发送请求，注册账号
            $.post("users/reg",{
                mobile:mobile_msg,
                code:code_msg,	
                email:email_msg,	
                pwd:pwd_msg,
                gender:gender_msg
            },function (res) { 
                console.log(res);
                //判断是否注册成功，成功后跳转到login登陆页面
                if(res.meta.status==200){
                    mui.toast(res.meta.msg);
                     setTimeout(function () { 
                         //1s 后跳转到login页面
                         location.href="/pages/login.html"
                      },1000)
                }else{
                    mui.toast(res.meta.msg)
                }
             })
        })
     }
})