var express = require('express');
var getHzfcSaleInfo = require('./hzfc');

var app = express();

app.use(express.static('public'));

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/test.js', function (req, res) {
    res.sendFile(__dirname + '/test.js');
});

app.get('/getHzfcSaleInfo', function (req, res) {
    var hzfcSaleInfo = getHzfcSaleInfo(function (data) {
       // console.log(data);
        res.end(JSON.stringify({ data: data }));
    });
    // hzfcSaleInfo.forEach(function (item) {
    //     if (item.estateName) {
    //         console.log(item.estateName + ' ' + item.estateSite + ' ' + item.estateSign + ' ' + item.estateReserve + ' ' + item.estateArea + ' ' + item.estatePrice + '\n');
    //     }
    // })
    //res.end(hzfcSaleInfo);
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().address;
    console.log('web server start success');
})