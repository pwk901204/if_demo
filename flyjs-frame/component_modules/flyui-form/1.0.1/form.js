'use strict';
var $ = require('jquery');
var fly = require('fly');
var validate = require('validate');

fly.binders.component.validate = fly.Binder.extend({

    ctor: function(component, bindings, options) {
        this._super(component.element, bindings, options);
        this.component = component;
    },

    refresh: function() {
        this.component.setValidate(this.bindings.validate.get());
    }
});

var FormControl = fly.Component.extend({
    name: 'FormControl',
    options: {
        inline: null,
        align: null,
        required: false,
        title: ''
    },
    template: fly.template(__inline('form.tpl'))
});

var Form = module.exports = fly.Component.extend({

    events: ['submit'],

    ctor: function(element, options) {
        var that = this;
        that._super(element, options);
        $(that.element).submit(function(e){
            e.preventDefault();
            if (that.validate()) {
                that.trigger('submit');
            }
        });
    },

    setValidate: function(valid) {
        this.valid = valid;
    },

    validate: function(){
        var $form = $(this.element),
            $items = $form.find('input[name], textarea[name], select[name]'),
            valid = this.valid,
            names = $items.map(function() {
                return $(this).attr('name');
            }).get(),
            cache = {};

         for (var i = 0, l = names.length; i < l; i++) {
            var name = names[i],
                item = $items.filter('[name="' + name + '"]');

            if(cache[name]) {
                continue;
            } else {
                cache[name] = name;
            }

            if (!validate(item, valid[name])) {
                return false;
            }
         }
         return true;
    }

});

fly.component(Form, 'Form');
fly.component(FormControl, 'FormControl');