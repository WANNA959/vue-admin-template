<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" autocomplete="on" label-position="left" >

      <div class="title-container">
        <h3 class="title">Reset</h3>
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
          readonly
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
          @keyup.enter.native="handleResetPass"
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
          @keyup.enter.native="handleResetPass"
        />
      </el-form-item>

      <div>
        <el-col :span="12">
          <el-button type="primary" style="width:90%;margin-left: 5%" @click.native.prevent="handleResetPass('registerForm')">确认修改</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="width:90%;margin-left: 5%" @click.native.prevent="handleReset('registerForm')">重置</el-button>
        </el-col>
      </div>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'ResetPass',
  data() {
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
    return {
      registerForm: {
        password: '',
        checkPassword: '',
        username: '',
        userId: '',
        code: ''
      },
      registerRules: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        checkPassword: [{ required: true, trigger: 'blur', validator: validatePassword2 }]
      },
      passwordType: 'password',
      loading: false,
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
    this.registerForm.username = this.otherQuery.username
    this.registerForm.userId = this.otherQuery.userId
    this.registerForm.code = this.otherQuery.code
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.registerForm.password === '') {
      this.$refs.password.focus()
    } else if (this.registerForm.checkPassword === '') {
      this.$refs.checkPassword.focus()
    }
  },
  destroyed() {
  },
  methods: {
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    handleResetPass(registerForm) {
      this.$refs[registerForm].validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/resetpass', this.registerForm)
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
