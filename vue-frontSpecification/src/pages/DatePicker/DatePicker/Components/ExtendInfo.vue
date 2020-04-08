<template>
  <div>
    <a-date-picker>
      <template slot="renderExtraFooter">
        extra footer
      </template>
    </a-date-picker>
    <a-date-picker showTime>
      <template slot="renderExtraFooter">
        extra footer
      </template>
    </a-date-picker>
    <a-range-picker>
      <template slot="renderExtraFooter">
        extra footer
      </template>
    </a-range-picker>
    <a-range-picker showTime>
      <template slot="renderExtraFooter">
        extra footer
      </template>
    </a-range-picker>
    <a-month-picker placeholder="Select month">
      <template slot="renderExtraFooter">
        extra footer
      </template>
    </a-month-picker>
  </div>
</template>
