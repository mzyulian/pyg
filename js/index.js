$(function () { 
    //入口函数初始化
    innit()
    function innit(){
        getSlidesData()
        getCatitems()
        getGoodslist()
    }
    //轮播图
    function getSlidesData(){
        $.get("home/swiperdata",function(res){
            //  console.log(res);
             var html=template("slideTmp",{"data":res.data})
             $('.mui-slider').html(html);
             //获得slider插件对象  初始化轮播图
            var gallery = mui('.mui-slider');
            gallery.slider({
            interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
            },"json");
        })
    }
    //导航栏
    function getCatitems(){
       $.get("home/catitems",function (res) { 
            // console.log(res);
            var html=template("catitems_tmp",{"arr":res.data})
            $('.index_nav').html(html)
        },"json")
    }
    //商品列表
    function getGoodslist(){
       $.get("home/goodslist",function (res) { 
        //    console.log(res);
           var html=template('goodslist_tmp',{"data":res.data})
           $('.index_goodslist').html(html);
        },"json")   
    }
 })
