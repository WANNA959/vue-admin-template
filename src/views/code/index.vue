<template>
  <div class="app-container">
    <el-form class="filter-container" inline>
      <el-row>
        <el-form-item label="创建时间范围">
          <el-date-picker
            v-model="value"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="margin-right: 50px"
            align="right"
          />
        </el-form-item>
        <el-form-item label="更新时间范围">
          <el-date-picker
            v-model="value2"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="主机名" style="">
          <el-input v-model="listQuery.host" placeholder="" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
        </el-form-item>
        <el-form-item label="用户名" style="margin-left: 40px">
          <el-input v-model="listQuery.username" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
        </el-form-item>
        <el-form-item label="数据库名称" style="margin-left: 50px">
          <el-input v-model="listQuery.dbName" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
        </el-form-item>
        <el-form-item label="表名" style="margin-left: 50px">
          <el-input v-model="listQuery.table" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
        </el-form-item>
        <el-button v-waves class="filter-item" type="primary" style="float: right;margin-right: 15px" icon="el-icon-search" @click="getList">
          搜索
        </el-button>
        <el-button type="success" style="float: right;margin-right: 15px" icon="el-icon-download" @click="dialogFormVisible = true">导入数据库</el-button>
      </el-row>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="list"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column align="center" label="Id" width="60">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="数据库名称" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.dbName }}
        </template>
      </el-table-column>
      <el-table-column label="数据库描述" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.dbComment }}
        </template>
      </el-table-column>
      <el-table-column width="300px" align="center" label="数据库表名">
        <template slot-scope="scope">
          <span>
            <el-tag
              v-for="table in paramJson(scope.row.tables)"
              :key="table"
              :closable="scope.row.edit"
              :disable-transitions="false"
              style="margin-left: 5px"
              @close="handleClose(table,scope.row)"
            >
              {{ table }}
            </el-tag>
            <el-input
              v-if="scope.row.edit && scope.row.inputVisible"
              ref="saveTagInput"
              v-model="scope.row.inputValue"
              class="input-new-tag"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
            />
            <el-button v-else-if="scope.row.edit && !scope.row.inputVisible" class="button-new-tag" size="small" @click="showInput(scope.row)">New Table</el-button>
            <!--            <el-tag v-for="table in paramJson(scope.row.tables)" :key="table" style="margin-left: 5px">{{ table }}</el-tag>-->
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="主机名" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.host }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="端口" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="密码" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="520" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!--          @click="handleEdit(row)"-->
          <el-button v-if="row.edit" type="success" size="mini" @click="confirmEdit(row)">
            OK
          </el-button>
          <el-button v-if="!row.edit" size="mini" type="success" @click="row.edit=!row.edit">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button type="primary" size="mini" @click="handleExport(row)">
            全部导出
          </el-button>
          <el-button type="primary" size="mini" @click="handleBatchInsert(row)">
            批量导入
          </el-button>
          <el-button type="primary" size="mini" @click="beforeHandleGenerate(row)">
            生成代码
          </el-button>
          <el-button type="primary" size="mini" @click="handleGenerate2(row)">
            生成文档
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 20px">
      <el-pagination
        background
        :current-page="this.listQuery.pageNum"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="this.total"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="添加新数据库" :visible.sync="dialogFormVisible" align="center">
      <el-form :model="form" :rules="formRules">
        <el-form-item prop="dbName" label="数据库名称" :label-width="formLabelWidth">
          <el-input v-model="form.dbName" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="dbComment" label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.dbComment" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="tables" label="表名" :label-width="formLabelWidth">
          <el-input v-model="form.tables" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="host" label="主机名" :label-width="formLabelWidth">
          <el-input v-model="form.host" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="port" label="端口" :label-width="formLabelWidth">
          <el-input v-model="form.port" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleInsert">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择导入的数据表和数据文件" :visible.sync="dialogFormVisible2" align="center">
      <el-row>
        <el-select v-model="optionValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-upload
          class="upload-demo"
          action="111"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="handleExceed"
          :http-request="httpRequest"
          accept=".csv"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
        </el-upload>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleBatchInsert2">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择生成代码类型" :visible.sync="dialogFormVisible3" align="center" width="60%">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedtype" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in codeType" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="handleGenerate(codeRow,checkedtype)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime, paramJson, dateFormat } from '@/utils/index'
import { deleteDbItem, updateDbItem, fetchDbList, batchInsert, batchExport, generatorMybatis, insertDbItem, generatorDbDoc } from '@/api/code'

export default {
  name: 'Mybatis',
  data() {
    const validateDbName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入数据库名称'))
      } else {
        callback()
      }
    }
    const validateDbComment = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入描述'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入数据库用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入数据库密码'))
      } else {
        callback()
      }
    }
    const validateHost = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入数据库主机名'))
      } else {
        callback()
      }
    }
    const validatePort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入数据库端口'))
      } else {
        callback()
      }
    }
    const validateTables = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入数据库下的表名'))
      } else {
        callback()
      }
    }
    const typeOptions = ['model.java', 'dao.java', 'service.java', 'serviceImpl.java', 'controller.java', 'mapper.xml']
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
      value: [],
      value2: [],
      fileList: [],
      options: [],
      optionId: '',
      optionValue: '',
      optionFile: null,
      list: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        host: '',
        port: '',
        username: '',
        dbName: '',
        table: '',
        type: this.type,
        beginTime: '',
        endTime: '',
        beginTime2: '',
        endTime2: ''
      },
      loading: false,
      total: 0,
      filename: '',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      codeRow: [],
      checkAll: false,
      checkedtype: ['model.java', 'mapper.xml'],
      codeType: typeOptions,
      isIndeterminate: true,
      form: {
        dbName: '',
        dbComment: '',
        tables: '',
        host: '',
        port: '',
        username: '',
        password: ''
      },
      formRules: {
        dbName: [{ required: true, trigger: 'blur', validator: validateDbName }],
        dbComment: [{ required: true, trigger: 'blur', validator: validateDbComment }],
        tables: [{ required: true, trigger: 'blur', validator: validateTables }],
        host: [{ required: true, trigger: 'blur', validator: validateHost }],
        port: [{ required: true, trigger: 'blur', validator: validatePort }],
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    // 默认创建最近7天
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    this.value = [start, end]
    this.beginTime = start
    this.endTime = end
    // 默认更新最近30天
    const end2 = new Date()
    const start2 = new Date()
    start2.setTime(start2.getTime() - 3600 * 1000 * 24 * 30)
    this.value2 = [start2, end2]
    this.beginTime2 = start2
    this.endTime2 = end2
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      console.log('in getlist')
      this.loading = true
      this.$emit('create') // for test
      this.listQuery.beginTime = dateFormat('YYYY-mm-dd HH:MM:SS"', this.value[0])
      this.listQuery.endTime = dateFormat('YYYY-mm-dd HH:MM:SS"', this.value[1])
      this.listQuery.beginTime2 = dateFormat('YYYY-mm-dd HH:MM:SS"', this.value2[0])
      this.listQuery.endTime2 = dateFormat('YYYY-mm-dd HH:MM:SS"', this.value2[1])
      console.log(this.listQuery)
      fetchDbList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.list = this.list.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          this.$set(v, 'inputVisible', false) // https://vuejs.org/v2/guide/reactivity.html
          this.$set(v, 'inputValue', '') // https://vuejs.org/v2/guide/reactivity.html
          return v
        })
        this.loading = false
      })
    },
    handleCurrentChange(pageNum) {
      this.listQuery.pageNum = pageNum
      fetchDbList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    handleEdit(row) {
      const params = { id: row.id, dbName: row.dbName, dbComment: row.dbComment, tables: row.tables, host: row.host, username: row.username, password: row.password }
      updateDbItem(params).then(response => {
        if (response.code === 200) {
          this.getList()
        }
      })
    },
    handleDelete(row) {
      const params = { id: row.id }
      deleteDbItem(params).then(response => {
        if (response.code === 200) {
          this.getList()
        }
      })
    },
    handleExport(row) {
      const params = { id: row.id }
      batchExport(params).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.$message({
            message: '导出成功，请于db数据导出记录中下载',
            type: 'success'
          })
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    },
    handleBatchInsert(row) {
      this.dialogFormVisible2 = true
      const list = paramJson(row.tables)
      this.options = []
      this.optionId = ''
      this.optionValue = ''
      this.fileList = []
      for (var i = 0; i < list.length; i++) {
        var table = list[i]
        var tmp = { value: table, label: table }
        this.options.push(tmp)
      }
      this.optionId = row.id
    },
    httpRequest(item) {
      this.optionFile = item.file
    },
    handleBatchInsert2() {
      const params = new FormData()
      params.append('id', this.optionId)
      params.append('table', this.optionValue)
      params.append('file', this.optionFile)
      // const params = { id: this.optionId, table: this.optionValue, file: this.optionFile }
      batchInsert(params).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.$message({
            message: response.message,
            type: 'success'
          })
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove() {
      // this.fileList = []
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，若上传新文件，请先删除已上传文件`)
    },
    handleCheckAllChange(val) {
      this.checkedtype = val ? this.codeType : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.codeType.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.codeType.length
    },
    beforeHandleGenerate(data) {
      this.codeRow = data
      this.dialogFormVisible3 = true
    },
    handleGenerate(row, type) {
      // const tableList = paramJson(row.tables)
      // console.log(tableList)
      this.dialogFormVisible3 = false
      // const params = { id: row.id, username: row.username, password: row.password, host: row.host, port: row.port, database: row.dbName, tables: row.tables, codeType: JSON.stringify(type) }
      const params = { id: row.id, codeType: JSON.stringify(type) }
      generatorMybatis(params).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.$message({
            message: '导出成功，请于Mybatis代码导出记录中下载',
            type: 'success'
          })
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    },
    handleGenerate2(row) {
      // const params = { id: row.id, username: row.username, password: row.password, host: row.host, port: row.port, database: row.dbName }
      const params = { id: row.id }
      generatorDbDoc(params).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '导出成功，请于数据库文档导出记录中下载',
            type: 'success'
          })
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    },
    confirmEdit(row) {
      row.edit = false
      const params = { id: row.id, tables: row.tables }
      updateDbItem(params).then(response => {
        if (response.code === 200) {
          this.getList()
          this.$message({
            message: 'The tables has been edited',
            type: 'success'
          })
        }
      })
    },
    handleClose(table, row) {
      const list = paramJson(row.tables)
      list.splice(list.indexOf(table), 1)
      const s = JSON.stringify(list)
      row.tables = s
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(row) {
      const inputValue = row.inputValue
      const list = paramJson(row.tables)
      if (inputValue) {
        list.push(inputValue)
      }
      row.tables = JSON.stringify(list)
      row.inputVisible = false
      row.inputValue = ''
    },
    handleInsert() {
      insertDbItem(this.form).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.dialogFormVisible = false
          this.$message({
            message: '导入数据库信息成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.dialogFormVisible = true
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    },
    parseTime,
    paramJson
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 12.5px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
