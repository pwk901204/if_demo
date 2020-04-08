// 封装监听事件
var handlerEvent = {
    option: {
        index: 0,
        musicSrc: '',
        wrapper: '#music-wrapper'
    },

    setOption: function (options) {
        handlerEvent.option.audioSrc = options.audioSrc;
        handlerEvent.option.index = options.index;
        handlerEvent.option.wrapper = options.wrapper;
        handlerEvent.option.parentBox = $('#music-wrapper');
    },
    addDom: function () {
        var src = handlerEvent.option.audioSrc;

        var div = '  <div class="file-name"></div>' +
        '<div class="audio-wrapper">' +
            '<audio >' +
            '    <source src="' + src + '" type="audio/mp3">' +
            '</audio>' +
            '<div class="audio-left">' +
            ' <img src="../img/suspend.png">' +
            '</div>' +
            '<div class="audio-time">' +
            '    <span class="audio-length-current">00:00</span>' +
            '</div>' +
            '<div class="audio-right">' +
            '  <div class="progress-bar-bg">' +
            '  <span class="progress-dot"></span>' +
            '    <div class="progress-bar"></div>' +
            ' </div>' +
            '</div>' +
            '<div class="audio-time">' +
            '    <span class="audio-length-total">00:00</span>' +
            '</div>' +
            '<div class="audio-voice">' +
            '<img src="../img/volume.png">' +
            '</div>' +
            '<div class="audio-voice-num">' +
            '  <div class="voice-bar-bg">' +
            '  <span class="voice-dot"></span>' +
            '    <div class="voice-bar"></div>' +
            ' </div>' +
            '</div>'
        handlerEvent.option.parentBox.append(div);
    },
    addHandler: function (num) {
        var audio = $('audio')[num];
        if (audio.addEventListener) {
            // 监听音频播放时间并更新进度条
            audio.addEventListener('timeupdate', function () {
                updateProgress(audio, num);
            }, false);

            // 监听播放完成事件
            audio.addEventListener('ended', function () {
                audioEnded(num);
            }, false);

        }
        // 点击进度条跳到指定点播放
        // 此处不要用click，否则下面的拖动进度点事件有可能在此处触发，此时e.offsetX的值非常小，会导致进度条弹回开始处
        $('.progress-bar-bg').eq(num).on('mousedown', function (e) {
            var pgsWidth = $('.progress-bar-bg').width();
            var rate = e.offsetX / pgsWidth;
            audio.currentTime = audio.duration * rate;
            updateProgress(audio, num);
        });

        //拖动进度条
        var dot = document.getElementsByClassName('progress-dot')[num];
        dot.onmousedown = function (e) {
            var oriLeft = dot.offsetLeft;
            var mouseX = e.clientX;
            var maxLeft = oriLeft; // 向左最大可拖动距离
            var maxRight = document.getElementsByClassName('progress-bar-bg')[num].offsetWidth - oriLeft; // 向右最大可拖动距离

            // 禁止默认的选中事件（避免鼠标拖拽进度点的时候选中文字）
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }

            // 禁止事件冒泡
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }

            // 开始拖动
            document.onmousemove = function (e) {
                var length = e.clientX - mouseX;
                if (length > maxRight) {
                    length = maxRight;
                } else if (length < -maxLeft) {
                    length = -maxLeft;
                }
                var pgsWidth = $('.progress-bar-bg').width();
                var rate = (oriLeft + length) / pgsWidth;
                audio.currentTime = audio.duration * rate;
                updateProgress(audio, num);
                // debugger
            };

            // 拖动结束
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        // 获取播放总时长
        $('audio').eq(num).on("loadedmetadata", function () {
            $('.audio-length-total').eq(num).text(transTime(this.duration));
        });

        //更新进度条与当前播放时间
        function updateProgress(audio, num) {
            var value = audio.currentTime / audio.duration;
            $('.progress-bar').eq(num).css('width', value * 100 + '%');
            $('.progress-dot').eq(num).css('left', value * 100 + '%');
            $('.audio-length-current').eq(num).html(transTime(audio.currentTime));
        };

        //音频播放时间换算
        function transTime(value) {
            var time = "";
            var h = parseInt(value / 3600);
            value %= 3600;
            var m = parseInt(value / 60);
            var s = parseInt(value % 60);
            if (h > 0) {
                time = formatTime(h + ":" + m + ":" + s);
            } else {
                time = formatTime(m + ":" + s);
            }

            return time;
        };

        //格式化时间显示，补零对齐
        // eg：2:4  -->  02:04
        function formatTime(value) {
            var time = "";
            var s = value.split(':');
            var i = 0;
            for (; i < s.length - 1; i++) {
                time += s[i].length == 1 ? ("0" + s[i]) : s[i];
                time += ":";
            }
            time += s[i].length == 1 ? ("0" + s[i]) : s[i];

            return time;
        };

        //播放完成时把进度调回开始的位置
        function audioEnded(num) {
            $('.progress-bar').eq(num).css('width', 0);
            $('.progress-dot').eq(num).css('left', 0);
            $('.audio-left img').eq(num).attr('src', '../img/suspend.png');
        };

        // 点击播放/暂停图片时，控制音乐的播放与暂停
        $('.audio-left img').eq(num).click(function () {
            var playAndSuspend = $('.audio-left img').eq(num);
            if (audio.paused) {
                // 开始播放当前点击的音频
                audio.play();
                playAndSuspend.attr('src', '../img/play.png');
            } else {
                audio.pause();
                playAndSuspend.attr('src', '../img/suspend.png');
            }
        });

        //静音
        $('.audio-voice img').eq(num).click(function () {
            var isMute = $('.audio-voice img').eq(num);
            if (!audio.muted) {
                audio.muted = true;
                isMute.attr('src', '../img/mute.png');
            } else {
                audio.muted = false;
                isMute.attr('src', '../img/volume.png');
            }
        });
        //更新声音进度条
        function updateVoiceProgress(audio, num) {
            var value = audio.volume
            var isMute = $('.audio-voice img').eq(num);
            if (!value) {
                isMute.attr('src', '../img/mute.png');
            } else {
                isMute.attr('src', '../img/volume.png');
            }
            $('.voice-bar').eq(num).css('width', value * 100 + '%');
            $('.voice-dot').eq(num).css('left', value * 100 + '%');
        };
        //声音大小
        //计算rate，关联声音的大小
        //拖动voice-dot,声音变化
        $('.voice-bar-bg').eq(num).on('mousedown', function (e) {
            var pgsWidth = $('.voice-bar-bg').width();
            var rate = e.offsetX / pgsWidth;
            var vol = Math.floor(rate * 100) 
            audio.volume = vol / 100
            $('audio')[num].volume = audio.volume
            //点击更新进度条
            updateVoiceProgress(audio, num)
            //拖动进度条
            dragVoiceDot()


        });
        //拖动音量进度条
        function dragVoiceDot() {
            var dot = document.getElementsByClassName('voice-dot')[num];
            dot.onmousedown = function (e) {
                // debugger
                var oriLeft = dot.offsetLeft;
                var mouseX = e.clientX;
                var maxLeft = oriLeft; // 向左最大可拖动距离
                var maxRight = document.getElementsByClassName('voice-bar-bg')[num].offsetWidth - oriLeft; // 向右最大可拖动距离

                // 禁止默认的选中事件（避免鼠标拖拽进度点的时候选中文字）
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }

                // 禁止事件冒泡
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    window.event.cancelBubble = true;
                }

                // 开始拖动
                document.onmousemove = function (e) {
                    var length = e.clientX - mouseX;
                    if (length > maxRight) {
                        length = maxRight;
                    } else if (length < -maxLeft) {
                        length = -maxLeft;
                    }
                    var pgsWidth = $('.voice-bar-bg').width();
                    // var rate = e.offsetX / pgsWidth;
                    var rate = (oriLeft + length) / pgsWidth;
                    var vol = Math.floor(rate * 100)
                    // debugger
                    audio.volume = vol / 100
                    updateVoiceProgress(audio, num);
                };

                // 拖动结束
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
        }

        //
    }
}

$(document).ready(function () {

    var srcs = [{name: 'music1',url: '../music/music1.mp3'}, {name: 'music3',url: '../music/music3.mp3'}];
    // var srcs = ['../music/music1.mp3'];
    for (var i = 0; i < srcs.length; i++) {
        var src = srcs[i].url;
        var fileName = srcs[i].name;
        handlerEvent.setOption({
            index: i,
            audioSrc: src,
            wrapper: '#music-wrapper'
        })
        handlerEvent.addDom();
        handlerEvent.addHandler(i);
        // 文件显示
        $('.file-name').eq(i).text(fileName)
    }
});