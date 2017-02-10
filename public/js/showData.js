var map = new AMap.Map('map', {
    resizeEnable: true,
    zoom: 11,
    center: [120.197428, 30.20923],
    mapStyle: 'dark',
});
var socket = io();

socket.on('getData', function(data) {
    var hzfcSaleInfo = JSON.parse(data).data;
    showInfo(hzfcSaleInfo);
});

/**
 * 在页面上展示后台抓取的数据
 * @param {object} data
 */
function showInfo(data) {
    map.clearMap();
    var saleTotal = document.getElementsByClassName('total')[0];
    var d = new Date();
    var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    saleTotal.innerHTML = str + '日杭州房产销售总量：' + data.length;
    AMap.plugin('AMap.Geocoder', function() {
        var len = data.length;
        var geocoder = new AMap.Geocoder({
            city: "杭州" //城市
        });
        showSingle(data, 0)

        /**
         * 递归方法 
         * @param {object} data
         * @param {int} n
         * @returns
         */
        function showSingle(data, n) {
            if (n >= len) {
                return;
            }
            geocoder.getLocation(data[n].estateName, function(status, result) {
                if (status == 'complete' && result.geocodes.length) {
                    var marker = priceMarker(data[n].estatePrice, result)
                    var title = result.geocodes[0].formattedAddress.replace("浙江省杭州市", "") + '<br/><span style="font-size:11px;color:#F00;">价格:' + data[n].estatePrice + '</span>',
                        content = [];
                    content.push("小区名称：" + data[n].estateName);
                    content.push("所在区：" + data[n].estateSite);
                    content.push("销售套数：" + data[n].estateSign);
                    content.push("销售总面积：" + data[n].estateArea);
                    content.push("预定套数：" + data[n].estateReserve);
                    var infoWindow = new AMap.InfoWindow({
                        isCustom: true, //使用自定义窗体
                        content: createInfoWindow(title, content.join("<br/>")),
                        offset: new AMap.Pixel(16, -45)
                    });
                    AMap.event.addListener(marker, 'click', function() {
                        infoWindow.open(map, marker.getPosition());
                    });
                    showSingle(data, n + 1);
                } else {
                    showSingle(data, n + 1);
                }
            })
        }
    })
}

/**
 * 根据楼盘的价格显示不同的图标
 * @param {string} estatePrice
 * @param {object} result
 * @returns
 */
function priceMarker(estatePrice, result) {
    var price = parseInt(estatePrice);
    var iconUrl;
    if (price <= 10000) {
        iconUrl = 'http://localhost:8081/img/icon0.png';
    } else if (price > 10000 && price <= 15000) {
        iconUrl = 'http://localhost:8081/img/icon1.png';
    } else if (price > 15000 && price <= 20000) {
        iconUrl = 'http://localhost:8081/img/icon2.png';
    } else if (price > 20000 && price <= 25000) {
        iconUrl = 'http://localhost:8081/img/icon3.png';
    } else if (price > 25000 && price <= 30000) {
        iconUrl = 'http://localhost:8081/img/icon4.png';
    } else if (price > 30000) {
        iconUrl = 'http://localhost:8081/img/icon5.png';
    }
    var marker = new AMap.Marker({
        offset: new AMap.Pixel(-22, -42),
        map: map,
        bubble: true,
        icon: iconUrl,
        position: result.geocodes[0].location,
        title: result.geocodes[0].formattedAddress
    });
    return marker
}

/**
 * 创建自定义信息窗体
 * @param {string} title
 * @param {string} content
 * @returns
 */
function createInfoWindow(title, content) {
    var info = document.createElement("div");
    info.className = "info";

    //可以通过下面的方式修改自定义窗体的宽高
    //info.style.width = "400px";
    // 定义顶部标题
    var top = document.createElement("div");
    var titleD = document.createElement("div");
    var closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = title;
    closeX.src = "http://webapi.amap.com/images/close2.gif";
    closeX.onclick = closeInfoWindow;

    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    var middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.innerHTML = content;
    info.appendChild(middle);

    // 定义底部内容
    var bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    var sharp = document.createElement("img");
    sharp.src = "http://webapi.amap.com/images/sharp.png";
    bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
}

/**
 *关闭信息窗体 
 */
function closeInfoWindow() {
    map.clearInfoWindow();
}

/**
 * 切换地图底图的颜色
 * @param {string} e
 */
function refresh(e) {
    map.setMapStyle(e);
}