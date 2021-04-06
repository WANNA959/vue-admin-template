<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" autocomplete="on" label-position="left" >

      <div class="title-container">
        <h3 class="title">Register</h3>
      </div>

      <el-form-item prop="username" label="账号" label-width="80px">
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder=""
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="password" label="密码" label-width="80px">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder=""
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>

      <el-form-item prop="checkPassword" label="确认密码" label-width="80px">
        <el-input
          ref="checkPassword"
          v-model="registerForm.checkPassword"
          :type="passwordType"
          placeholder=""
          name="checkPassword"
          tabindex="3"
          autocomplete="on"
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>

      <el-form-item prop="email" label="邮箱" label-width="80px">
        <el-input
          ref="email"
          v-model="registerForm.email"
          type="email"
          placeholder=""
          name="email"
          tabindex="4"
          autocomplete="on"
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>

      <el-row>
        <el-col :span="12" >
          <el-form-item prop="code" label="验证码" label-width="80px">
            <el-col :span="24" >
              <el-input
                ref="code"
                v-model="registerForm.code"
                type="text"
                placeholder=""
                name="code"
                tabindex="5"
                autocomplete="on"
                @keyup.enter.native="handleRegister"
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

      <div>
        <el-col :span="12">
          <el-button type="primary" style="width:90%;margin-left: 5%" @click.native.prevent="handleRegister('registerForm')">注册</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="width:90%;margin-left: 5%" @click.native.prevent="handleReset('registerForm')">重置</el-button>
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
  name: 'Register',
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
      } else if (value.length < 6) {
        callback(new Error('密码长度需不小于6位'))
      } else {
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请再次确认密码'))
      } else if (value !== this.registerForm.password) {
        return callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('请输入邮箱'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
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
      registerForm: {
        username: '',
        password: '',
        checkPassword: '',
        email: '',
        code: ''
      },
      verifyCode: '',
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        checkPassword: [{ required: true, trigger: 'blur', validator: validatePassword2 }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      passwordType: 'password',
      codeType: 'code',
      loading: false,
      showDialog: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
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
    if (this.registerForm.username === '') {
      this.$refs.username.focus()
    } else if (this.registerForm.password === '') {
      this.$refs.password.focus()
    } else if (this.registerForm.checkPassword === '') {
      this.$refs.checkPassword.focus()
    } else if (this.registerForm.email === '') {
      this.$refs.email.focus()
    } else if (this.registerForm.code === '') {
      this.$refs.code.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getVerifySrc() {
      getVerifySrcApi().then(response => {
        // 这里也是关键,调用window的这个方法URL方法
        this.verifyCode = window.URL.createObjectURL(response)
      })
    },
    handleRegister(registerForm) {
      this.$refs[registerForm].validate(valid => {
        console.log(valid)
        // todo  valid
        if (valid || !valid) {
          this.loading = true
          this.$store.dispatch('user/register', this.registerForm)
            .then(response => {
              console.log(response)
              // 若成功，跳转到登录页面
              if (response.code === 200) {
                this.$message({
                  message: response.message,
                  type: 'success',
                  duration: 10000
                })
                setTimeout(() => {
                  this.$router.push({ path: this.redirect || '/' })
                }, 3000)
              } else {
                this.$message({
                  message: response.message,
                  type: 'error',
                  duration: 10000
                })
                return false
              }
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.$message({
            message: '参数错误，请检查输入参数',
            type: 'warning'
          })
          console.log('error submit!!')
          return false
        }
      })
    },
    handleReset(registerForm) {
      this.$refs[registerForm].resetFields()
      this.$refs.username.focus()
      this.$message({
        message: '重置成功',
        type: 'success'
      })
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
    //       this.$store.dispatch('registerByThirdparty', codeName).then(() => {
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
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;

    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;

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

  //.el-form-item {
  //  //border: 1px solid rgba(255, 255, 255, 0.1);
  //  //background: rgba(0, 0, 0, 0.1);
  //  background: $bg;
  //  border-radius: 5px;
  //  //color: #454545;
  //  color: $bg;
  //}

}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
