<div class="pagination clearfix">
    <div class="number"></div>
    <div class="info"></div>
    {{if showSwitch}}
    <div class="switch">
        <span class="switch-info">每页</span>
        <fly:dropdown data-bind="source: switches, value: switchValue, events:{change: switchChange}" data-option-label=""></fly:dropdown>        
        <span class="switch-info">条</span>
    </div>
    {{/if}}
</div>