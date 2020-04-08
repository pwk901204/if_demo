/**
 * @description: 公共的方法
 */
(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        factory();
    }
}(function() {
    var common = {};

    /**
     * [setEllClass 给grid的表格]
     * @param {[String]} col [宽度]
     * @param {[String]} col [名称]
     * @param {[object]} row [行对象]
     */
    common.setEllClass = function(width) {
        return function(col, row) {
            var data = row[col];

            if (data.toString().length > 0) {
                data = data.toString().replace(/"/g, "'");
            } else {
                data = '-';
            }
            return ("<div class='ell' title=\"{data}\" style=\"width:" + width + "px\">{data}</div>").replace(/{data}/g, data);
        };
    };

    /**
     * 设置表格按钮
     * @param {[type]} url [请求的接口]
     * @param {[type]} param [参数]
     * @param {[type]} success [ajax成功调用的方法]
     * @param {[type]} error [ajax失败调用的方法]
     */
    common.ajaxRequest = function(url, param, success, error) {
        $.ajax({
            url: url,
            type: 'POST',
            data: param,
            //dataType: "json",  //by ddqian2 让AJAX自己去识别类别
            success: success,
            error: error
        });
    };

    // 逗号分隔 
    common.formatNum = function(str) {
        str = str.toString();
        if (/[^0-9\.]/.test(str)) {
            return str;
        }
        var strFloor = '';
        if (RegExp('\\.').test(str)) {
            strArr = str.split('.');
            str = strArr[0];
            strFloor = '.' + strArr[1];
        }
        var n = str.length % 3;
        if (n) {
            return str.slice(0, n) + str.slice(n).replace(/(\d{3})/g, ',$1') + strFloor;
        } else {
            return str.replace(/(\d{3})/g, ',$1').slice(1) + strFloor;
        }
    };

    /**
     * dialog对话框
     * @param {[type]} content [显示的内容]
     * @param {[type]} okCb [确定是执行的方法]
     * @param {[type]} cancelCb [取消时执行的方法]
     */
    common.sysConfirm = function(content, okCb, cancelCb) {
        var d = fly.top.fly.dialog({
            id: "sysconfirm",
            content: '<span class="confirm-span">' + content + '</span>',
            width: 280,
            height: 70,
            skin: 'dialog-tip',
            padding: '15px 20px',
            title: "系统提示",
            okValue: '确定',
            cancelValue: "取消",
            ok: okCb,
            cancel: true
        });

        return d;
    };



    /**
     * [getNowFormatDate 获取当前日期并格式化]
     * @return {[type]} [当前日期 yyyy-MM-dd hh:mm:ss]
     */
    common.getNowFormatDate = function() {
        var date = new Date();
        var seperator1 = '-';
        var seperator2 = ':';
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate;
        }
        // var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        var currentdate = year + seperator1 + month + seperator1 + strDate;

        return currentdate;
    };

    /**
     * 将14位数字字符串转日期格式
     * @param str 14位字符串
     * @return 日期
     */
    common.dateToNum = function(str) {
        return str.replace(/[^0-9]/g, '');
    };

    /**
     * [获取到对象数组中的属性生成字符串数组 ]
     * @param  {[object]} data [数据对象]
     * @param  {[String]} name [需要处理的属性]
     * @return {[Srray]}      [返回字符串数组]
     */
    common.getDataArrayByName = function(data, name) {
        var array = [];
        for (var i = 0; i < data.length; i++) {
            array.push(data[i][name]);
        };
        return array;
    };

    // 获取url中的中文值
    common.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return '';
    };

    /**
     * 移出遮罩
     * @return {[type]} [description]
     */
    common.removeMask = function() {
        if (window.top.$('.fly-mask').length) {
            util.removeMask();
        }
    };

    // 获取元素位置
    common.getElemPos = function(obj) {
        var pos = {
            "top": 0,
            "left": 0
        };
        if (obj.offsetParent) {
            while (obj.offsetParent) {
                pos.top += obj.offsetTop;
                pos.left += obj.offsetLeft;
                obj = obj.offsetParent;
            }
        } else if (obj.x) {
            pos.left += obj.x;
        } else if (obj.x) {
            pos.top += obj.y;
        }
        return {
            x: pos.left,
            y: pos.top
        };
    }

    // replaceAll
    String.prototype.replaceAll = function(oldV, newV) {
        var reg = new RegExp(oldV, 'g');
        return this.replace(reg, newV);
    }

    // HTML CODE 替换
    common.HTMLCodeReplace = function(dataObj) {
        var codeMap = {
            "&lt;": "<",
            "&gt;": ">",
            "&#40;": "(",
            "&#41;": ")",
            "&#39;": "'"
        }; //特殊字符MAP

        // 循环遍历内容
        for (var i = 0; i < dataObj.length; i++) {
            var item = dataObj[i];

            // 取值
            var $inputObj = $('[name="' + item + '"]'),
                val = $inputObj.val();

            // 替换全部CODE
            for (var code in codeMap) {
                val = val.replaceAll(code, codeMap[code]);
            }

            // 替换
            $inputObj.val(val);
        }
    }

    /**
     *判断是否安装flash
     *
     */
    common.getFlashInfo = function() {
        var swf, data = {};
        if (!!window.ActiveXObject || "ActiveXObject" in window) { //ie
            try {
                var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                // alert("已安装插件"); 
                if (swf) {
                    VSwf = swf.GetVariable("$version");
                    flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                    // 
                    if (flashVersion > 11) {
                        data.flashVersion = true;
                        data.flag = true;
                        return data;
                    } else {
                        data.flashVersion = false;
                        data.flag = true;
                        return data;
                    }

                } else {
                    data.flashVersion = false;
                    data.flag = false;
                    return data;
                }
            } catch (e) {
                // alert("没有安装插件"); 
                data.flashVersion = false;
                data.flag = false;
                return data;
            }
        }
        //chrome firefox
        if (navigator.userAgent.indexOf("Firefox") > 0 || navigator.userAgent.indexOf("Chrome") > 0) {
            swf = navigator.plugins["Shockwave Flash"];
            if (swf) {
                //alert("已安装插件");
                var words = swf.description.split(" ");
                for (var i = 0; i < words.length; ++i) {
                    if (isNaN(parseInt(words[i]))) continue;
                    flashVersion = parseInt(words[i]);
                }
                if (flashVersion > 11) {
                    data.flashVersion = true;
                    data.flag = true;
                    return data;
                } else {
                    data.flashVersion = false;
                    data.flag = true;
                    return data;
                }

            } else {
                //alert("没有安装插件");
                data.flashVersion = false;
                data.flag = false;
                return data;
            }
        }
    };

    // 暂无数据
    // @param: emptyObj: 空数据需要添加到的DOMID (string)
    common.addEmpty = function(emptyObj) {

        var $emptyObj = $("#" + emptyObj),
            $prevObj = $emptyObj.prev(),
            _objHeight = $emptyObj.height(),
            _marginTopH = _objHeight / 2 - 25, // 25px:暂无数据的高度 / 2
            htmlObj = [
                '<div class="emptyData">',
                '    <table class="wp-100">',
                '        <tbody>',
                '            <tr>',
                '                <td>',
                '                    <div class="emptyData-container">',
                '                        <div class="emptyData-left empty-wrap"></div>',
                '                        <div class="emptyData-right empty-wrap">暂无数据~</div>',
                '                    </div>',
                '                </td>',
                '            </tr>',
                '        </tbody>',
                '    </table>',
                '</div>'
            ].join('');

        $emptyObj.empty().append(htmlObj);

        if ($prevObj && $prevObj.length) {
            $emptyObj.css({
                'width': $prevObj.width()
            });
            $prevObj.css({
                "overflow-x": "visible"
            });
        }

        // 修改高度、宽度
        $emptyObj.find('.emptyData-container').css('padding-top', _marginTopH);
    };

    Array.prototype.sum = function() {

        var temp = 0;

        for (var i = 0, len = this.length; i < len; i++) {
            temp += this[i] >> 0;
        }
        return temp;
    };

    common.dateFormatter = function() {

        // 时间的格式处理 
        fly.template.helper('dateFormatter', function(str) {
            if (!str) {
                return '-';
            }
            var newStr = '';
            if (str.length == 12) {
                newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + ' ' + str.substring(8, 10) + '：' + str.substring(10, 12);
            } else if (str.length == 8) {
                newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8);
            }
            return newStr;
        });
    };
    common.dateFormatterLen = function(str) {
        if (!str) {
            return '-';
        }
        var newStr = '';
        if (str.length == 12) {
            newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8) + ' ' + str.substring(8, 10) + '：' + str.substring(10, 12);
        } else if (str.length == 8) {
            newStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8);
        }
        return newStr;
    };
    // 帮扶日志的展开和关闭 
    common.logShowAndHideFun = function() {
        fly.template.helper('logIntroFormatter', function(str) {
            if (str.length > 100) {
                return str.substring(0, 100) + '...';
            }
            return str;
        });

        // 帮扶日志的展开和关闭 
        $('#helpLogWrap').on('click', '.log-show', function() {
            var $this = $(this),
                $closeDom = $this.closest('.log-intro'),
                allArticle = $closeDom.attr('title'),
                flag = $this.hasClass('log-open');
            if (flag) {
                $closeDom.find('.log-article').text(allArticle);
                $this.addClass('log-close').removeClass('log-open').attr('title', '收起').text('收起');
            } else {
                var newArticle = allArticle.length > 100 ? (allArticle.substring(0, 100) + '...') : allArticle;
                $closeDom.find('.log-article').text(newArticle);
                $this.addClass('log-open').removeClass('log-close').attr('title', '展开').text('展开');
            }
        });
    };
    /**
     * 获取宽度
     * @param  {[type]} List     对象集合
     * @param  {[type]} fontSize 字体大小
     * @return {[type]}          [description]
     */
    common.getWidth = function(list, col, fontSize) {
        var baseW = 60, //两边留白 10px
            totalW = 0; // 总长度

        for (var i = 0; i < list.length; i++) {
            list[i].width = list[i][col].length * fontSize + baseW;
            totalW += list[i].width;
        }

        return {
            list: list,
            totalW: totalW
        };
    };
    /**
     * [setGridEmpty 表格空数据处理]
     * @param {[number]} num [表格的列数，为了合并列来显示的]
     */
    common.setGridEmpty = function(num) {
        var emptyDom = '<tr><td colspan="' + num + '"><div><div class="empty-data-show"></div></div></td></tr>';
        $('table').find('tbody').html(emptyDom);
    };
    //  8位数的当前时间 年月日
    common.toDateTime = function() {
        var myDate = new Date(),
            year = myDate.getFullYear(),
            month = myDate.getMonth() > 8 ? (myDate.getMonth() + 1) : '0' + (myDate.getMonth() + 1),
            date = myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate(),
            dateTime = year + month + date + '';
        return dateTime;
    };

    /**
     * [setGridEmpty 表格空数据处理]
     * @param {[number]} num [表格的列数，为了合并列来显示的]
     *
     *  id: 查找的id
     */
    common.setCustomizeGridEmpty = function(id) {
        var emptyDom = '<div class="empty-show">没有数据</div>';
        $('.grid').find('#' + id).html(emptyDom);
    };

    common.generateMixed = function(n) {
        var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var res = "";
        for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 35);
            res += chars[id];
        }
        return res;
    }
    common.permissionCode = [];

    (common.radioClick = function() {
        $('body').on('click', '.radio-wrap .radio-default', function() {
            var $this = $(this);
            if ($this.attr('disabled')) return false;
            $this.addClass('radio-selected').siblings().removeClass('radio-selected');
        }).on('click', '.checkbox-wrap .select-default', function() {
            var $this = $(this);
            if ($this.attr('disabled')) return false;
            if ($this.hasClass('select-check')) {
                $this.removeClass('select-check');
            } else {
                $this.addClass('select-check');
            }

        });
    })();

    window.common = common;
    return common;
}));