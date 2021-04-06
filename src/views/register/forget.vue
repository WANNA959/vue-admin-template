<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" autocomplete="on" label-position="left" >

      <div class="title-container">
        <h3 class="title">Forget</h3>
      </div>

      <el-form-item prop="email" label="邮箱" label-width="80px">
        <el-input
          ref="email"
          v-model="registerForm.email"
          type="email"
          placeholder=""
          name="email"
          tabindex="1"
          autocomplete="on"
          @keyup.enter.native="handleEmailRequest"
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
                tabindex="2"
                autocomplete="on"
                @keyup.enter.native="handleEmailRequest"
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
          <el-button type="primary" style="width:90%;margin-left: 5%" @click.native.prevent="handleEmailRequest('registerForm')">找回密码</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="width:90%;margin-left: 5%" @click.native.prevent="handleReset('registerForm')">重置</el-button>
        </el-col>
      </div>
    </el-form>
  </div>
</template>

<script>

import { getVerifySrcApi } from '@/api/user'

export default {
  name: 'ResetPass',
  data() {
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
        email: '',
        code: ''
      },
      registerRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      loading: false,
      verifyCode: '',
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
          console.log(this.otherQuery)
        }
      },
      immediate: true
    }
  },
  created() {
    getVerifySrcApi().then(response => {
      // 这里也是关键,调用window的这个方法URL方法
      this.verifyCode = window.URL.createObjectURL(response)
    })
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.registerForm.email === '') {
      this.$refs.email.focus()
    } else if (this.registerForm.code === '') {
      this.$refs.code.focus()
    }
  },
  destroyed() {
  },
  methods: {
    getVerifySrc() {
      getVerifySrcApi().then(response => {
        // 这里也是关键,调用window的这个方法URL方法
        this.verifyCode = window.URL.createObjectURL(response)
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    handleEmailRequest(registerForm) {
      this.$refs[registerForm].validate(valid => {
        console.log(valid)
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/forget', this.registerForm)
            .then(response => {
              console.log(response)
              if (response.code === 200) {
                this.$message({
                  message: response.message,
                  type: 'success',
                  duration: 10000
                })
              } else {
                this.$message({
                  message: response.message,
                  type: 'error',
                  duration: 10000
                })
                return false
              }
              this.loading = false
              // 跳转到登录页面
              setTimeout(() => {
                this.$router.push({ path: this.redirect || '/' })
              }, 3000)
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
  }
}
</script>

<style lang="scss">

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
