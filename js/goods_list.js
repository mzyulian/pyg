$(function () { 
    //查询的关键子
    var jqueryMsg={
        query:"",
        cid:getValue("cid"),
        pagenum:1, //页数索引
        pagesize:6  //每一页的个数
    }
    //设置全局的页面总数，在获取到数据之后再计算总共的页数
    var totalPage=1;
    init()
    function init() { 
        mui.init({
            pullRefresh : {
              container:".pyg_content",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
              down : {
                // style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback :function(){
                    //上拉刷新，将页面的内容清空，再次请求内容
                    $(".pyg_content ul").html("");
                    //页面重置为第一页
                    jqueryMsg.pagenum=1;
                    //发送请求
                    search(function () { 
                        //请求数据回来之后，结束下拉的刷新
                        mui('.pyg_content').pullRefresh().endPulldownToRefresh();
                        //重置组件
                        mui('.pyg_content').pullRefresh().refresh(true);

                     })

                }
              },
              //上拉刷新请求数据
              up:{
                  /**
                   * 判断当前页是不是大于总页数，大于的话提示没有数据加载
                   * 小于的话，让当前页数加1，然后执行ajax请求
                   * 
                   */
                 callback:function () { 
                     if(jqueryMsg.pagenum>=totalPage){
                         //结束上拉加载更多，没有数据，传入true
                        mui('.pyg_content').pullRefresh().endPullupToRefresh(true);
                        return;
                     }else{
                                   //每次下拉刷新，页面数加1
                     jqueryMsg.pagenum++;
                     //上拉刷新请求数据
                     search(function () { 
                      //结束上拉刷新
                      mui('.pyg_content').pullRefresh().endPullupToRefresh();
                      })
                     }
           
                  }
              }
            }
          });
     }
    // 根据url上的key来获取值
    function getValue(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
     }
    function search(callback){
        //发送请求
        $.get('goods/search', jqueryMsg,function (res) { 
            //获取页面的总数  数据总数/pagesize
            totalPage=Math.ceil(res.data.total/jqueryMsg.pagesize)
            console.log(res);
            var html=template('goods_tmp',{data:res.data.goods})
            $('.pyg_content ul').append(html);
             //传入函数回调
           callback &&callback() 
         })
       
    } 
 })