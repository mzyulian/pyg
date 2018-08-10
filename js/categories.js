$(function(){
    innit()
    function innit() { 
      setHtml()
      getData()
      get_categories()

     }
     function getData(){
        var leftScroll = new IScroll('.left');
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
    function get_categories(){
        $.get("categories",function(res){
            console.log(res);
        },"json")
    }
})