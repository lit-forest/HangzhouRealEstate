var express = require('express');
var getHzfcSaleInfo = require('./hzfc');

var app = express();

app.use(express.static('public'));

//处理前台页面的数据请求
app.get('/getHzfcSaleInfo', function(req, res) {
    /**
     * 处理前台页面ajax请求
     * 返回给前台全部的处理数据
     * @param {any} data
     */
    var hzfcSaleInfo = getHzfcSaleInfo(function(data) {
        res.end(JSON.stringify({ data: data }));
        // data.forEach(function(item) {
        //     if (item.estateName) {
        //         console.log(item.estateName + ' ' + item.estateSite + ' ' + item.estateSign + ' ' + item.estateReserve + ' ' + item.estateArea + ' ' + item.estatePrice + '\n');
        //     }
        // })
    });

    //res.end(hzfcSaleInfo);
});

/**
 * 启动web server
 */
var server = app.listen(8081, function() {
    console.log('web server start success', '访问地址为：http://localhost:8081/index.html');
})