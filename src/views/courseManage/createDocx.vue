<template>
  <div>
    <div class="form">
      <el-form ref="form" label-position="left" label-width="120px">
        <el-form-item label="教师姓名">
          <el-input v-model="teacherName" />
        </el-form-item>
        <el-form-item label="课程名">
          <el-input v-model="courseName" />
        </el-form-item>
        <el-form-item label="课程号">
          <el-input v-model="courseCode" />
        </el-form-item>
        <el-form-item label="课程性质">
          <el-input v-model="nature" />
        </el-form-item>
        <el-form-item label="学分">
          <el-input v-model="credit" />
        </el-form-item>
        <el-form-item label="总学时">
          <el-input v-model="totalHours" />
        </el-form-item>
        <el-form-item label="考核方式">
          <el-input v-model="assessment" />
        </el-form-item>
        <el-form-item label="讲授学时">
          <el-input v-model="teachHours" />
        </el-form-item>
        <el-form-item label="实验学时">
          <el-input v-model="experHours" />
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
          <el-input v-model="semeter" />
        </el-form-item>
        <el-form-item label="上课星期">
          <el-input v-model="weekday" />
        </el-form-item>
        <el-form-item label="上课时间">
          <!-- 选择器 -->
          <template>
            <el-select v-model="time" placeholder="请选择">
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
      <el-button @click="handleAdd" type="primary" class="confirm">
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
        :limit="limitUpload"
        accept="application/vnd.openxmlformats-
        officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.xlsx"
        :auto-upload="false">
          <el-button size="small" type="primary">上传成绩册</el-button>
      </el-upload>
      <el-button @click="renderDoc" type="primary" class="confirm">
        确认
      </el-button>
      <el-button @click="handleAdd" type="primary" class="confirm" v-if="isAdd == true">
        添加课程实例
      </el-button>
      <el-button @click="handleEdit" type="primary" class="confirm" v-else-if="isAdd == false">
        编辑课程实例
      </el-button>
    </div>
  </div>
</template>

<script>
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'
import axios from 'axios'

function loadFile (url, callback) {
  PizZipUtils.getBinaryContent(url, callback)
}

export default {
  data () {
    return {
      limitUpload: 1,
      filetemp: '',
      spread: null,
      importExcelFile: null,
      exportFileName: 'export.xlsx',
      password: '',
      isAdd:this.$route.params.isAdd,
      course:this.$route.params.course,
      courseInstance:this.$route.params.courseInstance,
      timeOptions: [{
          value: '8:05 - 9:40', //时间
          label: '第一二节' //课时
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

      teacherName: '',
      courseName:'', // 课程名
      courseCode:'', // 课程号
      nature: '', // 课程性质
      time: '', // 填表日期
      credit: '', // 学分
      totalHours: '', // 总学时
      assessment: '', // 考核方式
      teachHours: '', // 讲授学时
      experHours: '', // 实验学时
      operateHours: '', // 上机学时
      practiceHours: '', // 课程实践学时
      selfStudyHours: '', // 自学学时

      courseInfoId:'',//课程实例id
      year:'', // 学年
      semeter:'', // 学期
      weekday:'', //上课星期
      time:'',  //上课时间
      book:'', //教材
      resource:'', //参考书目

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
  created () {
   
  },
  beforeRouteEnter(to, from, next) {
    //获取上个页面，vm相当于this
    next(vm=>{        
      var that = vm.isAdd
      if(from.name == 'courseInfo'){
        if(that == true){
          vm.addAssign()
          console.log('addSuccess')
          console.log(that)
        }
        else if(that == false){
          vm.addAssign()
          vm.editAssign()
          console.log('editSuccess')
        }
        else{
          console.log('success')
        }
      }
      else{
        console.log('failed')
      }
    })
  },
  methods: {
    renderDoc () {
      loadFile(
        'http://template.moonyoung.top/course-template.docx',
        (error, content) => {
          if (error) {
            throw error
          }
          var zip = new PizZip(content)
          var doc = new Docxtemplater().loadZip(zip)
          doc.setData({
            teacherName: this.teacherName, // 教师姓名
            courseName: this.courseName, // 课程名
            courseCode: this.courseCode, // 课程号
            nature: this.nature, // 课程性质
            time: this.getDate(), // 填表日期
            credit: this.credit, // 学分
            totalHours: this.totalHours, // 总学时
            resource: this.resource, // 参考书目
            assessment: this.assessment, // 考核方式
            teachHours: this.teachHours,
            experHours: this.experHours,
            operateHours: this.operateHours,
            practiceHours: this.practiceHours,
            selfStudyHours: this.selfStudyHours,
            clints: this.clints
          })
          try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render()
          } catch (error) {
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
            if (error.properties && error.properties.errors instanceof Array) {
              const errorMessages = error.properties.errors
                .map(function (error) {
                  return error.properties.explanation
                })
                .join('\n')
              console.log('errorMessages', errorMessages)
              // errorMessages is a humanly readable message looking like this :
              // 'The tag beginning with "foobar" is unopened'
            }
            throw error
          }
          var out = doc.getZip().generate({
            type: 'blob',
            mimeType:
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }) // Output the document using Data-URI
          saveAs(out, 'output.docx')
        }
      )
    },
    getDate () {
      let date = new Date()
      return date.getFullYear().toString() + '.' + (date.getMonth() + 1).toString() + '.' + date.getDate().toString()
    },
    handleAdd () {
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
    //创建课程实例
    async handleAdd(){
      if(this.courseInfoName != '' || this.semeter != '' || this.weekday != '' || this.startTime != '' || this.endTime != '' || this.book != '' || this.resource != ''){
        axios.post('http://api.moonyoung.top/api/admin/courseInstance', 
        {
          year: this.year,
          semeter: this.semeter,
          weekday: this.weekday,
          time: this.time,
          book: this.book,
          resource: this.resource,
          course: 1
        })
        .then( res => {
          this.$message("创建成功")
          console.log(res)
        })
        .catch( err =>{
          this.$message("创建出错")
          console.log(err)
        })
      }
      else{
        this.$message("填入内容不能为空");
      }
    },
    //编辑课程实例，未实现
    async handleEdit(){
      if(this.courseInfoName != '' || this.semeter != '' || this.weekday != '' || this.startTime != '' || this.endTime != '' || this.book != '' || this.resource != ''){
        axios.patch('http://api.moonyoung.top/api/admin/courseInstance/'+this.courseInfoId, 
        {
          year: this.year,
          semeter: this.semeter,
          weekday: this.weekday,
          time: this.time,
          book: this.book,
          resource: this.resource,
          course: 1
        })
        .then( res => {
          this.$message("创建成功")
          console.log(res)
        })
        .catch( err =>{
          this.$message("创建出错")
          console.log(err)
        })
      }
      else{
        this.$message("填入内容不能为空");
      }
    },
    addAssign(){
      this.teacherName = this.$store.getters.info.name;
      this.courseName = this.course.title;
      this.courseCode = this.course.code;
      this.nature = this.course.nature;
      this.credit = this.course.credit;
      this.totalHours = this.course.totalHours;
      this.assessment = this.course.assessment;
    },
    editAssign(){
      this.courseInfoId = this.courseInstance.id;
      this.year = this.courseInstance.year;
      this.semeter = this.courseInstance.semeter;
      this.weekday = this.courseInstance.weekday;
      this.time = this.courseInstance.time;
      this.book = this.courseInstance.book;
      this.resource = this.changeLine(this.courseInstance.resource);
    },
    changeLine:function (str) {
      if(str != null)
        //return str.replace(/\n/g,"<br/>") //把/n替换成<br>
        // split按条件分割字符串
        return (str.split("\r\n")).join(';')
    },
  }
}
</script>

<style scoped>
.confirm {
  margin-top: 20px;
}
</style>
