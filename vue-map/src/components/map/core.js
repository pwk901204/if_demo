/**
 * 地图系统
 * 内核
 */

export const Map = function () {
  'use strict';
  const NODE_ENV = process.env.NODE_ENV
  // 默认配置项
  var option = {
    id: 'map', // canvas ID
    mapTiles: { x: 3, y: 2 }, // 瓦片数量（1级）
    // src: `${NODE_ENV === 'development' ? '/api' : ''}/map/files/${mapInfo.floorName}/`, // 图片路径
    imageFormat: '.png', // 图片格式
    mapLevelMax: 3, // 最大缩放等级
    tileWidth: 128, // 瓦片边长
    wheelScale: 1.05, // 鼠标滚轮缩放系数
    scaleLevel: 1, // 当前加载的瓦片级别
    point: {
      x: 'posX',
      y: 'posY',
      name: 'pointName'
    }
  };

  var canvas, context;
  var moveOffsetY = 0, moveOffsetX = 0;
  //var img_max_count = 0; // 地图瓦片总数
  //var img_loaded_num = 0; //当前已经加载的瓦片数量
  var finger1Pos = { x: 0, y: 0 }; // 手指1位置
  var finger2Pos = { x: 0, y: 0 }; // 手指2位置
  var lines = []; // 线
  var img_start, img_end, img_line, img_line_manage, end_point, img_mark, is_mark;

  var start_point, mark_point, end_point;

  var TEXT_EACH_WIDTH = 8; //单个文本字符宽度（英文）

  //点位显示类型
  var show_point_type = 0;//0显示标识 1显示名称

  // 寻路导航线
  img_line = new Image();
  img_line.src = '/icon/icon-line.png';

  img_line_manage = new Image();
  img_line_manage.src = '/icon/icon-line-manage.png';

  // 起点
  img_start = new Image();
  img_start.src = '/icon/icon-start.png';

  // 终点
  img_end = new Image();
  img_end.src = '/icon/icon-end.png';

  // 标记
  img_mark = new Image();
  img_mark.src = '/icon/icon-mark.png';

  var NODE = {}, // 节点信息icon
    ROUTES = [],//路径规划
    POINTX = 'posX',
    POINTY = 'posY',
    LAYERS = 'showLayers',
    POINTCONNECT = 'connectPoints',
    POINTNMAE = 'pointId'; // 点x轴坐标和y轴坐标字段

  /**
   * [resetOption 重新设置配置项]
   * @param  {[type]} myOption [自定义配置项]
   * @return {[type]}        [新的默认配置项]
   */
  function resetOption (myOption) {
    if (myOption instanceof Object) {
      for (var key in myOption) {
        option[key] = myOption[key];
      }
    }
  };

  // var screenWidth, screenHeight;
  // var img_mark
  // ; //标记图片
  var tilesImageArr = {}; //瓦片图集
  var offsetX = 0; //地图偏移量（X）
  var offsetY = 0; //地图偏移量（Y）
  var mapZoom = 1; //地图当前缩放数值
  var cur_event = 'idle'; //当前对地图的操作行为（idle:无，move:移动，scale:缩放）
  // var img_max_count = 0; //地图瓦片总数
  // var img_loaded_num = 0; //当前已经加载的瓦片数量
  var img_loading_queue = []; //地图加载队列

  var currentMapSize = { w: 0, h: 0 }; // 当前展示地图大小

  // var downPos; // 
  // 

  // 事件处理
  var eventControl = {
    /**
     * [onmousedown 图片拖拽]
     * @param  {[type]} event [事件对象]
     * @return {[type]}       [图片移动]
     */
    onmousedown: function (event) {
      var downPos = windowToCanvas(event.clientX, event.clientY);

      canvas.onmousemove = function (event) {

        var pos = windowToCanvas(event.clientX, event.clientY);
        var x = pos.x - downPos.x;
        var y = pos.y - downPos.y;
        downPos = pos;
        moveOffsetX += x;
        moveOffsetY += y;

        if (x != 0 && y != 0 && cur_event != 'move') {
          cur_event = 'move';
          canvas.style.cursor = "move";
        }
      }

      canvas.onmouseup = function () {
        canvas.onmousemove = null;
        canvas.onmouseup = null;
        // cur_event = 'idle';
        canvas.style.cursor = "default";
        springback();
      }

      canvas.onmouseout = function () {
        canvas.onmousemove = null;
        canvas.onmouseup = null;
        springback();
        // cur_event = 'idle';
        canvas.style.cursor = "default";
        springback();
      }
    },

    /**
     * [onmousewheel 鼠标滚动]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */



    onmousewheel: function (event) {
      var pos = windowToCanvas(event.clientX, event.clientY);
      var wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltaY * (-40));

      if (wheelDelta > 0) { // 放大
        if (option.scaleLevel != option.mapLevelMax || mapZoom < 1.2) {
          offsetX -= (pos.x - offsetX) * (option.wheelScale - 1);
          offsetY -= (pos.y - offsetY) * (option.wheelScale - 1);

          mapZoom *= option.wheelScale;

          if (option.scaleLevel < option.mapLevelMax && mapZoom >= 1.5) {
            option.scaleLevel++;
            mapZoom *= 0.5;
          }
        }
      } else { // 缩小
        if (option.scaleLevel > 1 || mapZoom > 1) {
          offsetX += ((pos.x - offsetX) / mapZoom) * (mapZoom * (1 - 1 / option.wheelScale));
          offsetY += ((pos.y - offsetY) / mapZoom) * (mapZoom * (1 - 1 / option.wheelScale));

          mapZoom /= option.wheelScale;

          if (option.scaleLevel == 1 && mapZoom <= 1) {
            mapZoom = 1;
          }

          if (option.scaleLevel > 1 && mapZoom < 0.75) {
            option.scaleLevel--;
            mapZoom *= 2;
          }
        }
      }

      drawImage();

      event.preventDefault();
    },

    touchstart: function (event) {
      cur_event = 'idle';
      if (event.touches.length == 1) {
        finger1Pos = windowToCanvas(event.touches[0].clientX, event.touches[0].clientY);
      } else if (event.touches.length == 2) {
        finger1Pos = windowToCanvas(event.touches[0].clientX, event.touches[0].clientY);
        finger2Pos = windowToCanvas(event.touches[1].clientX, event.touches[1].clientY);
      }
      event.preventDefault();
    },

    touchmove: function (event) {
      if (event.touches.length == 1) {
        var cur_pos = windowToCanvas(event.touches[0].clientX, event.touches[0].clientY);
        var x = cur_pos.x - finger1Pos.x;
        var y = cur_pos.y - finger1Pos.y;
        finger1Pos = cur_pos;

        if ((cur_event == 'idle' || cur_event == 'scale') && (Math.abs(x) >= 2 || Math.abs(y) >= 2)) {
          cur_event = 'move';
          return;
        }
        moveOffsetX += x;
        moveOffsetY += y;
      } else if (event.touches.length == 2) {
        var dis_pre = Math.pow((finger2Pos.x - finger1Pos.x) * (finger2Pos.x - finger1Pos.x) + (finger2Pos.y - finger1Pos.y) * (finger2Pos.y - finger1Pos.y), 0.5);

        var cur_pos_1 = windowToCanvas(event.touches[0].clientX, event.touches[0].clientY);
        var cur_pos_2 = windowToCanvas(event.touches[1].clientX, event.touches[1].clientY);

        var dis_cur = Math.pow((cur_pos_2.x - cur_pos_1.x) * (cur_pos_2.x - cur_pos_1.x) + (cur_pos_2.y - cur_pos_1.y) * (cur_pos_2.y - cur_pos_1.y), 0.5);

        if (cur_event == 'idle') {
          cur_event = 'scale';
        }

        var point_center = { x: (cur_pos_2.x + cur_pos_1.x) * 0.5, y: (cur_pos_2.y + cur_pos_1.y) * 0.5 };

        if (dis_cur > dis_pre) { //放大
          if (option.scaleLevel != option.mapLevelMax || mapZoom < 1.2) {
            var scale_cur = dis_cur / dis_pre;
            offsetX -= (point_center.x - offsetX) * (scale_cur - 1);
            offsetY -= (point_center.y - offsetY) * (scale_cur - 1);

            mapZoom *= scale_cur;

            if (option.scaleLevel < option.mapLevelMax && mapZoom >= 1.5) {
              option.scaleLevel++;
              mapZoom *= 0.5;
            }
          }
        } else if (dis_cur < dis_pre) { //缩小
          if (option.scaleLevel > 1 || mapZoom > 1) {
            var scale_cur = dis_pre / dis_cur;
            offsetX += (point_center.x - offsetX) * (1 - 1 / scale_cur);
            offsetY += (point_center.y - offsetY) * (1 - 1 / scale_cur);

            mapZoom /= scale_cur;

            if (option.scaleLevel == 1 && mapZoom <= 1) {
              mapZoom = 1;
            }

            if (option.scaleLevel > 1 && mapZoom < 0.75) {
              option.scaleLevel--;
              mapZoom *= 2;
            }
          }
        }
        finger1Pos = cur_pos_1;
        finger2Pos = cur_pos_2;
        drawImage();
      }

      //drawImage();

      event.preventDefault();
    },

    touchend: function (event) {
      if (event.touches.length == 0) {
        if (cur_event === 'move') {
          springback();
        }
      }

      // cur_event = 'idle';
      canvas.ontouchstart = null;
      canvas.ontouchmove = null;
      event.preventDefault();
    }
  };

  /**
   * [loadImageLevel 加载不同级别的瓦片]
   * @param  {[type]} level [瓦片级别]
   * @return {[type]}       [图片被加载出来]
   */
  function loadImageLevel (level) {
    // var arr = [];
    // for (var i = 0; i < option.mapTiles.x * Math.pow(2, level - 1); i++) {
    //     arr[i] = new Array();

    //     for (var j = 0; j < option.mapTiles.y * Math.pow(2, level - 1); j++) {
    //         arr[i][j] = new Image();
    //         // arr[i][j].src = option.src + level + "/" + i + "_" + j + option.imageFormat;
    //         var img_index = parseInt(option.mapTiles.x * Math.pow(2, level - 1) * j) + parseInt(i) + 1;
    //         if(img_index < 10){
    //             img_index = "0" + img_index;
    //         }
    //         arr[i][j].src = option.src + level + "/" + img_index + option.imageFormat;
    //     }
    // }
    // tilesImageArr['level' + level] = arr;

    var arr = [];
    for (var i = 0; i < option.mapTiles.x * Math.pow(2, level - 1); i++) {
      arr[i] = new Array();

      for (var j = 0; j < option.mapTiles.y * Math.pow(2, level - 1); j++) {
        arr[i][j] = new Image();
        arr[i][j].onload = function () {
          drawImage();
        }

        // arr[i][j].src = option.src + level + "/" + i + "_" + j + option.imageFormat;


        // var img_index = parseInt(option.mapTiles.x * Math.pow(2, level - 1) * j) + parseInt(i) + 1;
        // if(img_index < 10){
        //     img_index = "0" + img_index;
        // }
        // arr[i][j].src = option.src + level + "/" + img_index + option.imageFormat;
      }
    }
    tilesImageArr['level' + level] = arr;
  };


  /**
   * [drawImage 绘制地图]
   * @return {[type]} [description]
   */
  function drawImage () {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < option.mapTiles.y * Math.pow(2, option.scaleLevel - 1); i++) {
      for (var j = 0; j < option.mapTiles.x * Math.pow(2, option.scaleLevel - 1); j++) {
        if (offsetX + j * option.tileWidth * mapZoom < -option.tileWidth * mapZoom || offsetX + j * option.tileWidth * mapZoom > canvas.width) {
          continue;
        }
        if (offsetY + i * option.tileWidth * mapZoom < -option.tileWidth * mapZoom || offsetY + i * option.tileWidth * mapZoom > canvas.height) {
          continue;
        }

        var cur_img = tilesImageArr['level' + option.scaleLevel][j][i];
        if (cur_img.width !== option.tileWidth) {
          if (img_loading_queue.indexOf(option.scaleLevel + "_" + j + "_" + i) == -1) {
            img_loading_queue.push(option.scaleLevel + "_" + j + "_" + i);
          }
        } else {
          var dx = parseInt(offsetX + j * option.tileWidth * mapZoom);
          var dy = parseInt(offsetY + i * option.tileWidth * mapZoom);
          var diw = Math.ceil(option.tileWidth * mapZoom);
          var dih = Math.ceil(option.tileWidth * mapZoom);

          context.drawImage(cur_img, 0, 0, cur_img.width, cur_img.height, dx, dy, diw, dih);
        }
      }
    }

    drawPoint();
  }

  /**
   * [springback 边界回弹]
   * @return {[type]} [description]
   */
  function springback () {
    var map_width = option.mapTiles.x * Math.pow(2, option.scaleLevel - 1) * option.tileWidth * mapZoom;
    var map_height = option.mapTiles.y * Math.pow(2, option.scaleLevel - 1) * option.tileWidth * mapZoom;

    if (moveOffsetX > 0 && offsetX > 0) {
      if (offsetX + map_width > canvas.width) {
        moveOffsetX = canvas.width - (offsetX + map_width);
        if (moveOffsetX + offsetX < 0) {
          moveOffsetX = offsetX * -1;
        }
      }
    }
    else if (moveOffsetX < 0) {
      if (map_width < canvas.width) {
        if (offsetX < 0) {
          moveOffsetX = offsetX * -1;
        }
      }
      else if (offsetX + map_width < canvas.width) {
        moveOffsetX = canvas.width - (offsetX + map_width);
      }
    }

    if (moveOffsetY > 0 && offsetY > 0) {
      if (offsetY + map_height > canvas.height) {
        moveOffsetY = canvas.height - (offsetY + map_height);
        if (moveOffsetY + offsetY < 0) {
          moveOffsetY = offsetY * -1;
        }
      }
    }
    else if (moveOffsetY < 0) {
      if (map_height < canvas.height) {
        if (offsetY < 0) {
          moveOffsetY = offsetY * -1;
        }
      }
      else if (offsetY + map_height < canvas.height) {
        moveOffsetY = canvas.height - (offsetY + map_height);
      }
    }
  }

  /**
   * [drawPoint 绘制点]
   * @return {[type]} [description]
   */
  function drawPoint () {
    context.save(); //保存状态
    lines.length = 0;


    drawLine();

    //文本
    context.font = "bold 12px Microsoft YaHei";
    context.fillStyle = "red";
    for (var key in NODE) {
      var point = NODE[key],
        id = point.pointId,
        name = point[POINTNMAE],
        mapX = parseInt(offsetX + point[POINTX] * mapZoom * Math.pow(2, option.scaleLevel - 1)),
        mapY = parseInt(offsetY + point[POINTY] * mapZoom * Math.pow(2, option.scaleLevel - 1)),
        mapPos = { x: mapX, y: mapY };

      var textOffsetX = getStrLength(name) * 3;

      //显示点位
      if (show_point_type == 2) {
        if (point[LAYERS] && $.inArray(option.scaleLevel + '', point[LAYERS].split(',')) >= 0) {
          context.fillText(name, mapPos.x - textOffsetX, mapPos.y + 6);
        }
      }
      else {
        context.beginPath();
        context.arc(mapPos.x, mapPos.y, 3, 0, Math.PI * 2, false);
        context.fillStyle = 'red';
        context.fill();
        context.fillText(name, mapPos.x - textOffsetX, mapPos.y - 10);
      }

      //显示开始点
      if (start_point && 'pointId' in start_point && start_point.pointId == id) {
        var dw = img_start.width,
          dh = img_start.height,
          sw = dw * 2 / 3,
          sh = dh * 2 / 3,
          sOffX = mapX - sw / 2,
          sOffY = mapY - sh + 6;

        context.drawImage(img_start, 0, 0, dw, dh, sOffX, sOffY, sw, sh);
      }

      //显示标记点
      if (mark_point && 'pointId' in mark_point && mark_point.pointId === id) {
        var dw = img_mark.width,
          dh = img_mark.height,
          sw = dw * 2 / 3,
          sh = dh * 2 / 3,
          sOffX = mapX - sw / 2,
          sOffY = mapY - sh + 6;

        context.drawImage(img_mark, 0, 0, dw, dh, sOffX, sOffY, sw, sh);
      }

      //显示结束点
      if (end_point && 'pointId' in end_point && end_point.pointId === id) {
        var dw = img_end.width,
          dh = img_end.height,
          sw = dw * 2 / 3,
          sh = dh * 2 / 3,
          sOffX = mapX - sw / 2,
          sOffY = mapY - sh + 6;

        context.drawImage(img_end, 0, 0, dw, dh, sOffX, sOffY, sw, sh);
      }
    }
  }

  /**
   * [drawLine 绘制线]
   * @return {[type]} [description]
   */
  function drawLine () {
    //后台连接线
    for (var key in NODE) {
      var pos = NODE[key];
      if (pos[POINTCONNECT] !== '') {
        // debugger
        if (POINTCONNECT in pos) {
          var connects = pos[POINTCONNECT].split(',');
          for (var i = 0; i < connects.length; i++) {
            var line1 = NODE[key][POINTNMAE] + '-' + connects[i];
            var lineStr = lines.join(',');
            if (lineStr.indexOf(line1) === -1) {
              var line2 = connects[i] + '-' + NODE[key][POINTNMAE];
              lines.push(line1);
              lines.push(line2);
              // console.log(lines)

              var c_pos = getNODEByPointId(connects[i]);//NODE[connects[i]];
              // console.log(c_pos)
              // context.beginPath();
              // debugger
              if (c_pos) {
                var lineStartX = offsetX + pos[POINTX] * mapZoom * Math.pow(2, option.scaleLevel - 1);
                var lineStartY = offsetY + pos[POINTY] * mapZoom * Math.pow(2, option.scaleLevel - 1);
                var lineEndX = offsetX + c_pos[POINTX] * mapZoom * Math.pow(2, option.scaleLevel - 1);
                var lineEndY = offsetY + c_pos[POINTY] * mapZoom * Math.pow(2, option.scaleLevel - 1);


                renderTextureLine({ x: lineStartX, y: lineStartY }, { x: lineEndX, y: lineEndY });
              }
            }
          }
        }
      }
    }

    //寻路线
    for (var i = 0, len = ROUTES.length - 1; i < len; i++) {
      var pos = ROUTES[i];
      var c_pos = ROUTES[i + 1];

      context.beginPath();
      var lineStartX = offsetX + pos[POINTX] * mapZoom * Math.pow(2, option.scaleLevel - 1);
      var lineStartY = offsetY + pos[POINTY] * mapZoom * Math.pow(2, option.scaleLevel - 1);
      var lineEndX = offsetX + c_pos[POINTX] * mapZoom * Math.pow(2, option.scaleLevel - 1);
      var lineEndY = offsetY + c_pos[POINTY] * mapZoom * Math.pow(2, option.scaleLevel - 1);


      renderTextureLine({ x: lineStartX, y: lineStartY }, { x: lineEndX, y: lineEndY });
    }
  }

  function getNODEByPointId (pointId) {
    // debugger
    for (var key in NODE) {
      if (NODE[key].pointId == pointId) {
        return NODE[key];
      }
    }
    return null;
  }

  function renderUpdate () {
    var refresh = false;
    if (moveOffsetX != 0) {
      offsetX += moveOffsetX * 0.5;
      moveOffsetX *= 0.5;

      if (Math.abs(moveOffsetX) <= 1) {
        moveOffsetX = 0;
      } else {
        refresh = true;
      }
    }
    if (moveOffsetY != 0) {
      offsetY += moveOffsetY * 0.5;
      moveOffsetY *= 0.5;

      if (Math.abs(moveOffsetY) <= 1) {
        moveOffsetY = 0;
      } else {
        refresh = true;
      }
    }
    if (refresh) {
      drawImage();
    }

    while (img_loading_queue.length > 0) {
      var img_loading = img_loading_queue.shift().split('_');
      loadMapTiles(img_loading[0], img_loading[1], img_loading[2]);
    }
  }

  function loadMapTiles (level, pos_x, pos_y) {
    var img = new Image();
    img.onload = function () {
      //img_array[level-1][pos_x][pos_y] = img;
      tilesImageArr['level' + level][pos_x][pos_y] = img;
      drawImage();
    }
    //img.src = option.src + level + "/" + pos_x + "_" + pos_y + option.imageFormat;//"images/"+level+"/"+pos_x+"_"+pos_y+".png";
    var img_index = parseInt(option.mapTiles.x * Math.pow(2, level - 1) * pos_y) + parseInt(pos_x) + 1;
    if (img_index < 10) {
      img_index = "0" + img_index;
    }
    img.src = option.src + level + "/" + img_index + option.imageFormat;
  }

  //  渲染路线
  function renderTextureLine (startPoint, endPoint) {
    var x = endPoint.x - startPoint.x;
    var y = endPoint.y - startPoint.y;
    var z = Math.sqrt(x * x + y * y);

    // var angle = Math.asin(y / z) / Math.PI * 180;
    var angle = Math.acos(x / z) / Math.PI * 180;

    if (0 == y) {
      if (x < 0) {
        angle = 180;
      } else {
        angle = 0;
      }
    } else if (y < 0) {
      angle *= -1;
    }

    context.save();
    var woodfill = context.createPattern(img_line_manage, "repeat");
    context.fillStyle = woodfill;
    context.translate(startPoint.x, startPoint.y);
    context.rotate(angle * Math.PI / 180);
    context.translate(0, -4); //用于防止接头错位
    context.fillRect(0, 0, z + 4, 8); //+4用于防止接头错位
    context.restore();
  }

  /**
   * [windowToCanvas 屏幕坐标转换成canvas坐标]
   * @param  {[type]} x [屏幕坐标X]
   * @param  {[type]} y [屏幕坐标Y]
   * @return {[type]}   [canvas坐标]
   */
  function windowToCanvas (x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
      x: (x - bbox.left),
      y: (y - bbox.top)
    }
  };

  /**
   * [isEmptyObject 判断指定参数是否是一个空对象]
   * @param  {[type]}  obj [description]
   * @return {Boolean}     [description]
   */
  function isEmptyObject (obj) {
    var name;
    for (name in obj) {
      return false;
    }
    return true;
  }

  /**
   * [getStrLength 计算中英文长度]
   * @param  {[type]}  obj [description]
   * @return {Boolean}     [description]
   */
  function getStrLength (str) {
    str += '';
    var cArr = str.match(/[^\x00-\xff]/ig);
    return str.length + (cArr == null ? 0 : cArr.length);
  }

  /**
   * [loading 加载中]
   * @return {[type]} [description]
   */
  function loading () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "bold 16px Courier New";
    context.fillStyle = "#4d4d4d";
    var txt = '正在加载中',
      x = (canvas.width - getStrLength(txt) * TEXT_EACH_WIDTH) / 2,
      y = (canvas.height - 12) / 2;
    // for(var i=0; i<tips_pos.length; i++){
    // var pos_item = tips_pos[i].split(',');
    context.fillText(txt, x, y);

    // canvas.
  }

  /**
   * [init 初始化地图]
   * @param  {[type]} myOption [自定义配置项]
   * @return {[type]}        [地图初始化]
   */
  this.init = function (myOption) {
    resetOption(myOption);
    canvas = document.getElementById(option.id);
    context = canvas.getContext('2d');
    // console.log(canvas.parentElement.offsetWidth)

    canvas.width = 'width' in option ? option.width : option.mapTiles.x * option.tileWidth;
    canvas.height = 'height' in option ? option.height : option.mapTiles.y * option.tileWidth;
    // debugger
    var pw = canvas.parentElement.offsetWidth;
    if (canvas.width > pw) {
      canvas.width = pw;
      canvas.height = parseInt(pw * option.mapTiles.y / option.mapTiles.x)
    }
    // canvas.width = canvas.width > 800 ? 800 : canvas.width;
    // canvas.height = canvas.height > 600 ? 600 : canvas.height;
    this.canvas = canvas;
    this.context = context;

    // 加载中
    // loading(); 
    // this.scaleLevel = option.scaleLevel;

    var xScale = canvas.width / (option.mapTiles.x * option.tileWidth),
      yScale = canvas.height / (option.mapTiles.y * option.tileWidth);
    mapZoom = xScale > yScale ? yScale : xScale;
    // debugger;
    // option.scaleLevel = 2;
    offsetX = (canvas.width - option.mapTiles.x * option.tileWidth * option.scaleLevel * mapZoom) / 2;
    offsetY = (canvas.height - option.mapTiles.y * option.tileWidth * option.scaleLevel * mapZoom) / 2;

    POINTX = option.point.x;
    POINTY = option.point.y;
    // POINTCONNECT = 'connectPoints',
    POINTNMAE = option.point.name;
    // debugger

    for (var i = 1; i <= option.mapLevelMax; i++) {
      loadImageLevel(i);
    }

    // loadImageLevel(option.scaleLevel);

    // 图片拖拽
    canvas.onmousedown = eventControl.onmousedown;

    // 图片放大缩小
    canvas.onmousewheel = canvas.onwheel = function (event) {
      eventControl.onmousewheel(event);
    };

    canvas.onmouseup = canvas.onmouseout = eventControl.onmouseup;

    canvas.addEventListener('touchstart', eventControl.touchstart, false);
    canvas.addEventListener('touchmove', eventControl.touchmove, false);
    canvas.addEventListener('touchend', eventControl.touchend, false);

    drawImage();

    setInterval(renderUpdate, 50);
  };

  this.resetMapSize = function (opt) {
    // option.scaleLevel = 1;

    resetOption(opt);

    canvas.width = 'width' in option ? option.width : option.mapTiles.x * option.tileWidth;
    canvas.height = 'height' in option ? option.height : option.mapTiles.y * option.tileWidth;

    // console.log(option);

    // var xScale = canvas.width / (option.mapTiles.x * option.tileWidth),
    //     yScale = canvas.height / (option.mapTiles.y * option.tileWidth);
    // mapZoom = xScale > yScale ? yScale : xScale;

    offsetX = (canvas.width - option.mapTiles.x * option.tileWidth * option.scaleLevel * mapZoom) / 2;
    offsetY = (canvas.height - option.mapTiles.y * option.tileWidth * option.scaleLevel * mapZoom) / 2;

    drawImage();
  };

  this.resetInit = function (opt) {
    option.scaleLevel = 1;
    resetOption(opt);

    canvas.width = 'width' in option ? option.width : option.mapTiles.x * option.tileWidth;
    canvas.height = 'height' in option ? option.height : option.mapTiles.y * option.tileWidth;

    // console.log(option);

    var xScale = canvas.width / (option.mapTiles.x * option.tileWidth),
      yScale = canvas.height / (option.mapTiles.y * option.tileWidth);
    mapZoom = xScale > yScale ? yScale : xScale;

    offsetX = (canvas.width - option.mapTiles.x * option.tileWidth * option.scaleLevel * mapZoom) / 2;
    offsetY = (canvas.height - option.mapTiles.y * option.tileWidth * option.scaleLevel * mapZoom) / 2;

    drawImage();
  };

  /**
   * [getPoint 获取点击位置坐标]
   * @param  {[event]} event [事件对象]
   * @return {[Object]}       [点击位置坐标]
   */
  this.getPoint = function (event) {
    // document.writeln(event);
    var result = 'idle';
    if (cur_event === 'idle') {
      var pos = windowToCanvas(event.clientX, event.clientY),
        x = parseInt((pos.x - offsetX) / mapZoom / Math.pow(2, option.scaleLevel - 1)),
        y = parseInt((pos.y - offsetY) / mapZoom / Math.pow(2, option.scaleLevel - 1)),
        mapW = option.mapTiles.x * option.tileWidth,
        mapH = option.mapTiles.y * option.tileWidth;

      if (x < 0 || y < 0 || x > mapW || y > mapH) {
        result = false;
      } else {
        result = {
          x: x,
          y: y
        }
      }
    }
    cur_event = 'idle';
    return result;
  };

  /**
   * [showPoint 展示点信息]
   * @param  {[Object]} points [点对象列表]
   * @return {[type]}        [展示在地图上]
   */
  this.showPoint = function (points) {
    NODE = points;
    drawImage();
  };

  /**
   * 设置点位显示方式
   */
  this.setShowPointType = function (type) {
    show_point_type = type;
  }

  /**
   * 显示路径规划线路
   */
  this.connectRoutes = function (routePoints) {
    ROUTES = routePoints;
    drawImage();
  }

  /**
   * [addEndPoint 添加起点位置]
   * @param {[type]} pos [位置]
   * @return {[type]}    [起点图片标注在地图]
   */
  this.setStartPoint = function (pos) {
    start_point = pos;
    mark_point = {};
    drawImage();
  };

  /**
   * [setEndPoint 添加起点位置]
   * @param {[type]} pos [位置]
   * @return {[type]}    [起点图片标注在地图]
   */
  this.setEndPoint = function (pos) {
    end_point = pos;
    mark_point = {};
    // debugger;
    drawImage();
  };

  /**
   * [setMarkPoint 添加标记点]
   * @param {[type]} pos [位置]
   * @return {[type]}    [起点图片标注在地图]
   */
  this.setMarkPoint = function (pos) {
    mark_point = pos;
    drawImage();
  }
};

/**
* 寻路
* A*算法
*/
export const PathRoute = function () {
  this.Map = new Array(); //地图：[{point:'0', connect_point:i+'', distance:20}];
  this.PathFindingList = new Array(); //查找过程中路径存储：[{paths:[1,3,6], arrived_point:6, distance:12}]
  this.PathCompleteList = new Array(); //完整路径存储：[{paths:[1,3,6,9], distance:15}]
  this.PointPassedList = new Array(); //已经经过的点：[{point:1, distance:35}]

  this.targetPoint = 0; //目标位置


  //清理上一次的寻路痕迹
  this.clear = function () {
    this.PathFindingList = new Array();
    this.PathCompleteList = new Array();
    this.PointPassedList = new Array();
  }

  //开始寻路
  this.route = function (start_point, end_point) {
    this.clear();
    this.targetPoint = end_point;

    var start_path = new Array();
    start_path.push(start_point);

    this.PathFindingList.push({ paths: start_path, arrived_point: start_point, distance: 0 });
    this.PointPassedList.push({ point: start_point, distance: 0 });

    this.findPath();

    var path_distance = 0;
    var result = new Array();
    for (var i = 0; i < this.PathCompleteList.length; i++) {
      if (path_distance == 0 || this.PathCompleteList[i].distance < path_distance) {
        path_distance = this.PathCompleteList[i].distance;
        result = this.PathCompleteList[i].paths;
      }
    }

    return result;
  }


  //递归查找
  this.findPath = function () {
    var newFindingPath = new Array();
    for (var i = this.PathFindingList.length - 1; i >= 0; i--) {
      var new_points = this.getNewPath(this.PathFindingList[i].arrived_point, this.PathFindingList[i].distance);
      if (new_points.length > 0) { //有新的连接点
        for (var j = 0; j < new_points.length; j++) {
          var new_paths = this.PathFindingList[i].paths.slice(0);
          new_paths.push(new_points[j].point);
          if (new_points[j].point == this.targetPoint) { //到达目标位置
            this.PathCompleteList.push({ paths: new_paths, distance: new_points[j].distance });
          } else {
            newFindingPath.push({ paths: new_paths, arrived_point: new_points[j].point, distance: new_points[j].distance });
          }
        }
      }
      this.PathFindingList.splice(i, 1); //不管有没有新的路，移除当前路径
    }
    this.PathFindingList = this.PathFindingList.concat(newFindingPath); //补入新的路径
    if (this.PathFindingList.length > 0) { //还有路，继续找
      this.findPath();
    }
  }

  //发散路径
  //param p   当前点
  //param d   当前距离
  this.getNewPath = function (p, d) {
    var new_path_points = new Array();
    for (var i = 0; i < this.Map.length; i++) {
      if (this.Map[i].point == p) {
        if (this.checkPointAvalible(this.Map[i].connect_point, d + this.Map[i].distance)) { //判断之前是否已经走过这个点，并且路程更短
          new_path_points.push({ point: this.Map[i].connect_point, distance: d + this.Map[i].distance });
        }
      }
    }
    return new_path_points;
  }

  //验证路径点是否已经走过
  //param p   待验证点
  //param d   距离
  this.checkPointAvalible = function (p, d) {
    for (var i = 0; i < this.PointPassedList.length; i++) {
      if (p == this.PointPassedList[i].point) {
        if (this.PointPassedList[i].distance > d) {
          this.PointPassedList[i].distance = d;
          break;
        } else {
          return false;
        }
      }
    }
    this.PointPassedList.push({ point: p, distance: d });
    return true;
  }
};
