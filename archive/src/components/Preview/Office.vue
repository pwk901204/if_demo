<template>
  <div :style="contentStyle">
    <div v-if="officeType==='0'">
      <!--<a-button @click="LoadServlet">打开服务器文件</a-button>-->
      <!--<a-button @click="loadLocalFile">打开本地文件</a-button>-->
      <!--<a-button @click="saveDocument">保存编研文件</a-button>-->
      <!--<a-button @click="WebAddBookMarks">添加书签</a-button>-->
      <!--<a-button @click="WebOpenBookMarks">打开书签窗口</a-button>-->
      <!--<a-button @click="WebUseTemplate">模板套红</a-button>-->
      <!--<a-button @click="WebSaveTemplate">保存模板文件</a-button>-->
      <!--<a-button @click="WebInsertImage">插入图片</a-button>-->
      <!--<a-button @click="addSelectContent">在光标处添加文本</a-button>-->
      <!--<a-button @click="createNewFile">新建文件</a-button>-->
      <!--<a-button @click="protectFile">不可编辑</a-button>-->
    </div>
    <div id="office"></div>
  </div>
</template>
<script>

import Vue from 'vue'
// import { mapActions } from 'vuex'
// import webOfficeTpl from 'plugins/webOffice/iWebOffice2015.js'
export default {
  props: {
    name: {
      type: String,
      require: true
    },
    width: {
      type: String
    },
    // 0是可编辑状态，1是不可编辑状态
    officeType: {
      type: String,
      default: '0'
    },
    // 文件的路径
    officeUrl: {
      type: String,
      default: ''
    },
    projectId: {
      type: String,
      default: ''
    },
    // 动态渲染office父级标签的高度
    officeHeight: {
      type: String,
      default: '100%'
    }
  },
  name: 'webOffice',
  data () {
    return {
      visible: false,
      webOffice: null,
      webOfficeObj: null
    }
  },
  computed: {
    contentStyle () {
      const style = {
        height: window.innerHeight - 200 + 'px'
      }
      return style
    }
  },
  mounted () {
    // this.allRouteSpinning(2000) // 遮罩
    setTimeout(() => {
      this.initWebOffice()
      this.initWebOfficeObject()
    }, 300)
  },
  methods: {
    // ...mapActions(['allRouteSpinning']),
    initWebOffice () {
      this.webOffice = new Vue({
        template: window.webOfficeTpl
      }).$mount('#office')
    },
    initWebOfficeObject () {
      const WebOffice2015 = window.WebOffice2015
      this.webOfficeObj = new WebOffice2015()
      this.webOfficeObj.setObj(document.getElementById('WebOffice'))
      try {
        // this.webOfficeObj.ServerUrl = "http://www.kinggrid.com:8080/iWebOffice2015/OfficeServer";
        // this.webOfficeObj.RecordID = "1551950618511";  //RecordID:本文档记录编号
        // 自定义参数 start
        // 自定义参数 end

        this.webOfficeObj.ServerUrl = process.env.VUE_APP_SERVERURL
        // this.webOfficeObj.UserName = 'XXX'
        this.webOfficeObj.FileName = 'Mytemplate.doc'
        this.webOfficeObj.ShowWindow = false // 显示/隐藏进度条
        this.webOfficeObj.EditType = '1' // 设置加载文档类型 0 锁定文档，1无痕迹模式，2带痕迹模式
        this.webOfficeObj.ShowMenu = '0'
        this.webOfficeObj.ShowToolBar = '3'
        this.webOfficeObj.ShowCustomToolBar(true) // 显示自定义菜单

        if (this.officeType === '0') {
          // this.webOfficeObj.SetCaption(this.webOfficeObj.UserName + '正在编辑文档') // 设置控件标题栏标题文本信息
        }
        // 参数顺序依次为：控件标题栏颜色、自定义菜单开始颜色、自定义工具栏按钮开始颜色、自定义工具栏按钮结束颜色、
        // 自定义工具栏按钮边框颜色、自定义工具栏开始颜色、控件标题栏文本颜色（默认值为：0x000000）
        this.SetGraySkin()
        // 设置控件皮肤
        this.LoadServlet()
        setTimeout(() => {
          // 设置Office用户名
          this.webOfficeObj.VBASetUserName(this.$store.getters.userInfo.name)
          // 开启审阅窗格
          this.webOfficeObj.WebSetRevision(true, true, true, true)
          this.webOfficeObj.WebObject.ActiveDocument.ActiveWindow.View.SplitSpecial = 18
        }, 0)
        this.webOfficeObj.HookEnabled()
        // 如果是预览，禁用编辑的功能
        if (this.officeType === '1') {
          this.protectFile()
        }
        // this.allRouteSpinning(0)
      } catch (e) {
        // this.allRouteSpinning(0)
      }
    },

    /**
     *  服务端Servlet方式打开文档
     *  参数fileName是需要打开的服务器文件名
     */
    LoadServlet (fileName) {
      fileName = this.officeUrl
      // fileName = 'http://172.16.1.40/group1/M00/11/0A/rBABKF3x-xWAKxJcAEf-9X1mRIU88.xlsx';
      try {
        // 用来保存文件的Server
        this.downloadLink = this.webOfficeObj.ServerUrl + '/webOffice/fileDownload?path=' + fileName// +"&projectId="+this.projectId
        // this.downloadLink =`${this.webOfficeObj.ServerUrl}/webOffice/fileDownload?path=${fileName}&projectId=${this.projectId}`
        // this.downloadLink = 'http://localhost:8888/iWebOffice2015.JSP-V2.1/FileDownload?FileName=/Document/sample.doc';
        this.webOfficeObj.projectId = this.projectId
        this.webOfficeObj.ShowMenu = 1
        this.webOfficeObj.ShowToolBar = 0
        this.webOfficeObj.FileType = fileName.substr(fileName.lastIndexOf('.'))
        this.webOfficeObj.FileName = fileName
        // this.SetGraySkin()//设置控件皮肤
        if (fileName === '') {
          this.createNewFile()
        } else {
          if (this.webOfficeObj.WebOpen3(this.downloadLink)) {
            // 文件在服务器上的相对路径 FileName
            this.webOfficeObj.obj.ActiveDocument.Application.ActiveWindow.DocumentMap = false // false 关闭 true打开
          }
        }

        // 打开后，模板套红
        // setTimeout(this.WebUseTemplate(""),1000);

        // 不可编辑
        // this.protectFile();
      } catch (e) {
        this.StatusMsg(e.description)
      }
    },
    StatusMsg (mValue) {
      try {
        document.getElementById('StatusBar').value = mValue
      } catch (e) {
        return false
      }
    },
    SetGraySkin () {
      // 参数顺序依次为：控件标题栏颜色、自定义菜单开始颜色、自定义工具栏按钮开始颜色、自定义工具栏按钮结束颜色、
      // 自定义工具栏按钮边框颜色、自定义工具栏开始颜色、控件标题栏文本颜色（默认值为：0x000000）
      if (!this.webOfficeObj.WebSetSkin(0xdbdbdb, 0xeaeaea, 0xeaeaea, 0xdbdbdb, 0xdbdbdb, 0xdbdbdb, 0x000000)) {
        this.webOfficeObj.Alert(this.webOfficeObj.Status)
      }
    },
    // 打开本地文件
    loadLocalFile () {
      this.webOfficeObj.FileType = '.docx'
      this.webOfficeObj.WebOpenLocal()
      this.webOfficeObj.obj.ActiveDocument.Application.ActiveWindow.DocumentMap = false // false 关闭 true打开
    },
    // 保存编研文档
    saveDocument () {
      return new Promise((resolve, reject) => {
        // 文件名，不用修改，因为上传到fastdfs 后就会修改文件名
        this.webOfficeObj.FileName = 'sample.docx'
        // word 文档不用修改，在线word 编辑针对的是.doc 文件
        this.webOfficeObj.FileType = this.webOfficeObj.FileName.substr(this.webOfficeObj.FileName.lastIndexOf('.'))
        this.webOfficeObj.SaveServlet = '/webOffice/save'
        if (this.webOfficeObj.WebSave()) { // 交互OfficeServer的OPTION="SAVEFILE"
          resolve(this.webOfficeObj.responseFilePath)
          // window.close();
        } else {
          // this.webOfficeObj.Alert(this.webOfficeObj.Status)
          this.StatusMsg(this.webOfficeObj.Status)
          resolve(this.webOfficeObj.Status)
        }
      })
    },

    /**
     * 模板套红
     * 参数 templateName 是模板文件的服务器地址
      */
    WebUseTemplate (templateName) {
      // 测试使用的模板文件
      // templateName = 'http://172.16.1.40/group1/M00/11/09/rBABKF3xlwWAEYqPAABiAIDOnC4050.doc';
      // templateName = 'http://172.16.1.40/group1/M00/11/0A/rBABKF3x7q6AP6bYAANoAJ4onZQ224.doc';
      // templateName = templateName //'http://172.31.236.77:8888/group1/M00/00/24/rB_sTV3zUeWASmbSAABiAM65P68174.doc'
      this.webOfficeObj.Template = templateName // 套红模板名称
      // 设置模板请求 url
      this.webOfficeObj.SaveServlet = '/webOffice/fileDownload?path=' + templateName
      this.webOfficeObj.WebUseTemplate()
      this.webOfficeObj.obj.ActiveDocument.Application.ActiveWindow.DocumentMap = false // 导航 false 关闭 true打开
    },

    /**
     * 保存模板文档
     */
    WebSaveTemplate () {
      // 页面传参
      // 模板id
      this.webOfficeObj.templateId = '1'
      // 用户id
      this.webOfficeObj.useId = '2c9fb52c6d3e7f5b016dd797618410f0'
      // 文档名称,不用修改
      this.webOfficeObj.FileName = 'sample.doc'
      this.webOfficeObj.SaveServlet = '/webOffice/save'
      this.webOfficeObj.WebSaveTemplate()
    },
    // 根据光标添加添加书签名和值（发布模板的新增和编辑使用：在文档中添加标签，bookMarkName固定为 Content）
    WebAddBookMarks () { // 书签名称，书签值
      console.log('WebAddBookMarks  start')
      return new Promise((resolve, reject) => {
        // 如果非ie浏览器调用HidePlugin隐藏插件避免窗体被遮挡
        // this.webOfficeObj.HidePlugin(0)
        var mText = '这里是正文内容......' // window.prompt('请输入书签内容')
        // if (!mText) {
        //   this.webOfficeObj.HidePlugin(1)
        //   return
        // }
        // this.webOfficeObj.BookMarkValue = mText
        this.webOfficeObj.FileType = '.docx'
        // 先删除原来的
        this.webOfficeObj.WebDelBookMarks('Content')
        var result = this.webOfficeObj.WebAddBookMarks('Content', mText)
        console.log('WebAddBookMarks res:' + result)
        // this.webOfficeObj.HidePlugin(1)
        resolve(result)
        return result
      })
    },
    // 打开书签窗口
    WebOpenBookMarks () {
      this.webOfficeObj.FileType = '.docx'
      this.webOfficeObj.WebOpenBookMarks()
    },
    /* 获取内容值 */
    WebGetBookMarks (bookmarkName) {
      return new Promise((resolve, reject) => {
        resolve(this.webOfficeObj.WebGetBookMarks(bookmarkName))
      })
    },
    // 插入图片
    WebInsertImage (imgPath) {
      // var imgPath = 'http://172.31.236.77:8888/group1/M00/00/24/rB_sTV3zU5SAFxSzAAA_gMHjhuI618.jpg'
      this.webOfficeObj.SaveServlet = '/webOffice/fileDownload?path=' + imgPath
      this.webOfficeObj.WebUrl = this.webOfficeObj.ServerUrl + this.webOfficeObj.SaveServlet
      this.webOfficeObj.WebInsertImage('myimage', imgPath, true, 5)
    },
    /* 在光标处添加文本 */
    addSelectContent (txt) {
      // var txt = '这里是选中需要加入到word 的内容'
      this.webOfficeObj.addSelectContent(txt, '255')
    },
    /* 新建空白word  */
    createNewFile () {
      this.webOfficeObj.FileType = '.docx'
      this.webOfficeObj.CreateFile()
      this.webOfficeObj.obj.ActiveDocument.Application.ActiveWindow.DocumentMap = false // 导航 false 关闭 true打开
    },
    /* 文档保护、不可编辑 */
    protectFile () {
      this.webOfficeObj.WebSetProtect(true, '123456')
    },
    /* 可编辑 */
    unProtectFile () {
      this.webOfficeObj.WebSetProtect(false, '123456')
    },
    /* 隐藏、显示金格 */
    hidePlugin (value) {
      // 0隐藏、1显示
      this.webOfficeObj.HidePlugin(value)
    }
  }
}
</script>
<style>
</style>
