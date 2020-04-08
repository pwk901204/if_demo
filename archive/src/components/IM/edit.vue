<template>
  <div class="IM-edit">
    <div class="edit-btn flex-row-align-center">
      <img class="edit-icon" src="./assets/close.png" />
      <img class="edit-icon" src="./assets/close.png" />
    </div>
    <div class="edit-textarea" contenteditable="true">

    </div>
    <div class="edit-send flex-row-align-center">
      <a-button type="primary">发送</a-button>
    </div>

  </div>
</template>
<script>
export default {

}
</script>
<style lang="less">
.IM-edit{
  background: #fff;
  .edit-btn{
    justify-content: flex-end;
    height:40px;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    .edit-icon{
      width:18px;
      height:18px;
      margin-right: 10px;
    }
  }
  .edit-textarea{
    display: block;
    height: 74px;
    outline: none;
    padding:0 20px;
    overflow-y: auto;
  }
  .edit-send{
    height: 56px;
    justify-content: flex-end;
  }
}
</style>
