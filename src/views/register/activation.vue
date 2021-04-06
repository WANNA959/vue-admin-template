<template>
  <div class="mycontainer">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" crossorigin="anonymous">
    <div class="container mt-5">
      <div class="jumbotron">
        <p class="lead" >{{ msg }}</p>
        <hr class="my-4">
        <p>
          系统会在 <span id="seconds" class="text-danger">{{ second }}</span> 秒后自动跳转到对应页面,
          您也可以点此 <a id="target" :href="href" class="text-primary">链接</a>, 手动跳转!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { activation } from '@/api/user'
export default {
  name: 'Activation',
  data() {
    return {
      title: '激活账号',
      msg: '',
      href: '',
      second: 5,
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
    activation(this.otherQuery.userId, this.otherQuery.code).then(response => {
      // 这里也是关键,调用window的这个方法URL方法
      console.log(response)
      this.msg = response.message
      if (response.code === 200) {
        this.href = '#/login'
      } else {
        this.href = '#/register'
      }
      const that = this
      var timer = setInterval(function() {
        that.second--
        console.log(that.second)
        if (that.second === 0) {
          console.log(that.href)
          that.$router.push({ path: that.href.substr(1) })
          clearInterval(timer)
        }
      }, 1000)
    })
  },
  mounted() {
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
    }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
.mycontainer {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
}

.jumbotron{
  margin-top: 200px;
}
</style>
