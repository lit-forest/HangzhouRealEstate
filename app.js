var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');
var getHzfcSaleInfo = require('./hzfc');

//建立socket链接并定时(10分钟)发送数据
io.on('connection', function(socket) {
    setData();
    setInterval(setData, 10 * 60 * 1000);
});
//发送数据
function setData() {
    getHzfcSaleInfo(function(data) {
        io.emit('getData', JSON.stringify({ data: data }));
    });
}


app.use(express.static('public'));

/**
 * 启动web server
 */
http.listen(8081, function() {
    console.log('web server start success', 'listen:http://localhost:8081/index.html');
})