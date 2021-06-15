<template>
  <div class="container">
    <el-table
      border
      :data="courseInstances">
        <el-table-column
          type="index"
          width="60">
        </el-table-column>
        <el-table-column
          prop="course"
          label="课程名"
          width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.course.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="year"
          label="学年">
        </el-table-column>
        <el-table-column
          prop="semeter"
          label="学期">
        </el-table-column>
        <el-table-column
          prop="weekday"
          label="上课日期">
        </el-table-column>
        <el-table-column
          prop="time"
          label="上课时间">
        </el-table-column>
        <el-table-column
          prop="gradeState"
          label="成绩状态">
        </el-table-column>
        <el-table-column
          width="450"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-role-btn="['teacher']"
              @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>
            <el-button
              size="mini"
              type="primary"
              v-role-btn="['teacher']"
              v-show="scope.row.gradeState === '可修改'"
              @click="handleEditGrade(scope.$index, scope.row)">编辑成绩
            </el-button>
            <el-button
              size="mini"
              type="success"
              v-role-btn="['teacher']"
              v-show="scope.row.gradeState === '无成绩'"
              @click="handleNewGrade(scope.$index, scope.row)">生成成绩
            </el-button>
            <el-button
              size="mini"
              type="primary"
              v-role-btn="['teacher']"
              @click="handleCreateDocx(scope.$index, scope.row)">生成教学文档
            </el-button>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
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
      courseInstances: []
    }
  },
  created () {
    this.getData().then(() => {
      console.log(this.courseInstances)
    })
  },
  methods: {
    async getData () {
      this.courseInstances = (await axios.get('admin/courseInstance/', {params: {relations: 'course'}})).data.data
    },
    handleEdit (index, row) {
      this.$router.push({name: 'editCourseIns', params: {isAdd: false, courseInstance: row, course: row.course}})
    },
    handleCreateDocx (index, row) {
      loadFile(
        'http://template.moonyoung.top/course-template.docx',
        async (error, content) => {
          if (error) {
            throw error
          }
          let courseInstance = (await axios.get('admin/courseInstance', {params: {id: row.id, relations: 'grade'}})).data.data[0]
          var zip = new PizZip(content)
          var doc = new Docxtemplater().loadZip(zip)
          doc.setData({
            teacherName: this.$store.getters.info.name, // 教师姓名
            courseName: row.course.title, // 课程名
            courseCode: row.course.code, // 课程号
            nature: row.course.nature, // 课程性质
            time: this.getDate(), // 填表日期
            credit: row.course.credit, // 学分
            resource: courseInstance.resource, // 参考书目
            assessment: row.course.assessment, // 考核方式
            totalHours: row.course.totalHours, // 总学时
            teachHours: courseInstance.teachHours, // 教学学时
            experiHours: courseInstance.experiHours, // 实验学时
            operateHours: courseInstance.operateHours,
            practiceHours: courseInstance.practiceHours,
            selfStudyHours: courseInstance.selfStudyHours,
            clints: courseInstance.grade
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
    handleEditGrade (index, row) {
      this.$router.push({path: '/courseManage/manageGrade', query: {courseInstance: row.id}})
    },
    async handleNewGrade (index, row) {
      try {
        await axios.post('admin/grade/new', {courseInstance: row.id})
      } catch (err) {
        console.log(err)
        return
      }
      this.$router.push({path: '/courseManage/manageGrade', query: {courseInstance: row.id}})
    }
  }
}
</script>

<style>

</style>
