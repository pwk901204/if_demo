<div>
  {{if inline}}
  <div class="form-control form-inline">
  {{else}}
  <div class="form-control">
  {{/if}}
      {{if align}}
      <div class="label label-{{align}">
      {{else}}
      <div class="label">
      {{/if}}
          <label>
              {{if required}}
                  <span class="required">*</span>
              {{/if}}
              {{title}}：
          </label>
      </div>
      <fly:content></fly:content>
  </div>
</div>