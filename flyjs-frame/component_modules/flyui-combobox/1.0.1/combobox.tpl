<div class="widget combobox">
    <span unselectable="on" class="widget-wrap state-default">
        <span class="input">
            <input type="text" autocomplete="off" />
            {{if required}}
            	<input type="hidden" name="{{name}}" required="required">
            {{else}}
            	<input type="hidden" name="{{name}}">
            {{/if}}
        </span>
        <span unselectable="on" class="select">
            <i class="icon icon-down"></i>
        </span>
    </span>
</div>