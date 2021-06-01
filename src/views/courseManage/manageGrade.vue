<template>
  <div>
    <el-table :data="clints" style="width: 100%" border>
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="id" label="学号" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.id">
        </el-input>
      </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.name">
        </el-input>
      </template>
      </el-table-column>
      <el-table-column prop="a" label="团队表现" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.a">
        </el-input>
      </template>
      </el-table-column>
      <el-table-column prop="b" label="作品" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.b">
        </el-input>
      </template>
      </el-table-column>
      <el-table-column prop="c" label="答辩" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.c">
        </el-input>
      </template>
      </el-table-column>
      <el-table-column prop="d" label="文档" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.d">
        </el-input>
      </template>
      </el-table-column>
      <el-table-column prop="total" label="总评" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.total">
        </el-input>
      </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button @click="handleAddRow" type="primary" class="confirm">
        添加一行
      </el-button>
      <el-button @click="handleDelete" type="primary" class="confirm">
        删除一行
      </el-button>
      <el-button @click="handleExport" type="primary" class="confirm">
        导出表格
      </el-button>
      <el-upload
        class="confirm"
        action=""
        :on-change="handleChange"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :limit="1"
        accept="application/vnd.openxmlformats-
        officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.xlsx"
        :auto-upload="false">
          <el-button size="small" type="primary">上传成绩册</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
// import { saveAs } from 'file-saver'
export default {
  data () {
    return {
      clints: [{
        number: '1',
        id: '',
        name: '',
        a: '',
        b: '',
        c: '',
        d: '',
        total: ''
      }, {
        number: '2',
        id: '',
        name: '',
        a: '',
        b: '',
        c: '',
        d: '',
        total: ''
      }, {
        number: '3',
        id: '',
        name: '',
        a: '',
        b: '',
        c: '',
        d: '',
        total: ''
      }, {
        number: '4',
        id: '',
        name: '',
        a: '',
        b: '',
        c: '',
        d: '',
        total: ''
      }]
    }
  },
  methods: {
    handleAddRow () {
      this.clints.push({
        id: '',
        name: '',
        a: '',
        b: '',
        c: '',
        d: '',
        total: ''
      })
    },
    handleDelete () {
      this.clints.pop()
    },
    handleExport () {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../vendor/Export2Excel')
        const tHeader = ['学号', '姓名', '团队表现', '作品', '答辩', '文档', '总评']
        const filterVal = ['id', 'name', 'a', 'b', 'c', 'd', 'total']
        const list = this.clints
        const data = this.formatJson(filterVal, list)
        console.log(data)
        export_json_to_excel(tHeader, data, '学生成绩册')
      })
    },
    // 上传文件时处理方法
    handleChange (file, fileList) {
      this.fileTemp = file.raw
      if (this.fileTemp) {
        if ((this.fileTemp.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
                    (this.fileTemp.type === 'application/vnd.ms-excel')) {
          this.importfxx(this.fileTemp)
        } else {
          this.$message({
            type: 'warning',
            message: '附件格式错误，请删除后重新上传！'
          })
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请上传附件！'
        })
      }
    },
    // 超出最大上传文件数量时的处理方法
    handleExceed () {
      this.$message({
        type: 'warning',
        message: '超出最大上传文件数量的限制！'
      })
    },
    // 移除文件的操作方法
    handleRemove (file, fileList) {
      this.fileTemp = null
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    importfxx (obj) {
      // let inputDOM = this.$refs.inputer
      // 通过DOM取文件数据
      let that = this

      this.filetemp = event.currentTarget.files[0]

      var rABS = false // 是否将文件读取为二进制字符串
      var f = this.filetemp

      var reader = new FileReader()
      // if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = ''
        var rABS = false // 是否将文件读取为二进制字符串
        var wb // 读取完成的数据
        var outdata
        var reader = new FileReader()
        reader.onload = function (e) {
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // 此处引入，用于解析excel
          var XLSX = require('xlsx')
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              // 手动转化
              type: 'base64'
            })
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            })
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          console.log(outdata)
          that.clints = outdata.map((value, index) => {
            return {
              number: index + 1,
              id: value['学号'],
              name: value['姓名'],
              a: value['团队表现'],
              b: value['作品'],
              c: value['答辩'],
              d: value['文档'],
              total: value['总评']
            }
          })
        }
        reader.readAsArrayBuffer(f)
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
  }
}
</script>

<style scoped>
.confirm {
  margin-top: 20px;
}
</style>
