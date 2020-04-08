<div class="widget dropdownlist">
    <span unselectable="on" class="widget-wrap state-default">
        <span unselectable="on" class="input"></span>
        {{if required}}
        	<input type="hidden" name="{{name}}" required="required">
        {{else}}
        	<input type="hidden" name="{{name}}">
        {{/if}}
        
        <span unselectable="on" class="select">
            <i class="icon icon-down"></i>
        </span>
    </span>
</div>