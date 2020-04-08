
## API文档 :   
#### <a href="http://www.mescroll.com/api.html?v=0201#options" target="_blank">前往官网查看 >> </a>

```
//创建mescroll对象
var mescroll = new MeScroll(id或dom对象, { down: {下拉刷新的配置参数}, up: {上拉加载的配置参数} });
```  
<table border="1" cellspacing="0">
	<tr align="center"><td colspan="3"><b>down 下拉刷新的配置参数</b></td></tr>
	<tr align="center">
		<td>参数名</td>
		<td>默认值</td>
		<td>说明</td>
	</tr>
	<tr align="center">
		<td>use</td>
		<td>true</td>
		<td>是否启用下拉刷新</td>
	</tr>
	<tr align="center">
		<td>auto</td>
		<td>true</td>
		<td>是否在初始化完毕之后自动执行下拉刷新的回调</td>
	</tr>
	<tr align="center">
		<td>autoShowLoading</td>
		<td>false</td>
		<td>当设置auto=true时(在初始化完毕之后自动执行下拉刷新的回调)<br/>是否显示下拉刷新的进度<br/>需配置down的callback才生效</td>
	</tr>
	<tr align="center">
		<td>isLock</td>
		<td>false</td>
		<td>是否锁定下拉刷新</td>
	</tr>
	<tr align="center">
		<td>isBoth</td>
		<td>false</td>
		<td>下拉刷新时,如果滑动到列表底部是否可以同时触发上拉加载</td>
	</tr>
	<tr align="center">
		<td>offset</td>
		<td>80</td>
		<td>在列表顶部,下拉大于80px,松手即可触发下拉刷新的回调</td>
	</tr>
	<tr align="center">
		<td>inOffsetRate (1.4.0新增)</td>
		<td>1</td>
		<td>在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉</td>
	</tr>
	<tr align="center">
		<td>outOffsetRate</td>
		<td>0.2</td>
		<td>在列表顶部,下拉的距离大于offset时,改变下拉区域高度比例;值越接近0,高度变化越小,表现为越往下越难拉</td>
	</tr>
	<tr align="center">
		<td>bottomOffset</td>
		<td>20</td>
		<td>当手指touchmove位置在距离body底部20px范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行<br/>这是1.2.1版本新增的配置,请检查最新版~</td>
	</tr>
	<tr align="center">
		<td>minAngle</td>
		<td>45</td>
		<td>触发下拉最少要偏移的角度(滑动的轨迹与水平线的锐角值),取值区间  [0,90];默认45度,即向下滑动的角度大于45度(方位角为45°~145°及225°~315°)则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;<br/>注意:没有必要配置超出[0,90]区间的值,否则角度限制无效; 因为假设配置60, 生效的方位角就已经是60°到120° 和 240°到300°的范围了;<br/>这是1.1.6版本新增的配置,请检查最新版~</td>
	</tr>
	<tr align="center">
		<td>hardwareClass</td>
		<td>"mescroll-hardware"</td>
		<td>硬件加速样式,解决iOS下拉因隐藏进度条而闪屏的问题,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>warpClass</td>
		<td>"mescroll-downwarp"</td>
		<td>下拉刷新的布局容器样式,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>mustToTop<br/>1.3.7版本新增</td>
		<td>false</td>
		<td>是否滚动条必须在顶部,才可以下拉刷新.默认false. 当您发现下拉刷新会闪白屏时,设置true即可修复.</td>
	</tr>
	<tr align="center">
		<td>warpId</td>
		<td>null</td>
		<td>可配置下拉刷新的布局添加到指定id的div <br/> 默认不配置,默认添加到mescrollId</td>
	</tr>
	<tr align="center">
		<td>resetClass</td>
		<td>"mescroll-downwarp-reset"</td>
		<td>下拉刷新高度重置的动画,参见mescroll.css</td>
	</tr>
    <tr align="center">
		<td>textInOffset<br/>1.3.7版本新增</td>
		<td>'下拉刷新'</td>
		<td>下拉的距离在offset范围内的提示文本</td>
	</tr>
    <tr align="center">
		<td>textOutOffset<br/>1.3.7版本新增</td>
		<td>'释放更新'</td>
		<td>下拉的距离大于offset范围的提示文本</td>
	</tr>
    <tr align="center">
		<td>textLoading<br/>1.3.7版本新增</td>
		<td>'加载中 ...'</td>
		<td>加载中的提示文本</td>
	</tr>
	<tr align="center">
		<td>htmlContent</td>
		<td>'&lt;p class="downwarp-progress"&gt;&lt;/p&gt;&lt;p class="downwarp-tip"&gt;&lt;/p&gt;'</td>
		<td>下拉刷新的布局内容</td>
	</tr>
	<tr align="center">
		<td>inited</td>
		<td>function(mescroll, downwarp) { ... }</td>
		<td>下拉刷新初始化完毕的回调(mescroll实例对象,下拉刷新容器dom对象)</td>
	</tr>
	<tr align="center">
		<td>inOffset</td>
		<td>function(mescroll) { ... }</td>
		<td>下拉的距离进入offset范围内那一刻的回调(mescroll实例对象)</td>
	</tr>
	<tr align="center">
		<td>outOffset</td>
		<td>function(mescroll) { ... }</td>
		<td>下拉的距离大于offset那一刻的回调(mescroll实例对象)</td>
	</tr>
	<tr align="center">
		<td>onMoving</td>
		<td>function(mescroll, rate, downHight) { ... }</td>
		<td>下拉过程中的回调,滑动过程一直在执行; rate下拉区域当前高度与指定距离的比值(inOffset: rate<1; outOffset: rate>=1); downHight当前下拉区域的高度</td>
	</tr>
	<tr align="center">
		<td>beforeLoading</td>
		<td>function(mescroll, downwarp) { return false; }</td>
		<td>准备触发下拉刷新的回调; 如果要完全自定义下拉刷新,那么return true,此时将不触发showLoading和callback回调; 参考案例【淘宝 v6.8.0】</td>
	</tr>
	<tr align="center">
		<td>showLoading</td>
		<td>function(mescroll) { ... }</td>
		<td>显示下拉刷新进度的回调</td>
	</tr>
	<tr align="center">
		<td>afterLoading</td>
		<td>function(mescroll) { return 0 }</td>
		<td>结束加载中,准备隐藏下拉的回调 <br/>返回结束下拉的延时执行时间,默认0ms<br/>常用于结束下拉之前再显示另外一小段动画,才去隐藏下拉刷新的场景, 参考案例【dotJump】</td>
	</tr>
	<tr align="center">
		<td>callback</td>
		<td>function(mescroll) { mescroll.resetUpScroll(); }</td>
		<td>下拉刷新的回调; 默认重置上拉加载列表为第一页</td>
	</tr>
</table>

<br/>

<table border="1" cellspacing="0">
	<tr align="center"><td colspan="3"><b>up 上拉加载的配置参数</b></td></tr>
	<tr align="center">
		<td>参数名</td>
		<td>默认值</td>
		<td>说明</td>
	</tr>
	<tr align="center">
		<td>use</td>
		<td>true</td>
		<td>是否启用上拉加载</td>
	</tr>
	<tr align="center">
		<td>auto</td>
		<td>false</td>
		<td>是否在初始化完毕之后自动执行上拉加载的回调</td>
	</tr>
	<tr align="center">
		<td>isLock</td>
		<td>false</td>
		<td>是否锁定上拉加载</td>
	</tr>
	<tr align="center">
		<td>isBoth</td>
		<td>false</td>
		<td>上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新</td>
	</tr>
	<tr align="center">
		<td>isBounce</td>
		<td>true</td>
		<td>是否允许ios的bounce回弹;默认true,允许回弹 (v 1.3.0新增)</td>
	</tr>
	<tr align="center">
		<td>offset</td>
		<td>100</td>
		<td>列表滚动到距离底部小于100px,即可触发上拉加载的回调</td>
	</tr>
	<tr align="center">
		<td>noMoreSize</td>
		<td>5</td>
		<td>如果列表已无数据,可设置列表的总数量要大于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看</td>
	</tr>
	<tr align="center">
		<td>toTop</td>
		<td align="left">{ <br/>
			warpId: null, <br/>
			src: null, <br/>
			html: null, <br/>
			offset: 1000, <br/>
			warpClass: "mescroll-totop", <br/>
			showClass: "mescroll-fade-in", <br/>
			hideClass: "mescroll-fade-out", <br/>
			duration: 300, <br/>
			supportTap: false <br/>
			btnClick : null <br/>
		}</td>
		<td align="left">回到顶部按钮的配置: <br/>
			warpId: 父布局的id; 默认添加在body中 (1.3.5版本支持传入dom元素)  <br/>
			src: 图片路径,必须配置src才会显示回到顶部按钮,不配置不显示 <br/>
			html: 标签内容,默认null; 如果同时设置了src,则优先取src (2017/12/10新增) <br/>
			offset: 列表滚动1000px显示回到顶部按钮 <br/>
			warpClass: 按钮样式,参见mescroll.css <br/>
			showClass: 显示样式,参见mescroll.css <br/>
			hideClass: 隐藏样式,参见mescroll.css <br/>
			duration: 回到顶部的动画时长,默认300ms <br/>
			supportTap: 如果您的运行环境支持tap,则可配置true,可减少点击延时,快速响应事件;默认false,通过onclick添加点击事件; (v 1.3.0 新增) (注:微信和PC无法响应tap事件) <br/>
			btnClick: 点击按钮的回调; 提示:如果在回调里return true,将不执行回到顶部的操作
		</td>
	</tr>
	<tr align="center">
		<td>loadFull</td>
		<td align="left">{ <br/>
			use: false, <br/>
			delay: 500 <br/>
		}</td>
		<td align="left">
			use: 列表数据过少,不足以滑动触发上拉加载,是否自动加载下一页,直到满屏或者无更多数据为止; 默认false,因为可通过调高page.size避免这个情况 <br/>
			delay: 延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕;
		</td>
	</tr>
	<tr align="center">
		<td>empty</td>
		<td align="left">{ <br/>
			warpId: null, <br/>
			icon: null, <br/>
			tip: "暂无相关数据~", <br/>
			btntext: "", <br/>
			btnClick: null, <br/>
			supportTap: false <br/>
		}</td>
		<td align="left">列表第一页无任何数据时,显示的空提示布局; 需配置warpId或clearEmptyId才生效 <br/>
			warpId: 父布局的id; 如果此项有值,将不使用clearEmptyId的值; (1.3.5版本支持传入dom元素) <br/>
			icon: 空布局的图标路径 <br/>
			tip: 提示文本 <br/>
			btntext: 按钮文本 <br/>
			btnClick: 点击按钮的回调 <br/>
			supportTap: 如果您的运行环境支持tap,则可配置true,可减少点击延时,快速响应事件;默认false,通过onclick添加点击事件; (v 1.3.0 新增) (注:微信和PC无法响应tap事件) <br/>
		</td>
	</tr>
	<tr align="center">
		<td>clearId</td>
		<td>null</td>
		<td>加载第一页时需清空数据的列表id; 如果此项有值,将不使用clearEmptyId的值; 在vue中使用,则无需配置此项</td>
	</tr>
	<tr align="center">
		<td>clearEmptyId</td>
		<td>null</td>
		<td>相当于同时设置了clearId和empty.warpId; 简化写法; 在vue中使用,不能配置此项  (1.3.5版本支持传入dom元素)</td>
	</tr>
	<tr align="center">
		<td>hardwareClass</td>
		<td>"mescroll-hardware"</td>
		<td>硬件加速样式,使动画更流畅,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>warpClass</td>
		<td>"mescroll-upwarp"</td>
		<td>上拉加载的布局容器样式,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>warpId</td>
		<td>null</td>
		<td>可配置上拉加载的布局添加到指定id的div;默认不配置,默认添加到mescrollId</td>
	</tr>
	<tr align="center">
		<td>htmlLoading</td>
		<td>'&lt;p class="upwarp-progress mescroll-rotate"&gt;&lt;/p&gt;&lt;p class="upwarp-tip"&gt;加载中..&lt;/p&gt;'</td>
		<td>上拉加载中的布局,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>htmlNodata</td>
		<td>'&lt;p class="upwarp-nodata"&gt;-- END --&lt;/p&gt;'</td>
		<td>无数据的布局,参见mescroll.css</td>
	</tr>
	<tr align="center">
		<td>inited</td>
		<td>function(mescroll, upwarp){}</td>
		<td>初始化完毕的回调; 回调(mescroll实例, upwarp上拉加载的布局Dom对象)</td>
	</tr>
	<tr align="center">
		<td>showLoading</td>
		<td>function(mescroll, upwarp){ ... }</td>
		<td>显示上拉加载中的回调; 回调(mescroll实例, upwarp上拉加载的布局Dom对象)</td>
	</tr>
	<tr align="center">
		<td>showNoMore</td>
		<td>function(mescroll, upwarp){ ... }</td>
		<td>显示无更多数据的回调; 回调(mescroll实例, upwarp上拉加载的布局Dom对象)</td>
	</tr>
	<tr align="center">
		<td>onScroll</td>
		<td>null</td>
		<td>列表滑动监听, 默认null<br/>例 onScroll : function(mescroll, y, isUp){ ... };<br/>y为列表当前滚动条的位置;<br/>isUp=true向上滑,isUp=false向下滑)<br/>isUp是1.2.1版本新增的配置,请检查最新版~</td>
	</tr>
	<tr align="center">
		<td>callback</td>
		<td>function(page,mescroll){}</td>
		<td>上拉加载的回调; 回调(page对象,mescroll实例), 其中page={num:页码, size:每页数据的数量, time:第一页数据的时间}</td>
	</tr>
	<tr align="center">
		<td>page</td>
		<td align="left">{ <br/>num:0, <br/> size:10, <br/> time:null <br/>}</td>
		<td align="left">num: 当前页码,默认0,回调之前会加1,即callback(page)会从1开始; <br/>size: 每页数据的数量; <br/>time: 加载第一页数据服务器返回的时间;防止用户翻页时,后台新增了数据从而导致下一页数据重复;</td>
	</tr>
	<tr>
		<td align="center">scrollbar</td>
		<td>{<br/>&nbsp; use : ... , <br/>&nbsp; barClass : "mescroll-bar" <br/>}</td>
		<td>use : 是否开启自定义滚动条; PC端默认true开启自定义滚动条; 移动端默认false不使用 <br/>barClass : 自定义滚动条的样式; 参见mescroll.css</td>
	</tr>
	<tr>
		<td align="center">lazyLoad<br/>（1.3.6新增）</td>
		<td>
			{<br/>
		        use: false,<br/>
		        attr: 'imgurl',<br/>
		        showClass: 'mescroll-lazy-in',<br/>
		        delay: 500,<br/>
		        offset: 200<br/>
		    }
		</td>
		<td>
			use: 是否开启懒加载,默认false<br/>
	        attr: 标签中网络图片地址的属性名,默认"imgurl"<br/>
	        showClass: 显示样式:渐变显示,参见mescroll.css<br/>
	        delay: 列表滚动的过程中检查一次图片是否在可视区域的时间间隔,默认500 (单位ms)<br/>
	        offset: 超出可视区域多少px的图片仍可触发懒加载 默认200
		</td>
	</tr>
</table>  

## 常用方法 :   
#### <a href="http://www.mescroll.com/api.html#methods" target="_blank">前往官网查看 >> </a>  

<table border="1" cellspacing="0">
	<tr align="center">
		<td>方法名</td>
		<td>说明</td>
	</tr>
	<tr align="center">
		<td align="left">mescroll.endByPage(dataSize, totalPage, systime);<br/>(v 1.2.1 新增)</td>
		<td align="left">隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用<br />
		dataSize : 当前页获取的数据总数(注意是当前页)<br />
		totalPage : 列表的总页数<br/>
		systime : 加载第一页数据的服务器时间 (可空);
		</td>
	</tr>
	<tr align="center">
		<td align="left">mescroll.endBySize(dataSize, totalSize, systime);<br/>(v 1.2.1 新增)</td>
		<td align="left">隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用<br />
		dataSize : 当前页获取的数据总数(注意是当前页)<br />
		totalSize : 列表的总数据量<br/>
		systime : 加载第一页数据的服务器时间 (可空);
		</td>
	</tr>
	<tr align="center">
		<td align="left">mescroll.endSuccess(dataSize, hasNext, systime);<br/>(v 1.2.1 调整)</td>
		<td align="left">隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用<br />
		dataSize : 当前页获取的数据量(注意是当前页)<br />
		hasNext : 是否有下一页数据true/false<br/>
		systime : 加载第一页数据的服务器时间 (可空);
		</td>
	</tr>
	<tr align="center">
		<td>mescroll.endErr();</td>
		<td>隐藏下拉刷新和上拉加载的状态, 在联网获取数据失败后调用;<br/>mescroll内部会自动恢复原来的页码,时间等变量;</td>
	</tr>
	<tr align="center">
		<td>mescroll.resetUpScroll( isShowLoading );</td>
		<td>重置列表为第一页 (常用于列表筛选条件变化或切换菜单时重新刷新列表数据)<br />内部实现: 把page.num=1,再主动触发up.callback<br />isShowLoading 是否显示进度布局; <br />1.默认null,不传参,则显示上拉加载的进度布局 <br />2.传参true, 则显示下拉刷新的进度布局<br />3.传参false,则不显示上拉和下拉的进度 (常用于静默更新列表数据)</td>
	</tr>
	<tr align="center">
		<td>mescroll.triggerDownScroll();</td>
		<td>主动触发下拉刷新</td>
	</tr>
	<tr align="center">
		<td>mescroll.triggerUpScroll();</td>
		<td>主动触发上拉加载</td>
	</tr>
	<tr align="center">
		<td>mescroll.setPageNum(num);<br/>(v 1.2.5 新增)</td>
		<td>设置当前page.num的值</td>
	</tr>
	<tr align="center">
		<td>mescroll.setPageSize(size);<br/>(v 1.2.5 新增)</td>
		<td>设置当前page.size的值</td>
	</tr>
	<tr align="center">
		<td>mescroll.scrollTo( y, t );</td>
		<td>滚动列表到指定位置 ( y=0回到列表顶部; 如需滚动到列表底部,可设置y很大的值,比如y=99999 ); t时长,单位ms,默认300</td>
	</tr>
	<tr align="center">
		<td>mescroll.optDown;</td>
		<td>获取下拉刷新的配置</td>
	</tr>
	<tr align="center">
		<td>mescroll.optUp;</td>
		<td>获取上拉加载的配置</td>
	</tr>
	<tr align="center">
		<td>mescroll.lockDownScroll( isLock );</td>
		<td>锁定下拉刷新 ( isLock=ture,null 锁定 ; isLock=false 解锁 )</td>
	</tr>
	<tr align="center">
		<td>mescroll.lockUpScroll( isLock );</td>
		<td>锁定上拉加载 ( isLock=ture,null 锁定 ; isLock=false 解锁 )</td>
	</tr>
	<tr align="center">
		<td>mescroll.os<br/>(v 1.2.5 新增)</td>
		<td>
			<b>mescroll.os.ios</b> 为true, 则是ios设备;<br/>
			<b>mescroll.os.android</b> 为true, 则是android设备;<br/>
			<b>mescroll.os.pc</b> 为true, 则是PC端;
		</td>
	</tr>
	<tr align="center">
		<td>mescroll.setBounce(boolean)<br/>(v 1.3.0 新增)</td>
		<td>
			<b>mescroll.setBounce(true)</b> 允许bounce;<br/>
			<b>mescroll.setBounce(false)</b> 禁止bounce
		</td>
	</tr>
	<tr align="center">
		<td>mescroll.lazyLoad(delay)<br/>(v 1.3.6 新增)</td>
		<td>
			主动触发懒加载: 自动加载可视区域的图片.<br />
			delay:延时加载图片的时间,默认500ms.目的是确保dom元素已渲染完成.
		</td>
	</tr>
</table>

## 其他方法 :  
#### <a href="http://www.mescroll.com/api.html#others" target="_blank">前往官网查看 >> </a>  

<table border="1" cellspacing="0">
	<tr align="center"><td colspan="2">以下方法不常用,您可灵活运用于更复杂的场景</tr>
	<tr align="center">
		<td width="288px">mescroll.showDownScroll();</td>
		<td width="600px">显示下拉刷新的进度布局<br/>
		mescroll.triggerDownScroll() 和 mescroll.resetUpScroll() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.endDownScroll();</td>
		<td>隐藏下拉刷新的进度布局<br/>
		mescroll.endSuccess() 和 mescroll.endErr() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showUpScroll();</td>
		<td>显示上拉加载的进度布局<br/>
		mescroll.triggerDownScroll() 和 mescroll.resetUpScroll() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showNoMore();</td>
		<td>显示上拉无更多数据的布局<br/>
		mescroll.endUpScroll() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.hideUpScroll(displayAble);</td>
		<td>隐藏上拉加载的布局<br/>
		mescroll.endUpScroll() 内部有调用<br/>
		1.3.5新增参数 displayAble: 是否通过display:none隐藏, 默认false通过visibility:hidden的方式隐藏
		</td>
	</tr>
	<tr align="center">
		<td>mescroll.clearDataList();</td>
		<td>清空上拉加载的数据列表<br/>
		mescroll.resetUpScroll() 和 mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.loadFull();</td>
		<td>检查如果加载的数据过少,无法触发上拉加载时,则自动加载下一页,直到满屏或无数据<br/>
		此方法最好在列表的图片数据加载完成之后调用,以便计算列表内容高度的准确性<br/>
		mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showEmpty();</td>
		<td>显示无任何数据的空布局<br/>
		mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.removeEmpty();</td>
		<td>移除无任何数据的空布局<br/>
		mescroll.endSuccess() 内部有调用</td>
	</tr>
	<tr align="center">
		<td>mescroll.showTopBtn(time);</td>
		<td>显示回到顶部的按钮<br/>time: 显示的动画时长,默认0.5秒 (1.3.5版本新增参数)</td>
	</tr>
	<tr align="center">
		<td>mescroll.hideTopBtn(time);</td>
		<td>隐藏回到顶部的按钮 <br/>time: 隐藏的动画时长,默认0.5秒 (1.3.5版本新增参数)</td>
	</tr>
	<tr align="center">
		<td>mescroll.setTopBtnFadeDuration(time);<br/>(1.3.5版本新增)</td>
		<td>设置回到顶部按钮的显示和隐藏的动画时长 <br/>time: 显示隐藏动画时长,默认0.5秒</td>
	</tr>
	<tr align="center">
		<td>mescroll.getScrollTop();</td>
		<td>获取滚动条的位置y; 也可以在up配置onScroll监听滚动条的位置</td>
	</tr>
	<tr align="center">
		<td>mescroll.getBodyHeight();</td>
		<td>获取body的高度 </td>
	</tr>
	<tr align="center">
		<td>mescroll.getClientHeight();</td>
		<td>获取滚动容器的高度 </td>
	</tr>
	<tr align="center">
		<td>mescroll.getScrollHeight();</td>
		<td>获取滚动内容的高度 </td>
	</tr>
	<tr align="center">
		<td>mescroll.getToBottom();<br/>(v 1.3.0新增)</td>
		<td>获取当前滚动条到底部的距离 </td>
	</tr>
	<tr align="center">
		<td>mescroll.getStep(star, end, callback, t, rate);<br/>(v 1.2.8 新增) </td>
		<td align="left">
			star : 开始值; <br/>
		 	end : 结束值; <br/>
		 	callback(step,timer) :  回调 function(step,timer), <br/>
		 	t : 计步时长; 传0则直接回调end值; 不传则默认300ms ; <br/>
		 	rate : 周期; 不传则默认30ms计步一次 ; <br/>
		 	此方法相当于默认在300ms内,每30ms返回star到end之间的阶梯值step; 可用于模拟帧动画 <br/>
		 	比如mescroll的回到顶部缓冲动画,轮播导航案例的顶部菜单滚动都是通过getStep实现<br/>
		 	(注: 您可根据实际情况在 callback 通过 window.clearInterval(timer) 提前结束计步器)
	 	</td>
	</tr>
	<tr align="center">
		<td>mescroll.version;<br/>(v 1.3.0新增)</td>
		<td>mescroll的版本号</td>
	</tr>
	<tr align="center">
		<td>mescroll.destroy();</td>
		<td>销毁mescroll</td>
	</tr>
</table>
```