$(function () { 
    init();
    function init() { 
        //判断是否登陆 拓展方法获取到全局本地永久存储来判断，如果本地永久存储没数据，跳回到login页面，
        if(!$.checkLogin()){
            //会话存储当前页面,等登陆完成后取到会话存储的当前页面
            sessionStorage.setItem("pages",location.href);
            location.href="/pages/login.html";
            return;
        }else{
            $('body').fadeIn();
        }
        getCartdata()
        changNum()  
     }
    //查询购物车数据
    function getCartdata(){
        //获取到token，调用拓展的token的方法， 判断有没有登陆
        var token=$.token();
        // console.log(token);
        // debugger;
        //发送请求ajaxq请求，发送的时候也发送token，判断有咩有登陆
        $.ajax({
            type:"get",
            url:"my/cart/all",
            headers:{
                "Authorization" : token
            },
            success:function (res) { 
                // console.log(res);
                // debugger;
                if(res.meta.status==200){
                    //将获取回来的json数据字符串解析为对象
                    var cart_info=JSON.parse(res.data.cart_info);
                    console.log(cart_info);
                    // debugger
                    //创建模板
                    var html=template("indentTmp",{data:cart_info});
                    $(".indent_details ul").html(html)
                    //动态创建的输入框需要手动初始话
                    mui(".mui-numbox").numbox()
                    //计算总的价格
                    get_total()

                }else{
                   console.log(res.meta.msg);
                }
               
             }
        })
    }
    //计算总价格，拿到存在li的data  信息，计算中的价格
    function  get_total() { 
        //获取到所有的li标签
        var lis=$(".indent_details li");
        //设置一个总价格的变量
        var total=0;
        for(var i=0;i<lis.length;i++){
            var li=lis[i];
            var goods_price=$(li).data("msg");
            //单价
            var tmp_price=goods_price.goods_price;
            //获取到购买的数量
            var nums=$(li).find(".mui-numbox-input").val();
            //计算总的价格
            total+=tmp_price*nums;
            console.log(total);
        }
        //赋值显示
        $("#total_price").text(total);
     }
    //给加号和减号注册事件 ,委托的方式
    function changNum(){
        $(".indent_details").on("tap","button",function () { 
            get_total();
         })
         //点击编辑切换类，让影藏的元素显示
         $("#edit_btn").on("tap",function () { 
             $("body").toggleClass('toggle_class');
                //编辑文字改变为完成
            if($('body').hasClass("toggle_class")){
                $("#edit_btn").text("完成")
            }else{
            $("#edit_btn").text("编辑")
            }
          })
    }
 })