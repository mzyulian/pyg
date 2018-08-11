$(function(){
    innit()
    //滚动条
    var leftScroll;
    //后台数据
    var goods_data;
    function innit() { 
      setHtml()
      get_categories()
      left_tap()
     }
     function get_categories(){
        $.get("categories",function(res){
            console.log(res);
            var html=template("leftdata_tmp",{"data":res.data})
            $('.left ul').html(html)
            leftScroll = new IScroll('.left');
            goods_data=res.data;
            right_tap(0)
        },"json")
    }
    //注册事件，根据索引来渲染右边的页面
    function left_tap(){
       $('.left').on("tap",'li',function(){
           $(this).addClass('active').siblings().removeClass('active');
           //滚动到当前
           leftScroll.scrollToElement(this);
           //获取到被点击的li的index
           var index=$(this).data("index");
           console.log(index);
           right_tap(index)
       })   
    }
    //根据index 左边点击对应右边的渲染
    function right_tap(index){
        //获取到全局的对应的数据
        var arr=goods_data[index].children;
        //调用模板方法
        var html2=template("rightdata_tmp",{arr:arr});
        $('.right').html(html2);
        //给右边的页面设置滚动条(当图片加载完成之后有高度之后) 
        //获取图片的长度，当图片都加载完成之后设置滚动条
        var nums=$('.right img').length;
        console.log(nums);
        $('.right img').on('load',function(){
            nums--;
           if(nums==0){
               new IScroll(".right")
           }
        })
    }

    


    function setHtml(){
      //设置初始(初始值))的font-size  
      var baseVal=100;
      //设置设计稿
      var pageWidth=375;
      //获取屏幕的宽度
      var screenWidth=document.querySelector("html").offsetWidth
      //公式 :设计稿/初始值=当前屏幕宽/要设置的font-size=========>要设置的font-size=初始值*当前屏幕的宽度/设计稿的宽度
      var font_size=baseVal*screenWidth/pageWidth;
      //设置回去当前屏幕
      document.querySelector('html').style.fontSize=font_size+"px";
    } 

    window.onresize=function(){
        //window 下调测调用
        setHtml()
    }

})