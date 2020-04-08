/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.0.4 (2019-04-23)
 */
(function () {
  var fileupload = (function (domGlobals) {
    'use strict';

    var suffixIcon = ['chm', 'doc', 'exe', 'jpg', 'mp3', 'mv', 'pdf', 'ppt', 'psd', 'rar', 'txt', 'xls'];

    var global = tinymce.util.Tools.resolve('tinymce.PluginManager');

    var submitHandler = function (editor) {
      // var data = api.getData();
      // console.log(api.getData())
      // editor.insertContent('Title: ' + data.title);
      // api.close();
      return function (api) {
        var data = api.getData().url;
        if (data.value) {
          // const icon = require('./fileTypeImages/icon_chm.gif')
          var reg = /\.(\w+)$/;
          var suffix = data.meta.title.match(reg)[1];
          if (suffixIcon.indexOf(suffix) === -1) {
            // 处理图片
            if (data.meta.fileType.indexOf('image/') === 0) {
              suffix = 'jpg'
            } else if (suffix === 'zip') {
              suffix = 'rar'
            } else if (suffix.length === 4 && suffixIcon.indexOf(suffix.substr(0, 3)) > 0) { // office 文档
              suffix = suffix.substr(0, 3)
            } else {
              suffix = 'default'
            }
          }
          // =
          editor.execCommand('mceInsertContent', false, `<p><img src="tinymce/plugins/fileupload/fileTypeImages/icon_${suffix}.gif"/> <a href="${data.value}">${data.meta.title}</a></p>`);
        }

        // editor.insertContent('Title: ' + data.title);
        api.close();
        //   console.log(info.getData())
        // //   return function (api) {
        // //     var data = deepMerge(fromImageData(info.image), api.getData());
        // //     editor.undoManager.transact(function () {
        // //       insertOrUpdateImage(editor, toImageData(data));
        // //     });
        // //     editor.editorUpload.uploadImagesAuto();
        // //     api.close();
        // //   };
      };
    };

    // var makeDialog = function (helpers) {
    //   return function (info) {
    //     // var state = createState(info);
    //     return {
    //       title: 'Insert/Edit File',
    //       size: 'normal',
    //       body: {
    //         type: 'panel',
    //         items: [
    //           {
    //             type: 'input',
    //             name: 'title',

    //             label: 'Title'
    //           }
    //         ]
    //       },
    //       buttons: [
    //         {
    //           type: 'cancel',
    //           name: 'cancel',
    //           text: 'Cancel'
    //         },
    //         {
    //           type: 'submit',
    //           name: 'save',
    //           text: 'Save',
    //           primary: true
    //         }
    //       ],
    //       onSubmit: helpers.onSubmit(info),
    //       // onChange: changeHandler(helpers, info, state),
    //       // onClose: closeHandler(state)
    //     };
    //   };
    // };

    // var submitHandler = function (editor) {
    //   // return function (info) {
    //   //   return function (api) {
    //   //     var data = deepMerge(fromImageData(info.image), api.getData());
    //   //     editor.undoManager.transact(function () {
    //   //       insertOrUpdateImage(editor, toImageData(data));
    //   //     });
    //   //     editor.editorUpload.uploadImagesAuto();
    //   //     api.close();
    //   //   };
    //   // };
    // };

    var Dialog = function (editor) {
      // var helpers = {
      //   onSubmit: submitHandler(editor),
      //   // imageSize: imageSize(editor),
      //   // createBlobCache: createBlobCache(editor),
      //   // alertErr: alertErr(editor),
      //   // normalizeCss: normalizeCss$1(editor),
      //   // parseStyle: parseStyle(editor),
      //   // serializeStyle: serializeStyle(editor)
      // };

      var config = {
        title: '上传文件',
        size: 'normal',
        body: {
          type: 'panel',
          items: [
            {
              name: 'url',
              type: 'urlinput',
              filetype: 'file',
              label: 'Url'
            }
          ]
        },
        buttons: [
          {
            type: 'cancel',
            name: 'cancel',
            text: 'Cancel'
          },
          {
            type: 'submit',
            name: 'save',
            text: 'Save',
            primary: true
          }
        ],
        onSubmit: submitHandler(editor),
        // onChange: changeHandler(helpers, info, state),
        // onClose: closeHandler(state)

      };
      var open = function () {
        // debugger
        // editor.windowManager.open({
        //   title: 'Example plugin',
        //   body: {
        //     type: 'panel',
        //     items: [
        //       {
        //         type: 'input',
        //         name: 'title',
        //         label: 'Title'
        //       }
        //     ]
        //   },
        //   buttons: [
        //     {
        //       type: 'cancel',
        //       text: 'Close'
        //     },
        //     {
        //       type: 'submit',
        //       text: 'Save',
        //       primary: true
        //     }
        //   ],
        //   onSubmit: function (api) {
        //     var data = api.getData();
        //     // Insert content when the window form is submitted
        //     editor.insertContent('Title: ' + data.title);
        //     api.close();
        //   }
        // });
        // var dialog = makeDialog(helpers)

        // console.log(dialog())
        // return makeDialog(helpers).get(function (spec) {
        return editor.windowManager.open(config);
        // });
      };
      return { open: open };
    };

    var register = function (editor) {
      // editor.addCommand('InsertFileUpload', function () {
      editor.addCommand('mceFileUpload', Dialog(editor).open);
      // });
    };

    var Commands = { register: register };

    var register$1 = function (editor) {
      editor.ui.registry.addButton('fileupload', {
        icon: 'upload',
        tooltip: 'File upload',
        onAction: function () {
          // editor.execCommand('mceInsertContent', false, '<img src="https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg" />');
          //  debugger
          Dialog(editor).open()
          // return editor.execCommand('InsertFileUpload');
        }
      });
      editor.ui.registry.addMenuItem('fileupload', {
        icon: 'upload',
        text: 'File upload',
        onAction: function () {
          debugger
          return editor.execCommand('InsertFileUpload');
        }
      });
    };

    var Buttons = { register: register$1 };

    global.add('fileupload', function (editor) {
      // var headState = Cell(''), footState = Cell('');
      // FilterContent.setup(editor);
      Buttons.register(editor);
      Commands.register(editor);
    });
    function Plugin () {
    }

    return Plugin;

  }(window));
})();
