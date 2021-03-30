<template>
  <div class="form">
    <el-form ref="form" label-position="left" label-width="120px" >
      <el-form-item label="教师姓名">
        <el-input v-model="teacherName"/>
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
      <el-form-item label="参考书目">
        <el-input v-model="resource" />
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
      <el-form-item>
        <el-button type="primary" @click="renderDoc">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'

function loadFile (url, callback) {
  PizZipUtils.getBinaryContent(url, callback)
}

export default {
  data () {
    return {
      teacherName: '123',
      courseName: '', // 课程名
      courseCode: '', // 课程号
      nature: '', // 课程性质
      time: '', // 填表日期
      credit: '', // 学分
      totalHours: '', // 总学时
      resource: '', // 参考书目
      assessment: '', // 考核方式
      teachHours: '', // 讲授学时
      experHours: '', // 实验学时
      operateHours: '', // 上机学时
      practiceHours: '', // 课程实践学时
      selfStudyHours: '' // 自学学时
    }
  },
  created () { },
  methods: {
    getDate () {
      let date = new Date()
      return (
        date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate()
      )
    },

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
            selfStudyHours: this.selfStudyHours
            // name: '王沐阳'
            // first_name: "John",
            // last_name: "Doe",
            // phone: "0652455478",
            // description: "New Website"
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
    }
  }
}
</script>

<style>
</style>
