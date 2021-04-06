<template>
  <div class="tab-container">
<!--    <el-tag>mounted times ：{{ createdTimes }}</el-tag>-->
<!--    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" />-->
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import TabPane from '@/views/code/components/TabPane'

export default {
  name: 'History',
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [
        { label: 'Mybatis代码', key: 'mybatis' },
        { label: '数据库文档', key: 'dbdoc' },
        { label: 'Japan', key: 'JP' },
        { label: 'Eurozone', key: 'EU' }
      ],
      activeName: 'mybatis',
      createdTimes: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        host: '',
        username: '',
        database: '',
        table: '',
        type: this.type,
        beginTime: '',
        endTime: '',
        sort: '+id'
      },
      total: 10
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?type=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    }
  }
}
</script>

<style scoped>
@import url("//unpkg.com/element-ui@2.15.1/lib/theme-chalk/index.css");
.tab-container {
  margin: 30px;
}

.filter-container {
  padding-bottom: 10px;

  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}

</style>
