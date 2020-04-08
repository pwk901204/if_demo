<div>
{{if close}}
<div class="alert alert-dismissable alert-{{type}} {{className}} {{icon}}">
{{else}}
<div class="alert alert-{{type}} {{className}}">
{{/if}}
    {{if closable}}
    	<button type="button" class="close" title="{{closeTitle}}">
    		{{if closeText}}
				<span class="close-text">{{closeText}}</span>
    		{{else}}
				<i class="icon icon-cross"></i>
    		{{/if}}
    	</button>
    {{/if}}
    {{if icon}}
    	<i class="icon {{icon}}"></i>
    {{/if}}
    <span class="alert-content">{{# content}}<fly:content></fly:content></span>
</div>
</div>