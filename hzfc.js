var http = require('http');
var cheerio = require('cheerio');

var url = 'http://www.tmsf.com/daily.htm';

function getHzfcSaleInfo(callBack) {
    var hzfcSaleInfo = [];
    http.get(url, function (res) {
        var html = '';
        res.on('data', function (data) {
            html += data;
        });
        res.on('end', function () {
            hzfcSaleInfo = filterChapters(html);
            callBack(hzfcSaleInfo);
        });
        res.on('error', function () {
            console.log('获取数据出错');
        });
    })
    // return hzfcSaleInfo;
}


function filterChapters(html) {
    var $ = cheerio.load(html);
    var data = [];
    var container = $('#myCont2')
    var districts = container.find('table');
    districts.each(function () {
        var district = $(this);
        var trs = district.find('tr');
        trs.each(function () {
            var tr = $(this);
            var tds = tr.find('td');
            var i = 0;
            var estateName;
            var estateSite;
            var estateSign;
            var estateReserve;
            var estateArea;
            var estatePrice;
            tds.each(function () {
                var col = $(this);
                if (i == 0) {
                    estateName = col.find('a').text();
                } else if (i == 1) {
                    estateSite = col.text().replace(/[^\u4e00-\u9fa5]/gi, "");
                } else if (i == 2) {
                    var spanClass = '';
                    var spans = col.find('span');
                    spans.each(function (a) {
                        var span = $(this);
                        var cssName = classNameToNumb(span.attr('class'));
                        spanClass = spanClass + cssName;
                    });
                    estateSign = spanClass;
                } else if (i == 3) {
                    var spanClass = '';
                    var spans = col.find('span');
                    spans.each(function (a) {
                        var span = $(this);
                        var cssName = classNameToNumb(span.attr('class'));
                        spanClass = spanClass + cssName;
                    });
                    estateReserve = spanClass;
                }
                else if (i == 4) {
                    var spanClass = '';
                    var spans = col.find('span');
                    spans.each(function (a) {
                        var span = $(this);
                        var cssName = classNameToNumb(span.attr('class'));
                        spanClass = spanClass + cssName;
                    });
                    estateArea = spanClass + '㎡';
                } else if (i == 5) {
                    var spanClass = '';
                    var spans = col.find('span');
                    spans.each(function (a) {
                        var span = $(this);
                        var cssName = classNameToNumb(span.attr('class'));
                        spanClass = spanClass + cssName;
                    });
                    estatePrice = spanClass + '元/㎡';
                }
                i++;
            })
            var estateData = {
                estateName: estateName,
                estateSite: estateSite,
                estateSign: estateSign,
                estateReserve: estateReserve,
                estateArea: estateArea,
                estatePrice: estatePrice
            }
            //console.log(estateData);
            if (estateData.estateName) {
                data.push(estateData);
            }
        })
    })
    return data;
}
function classNameToNumb(className) {
    var numb;
    if (className == 'numbzero') {
        numb = '0';
    } else if (className == 'numbone') {
        numb = '1';
    } else if (className == 'numbtwo') {
        numb = '2';
    } else if (className == 'numbthree') {
        numb = '3';
    } else if (className == 'numbfour') {
        numb = '4';
    } else if (className == 'numbfive') {
        numb = '5';
    } else if (className == 'numbsix') {
        numb = '6';
    } else if (className == 'numbseven') {
        numb = '7';
    } else if (className == 'numbeight') {
        numb = '8';
    } else if (className == 'numbnine') {
        numb = '9';
    } else if (className == 'numbdor') {
        numb = '.';
    }
    return numb;
}

module.exports = getHzfcSaleInfo;