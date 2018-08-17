$(function () { 
    init();
    function init(){
        //判断是否登陆
        if(!$.checkLogin()){
            //没登陆的话跳到login
            $.setpage();
            location.href="/pages/login.html";
            return;
        }else{
          $("body").fadeIn();
        }
        getorders_data()
    }
    function getorders_data(){
        $.ajax({
            type: "get",
            url: "my/orders/all",
            headers:{
                "Authorization" : $.token()
            },
            data: {
                type:1
            },
            dataType: "json",
            success: function (res) {
                console.log(res);   
                if(res.meta.status==200){
                    var html=template("order_tmp",{data:res.data})
                    $("#item1 ul").html(html);
                }else{
                    mui.toast(res.meta.msg)
                }
            }
        });
    }
 })