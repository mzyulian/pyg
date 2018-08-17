$(function () { 
    init();
    function init() { 
        //判断是否登陆 拓展方法获取到全局本地永久存储来判断，如果本地永久存储没数据，跳回到login页面，
        if(!$.checkLogin()){
            //会话存储当前页面,等登陆完成后取到会话存储的当前页面
            $.setpage();
            location.href="/pages/login.html";
            return;
        }else{
            $('body').fadeIn();
        }
        getCartdata()
        changNum()  
     }
    //查询购物车数据(渲染页面))
    function getCartdata(){

        //发送请求ajaxq请求，发送的时候也发送token，判断有咩有登陆
        $.ajax({
            type:"get",
            url:"my/cart/all",
            headers:{
                "Authorization" : $.token()
            },
            success:function (res) { 
                // console.log(res);
                // debugger;
                if(res.meta.status==200){
                    //将获取回来的json数据字符串解析为对象
                    var cart_info=JSON.parse(res.data.cart_info);
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
        }
        //赋值显示
        $("#total_price").text(total);
     }
    //给加号和减号 删除按钮等 注册事件 ,委托的方式
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
            //点击编辑按钮，完成数据的编辑功能 1.判断有没有商品，没有的话直接return，有的话重新获取下购买商品的数量
            var lis=$('.indent_details li') 
            if(lis.length==0){
                mui.toast("你还没有选购商品");
                return;
            }
              //需要发布数据同步到后台
              var infos={};
              for(var i=0;i<lis.length;i++){
                  var li=lis[i];
                  //获取到li里面的自定义的属性的值
                  var msg=$(li).data('msg');
                  //   console.log(msg);
                  //获取到购买的数量,将存到li里面的自定义的商品的数量改变，然后发送到后台
                  msg.amount=$(li).find(".mui-numbox-input").val();
                  infos[msg.goods_id]=msg;
              }   
                //同步数据，渲染页面
                sync_data(infos);
            }
          })
          //点击删除按钮，备注(获取到没有被选中的数据，发送到后台，后台返回数据后再重新渲染页面)
          $("#delete_btn").on("tap",function(){
              //获取到被选中的订单
            var chcks= $(".indent_details [name='checkbox1']:checked");
            //判断选中的商品的长度，
            if(chcks.length==0){
                mui.toast("还没选中商品");
                return;
            }
            //弹框提示是否要删除
            mui.confirm("确定要删除吗？","警告",["确定","取消"],function (msg) { 
                 if(msg.index==0){
                    //获取到没被选中的li数据
                    var userSelect=$(".indent_details [name='checkbox1']").not(":checked").parents("li");
                    //声明一个对象存储没被删除的数据，对象的形式
                    var infos={};
                    for(var i=0;i<userSelect.length;i++){
                       var li=userSelect[i]
                       //获取到每个li里面的存储的自定义的数据
                       var msg=$(li).data("msg");
                       //    console.log(msg);
                       //将没被删除的数据重新存到一个对象里面
                       infos[msg.goods_id]=msg;
                    }
                       //同步数据，发送数据到后台
                       sync_data(infos)
                 }else if(msg.index==1){
                     console.log("取消");
                 }
             }) 
          })
          //生成订单
          $(".mark_indent").on("tap",function () { 
              var lis=$('.indent_details li')
              //判断有没有商品
              if(lis.length==0){
                  mui.toast("你还没有选购商品");
                  return;
              }
              //发送的参数
              var parmesObj={
                order_price:$('#total_price').text(),
                consignee_addr:"广州天河黑马",
                goods:[]
              }

              for(var i=0;i<lis.length;i++){
                  var li=lis[i];
                  var msg=$(li).data('msg');
                  var tmp={
                    goods_id:msg.goods_id,
                    goods_number:$(li).find(".mui-numbox-input").val(),
                    goods_price:msg.goods_price
                  }
                  //往对象里面的数组添加对象
                  parmesObj.goods.push(tmp)
              }
              //发送请求
              orders_data(parmesObj);
           })
    }
    //同步数据，然后重新渲染页面
    function sync_data(infos) { 
         //发送请求
         $.ajax({
            url:"my/cart/sync",
            headers:{
                Authorization: $.token()
            },
            type:"post",
            //将对象转为字符串的形式发送
            data:{
             infos:JSON.stringify(infos)
            },
            success:function (res) { 
                 //重新渲染页面
                 console.log(res);
                 if(res.meta.status==200){
                     //成功
                     mui.toast(res.meta.msg)
                     //重新构造页面
                     getCartdata();
                 }else{
                     //失败
                     mui.toast(res.meta.msg)
                 }
             }
        })
     }
    //创建订单
    function orders_data(parmes){
        $.ajax({
            type: "post",
            url: "my/orders/create",
            data: parmes,
            headers:{
                "Authorization":$.token()
            },
            success: function (res) {
                if(res.meta.status==200){
                    // console.log(res);
                    mui.toast(res.meta.msg)
                   //跳转到订单页面
                   setTimeout(function () { 
                       location.href="/pages/orders.html"
                    },1000)
                }else{
                    mui.toast(res.meta.msg)
                }
            }
        });
    }  
 })