<template>
  <div>
    <el-form class="filter-container" inline>
      <el-row>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="value2"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="host" style="margin-left: 40px">
          <el-input v-model="listQuery.host" placeholder="" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="数据库名称" >
          <el-input v-model="listQuery.database" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
        </el-form-item>
        <el-form-item label="表名" style="margin-left: 50px" v-if="listQuery.type!='dbdoc'">
          <el-input v-model="listQuery.table" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
        </el-form-item>
        <el-form-item label="用户名" style="margin-left: 50px">
          <el-input v-model="listQuery.username" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" style="float: right;margin-right: 15px" icon="el-icon-search" @click="getList" >
          Search
        </el-button>
      </el-row>
    </el-form>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="ID"
        width="65"
        type="index"
        element-loading-text="请给我点时间！"
      >
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.id }}</span>-->
<!--        </template>-->
      </el-table-column>

      <el-table-column width="200px" align="center" label="请求时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="生成文件类型">
        <template slot-scope="scope">
          <span>{{ scope.row.fileType }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="数据库host">
        <template slot-scope="scope">
          <span>{{ scope.row.host }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="数据库用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="数据库名称">
        <template slot-scope="scope">
          <span>{{ scope.row.dbName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="数据库表名">
        <template slot-scope="scope">
          <span>
            <el-tag v-for="table in paramJson(scope.row.tables)" :key="table" style="margin-left: 5px">{{ table }}</el-tag>
          </span>
  <!--        <span>{{ scope.row.tables }}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleDownload(row)">
            下载
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row,id)">
            删除记录
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 20px">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        :current-page="this.listQuery.pageNum"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="this.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchList, deleteItem, downloadItem } from '@/api/code'
import { parseTime, paramJson, dateFormat } from '@/utils/index'
import { mapGetters } from 'vuex'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'mybatis'
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: [],
      list: null,
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
      loading: false,
      total: 0
    }
  },
  created() {
    // 默认一周内
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    this.value2 = [start, end]
    this.beginTime = start
    this.endTime = end
    this.getList()
  },
  computed: {
    ...mapGetters([
      'name',
      'id'
    ])
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      this.listQuery.beginTime = dateFormat('YYYY-mm-dd HH:MM:SS"', this.value2[0])
      this.listQuery.endTime = dateFormat('YYYY-mm-dd HH:MM:SS"', this.value2[1])
      console.log(this.listQuery)
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    handleCurrentChange(pageNum) {
      this.listQuery.pageNum = pageNum
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    handleDownload(row) {
      const params = { id: row.id }
      downloadItem(params).then(response => {
        const aLink = document.createElement('a')
        const blob = new Blob([response], { type: 'application/octer-stream' })
        // 获取到Content-Disposition;filename
        // const fileNames = response.headers['Content-Disposition']
        // 文件名称  截取=后面的文件名称
        // const fileName = fileNames.match(/=(.*)$/)[1]
        let fileName
        if (this.listQuery.type === 'mybatis') {
          fileName = 'mybatis-code.zip'
        } else if(this.listQuery.type === 'dbdoc') {
          fileName = 'database-doc.zip'
        }
        aLink.href = window.URL.createObjectURL(blob)
        aLink.setAttribute('download', fileName)
        document.body.appendChild(aLink)
        aLink.click()
      })
    },
    handleDelete(row, userId) {
      const params = { id: row.id, userId: userId }
      deleteItem(params).then(response => {
        if (response.code === 200) {
          this.getList()
        }
      })
    },
    parseTime,
    paramJson
  }
}
</script>

