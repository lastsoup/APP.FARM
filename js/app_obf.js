//docs:http://www.framework7.cn/docs/routes.html
var accessToken="at.9car0ka09mlsud8tds92ftf2a22weroo-26jf3szf1s-1ge48zo-q0ardbsiq";
var code=GetQueryString("code");
var openidUrl= 'https://api.weixin.qq.com/sns/jscode2session?appid=wxbb92ec4b66f5656d&secret=c159656720b5c8797a0b4b64ed098b6c&js_code='+code+'&grant_type=authorization_code';
var tokenUrl='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxbb92ec4b66f5656d&secret=c159656720b5c8797a0b4b64ed098b6c';
//获取code后，请求以下链接获取access_token
//access_token: https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
//或者 https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appidAPPID&secret=SECRET
//拉取用户信息(需scope为 snsapi_userinfo)
//userinfo: https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
//或者 https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
//通过request获取数据
var openid="oztf-0CUq8GgWKpA9f67VphT6JeU";
var access_token="24_Y__WJ8Za7uw9Iec9ZLtFJ09FU_Nqb3xiIgGkyrgdCrxAXFaIIK2fC0Nc4dHHZj_jSCNVlsWBqhwDeIYn801AIcIb5PzXF3CVDweGS_8fvK7-v0sc-A_rQ7MEh__Gkhd7hid4Y_xqmzR9EwwHLJSeAJAZXG";
//获取用户信息(需要认证后才可以获取到数据)
var userinfo='https://api.weixin.qq.com/cgi-bin/user/info?access_token='+access_token+'&openid='+openid+'&lang=zh_CN';
function GetQueryString(key)
{
     // 获取参数
     var url = window.location.search;
     // 正则筛选地址栏
     var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
     // 匹配目标参数
     var result = url.substr(1).match(reg);
     //返回参数值
     return result ? decodeURIComponent(result[2]) : null;
}

var nickName=GetQueryString("nickName");
var avatarUrl=GetQueryString("avatarUrl");
var city=GetQueryString("city");
var addr=GetQueryString("addr");
var x=GetQueryString("x");
var y=GetQueryString("y");

if(nickName){
    $("#username").text(nickName);
}

if(avatarUrl){
    $("#tongxiang").attr("src",avatarUrl);
}
if(!x||!y){
    x=118.81159973144531,y=32.321414947509766
}

var newlocation;
BMap.Convertor.translate(new BMap.Point(x,y),2,function(data){
    var location=data.lng+","+data.lat;
    newlocation=data;
    console.log(location);
    searchByPointTx(location,function(data){
       console.log(data);
       var city=data.addressComponents.city;
       var address=data.address;
       $("#livecity").text(city.replace("市",""));
       //alert("城市："+ city+",地址："+address);
    });
 }); 
 function initMap(){
     $(".maptab").click(function(){
        $(".maptab").removeClass("on");
        $(this).addClass("on");
        var name=$(this).attr("name");
        if(name=="baidu"){
            $("#bmap").show();
            $("#amap").hide();
        }else{
            $("#amap").show();
            $("#bmap").hide();
        }
     });
    initBmap();
    initAmap();
 }
 function initBmap(){
    var map = new BMap.Map("bmap");    // 创建Map实例
    map.addControl(new BMap.MapTypeControl({mapTypes:[BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]}));	  
    map.centerAndZoom(new BMap.Point(newlocation.lng,newlocation.lat),17);
    map.enableScrollWheelZoom(true);
    map.clearOverlays(); 
    var new_point = new BMap.Point(newlocation.lng,newlocation.lat);
    var marker = new BMap.Marker(new_point);  // 创建标注
    map.addOverlay(marker);              // 将标注添加到地图中
    map.panTo(new_point); 
 }

function initAmap(){
    var lnglat=[x,y];
    var map = new AMap.Map("amap", {
        resizeEnable: true,
        rotateEnable:true,
        pitchEnable:true,
        center: lnglat,
        viewMode:'3D',
        pitch:0,
        expandZoomRange:true,
        zoom:17,
        zooms:[3,20]
    });

    var m1 = new AMap.Marker({
        position: lnglat,
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png"
    });
    map.add(m1);
    map.setPointToCenter(lnglat[0],lnglat[1]);

    var Options={
        showZoomBar:false,
        showControlButton:true,
        position:{
          right:'10px',
          top:'10px'
        }
      };

      map.plugin(["AMap.ControlBar"],function(){
        var controlBar = new AMap.ControlBar(Options)
        map.addControl(controlBar)
    });
}

// 状态栏图标状态切换
var selectedTab=document.getElementsByClassName("tab-link-active")[0];
function setSymbol(active){
  //选中命名规则原名1
  //删除旧样式
  var stext=active.getAttribute('href');
  var text=selectedTab.getAttribute('href');
  if(stext!=text){
    //改变图表
    //取消选中
    var use=selectedTab.firstElementChild.firstElementChild;
    var xlink=use.getAttribute('xlink:href').replace("1","");
    attr(use,'xlink:href',xlink);
    //选中
    var suse=active.firstElementChild.firstElementChild;
    var sxlink=suse.getAttribute('xlink:href')+"1";
    attr(suse,'xlink:href',sxlink);
    //标题
    document.title=active.children[1].innerText;
    // if(document.title=="农情"){
    //   var state=active.getAttribute("fistload");
    //   if(state=="false"){
    //     initSwiper();
    //   }
    //   attr(active,'fistload',"true");
    // }
    //重新赋值选中元素
    selectedTab=active;
  }else{
    //重新加载
  }
}

function attr(el,attribute, val) {
if (el.tagName && el.tagName.toLowerCase() == 'input' && attribute == 'value') el.value = val;
        else if (el.setAttribute) {
          if (attribute == 'checked' && (val == '' || val == false || typeof val == "undefined")) el.removeAttribute(attribute);
          else el.setAttribute(attribute, val);
}
}


function getAccessToken(){
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "https://open.ys7.com/api/lapp/token/get",
    data: { appKey:"943e366c0a5042d2911e6b17ba6357ee",appSecret:"47445eedd15b0e2e9b2f3be3852528db"}
  }).done(function(data){
     accessToken=data.data.accessToken;
     getDeviceList();
  })
}

getAccessToken();
function getDeviceList(){
  $.ajax({
      type: "POST",
      dataType: "json",
      url: "https://open.ys7.com/api/lapp/device/list",
      data: { accessToken: accessToken}
  }).done(function(data){
    var item=data.data;
    $.each(item,function(){
       var url=this.status==0?"javascript:;":"/video/";
       var click=this.status==0?"":"setdeviceSerial(this)";
       var li=`<li class="index_item"><a class="v-center vcard" href="`+url+`" id="`+this.deviceSerial+`" onclick="`+click+`">
             <div class="v-center h">
             <div class="fenm">
              <img src="" border="0" />
            </div>
            <div class="h-center v miaoshu">
              <span class="name">`+this.deviceName+`</span>
                <span class="`+(this.status==0?"zain":"zaiy")+`">状态：<i>`+(this.status==0?"不在线":"在线")+`</i></span>
                <span>设备型号：<i>`+this.deviceType+`</i></span>
              </div>
            </div>
            <i class="iconfont icon-shezhi"></i>
        </li>`;
        $("#video-list").append(li);
    });
  }).fail(function(erro){

  });
}

var currentUrl;
function setdeviceSerial(el){
var id=el.id;
$.ajax({
    type: "POST",
    dataType: "json",
    url: "https://open.ys7.com/api/lapp/live/address/limited",
    data: { accessToken: accessToken,
    deviceSerial:id,
    channelNo:1
    }, 
}).done(function(data){
  currentUrl=data.data.hdAddress;
});
}

var player;
function play(){
$('#myPlayer').attr("src", currentUrl);
player = new EZUIKit.EZUIPlayer('myPlayer');
player.play();
}

var $$ = Dom7;
var app = new Framework7({
'root': "#app",
'theme': 'ios',
'tapHold': !! [],
'view': {
'stackPages': !! []
},
'routes': [{
'path': '/',
'url': "index.html"
},
{
'path': "/video/",
'url': "pages/video.html",
on: {
	pageBeforeIn: function (e, page) {
	},
	pageAfterIn: function (e, page) {
		play();
	},
	pageInit: function (e, page) {

	},
	pageBeforeRemove: function (e, page) {
		player.stop();
	}
  }
},
{
'path': "/map/",
'url': "pages/map.html",
on: {
	pageBeforeIn: function (e, page) {
	},
	pageAfterIn: function (e, page) { 
		initMap();
	},
	pageInit: function (e, page) {

	},
	pageBeforeRemove: function (e, page) {
		
	}
  }
}]
});
var mainView = app.views.create(".view-main");
var categoriesView = app.views.create("#view-video");
var discoverView = app.views.create("#view-discover");
var searchView = app.views.create("#view-search");
var pagesView =app.views.create("#view-pages");

function activeCardTouch() {
$$(".card").on("touchstart", function(_0x5b31ab) {
$$(this).addClass("card-scale");
});
$$(".card").on("touchend", function(_0x5d33ae) {
$$(this).removeClass("card-scale");
});
$$(".card").on('mousedown', function() {
$$(this)['addClass']("card-scale");
});
$$(".card").on('mouseup', function() {
$$(this).removeClass("card-scale");
});
$$(".swiper-slide a").on("click", function(_0x3f4745) {
app.views.current.router.navigate($$(this).attr('data-href'));
});
}
activeCardTouch();
app.on("pageInit", function(_0x10d767) {
activeCardTouch();
});

var swiperOptions = {
'spaceBetween': 0xa,
'touchMoveStopPropagation': ![],
'on': {
'touchStart': function(_0x277f95) {
	$$(_0x277f95.target.closest('.card')).addClass("card-scale");
},
'touchEnd': function(_0x58cacf) {
	$$(_0x58cacf.target.closest(".card")).removeClass("card-scale");
}
}
};
var discoverSwiper = new Swiper("#discover-swiper", Object.assign({}, swiperOptions, {
'width': 0x140
}));
var discoverSwiper2 = new Swiper("#discover-swiper2", Object.assign({}, swiperOptions, {
'width': 0x104
}));
var discoverSwiper3 = new Swiper('#discover-swiper3', Object.assign({}, swiperOptions, {
'width': 0x168
}));
$$(document)['on']("page:init", '.page[data-name="single"]', function(_0xede795) {
var _0x5ef681 = new Swiper("#single-swiper", Object.assign({}, swiperOptions, {
'width': 0x118
}));
});
$$(document)['on']("page:init",'.page[data-name="single-2"]', function(_0x1d7cda) {
var _0x510f93 = new Swiper("#single-swiper-2", Object.assign({}, swiperOptions, {
'width': 0x118
}));
});
$$('.ptr-content').on("ptr:refresh", function(_0x25fd3c) {
setTimeout(function() {
var _0x48008b = '<div class="title-container">' + '<span class="title-date">Tuesday 19 March</span>' + '<h1>Just Now</h1>' + "</div>" + '<a href="/single/">' 
+ '<div class="card">' + '<img class="card-image" src="img/thumb-14.jpg" alt="">' + '<div class="card-infos">' 
+ '<h2 class="card-title">How to Get Your First Tattoo Right</h2>' + '<div class="card-bottom">' + '<div class="card-author">' + '<img class="card-author-image" src="img/authors/author-1.jpg" alt="">' 
+ '<div>Camille Aline</div>' + '</div>' +'<div class="card-comments"><i class="icon ion-ios-text"></i>3</div>' + '</div>' 
+ '</div>' + '</div>' + '</a>';
$$(".ptr-content").find('#today-content').prepend(_0x48008b);
activeCardTouch();
app.ptr.done();
}, 0x3e8);
});
var allowInfinite = !! [];
$$(".infinite-scroll-content").on("infinite", function() {
if (!allowInfinite) return;
allowInfinite = ![];
setTimeout(function() {
allowInfinite = !! [];
var _0x2cec87 = "<li>" + '<a href="/single/">' + '<div class="item-content">' + '<div class="item-media"><img src="img/thumb-15.jpg" width="44"/></div>'
 + '<div class="item-inner">' + '<div class="item-subtitle">Fashion</div>' + '<div class="item-title">Archery at the 2024 Olympic Games</div>' + '<div class="item-subtitle bottom-subtitle"><img src="img/authors/author-3.jpg">Jess Roxana</div>' + '</div>'
 +'</div>' + '</a>' +'</li>' +'<li>' +'<a href="/single/">' +'<div class="item-content">' +'<div class="item-media"><img src="img/thumb-16.jpg" width="44"/></div>' + '<div class="item-inner">' 
 + '<div class="item-subtitle">Fashion</div>' + '<div class="item-title">Most Beautiful Beach of the Costa Brava</div>' + '<div class="item-subtitle bottom-subtitle"><img src="img/authors/author-2.jpg">Zorka Ivka</div>' 
 + '</div>' +'</div>' +'</a>' + '</li>';
$$("#infinite-content").append(_0x2cec87);
app.infiniteScroll.destroy('.infinite-scroll-content');
$$(".infinite-scroll-preloader").remove();
}, 0x3e8);
});
$$(document).on("page:init", '.page[data-name="slider-1"]', function(_0x47a769) {
var _0x2f3c0a = new Swiper('#pages-swiper', Object.assign({}, swiperOptions, {
'width': 0x140
}));
});
$$(document).on('page:init', '.page[data-name="slider-2"]', function(_0x4e2853) {
var _0x470415 = new Swiper("#pages-swiper2", Object.assign({}, swiperOptions, {
'width': 0x104
}));
});
$$(document).on("page:init",'.page[data-name="slider-3"]', function(_0x1a7936) {
var _0x1b649f = new Swiper("#pages-swiper3", Object.assign({}, swiperOptions, {
'width': 0x168
}));
});
$$(document).on("page:init", '.page[data-name="slider-4"]', function(_0x207eed) {
var _0x4065f7 = new Swiper('#pages-swiper4', Object.assign({}, swiperOptions, {
'width': 0x118
}));
});
$$(document).on("page:init", '.page[data-name="pull-to-refresh"]', function(_0x175106) {
$$("#pages-ptr").on("ptr:refresh", function(_0x175106) {
setTimeout(function() {
	var _0x1bff79 ='<li>'+ '<a href="/single/">' + '<div class="item-content">' + '<div class="item-media"><img src="img/thumb-25.jpg" width="44"/></div>' + _0x48bd('0x6d') + '<div class="item-subtitle">Fashion</div>' + '<div class="item-title">The Best Diet for a Flatter Belly</div>' 
	+ '<div class="item-subtitle bottom-subtitle"><i class="icon ion-md-time"></i>2 hours ago</div>' + '</div>' +'</div>' + '</a>' +'</li>';
	$$('#pages-ptr').find("#pages-ptr-list").prepend(_0x1bff79);
	app.ptr.done($$("#pages-ptr"));
}, 0x3e8);
});
});

$$(document).on("page:init",'.page[data-name="infinite-scroll"]', function(_0x1af19a) {
var _0x37812e = !! [];
$$("#pages-infinite-scroll").on("infinite", function() {
if (!_0x37812e) return;
_0x37812e = ![];
setTimeout(function() {
	_0x37812e = !! [];
	var _0x2fc8a8 = '<li>' + '<a href="/single/">'+ '<div class="item-content">' + '<div class="item-media"><img src="img/thumb-26.jpg" width="44"/></div>' 
	+ '<div class="item-inner">' + '<div class="item-subtitle">Fashion</div>' +'<div class="item-title">The Best Diet for a Flatter Belly</div>' 
	+ '<div class="item-subtitle bottom-subtitle"><i class="icon ion-md-time"></i>2 hours ago</div>' +'</div>' + '</div>' + '</a>' + '</li>';
	$$("#pages-infinite-scroll-list").append(_0x2fc8a8);
	app.infiniteScroll.destroy("#pages-infinite-scroll");
	$$("#pages-infinite-scroll .infinite-scroll-preloader").remove();
}, 0x320);
});
});


$$(document).on("page:init", '.page[data-name="single"]', function(_0x3c1659, _0x4e8288) {
parent.hideStatus();
});
$$(document).on("page:beforeout", '.page[data-name="single"]', function(_0x4b5f9d, _0xfaafb5) {
var _0x1ffb89 = _0x4b5f9d.detail.router.url;
if (_0x1ffb89 !="/single/" && _0x1ffb89 != "/single-2/" && _0x1ffb89 !="/author/" && _0x1ffb89 !="/contact/" && app.views.current.selector != "#view-discover") {
parent.showStatus();
}
});
$$(document).on("page:init",'.page[data-name="single-2"]', function(_0x2738e7, _0x4aa115) {
parent.hideStatus();
});
$$(document).on("page:beforeout", '.page[data-name="single-2"]', function(_0x35a005, _0x37ad99) {
var _0x3aa1b1 = _0x35a005.detail.router.url;
if (_0x3aa1b1 != "/single/" && _0x3aa1b1 != "/single-2/" && _0x3aa1b1 != "/author/" && _0x3aa1b1 != "/contact/" && app.views.current.selector != "#view-discover") {
parent.showStatus();
}
});
$$(document).on("page:init", '.page[data-name="author"]', function(_0x4fff8b, _0x37a567) {
parent.hideStatus();
});
$$(document).on('page:beforeout','.page[data-name="author"]', function(_0x5092e8, _0x2ad787) {
var _0x43e15b = _0x5092e8.detail.router.url;
if (_0x43e15b != "/single/" && _0x43e15b !="/single-2/" && _0x43e15b != "/author/" && _0x43e15b != "/contact/" && app.views.current.selector != "#view-discover") {
parent.showStatus();
}
});
$$(document).on("page:init", '.page[data-name="contact"]', function(_0x1dcbf3, _0x2f668e) {
parent.hideStatus();;
});
$$(document).on('page:beforeout', '.page[data-name="contact"]', function(_0x209184, _0x2596d6) {
var _0x4d6440 = _0x209184.detail.router.url;
if (_0x4d6440 != "/single/" && _0x4d6440 != "/single-2/" && _0x4d6440 != "/author/" && _0x4d6440 != "/contact/" && app.views.current.selector != "#view-discover") {
parent.showStatus();
}
});
$$(".view").on("tab:show", function(_0x15271e) {
var _0x426de7 = _0x15271e.srcElement.id;
if (_0x426de7 == "view-discover") {
parent.hideStatusFast();
} else {
var _0x31d83f = app.views.current.router.url;
if (_0x31d83f == "/single/" || _0x31d83f == '/single-2') {
	parent.hideStatusFast();
} else {
	parent.showStatusFast();
}
}
});
$$(".view").on("tab:hide", function(_0x8dfda5) {
var _0x28f58b = _0x8dfda5.srcElement.id;
if (_0x28f58b == 'view-discover') {
parent.showStatusFast();
} else {
parent.hideStatusFast();
}
});