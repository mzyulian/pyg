$(function () { 
    init()
    function init() { 
        //判断是否登陆
        if(!$.checkLogin()){
            //会话存储当前页
            $.setpage();
            //跳转到登陆页
            setTimeout(function () { 
                location.href="/pages/login.html"
                return
             },1000)
        }else{
           $("body").fadeIn();
        }
        getuser_data()
        login_out()
     }
     //页面渲染
     function getuser_data(){
         $.ajax({
             type: "get",
             url: "my/users/userinfo",
             dataType: "json",
             headers:{
                "Authorization" : $.token()
             },
             success: function (res) {
                 console.log(res);
                if(res.meta.status==200){
                    var html=template("me_tmp",{data:res.data})
                    $(".user").html(html)
                }else{
                    mui.toast(res.meta.msg)
                }
             }
         });
     }
     //退出登陆 ===>清除本地的永久存储
     function login_out(){
        $("#login_out_btn").on("tap",function () { 
            mui.confirm("确定退出吗?","提示",["确定","取消"],function (msg) { 
                // console.log(msg);
                if(msg.index==0){
                    //清除本地永久存储(调用一个拓展清除本地永久存储的方法)
                    $.removeUser()
                    //记录当前页(调用一个拓展的记录当前页的方法)
                    $.setpage();
                    //跳转到登陆页
                    location.href="/pages/login.html";

                }else if(msg.index==1){
                    console.log("取消");
                }
             })
         })
     }


 })