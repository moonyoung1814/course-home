<template>
  <div class="form">
    <el-form ref="form" label-width="80px" >
      <el-form-item label="教师姓名">
        <el-input v-model="teacherName"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
      teachHours: '',
      experHours: '',
      operateHours: '',
      practiceHours: '',
      selfStudyHours: ''
    }
  },
  created () {},
  methods: {}
}
</script>

<style>
</style>
