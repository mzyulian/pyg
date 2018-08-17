$(function(){
    init();
    //声明一个全局的变量存储商品的信息
    var goodsMsg;
    function init(){
         getDetails()
         add_goods()
    }


    //页面渲染
    function getDetails() { 
                //获得slider插件对象
                //发送请求 调用方法获取到url地址栏的参数,获取url地址栏信息的方法已经拓展到zepto的$里面，直接调用即可，然后请求
                $.get("goods/detail",{goods_id:$.getUrlvalue("goods_id")},function(res){
                    console.log(res);
                    //商品信息存到全局变量,下面点击添加到购物车的时候要使用
                    goodsMsg=res.data;
                    var html=template("goods_details",{"data":res.data})
                    $(".pyg_content").html(html);
                    var gallery = mui('.mui-slider');
                    gallery.slider({
                    interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
                    });
                })
     }
     //加入到购物车
     function add_goods(){
        $(".add_goods").on("tap",function(){

             //判断本地的永久存储是否存有userinfo,没有的话会话存储记录下当前页然后跳转到登陆页面
             if(!$.checkLogin()){
                 mui.toast("未登陆")
                 //會話存儲當前頁面
                 $.setpage();
               setTimeout(function () { 
                   location.href="/pages/login.html"
                },1000)
                return;
             }

             //在全局的变量中获取到商品的信息，然后发送请求
             //  debugger
             var obj={
                cat_id:goodsMsg.cat_id,
                goods_id:goodsMsg.goods_id,
                goods_name:goodsMsg.goods_name,
                goods_number:goodsMsg.goods_number,
                goods_price:goodsMsg.goods_price,
                goods_weight:goodsMsg.goods_weight,
                goods_small_logo:goodsMsg.goods_small_logo
             }
             //获取到token,登陆的时候已经设置在本地的永久存储，在全局的localstroge 本地永久存储中 获取的时候将字符串转为对象的JSON.Parse()
             var token=$.token();
             //发送ajax请求
             $.ajax({
                 url:"my/cart/add",
                 //将对象数据转为字符串
                 data:{info:JSON.stringify(obj)},
                 type:"post",
                 //将本地永久存储的token一起随请求头发送到后台
                 headers:{"Authorization" : token},
                 success:function(res){
                     console.log(res);
                    //  debugger
                     //无效的token,表示没有登陆，会话存储当前的页面，然后跳转到登陆页
                    if (res.meta.status==401){
                        mui.toast("未登录");
                       $.setpage();
                       setTimeout(function(){
                             //跳转到登录页
                             location.href="/pages/login.html";
                       },1000)
                    }else{
                        //如果是登陆了，弹框确认是否添加到购物车，然后跳转
                          mui.confirm("是否跳转到购物车页面","添加成功",["是","取消"],function (msg){ 
                              console.log(msg);
                              //取消跳转
                              if(msg.index==1){
                                //不跳转     
                              }else if(msg.index==0){
                                  location.href="/pages/cart.html"
                              }
                           })
                                          // location.href="/pages/cart.html";
                    }
                 }
             })
        })
     }
})
