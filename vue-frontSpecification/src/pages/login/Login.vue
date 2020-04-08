 <template>
  <div class="page-container page-login">
    <a-form :form="form"
            @submit="handleSubmit">
      <h2>账号登陆</h2>
      <a-form-item>
        <a-input v-decorator="decorator.account"
                 placeholder="用户名"
                 size="large"
                 maxlength="20">
          <a-icon slot="prefix"
                  type="user" />
        </a-input>
      </a-form-item>
      <a-form-item class="z-mb-0">
        <a-input v-decorator="decorator.password"
                 type="password"
                 placeholder="密码"
                 size="large"
                 maxlength="20">
          <a-icon slot="prefix"
                  type="lock" />
        </a-input>
      </a-form-item>
      <a-form-item class="mark">
        <a-checkbox :checked="checkNick"
                    @change="handleChange">
          记住我（公共场合慎用）
        </a-checkbox>
      </a-form-item>
      <a-form-item class="button-login">
        <a-button type="primary"
                  html-type="submit"
                  size="large">登录</a-button>
      </a-form-item>
    </a-form>
    <p class="bottom">Copyright 2019-2020 - Powered By 科大讯飞芜湖技术中心</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import decorator from './decorator.js'
export default {
  name: 'Login', // 登录页面
  data () {
    return {
      form: this.$form.createForm(this),
      decorator: Object.freeze(decorator),
      checkNick: false
    }
  },
  methods: {
    ...mapActions(['Login']),
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.Login(values).then(res => {
            this.$notification.success({
              message: res.role,
              description: `欢迎回来`
            })
            this.$router.push({ path: '/from' })
          })
        }
      })
    },
    handleChange () {
      this.checkNick = !this.checkNick
    }
  }
}
</script>

<style lang="less">
.page-login {
  overflow: hidden;
  height: 100%;
  min-height: 450px;
  background: url("../../assets/login/login.jpg") center center no-repeat;
  background-size: cover;
  h2 {
    margin: 0 0 25px 0;
    font-family: "Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif";
    font-size: 20px;
    color: #555555;
  }
  .ant-form {
    position: absolute;
    top: 50%;
    right: 220px;
    width: 400px;
    height: 340px;
    margin-top: -196px;
    background: #fff;
    padding: 30px;
    border-radius: 8px;
  }
  .ant-btn-primary {
    width: 100%;
  }
  .bottom {
    color: #fff;
    text-align: center;
    position: absolute;
    width: 100%;
    bottom: 20px;
  }
  .z-mb-0 {
    margin-bottom: 0;
  }

  .mark {
    margin-bottom: 14px;
  }

  .button-login {
    margin-bottom: 28px;
  }

  /*.icon {*/
    /*color: #bbb;*/
  /*}*/
}
.page-login /deep/.has-success .ant-input-prefix {
  color: #bbb;
}
</style>
