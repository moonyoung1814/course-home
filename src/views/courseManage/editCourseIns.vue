<template>
  <div>
    <div class="form">
      <el-form ref="form" label-position="left" label-width="120px">
        <el-form-item label="教师姓名">
          <el-input v-model="teacherName" />
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input v-model="courseName" />
        </el-form-item>
        <el-form-item label="课程代码">
          <el-input v-model="courseCode" />
        </el-form-item>
        <el-form-item label="课程类别">
          <el-input v-model="category" />
        </el-form-item>
        <el-form-item label="课程性质">
          <el-input v-model="nature" />
        </el-form-item>
        <el-form-item label="模块">
          <el-input v-model="nature" />
        </el-form-item>
        <el-form-item label="学分">
          <el-input v-model="credit" />
        </el-form-item>
        <el-form-item label="开课学期">
          <el-input v-model="semester" />
        </el-form-item>
        <el-form-item label="考核方式">
          <el-input v-model="assessment" />
        </el-form-item>
        <el-form-item label="起始周">
          <el-input v-model="week" />
        </el-form-item>
        <el-form-item label="总学时">
          <el-input v-model="totalHours" />
        </el-form-item>
        <el-form-item label="实验学时">
          <el-input v-model="experiHours" />
        </el-form-item>
        <el-form-item label="讲授学时">
          <el-input v-model="teachHours" />
        </el-form-item>
        <el-form-item label="上机学时">
          <el-input v-model="operateHours" />
        </el-form-item>
        <el-form-item label="课程实践学时">
          <el-input v-model="practiceHours" />
        </el-form-item>
        <el-form-item label="自学学时">
          <el-input v-model="selfStudyHours" />
        </el-form-item>
        <el-form-item label="学年">
          <el-input v-model="year" />
        </el-form-item>
        <el-form-item label="学期">
          <!-- 年份选择器 -->
          <el-radio v-model="semeter" :label="1">第一学期</el-radio>
          <el-radio v-model="semeter" :label="2">第二学期</el-radio>
        </el-form-item>
        <el-form-item label="上课星期">
          <!-- 上课星期选择器 -->
          <template>
            <el-select v-model="weekday" placeholder="请选择上课星期">
              <el-option
                v-for="item in weekdayOptions"
                :key="item.value"
                :value="item.value">
                <span>{{ item.value }}</span>
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="上课时间">
          <!-- 上课时间选择器 -->
          <template>
            <el-select v-model="schooltime" placeholder="请选择上课时间">
              <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.label">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="教材">
          <el-input type="textarea" autosize v-model="book" />
        </el-form-item>
        <el-form-item label="参考书目">
          <el-input type="textarea" autosize v-model="resource" />
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-button @click="handleAdd" type="primary" class="confirm" v-if="isAdd == true">
        添加课程实例
      </el-button>
      <el-button @click="handleEdit" type="primary" class="confirm" v-else-if="isAdd == false">
        提交修改
      </el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'


export default {
  data () {
    return {
      limitUpload: 1,
      filetemp: '',
      spread: null,
      importExcelFile: null,
      exportFileName: 'export.xlsx',
      password: '',
      isAdd: this.$route.params.isAdd,
      course: this.$route.params.course,
      courseInstance: this.$route.params.courseInstance,
      timeOptions: [{
        value: '8:05 - 9:40', // 时间
        label: '第一二节' // 课时
      }, {
        value: '10:00 - 11:35',
        label: '第三四节'
      }, {
        value: '13:30 - 15:05',
        label: '第六七节'
      }, {
        value: '15:15 - 16:50',
        label: '第八九节'
      }, {
        value: '18:30 - 20:05',
        label: '第十十一节'
      }],
      weekdayOptions: [{
        value: '周一'
      }, {
        value: '周二'
      }, {
        value: '周三'
      }, {
        value: '周四'
      }, {
        value: '周五'
      }],

      // 课程
      teacherName: '',
      courseName: '', // 课程名
      courseCode: '', // 课程代码
      category: '', // 课程类别
      nature: '', // 课程性质
      module: '', // 模块
      credit: '', // 学分
      totalHours: '', // 总学时
      experiHours: '', // 实验学时
      semester: '', // 开课学期
      assessment: '', // 考核方式
      week: '', // 起始周

      // 教学文档
      teachHours: '', // 讲授学时
      operateHours: '', // 上机学时
      practiceHours: '', // 课程实践学时
      selfStudyHours: '', // 自学学时
      time: '', // 填表日期

      // 课程实例
      courseInfoId: '', // 课程实例id
      year: '', // 学年
      semeter: '', // 学期
      weekday: '', // 上课星期
      schooltime: '', // 上课时间
      book: '', // 教材
      resource: '', // 参考书目

      clints: []
    }
  },
  created () {
    if (this.$route.params.isAdd === undefined) {
      this.$message('您还未选择要编辑的实例！')
      this.$router.go(-1)
    } else if (this.$route.params.isAdd === true) {
      this.addAssign()
    } else {
      this.addAssign()
      this.editAssign()
    }
  },
  methods: {
    getDate () {
      let date = new Date()
      return date.getFullYear().toString() + '.' + (date.getMonth() + 1).toString() + '.' + date.getDate().toString()
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
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
          // outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
          // 此处可对数据进行处理
          // let arr = [];
          // outdata.map(v => {
          //     let obj = {}
          //     obj.code = v['Code']
          //     obj.name = v['Name']
          //     obj.pro = v['province']
          //     obj.cit = v['city']
          //     obj.dis = v['district']
          //     arr.push(obj)
          // });
          // _this.da=arr;
          // _this.dalen=arr.length;
          // return arr
        }
        reader.readAsArrayBuffer(f)
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    // 创建课程实例
    async handleAdd () {
      axios.post('http://api.moonyoung.top/api/admin/courseInstance',
        {
          year: this.year,
          semeter: this.semeter,
          weekday: this.weekday,
          time: this.schooltime,
          book: this.book,
          resource: this.resource,
          teachHours: this.teachHours,
          experiHours: this.experiHours,
          operateHours: this.operateHours,
          practiceHours: this.practiceHours,
          selfStudyHours: this.selfStudyHours,
          course: this.course.id
        })
        .then(res => {
          this.$message('创建实例成功')
          console.log(res)
          this.$router.go(-1)
        })
        .catch(err => {
          this.$message('创建实例出错')
          console.log(err)
        })
    },
    // 编辑课程实例
    async handleEdit () {
      axios.patch('http://api.moonyoung.top/api/admin/courseInstance/' + this.courseInfoId,
        {
          year: this.year,
          semeter: this.semeter,
          weekday: this.weekday,
          time: this.schooltime,
          book: this.book,
          resource: this.resource,
          teachHours: this.teachHours,
          experiHours: this.experiHours,
          operateHours: this.operateHours,
          practiceHours: this.practiceHours,
          selfStudyHours: this.selfStudyHours
        })
        .then(res => {
          this.$message('编辑实例成功')
          console.log(res)
          this.$router.go(-1)
        })
        .catch(err => {
          this.$message('编辑实例出错')
          console.log(err)
        })
    },
    // 创建实例时赋值操作
    addAssign () {
      var that = this.course
      this.teacherName = this.$store.getters.info.name
      this.courseName = that.title
      this.courseCode = that.code
      this.category = that.category
      this.module = that.module
      this.nature = that.nature
      this.credit = that.credit
      this.totalHours = that.totalHours
      this.assessment = that.assessment
      this.experiHours = that.experiHours
      this.semester = that.semester
      this.week = that.week
    },
    // 编辑实例时附加赋值操作
    editAssign () {
      var that = this.courseInstance
      this.courseInfoId = that.id
      this.year = that.year
      this.semeter = that.semeter
      this.weekday = that.weekday
      this.experiHours = that.experiHours
      this.teachHours = that.teachHours
      this.operateHours = that.operateHours
      this.practiceHours = that.practiceHours
      this.selfStudyHours = that.selfStudyHours
      this.schooltime = that.time
      this.book = that.book
      this.resource = this.changeLine(that.resource)
    },
    changeLine: function (str) {
      if (str != null) {
        // return str.replace(/\n/g,"<br/>") //把/n替换成<br>
        // split按条件分割字符串
        return (str.split('\r\n')).join(';')
      }
    }
  }
}
</script>

<style scoped>
.confirm {
  margin-top: 20px;
}
</style>
