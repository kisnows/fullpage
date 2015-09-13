/* global echarts */
/* global $ */


var bills = {};
var a = 1;

bills.getData = function (monthNow, callback) {

    var url = "api/data.json";
    //for test
    if (a === 1) {
        url = "api/data.json";
        a++;
    } else if (a === 2) {
        url = "api/data1.json";
        a++;
    } else if (a === 3) {
        url = "api/data2.json";
        a++
    } else if (a === 4) {
        url = "api/data3.json";
        a = 1;
    }
    //test end

    $.ajax({
        url: url,
        dataType: "json",
        type: "GET",
        success: function (d) {
            Data = d;
            if (typeof callback === 'function') {
                callback();
            }
        },
        error: function (d) {
            window.console.log("error");
        }
    });
};

bills.distribution = {
    moveToRight: function () {

        bills.getData(monthNow, percentRank.rank(Data).init);

        this.translated3d = translate3d;
        bills.distribution.changeMonth(monthNow, translate3d);
    },
    moveToLeft: function () {

        var step = $('.month-title .month').width();
        var translate3d = this.translated3d + step;
        //滑动后先获取数据，然后排列
        bills.getData(monthNow, percentRank.rank(Data).init);

        this.translated3d = translate3d;
        this.changeMonth(monthNow, translate3d);
    },
    init: function () {
        percentRank.rank();
    }
}
;
//资产变动
bills.variation = {
    adjust: function () {
        var items = $('.variation .item');
        var height = $('.fp-tableCell').height();
        var itemHeight = height * 0.12;
        var itemMargin = height * 0.022;
        $(items).css({
                'height': itemHeight,
                'margin-bottom': itemMargin
            }
        )
        ;
    },
    init: function () {
        this.adjust();
    }
};

/**
 * 百分比圈排列方法
 */
var percentRank = {
    getLength: function (count) {
        //获取数据个数，即产品个数
        for (var i in Data.distribution) {
            count += 1;
        }
        return count;
    },
    rank: function () {
        //百分比圈排序
        var select = ".box .circle-percent",
            percentEle = $(select),
            initialWidth = $(".month-bottom").height() * 0.3;

        var size = [],
            coordinate = [];

        function initEle() {
            //当产品个数小于四个时，让没有数据的元素隐藏。
            var circle = $('#distribution .circle-percent');
            $(circle).show().width(initialWidth).height(initialWidth);
            console.log(initialWidth, $(circle).width());
            for (var i = percentRank.getLength(0); i < circle.length; i++) {
                $(circle[i]).css({
                    "display": "none"
                })
            }
        }

        function getSize() {
            size = [];
            //		data.distribution  是一个对象，格式如下
            //      "distribution": {"股票":"0.22", "基金":"0.83","现金": "0.36","理财": "0.49"}
            var percent = Data.distribution;
            var disTitle = [];
            for (var i in Data.distribution) {
                if (Data.distribution.hasOwnProperty(i)) {
                    disTitle.push(i);
                }
            }
            $(percentEle).each(function (index) {
                // 给百分比圈设置颜色并将其大小保存在 size 里面
                var color = ['#DB9EFD', '#FDFAAC', '#8CE5ED', '#F8667E'];
                if (disTitle[index]) {
                    var proPercent = percent[disTitle[index]].split('.')[1] + '%';
                    var proName = disTitle[index];
                    $(this).find('.percent').text(proPercent);//设置产品比例
                    $(this).find('.disc').text(proName);//设置产品名称
                    $(this).addClass('circle-percent');
                    $(this).css('border-color', color[index]);

                    //设置圆圈大小比例
                    if (parseFloat(percent[disTitle[index]]) <= 0.3) {
                        size.push(1);
                    } else if (parseFloat(percent[disTitle[index]]) > 0.3 && parseFloat(percent[disTitle[index]]) <= 0.6) {
                        size.push(1.3);
                    } else {
                        size.push(1.55);
                    }
                }
            });
            //console.log(size,size.length,percentRank.getLength(0));
            if (size && size.length === percentRank.getLength(0)) {
                getPosition();
            }
        }

        function getPosition() {
            // coordinate 为一个二维数组
            coordinate = [];
            $(percentEle).each(function (index, el) {
                el.Width = size[index] * initialWidth;
                //将 坐标值 push 进coordinate中
                if (index < percentRank.getLength(0)) {
                    var left = percentRank.getCoordinate(index, el).left,
                        top = percentRank.getCoordinate(index, el).top;
                    coordinate.push([left, top]);
                }
            });
        }

        function setAttr() {
            //设置属性
            //console.log(coordinate);
            $(percentEle).each(function (index, el) {
                if (coordinate[index]) {
                    $(el).css({
                        left: coordinate[index][0],
                        top: coordinate[index][1],
                        "width": initialWidth * size[index],
                        "height": initialWidth * size[index],
                        "fontSize": 1.4 * size[index].toString() + 'rem'
                    }).addClass('fallout');
                }
            });
        }

        function init() {
            initEle();
            getSize();
            setAttr();
        }

        return {
            getPosition: getPosition,
            setAttr: setAttr,
            init: init
        };
    },
    getCoordinate: function (index, el) {
        //百分比圈坐标计算函数

        var bottom = $('.box .month-bottom');
        var width = bottom.outerWidth(),
            height = bottom.outerHeight(),
            thisWidth = el.Width;
        var base = {
            left: width / 2,
            top: height / 2
        };
        var radius = 8;
        var circleCenter;

        switch (percentRank.getLength(0)) {
            case 1:
                circleCenter = getForOne();
                break;
            case 2:
                circleCenter = getForTwo();
                break;
            case 3:
                circleCenter = getForThree();
                break;
            case 4:
                circleCenter = getForFour();
                break;
        }


        function getForOne() {
            return {
                "0": {
                    left: base.left - thisWidth / 2,
                    top: base.top - thisWidth / 2
                }
            }
        }

        function getForTwo() {
            return {
                "0": {
                    left: base.left - thisWidth - radius,
                    top: base.top - thisWidth - radius
                },
                "1": {
                    left: base.left + radius,
                    top: base.top + radius
                }
            }
        }

        function getForThree() {
            return {
                "0": {
                    left: base.left - thisWidth / 2,
                    top: base.top - thisWidth - radius
                },
                "1": {
                    left: base.left - thisWidth - radius,
                    top: base.top + radius
                },
                "2": {
                    left: base.left + radius,
                    top: base.top + radius
                }
            }
        }

        function getForFour() {
            return {
                "0": {
                    left: base.left - thisWidth - radius,
                    top: base.top - thisWidth - radius
                },
                "1": {
                    left: base.left + radius,
                    top: base.top - thisWidth - radius
                },
                "2": {
                    left: base.left - thisWidth - radius,
                    top: base.top + radius
                },
                "3": {
                    left: base.left + radius,
                    top: base.top + radius
                }
            };
        }

        return {
            left: circleCenter[index].left,
            top: circleCenter[index].top
        };
    }
};
