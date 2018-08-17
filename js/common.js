$(function () {
    var BaseUrl=" http://api.pyg.ak48.xyz/";
    //导入模板变量
    template.defaults.imports.iconUrl = BaseUrl;
    // 修改接口的使用方式
    // 拦截器
    // 在每一次发送请求 之前对请求做一些处理 
    // 发送请求之前,提前对于 接口的url进行处理 
    // var oobj={};
    // $.ajax(oobj);
    // http://api.pyg.ak48.xyz/api/public/v1/  +   home/swiperdata
    //设置几个变量存发送请求的次数，这个变量用来定义动画的加载（小圆圈）
    var ajaxNum=0
    $.ajaxSettings.beforeSend=function (xhr,obj) {
      obj.url=BaseUrl+"api/public/v1/"+ obj.url;
      // console.log(obj.url);
      ajaxNum++;
      //给body增加一个加载动画
      $('body').addClass('wait');
    }
    //设置一个响应回来数据的的动画结束,当所有的请求都响应回来的时候
    $.ajaxSettings.complete=function(){
      ajaxNum--;
      if(ajaxNum==0){
        $('body').removeClass('wait')
      }
    }
    //给zepto拓展方法,给$拓展
    $.extend($,{
      //获取url地址栏的参数
      getUrlvalue:function (name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
       },
       //拓展一个判断手机号码的正则
       checkPhone: function (phone) {
         if (!(/^1[34578]\d{9}$/.test(phone))) {
           return false;
         } else {
           return true;
         }
       },
       //拓展一个判断邮箱的正则
       checkEmail: function (myemail) {
         var myReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
         if (myReg.test(myemail)) {
           return true;
         } else {
           return false;
         }
       },
       //拓展一个判断本地的永久存储中是否有userinfo,来判断是否有登陆
       checkLogin:function () { 
         return localStorage.getItem("userinfo");
        },
       //拓展一个返回本地永久存储中的token值得方法，存在返回token，没有返回一个"" 
       token:function () { 
         var token;
         if(localStorage.getItem("userinfo")){
           token= JSON.parse(localStorage.getItem("userinfo")).token;
         }else{
           token="";
         }
         return token;
        },
        //拓展一个将当前页面放到本地会话存储的方法
        setpage:function(){
          sessionStorage.setItem("pages",location.href);
        },
        //拓展一個將頁面的url从会话存储取出的方法
        getpage:function () { 
          return sessionStorage.getItem("pages");
         },
        //拓展一个将用户信息存进本地永久存储的方法 
        setUser:function (obj) { 
          localStorage.setItem("userinfo",JSON.stringify(obj))
         },
        //拓展一个将用户信息从本地永久储存取出的方法
        getUser:function () { 
          return localStorage.getItem("userinfo")? JSON.parse(localStorage.getItem("userinfo")):false
         },

        //拓展一个清除本地永久存储的方法
        removeUser:function () { 
          localStorage.removeItem("userinfo")
         }

    })
  })