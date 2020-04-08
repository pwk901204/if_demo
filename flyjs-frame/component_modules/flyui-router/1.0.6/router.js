var fly = require('fly');

var Class = fly.Class;
var Observable = fly.Observable;
var $ = fly.$;
var support = fly.support;

var CHANGE = 'change',
  BACK = 'back',
  SAME = 'same',
  location = window.location,
  history = window.history,
  CHECK_URL_INTERVAL = 50,
  BROKEN_BACK_NAV = support.browser.ie,
  hashStrip = /^#*/,
  document = window.document,
  INIT = 'init',
  ROUTE_MISSING = 'routeMissing',
  parseQueryStringParams = fly.parseQueryStringParams;

function hashDelimiter(bang) {
  return bang ? '#!' : '#';
}

function locationHash(hashDelimiter) {
  var href = location.href;

  if (
    hashDelimiter === '#!' &&
    href.indexOf('#') > -1 &&
    href.indexOf('#!') < 0
  ) {
    return null;
  }

  return href.split(hashDelimiter)[1] || '';
}

function stripRoot(root, url) {
  if (url.indexOf(root) === 0) {
    return url.substr(root.length).replace(/\/\//g, '/');
  } else {
    return url;
  }
}

/**
 * 封装扩展window.history(对象包含用户在浏览器窗口中访问过的URL)的类，解决在不同浏览器或终端兼容性问题
 * @class
 * @ignore
 */
var HistoryAdapter = Class.extend({
  /**
   * 构造函数
   * @memberOf HistoryAdapter.prototype
   */
  ctor: function() {},

  back: function() {
    if (BROKEN_BACK_NAV) {
      setTimeout(function() {
        history.back();
      });
    } else {
      history.back();
    }
  },

  forward: function() {
    if (BROKEN_BACK_NAV) {
      setTimeout(function() {
        history.forward();
      });
    } else {
      history.forward();
    }
  },

  length: function() {
    return history.length;
  },

  replaceLocation: function(url) {
    location.replace(url);
  }
});

/**
 * 扩展封装HTML5新特性History.pushState（允许用户逐条添加历史记录条目）的类，
 * 注意history.pushState()方法永远不会触发hashchange事件，即便新的地址只变更了hash。
 * @class
 * @ignore
 */
var PushStateAdapter = HistoryAdapter.extend({
  /**
   * @memberOf PushStateAdapter.prototype
   * @param  {String} root - 示协议的字符串
   */
  ctor: function(root) {
    this.root = root;
  },

  /**
   * 向History添加历史记录条目，浏览器不会在调用pushState()方法后加载该地址，但之后，可能会试图加载，例如用户重启浏览器。
   * 新的URL不一定是绝对路径；如果是相对路径，它将以当前URL为基准；传入的URL与当前URL应该是同源的，
   * 否则，pushState()会抛出异常。该参数是可选的；不指定的话则为文档当前URL。
   * @memberOf PushStateAdapter.prototype
   * @param  {String} to - 表示新的历史条目地址
   */
  navigate: function(to) {
    history.pushState({}, document.title, absoluteURL(to, this.root));
  },

  /**
   * 修改当前历史记录条目，这个方法有时会很有用，当你需要对某些用户行为作反应而更新一个state对象或者当前history实体时，
   * 可以使用它来更新state对象或者当前history实体的url
   * @memberOf PushStateAdapter.prototype
   * @param  {String} to - 表示已经存在的历史条目地址
   */
  replace: function(to) {
    history.replaceState({}, document.title, absoluteURL(to, this.root));
  },

  /**
   * 移除URL协议头
   * @memberOf PushStateAdapter.prototype
   * @param  {String} url - 表示地址URL的字符串
   * @return {String} 移除URL协议头的字符串
   */
  normalize: function(url) {
    return stripRoot(this.root, url);
  },

  /**
   * 返回当前location的pathname和search部分
   * @memberOf PushStateAdapter.prototype
   * @return {String}
   */
  current: function() {
    var current = location.pathname;

    if (location.search) {
      current += location.search;
    }

    return stripRoot(this.root, current);
  },

  /**
   * 监听popstate事件，每当激活的历史记录发生变化时，都会触发popstate事件。
   * 如果被激活的历史记录条目是由pushState所创建，或是被replaceState方法影响到的，popstate事件的状态属性将包含历史记录的状态对象的一个拷贝。
   * @memberOf PushStateAdapter.prototype
   * @param  {Function} callback - 事件触发执行回调函数
   * @todo 待实现优化
   */
  change: function(callback) {
    // $(window).bind("popstate.fly", callback);
  },

  /**
   * 解除绑定的popstate事件
   * @memberOf PushStateAdapter.prototype
   * @todo 待实现优化
   */
  stop: function() {
    // $(window).unbind("popstate.fly");
  },

  /**
   * 根据当前配置信息，将新的地址添加History历史记录条目
   * @memberOf PushStateAdapter.prototype
   * @param {Object} options - 包含协议/HASH分隔符的配置信息
   * @param {String} options.root - 表示URL协议头的字符串
   * @param {String} options.hashBang - 表示HASH分隔符的字符串
   */
  normalizeCurrent: function(options) {
    var fixedUrl,
      root = options.root,
      pathname = location.pathname,
      hash = locationHash(hashDelimiter(options.hashBang));

    if (root === pathname + '/') {
      fixedUrl = root;
    }

    if (root === pathname && hash) {
      fixedUrl = absoluteURL(hash.replace(hashStrip, ''), root);
    }

    if (fixedUrl) {
      history.pushState({}, document.title, fixedUrl);
    }
  }
});

function fixHash(url) {
  return url.replace(/^(#)?/, '#');
}

function fixBang(url) {
  return url.replace(/^(#(!)?)?/, '#!');
}

/**
 * 封装扩展对HASH操作的类，继承HistoryAdapter类
 * @class
 * @arguments {HistoryAdapter}
 * @ignore
 */
var HashAdapter = HistoryAdapter.extend({
  /**
   * @memberOf HashAdapter.prototype
   * @param {Boolean} bang - 标识当前HASH是否使用Hashbang模式
   */
  ctor: function(bang) {
    this._id = fly.guid();
    this.prefix = hashDelimiter(bang);
    this.fix = bang ? fixBang : fixHash;
  },

  /**
   * 设置当前location.hash为指定的值
   * @memberOf HashAdapter.prototype
   * @param  {String} hash - 表示HASH值的字符串
   */
  navigate: function(hash) {
    location.hash = this.fix(hash);
  },

  /**
   * 用一个新文档取代当前文档，该方法不会在History对象中生成一个新的记录，当使用该方法时，新的URL将覆盖History对象中的当前记录
   * @memberOf HashAdapter.prototype
   * @param  {String} hash - 表示HASH的字符串
   */
  replace: function(hash) {
    this.replaceLocation(this.fix(hash));
  },

  /**
   * 获取指定URL中的HASH值，若不存在匹配的HASH前缀，则返回URL
   * @memberOf HashAdapter.prototype
   * @param  {String} url - 表示URL地址的字符串
   * @return {String} URL或者HASH值
   */
  normalize: function(url) {
    if (url.indexOf(this.prefix) < 0) {
      return url;
    } else {
      return url.split(this.prefix)[1];
    }
  },

  /**
   * 监听HASH变化事件，当URL的片段标识符更改时，将触发hashchange事件 (跟在＃符号后面的URL部分，包括＃符号)，
   * 若当前浏览器不支持hashchange事件，使用setInterval模拟
   * @memberOf HashAdapter.prototype
   * @param  {Function} callback - HASH改变触发事件
   */
  change: function(callback) {
    if (
      'onhashchange' in window &&
      (typeof document.documentMode === 'undefined' ||
        document.documentMode == 8)
    ) {
      window.addEventListener('hashchange', callback);
    } else {
      this._interval = setInterval(callback, CHECK_URL_INTERVAL);
    }
  },

  /**
   * 解除绑定的hashchange事件，对于不支持hashchange事件的浏览器，直接清除定时器
   * @memberOf HashAdapter.prototype
   */
  stop: function() {
    fly.off(window, 'hashchange.' + this._id, callback);
    clearInterval(this._interval);
  },

  /**
   * 获取当前location.href中的HASH值
   * @memberOf HashAdapter.prototype
   * @return {String} 表示HASH值的字符串
   */
  current: function() {
    return locationHash(this.prefix);
  },

  /**
   * 调用location.replace方法根据配置生成的URL，替换当前文档
   * @memberOf HashAdapter.prototype
   * @param  {Object} options - 生成URL的配置文件
   * @param  {String} options.root - URL中不包含HASH的部分
   * @param {Boolean} options.pushState - 是否支持向历史记录新增地址
   * @return {Boolean}
   */
  normalizeCurrent: function(options) {
    var pathname = location.pathname,
      root = options.root;

    if (options.pushState && root !== pathname) {
      this.replaceLocation(root + this.prefix + stripRoot(root, pathname));
      return true; // browser will reload at this point.
    }

    return false;
  }
});

/**
 * 扩展封装Histroy操作的类
 * @class
 * @memberOf fly
 * @augments {Observable}
 * @alias fly.History
 */
var History = Observable.extend({
  /**
   * 初始化路由规则，监听事件
   * @param {Object} options - 初始化配置参数
   * @param {String} options.root - URL根目录
   * @param {Boolean} options.hasBang - 是否启用HTML5 HashBang模式
   * @param {Boolean} options.pushState - 是否支持向历史记录新增地址
   * @memberOf fly.History.prototype
   */
  start: function(options) {
    options = options || {};

    this.bind([CHANGE, BACK, SAME], options);

    if (this._started) {
      return;
    }

    this._started = true;

    options.root = options.root || '/';

    var adapter = this.createAdapter(options),
      current;

    // adapter may reload the document
    if (adapter.normalizeCurrent(options)) {
      return;
    }

    current = adapter.current();

    $.extend(this, {
      adapter: adapter,
      root: options.root,
      historyLength: adapter.length(),
      current: current,
      locations: [current]
    });

    adapter.change($.proxy(this, '_checkUrl'));
  },

  /**
   * 根据配置参数适配PushStateAdapter和HashAdapter
   * @param {Object} options - 初始化配置参数
   * @param {String} options.root - URL根目录
   * @param {Boolean} options.hasBang - 是否启用HTML5 HashBang模式
   * @param {Boolean} options.pushState - 是否支持想历史记录新增地址
   * @return {(PushStateAdapter | HashAdapter)}
   * @memberOf fly.History.prototype
   */
  createAdapter: function(options) {
    return support.pushState && options.pushState
      ? new PushStateAdapter(options.root)
      : new HashAdapter(options.hashBang);
  },

  /**
   * 解除绑定监听HASH变化的事件
   * @memberOf fly.History.prototype
   */
  stop: function() {
    if (!this._started) {
      return;
    }
    this.adapter.stop();
    this.unbind(CHANGE);
    this._started = false;
  },

  /**
   * 绑定change事件，并执行指定的回调函数
   * @param  {Function} callback - change事件触发后执行的回调函数
   * @memberOf fly.History.prototype
   */
  change: function(callback) {
    this.bind(CHANGE, callback);
  },

  /**
   * 使用指定的URL替换本地的地址
   * @param  {String} url - 新的文档地址
   * @param  {Boolean} silent - 静默状态下不进行页面的跳转
   * @memberOf fly.History.prototype
   */
  replace: function(url, silent) {
    this._navigate(to, silent, function(adapter) {
      adapter.replace(to);
      this.locations[this.locations.length - 1] = this.current;
    });
  },

  /**
   * 设置当前location.hash为指定的值
   * @param  {String} to - 表示HASH值的字符串
   * @param  {Boolean} silent - 静默状态下不进行页面的跳转
   * @memberOf fly.History.prototype
   */
  navigate: function(to, silent) {
    if (to === '#:back') {
      this.backCalled = true;
      this.adapter.back();
      return;
    }

    this._navigate(to, silent, function(adapter) {
      adapter.navigate(to);
      this.locations.push(this.current);
    });
  },

  /**
   * 设置URL替换和HASH值预处理函数
   * @param  {String}   to - 表示URL或者HASH值的字符串
   * @param  {Boolean}   silent - 静默状态下不进行页面的跳转
   * @param  {Function} callback - 预处理后执行的回调函数
   * @private
   * @memberOf fly.History.prototype
   */
  _navigate: function(to, silent, callback) {
    var adapter = this.adapter;

    to = adapter.normalize(to);

    if (this.current === to || this.current === decodeURIComponent(to)) {
      this.trigger(SAME);
      return;
    }

    if (!silent) {
      if (this.trigger(CHANGE, { url: to })) {
        return;
      }
    }

    this.current = to;

    callback.call(this, adapter);

    this.historyLength = adapter.length();
  },

  /**
   * 根据当前配置参数执行back或change事件，并对locations数组进行增删操作
   * @private
   * @memberOf fly.History.prototype
   */
  _checkUrl: function() {
    var adapter = this.adapter,
      current = adapter.current(),
      newLength = adapter.length(),
      navigatingInExisting = this.historyLength === newLength,
      back =
        current === this.locations[this.locations.length - 2] &&
        navigatingInExisting,
      backCalled = this.backCalled,
      prev = this.current;

    if (
      current === null ||
      this.current === current ||
      this.current === decodeURIComponent(current)
    ) {
      return true;
    }

    this.historyLength = newLength;
    this.backCalled = false;

    this.current = current;

    if (back && this.trigger('back', { url: prev, to: current })) {
      adapter.forward();
      this.current = prev;
      return;
    }

    if (
      this.trigger(CHANGE, { url: current, backButtonPressed: !backCalled })
    ) {
      if (back) {
        adapter.forward();
      } else {
        adapter.back();
        this.historyLength--;
      }
      this.current = prev;
      return;
    }

    if (back) {
      this.locations.pop();
    } else {
      this.locations.push(current);
    }
  }
});

History.HistoryAdapter = HistoryAdapter;
History.HashAdapter = HashAdapter;
History.PushStateAdapter = PushStateAdapter;

var optionalParam = /\((.*?)\)/g,
  namedParam = /(\(\?)?:\w+/g,
  splatParam = /\*\w+/g,
  escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

function namedParamReplace(match, optional) {
  return optional ? match : '([^/]+)';
}

function routeToRegExp(route, ignoreCase) {
  return new RegExp(
    '^' +
      route
        .replace(escapeRegExp, '\\$&')
        .replace(optionalParam, '(?:$1)?')
        .replace(namedParam, namedParamReplace)
        .replace(splatParam, '(.*?)') +
      '$',
    ignoreCase ? 'i' : ''
  );
}

function stripUrl(url) {
  return url.replace(/(\?.*)|(#.*)/g, '');
}

/**
 * 封装路由操作的类
 * @class Route
 * @ignore
 */
var Route = Class.extend({
  /**
   * Route构造函数
   * @memberOf Route.prototype
   * @param  {RegExp} route - 表示路由规则的正则表达式
   * @param  {Function} callback - 路由规则执行回调函数
   * @param  {Boolean}  ignoreCase - 路由规则是否区分大小写
   */
  ctor: function(route, callback, ignoreCase) {
    if (!(route instanceof RegExp)) {
      route = routeToRegExp(route, ignoreCase);
    }

    this.route = route;
    this._callback = callback;
  },

  /**
   * 检测URL是否匹配路由规则执行的回调函数
   * @memberOf Route.prototype
   * @private
   * @param  {String} url - 表示地址URL的字符串
   */
  callback: function(url) {
    var params,
      idx = 0,
      length,
      queryStringParams = fly.parseQueryStringParams(url);

    url = stripUrl(url);
    params = this.route.exec(url).slice(1);
    length = params.length;

    for (; idx < length; idx++) {
      if (typeof params[idx] !== 'undefined') {
        params[idx] = decodeURIComponent(params[idx]);
      }
    }

    params.push(queryStringParams);

    this._callback.apply(null, params);
  },

  /**
   * 检测URL是否匹配路由规则，若匹配执行相关函数
   * @memberOf Route.prototype
   * @param  {String} url - 表示地址URL的字符串
   * @return {Boolean}
   */
  worksWith: function(url) {
    if (this.route.test(stripUrl(url))) {
      this.callback(url);
      return true;
    } else {
      return false;
    }
  }
});

/**
 * 封装路由操作方法类
 * @class
 * @memberOf fly
 * @augments {Observable}
 * @alias fly.Router
 */
var Router = Observable.extend({
  /**
   * @memberOf fly.Router.prototype
   * @param {Object}  options            - 路由配置信息
   * @param {Boolean} options.pushState  - 是否支持向历史记录新增地址
   * @param {Boolean} options.hashBang   - 是否使用hashBang模式
   * @param {String}  options.root       - 表示根目录的字符串
   * @param {Boolean} options.ignoreCase - 是否忽略大小写
   */
  ctor: function(options) {
    if (!options) {
      options = {};
    }

    this._super();

    this.history = new History();
    this.routes = [];
    this.pushState = options.pushState;
    this.hashBang = options.hashBang;
    this.root = options.root;
    this.ignoreCase = options.ignoreCase !== false;

    this.bind([INIT, ROUTE_MISSING, CHANGE, SAME], options);
  },

  /**
   * 解除绑定change/same/back事件
   * @memberOf fly.Router.prototype
   */
  destroy: function() {
    this.history.unbind(CHANGE, this._urlChangedProxy);
    this.history.unbind(SAME, this._sameProxy);
    this.history.unbind(BACK, this._backProxy);
    this.unbind();
  },

  /**
   * 初始化路由规则，监听事件
   * @memberOf fly.Router.prototype
   */
  start: function() {
    var that = this,
      sameProxy = function() {
        that._same();
      },
      backProxy = function(e) {
        that._back(e);
      },
      urlChangedProxy = function(e) {
        that._urlChanged(e);
      };

    that.history.start({
      same: sameProxy,
      change: urlChangedProxy,
      back: backProxy,
      pushState: that.pushState,
      hashBang: that.hashBang,
      root: that.root
    });

    var initEventObject = {
      url: that.history.current || '/',
      preventDefault: $.noop
    };

    if (!that.trigger(INIT, initEventObject)) {
      that._urlChanged(initEventObject);
    }

    this._urlChangedProxy = urlChangedProxy;
    this._backProxy = backProxy;
  },

  /**
   * 创建Route类实例对象，用于缓存路由信息，并存储在数组
   * @memberOf fly.Router.prototype
   * @param  {RegExp}   route    - 表示路由规则的正则表达式
   * @param  {Function} callback - 检测URL是否匹配路由规则执行的回调函数
   */
  route: function(route, callback) {
    this.routes.push(new Route(route, callback, this.ignoreCase));
  },

  /**
   * 设置当前location.hash为指定的值
   * @memberOf fly.Router.prototype
   * @param  {String}  to     - 表示HASH值的字符串
   * @param  {Boolean} silent - 静默状态下不进行页面的跳转
   */
  navigate: function(url, silent) {
    this.history.navigate(url, silent);
  },

  /**
   * 使用指定的URL替换本地的地址
   * @memberOf fly.Router.prototype
   * @param  {String}  url    - 新的文档地址
   * @param  {Boolean} silent - 静默状态下不进行页面的跳转
   */
  replace: function(url, silent) {
    this.history.replace(url, silent);
  },

  /**
   * 触发back事件
   * @private
   * @memberOf fly.Router.prototype
   * @param {Object} e - Event对象
   */
  _back: function(e) {
    if (this.trigger(BACK, { url: e.url, to: e.to })) {
      e.preventDefault();
    }
  },

  /**
   * 触发same事件
   * @private
   * @memberOf fly.Router.prototype
   */
  _same: function(e) {
    this.trigger(SAME);
  },

  /**
   * URL改变事件
   * @private
   * @memberOf fly.Router.prototype
   * @param  {Object} e - Event对象
   */
  _urlChanged: function(e) {
    var url = e.url;

    if (!url) {
      url = '/';
    }

    if (
      this.trigger(CHANGE, {
        url: e.url,
        params: parseQueryStringParams(e.url),
        backButtonPressed: e.backButtonPressed
      })
    ) {
      e.preventDefault();
      return;
    }

    var idx = 0,
      routes = this.routes,
      route,
      length = routes.length;

    for (; idx < length; idx++) {
      route = routes[idx];

      if (route.worksWith(url)) {
        return;
      }
    }

    if (
      this.trigger(ROUTE_MISSING, {
        url: url,
        params: parseQueryStringParams(url),
        backButtonPressed: e.backButtonPressed
      })
    ) {
      e.preventDefault();
    }
  }
});

var FlyRouter = Router.extend({
  ctor: function(view, navigation) {
    this._super();
    this.pageView = view;
    this.navigation = navigation || {};
    this.views = {};
    this.pages = [];
  },

  empty: function(dom) {
    while (dom.hasChildNodes()) {
      dom.removeChild(dom.firstChild);
    }
  },

  has: function(name) {
    return this.views.hasOwnProperty(name);
  },

  hasOpen: function(page) {
    for (var key in this.pages) {
      if (this.pages[key] instanceof page) {
        return this.pages[key];
      }
    }
  },

  register: function(name) {
    if (!this.has(name)) {
      this.views[name] = 'pages' + name;
    }
  },

  title: function(title) {
    document.title = title;
  },

  back: function() {
    var locations = fly.history.locations;
    if (locations.length < 2) {
      this.navigate('');
    } else {
      window.history.go(-1);
    }
  },

  // 清理掉pages中所有的内容
  clearPage: function(page) {
    for (var key in this.pages) {
      var pageComponent = this.pages[key];
      if (!page || (page && pageComponent instanceof page)) {
        pageComponent.navbar && pageComponent.navbar.destroy();
        pageComponent.toolbar && pageComponent.toolbar.destroy();
        pageComponent.destroy && pageComponent.destroy();
      }
    }
  },

  // 清理掉pages中距离最近的root之外的所有内容
  clearPageDoRoot: function() {
    var pageComponent, rootPage;
    while ((pageComponent = this.pages.pop())) {
      if (
        pageComponent.navigation &&
        pageComponent.navigation.rootPage &&
        !rootPage
      ) {
        rootPage = pageComponent;
      } else {
        pageComponent.navbar && pageComponent.navbar.destroy();
        pageComponent.toolbar && pageComponent.toolbar.destroy();
        pageComponent.destroy();
        pageComponent.element.parentNode.removeChild(pageComponent.element);
      }
    }
    this.pages.push(rootPage);
  },

  // 清理所有的panel
  clearPanel: function() {},

  load: function(context, type, callback) {
    var that = this,
      name,
      wrapper,
      prev,
      current;

    if (typeof context === 'string') {
      context = {
        page: context
      };
    }

    name = context.page;
    name = that.has(name) ? name : '404';

    // _panel && panel.close(_panel);  // 此时清除  会导致一些未知的错误  主要是panel中打开新的panel不能实现

    // if (fly.$.isPlainObject(type)) {
    //   if (type.type === 'panel') {
    //     that.panel(context.page, type)
    //   }
    //   return
    // } else
    if (fly.isDOM(type)) {
      // 在指定容器中打开
      wrapper = type;
    } else {
      // 默认打开方式
      wrapper = that.pageView;
    }
    // clear panel
    // that.clearPanel()

    // 模块加载
    require.async(that.views[name] || name, function(Page) {
      var pageDom,
        pageComponent,
        navigation = Page.fn.navigation || {},
        length;

      if ((current = that.hasOpen(Page)) && (prev = that.pages.pop())) {
        that.navigation.unload(prev, current, function() {
          // animateEnd
          prev.element.parentNode.removeChild(prev.element);
          if (navigation.refresh === true) {
            // reload
            pageDom = document.createElement('div');
            current = that.pages.pop();
            current.navbar.destroy();
            current.element.parentNode.insertBefore(pageDom, current.element);
            current.element.parentNode.removeChild(current.element);
            pageComponent = new Page(pageDom, {
              params: context.queryParams,
              navigator: that.navigation
            });
            that.navigation.initNavbar(pageComponent);
            pageComponent.tag = pageComponent.tag || 'page-' + fly.guid();
            fly.addClass(pageComponent.element, pageComponent.tag);
            that.navigation.load(
              pageComponent,
              length && that.pages[length - 1]
            );
            that.pages.push(pageComponent);
          }
        });
        return;
      }

      length = that.pages.length;
      pageDom = document.createElement('div');

      that.clearPage();
      that.empty(wrapper);
      that.pages = [];
      pageDom.setAttribute('class', 'animated fastest fadeInRightSmall');

      that.navigation.setTitle &&
        that.navigation.setTitle(navigation.title || '');

      wrapper.appendChild(pageDom);
      pageComponent = new Page(pageDom, {
        params: context.queryParams,
        navigator: that.navigation
      }); // 这里要注意  子集的 navigation并不会同步到父级
      // 给每个page一个唯一的 class标识
      pageComponent.tag = pageComponent.tag || 'page-' + fly.guid();
      fly.addClass(pageComponent.element, pageComponent.tag);
      // 调用加载逻辑
      // that.navigation.load(pageComponent, length && that.pages[length - 1]);
      that.pages.push(pageComponent);
    });
  }
});

module.exports = FlyRouter;
