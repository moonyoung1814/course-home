<template>
  <div>
    <el-table
    :data="course"
    height="300"
    border
    style="width: 100%">
    <el-table-column
      prop="title"
      label="课程名称"
      fixed="left"
      width="120">
    </el-table-column>
    <el-table-column
      prop="titleEnglish"
      label="课程英文名称"
      width="170">
    </el-table-column>
    <el-table-column
      prop="code"
      label="课程代码"
      width="100">
    </el-table-column>
    <el-table-column
      prop="category"
      label="课程类别"
      width="120">
    </el-table-column>
    <el-table-column
      prop="nature"
      label="课程性质"
      width="80">
    </el-table-column>
    <el-table-column
      prop="module"
      label="模块"
      width="80">
    </el-table-column>
    <el-table-column
      prop="credit"
      label="学分"
      width="50">
    </el-table-column>
    <el-table-column
      prop="totalHours"
      label="总学时"
      width="70">
    </el-table-column>
    <el-table-column
      prop="experiHours"
      label="实验学时"
      width="80">
    </el-table-column>
    <el-table-column
      prop="semester"
      label="开课学期"
      width="80">
    </el-table-column>
    <el-table-column
      prop="assessment"
      label="考核方式"
      width="80">
    </el-table-column>
    <el-table-column
      prop="week"
      label="起始周"
      width="70">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="140">
      <template slot-scope="cScope">
        <el-popover
          placement="right"
          width="950"
          trigger="click"
          title="课程实例">
          <el-table :data="cScope.row.courseInstance" max-height="400" >
            <el-table-column width="100" property="name" label="课程名"></el-table-column>
            <el-table-column width="80" property="year" label="学年"></el-table-column>
            <el-table-column width="80" property="semeter" label="学期"></el-table-column>
            <el-table-column width="100" property="weekday" label="上课星期"></el-table-column>
            <el-table-column width="120" property="time" label="上课时间"></el-table-column>
            <el-table-column width="160" property="book" label="教材"></el-table-column>
            <el-table-column width="200" property="resource" label="参考书目"></el-table-column>
            <el-table-column width="80" label="操作">
              <template slot-scope="ciScope">
                <router-link :to="{name:'editCourseIns', params:{course:cScope.row,courseInstance:ciScope.row,isAdd:false}}">
                  <el-button size="mini" type="primary">编辑</el-button>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <el-button slot="reference" size="mini">查看</el-button>
        </el-popover>
        <router-link :to="{name:'editCourseIns', params:{course:cScope.row,isAdd:true}}">
          <el-button size="mini" type="danger">添加</el-button>
        </router-link>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'courseInfo',
  data () {
    return {
      courseInfo: [],
      course: [],
      dialogVisible: false
    }
  },
  async created () {
    let course = (await axios.get('http://api.moonyoung.top/api/admin/course?relations=courseInstance')).data.data
    this.course = course
    console.log(this.course)
  },
  methods: {
    changeLine: function (str) {
      if (str != null) {
      // return str.replace(/\n/g,'<br>') 把/n替换成<br>
      // split按条件分割字符串
        return str.split('\r\n')
      }
    },
    handleAdd: function () {
      this.$router.push({name: 'createDocx'})
    }
  }
}
</script>

<style>
.flex-row{
  display: flex;
  flex-direction: row;
}
</style>
