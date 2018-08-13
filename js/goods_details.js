$(function(){
    init();
    function init(){
        //获得slider插件对象
                //发送请求 调用方法获取到url地址栏的参数,获取url地址栏信息的方法已经拓展到zepto的$里面，直接调用即可，然后请求
                $.get("goods/detail",{goods_id:$.getUrlvalue("goods_id")},function(res){
                    console.log(res);
                    var html=template("goods_details",{"data":res.data})
                    $(".pyg_content").html(html);
                    var gallery = mui('.mui-slider');
                    gallery.slider({
                    interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
                    });
                })
    }
})