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


  })