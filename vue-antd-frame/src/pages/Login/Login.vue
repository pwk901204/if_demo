 <template>
  <div class="page-container page-login">
    <a-form :form="form" @submit="handleSubmit">
      <h2>Vue + Ant Design模板</h2>
      <a-form-item>
        <a-input v-decorator="decorator.account" placeholder="用户名" size="large" maxlength="20">
          <a-icon slot="prefix" type="user" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input v-decorator="decorator.password" type="password" placeholder="密码" size="large" maxlength="20">
          <a-icon slot="prefix" type="lock" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" size="large">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import decorator from './decorator.js'
export default {
  name: 'Login', // 登录页面
  data () {
    return {
      form: this.$form.createForm(this),
      decorator: Object.freeze(decorator)
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.avatar = 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
          values.role = '项目经理 '
          values.group = ' 芜湖技术中心－交付一部'
          this.$store.commit('account/setUser', values)
          this.$router.push({ path: '/dashboard' })
        }
      })
    }
  }
}
</script>

<style lang="less">
.page-login {
  overflow: hidden;
  height: 100%;
  min-height: 450px;
  background: url("../../assets/login/bg.svg") center center no-repeat;
  h2 {
    margin: 32px 0;
    text-align: center;
    font-family: "Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif";
    font-size: 32px;
  }
  .ant-form {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 380px;
    margin-top: -196px;
    margin-left: -180px;
  }
  .ant-btn-primary {
    width: 100%;
  }
}
</style>
