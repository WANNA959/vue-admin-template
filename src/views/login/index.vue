<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="admin"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-row>
        <el-col :span="12" >
          <el-form-item prop="code" >
            <el-col :span="12" style="width: 18%">
              <span class="svg-container">
                <svg-icon icon-class="verify2" />
              </span>
            </el-col>
            <el-col :span="12" >
              <el-input
                :key="codeType"
                ref="code"
                v-model="loginForm.code"
                type="text"
                placeholder="验证码"
                name="code"
                tabindex="3"F
                autocomplete="on"
                @keyup.enter.native="handleLogin"
              />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <div style="width:100%;margin-left: 20%">
            <el-row>
              <img :src="verifyCode" @click="getVerifySrc" style="width:60%;vertical-align: center;align:center" />
            </el-row>
            <el-row>
              <a href="JavaScript:;" @click="getVerifySrc" style="color: white;font-size: 1px;align:center">看不清，换一张</a>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <el-checkbox v-model="loginForm.remember" style="margin-left: 10px">7天免登录</el-checkbox>
      <a href="#/forget" class="forget" >忘记密码？</a>
      <div>
        <el-col :span="12">
          <el-button :loading="loading" type="primary" style="width:90%;margin-left: 5%" @click.native.prevent="handleLogin">登录</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="width:90%;margin-left: 5%" @click.native.prevent="handleRegister">注册</el-button>
        </el-col>
      </div>

      <!--      <div style="position:relative">-->
      <!--        <div class="tips">-->
      <!--          <span>Username : admin</span>-->
      <!--          <span>Password : password</span>-->
      <!--        </div>-->

      <!--        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">-->
      <!--          Or connect with-->
      <!--        </el-button>-->
      <!--      </div>-->
    </el-form>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { getVerifySrcApi } from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入验证码'))
      } else if (value.length !== 4) {
        return callback(new Error('验证码为4位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        code: '',
        remember: false
      },
      verifyCode: '',
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      passwordType: 'password',
      codeType: 'code',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    getVerifySrcApi().then(response => {
      // 这里也是关键,调用window的这个方法URL方法
      this.verifyCode = window.URL.createObjectURL(response)
    })
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getVerifySrc() {
      console.log('in method')
      getVerifySrcApi().then(response => {
        // 这里也是关键,调用window的这个方法URL方法
        this.verifyCode = window.URL.createObjectURL(response)
      })
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(response => {
              console.log(response)
              if (response.code === 200) {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
                // authToken(this.loginForm)
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRegister() {
      this.$router.push({ path: '/register' })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .forget{
    color: #606266;
    font-weight: 500;
    font-size: 14px;
    margin-left: 70px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
