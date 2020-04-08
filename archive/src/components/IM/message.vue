
<template>
  <div class="IM-message">
    <div class="message">
      <p class="time">
        <span>12:20</span>
      </p>
      <div class="main flex-row">
        <div class="avatar">
          <span>李琦</span>
        </div>
        <div class="text">李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦</div>
      </div>
    </div>
    <div class="message myself">
      <p class="time">
        <span>12:20</span>
      </p>
      <div class="main flex-row">
        <div class="avatar">
          <span>李琦</span>
        </div>
        <div class="text">李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦</div>
      </div>
    </div>
    <div class="message myself">
      <p class="time">
        <span>12:20</span>
      </p>
      <div class="main flex-row">
        <div class="avatar">
          <span>李琦</span>
        </div>
        <div class="text">李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦</div>
      </div>
    </div>
    <div class="message myself">
      <p class="time">
        <span>12:20</span>
      </p>
      <div class="main flex-row">
        <div class="avatar">
          <span>李琦</span>
        </div>
        <div class="text">李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦李琦</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" >
.IM-message{
  height: 380px;
  overflow-y:auto;
  background: #fafafa;
  .message{
    margin-bottom: 15px;
    .time {
      margin: 7px 0;
      text-align: center;
      > span {
          display: inline-block;
          padding: 0 18px;
          font-size: 12px;
          color: #fff;
          border-radius: 2px;
          background-color: #dcdcdc;
      }
    }
    .main{
      .avatar {
        margin:0 10px 0 20px;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        background: #d9d9d9;
        text-align: center;
        line-height: 50px;
      }
      .text {
        position: relative;
        padding: 0 10px;
        max-width: 60%;
        min-height: 30px;
        line-height: 2;
        font-size: 12px;
        word-break: break-all;
        background-color: #fff;
        border-radius: 4px;
        &:before {
            content: " ";
            position: absolute;
            top: 9px;
            right: 100%;
            border: 6px solid transparent;
            border-right-color: #fff;
        }
      }
    }
    &.myself{
      .main{
        justify-content: flex-end;
        .avatar{
          order:2
        }
        .text{
          background: #1890ff;
          color: #fff;
           &:before {
            left:100%;
            border-left-color: #1890ff;
          }
        }
      }

    }
  }

}
</style>
