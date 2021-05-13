<template>
  <div>
    <el-table
    :data="courseInfo"
    height="500"
    border
    style="width: 100%">
    <el-table-column
      prop="course[title]"
      label="课程名称"
      fixed="left"
      width="120">
    </el-table-column>
    <el-table-column
      prop="course[titleEnglish]"
      label="课程英文名称"
      width="170">
    </el-table-column>
    <el-table-column
      prop="course[code]"
      label="课程代码"
      width="100">
    </el-table-column>
    <el-table-column
      prop="course[category]"
      label="课程类别"
      width="120">
    </el-table-column>
    <el-table-column
      prop="course[nature]"
      label="课程性质"
      width="80">
    </el-table-column>
    <el-table-column
      prop="course[module]"
      label="模块"
      width="80">
    </el-table-column>
    <el-table-column
      prop="course[credit]"
      label="学分"
      width="50">
    </el-table-column>
    <el-table-column
      prop="course[totalHours]"
      label="总学时"
      width="70">
    </el-table-column>
    <el-table-column
      prop="course[experiHours]"
      label="实验学时"
      width="80">
    </el-table-column>
    <el-table-column
      prop="course[semester]"
      label="开课学期"
      width="80">
    </el-table-column>
    <el-table-column
      prop="course[assessment]"
      label="考核方式"
      width="80">
    </el-table-column>
    <el-table-column
      prop="course[week]"
      label="起始周"
      width="70">
    </el-table-column>
    <el-table-column
      fixed="right" 
      label="操作"
      width="140">
      <template slot-scope="scope">
        <el-popover
          placement="right"
          width="500"
          trigger="click"
          title="课程实例">
          <div>
            <ol>
              <li>
                课程名：&nbsp;{{scope.row.name}}
              </li>
              <li>
                学期：&nbsp;{{scope.row.semeter}}
              </li>
              <li>
                上课时间（星期）：&nbsp;{{scope.row.weekday}}
              </li>
              <li>
                上课时间（时间）：&nbsp;{{scope.row.startTime}}&nbsp;-&nbsp;{{scope.row.endTime}}
              </li>
              教材：&nbsp;
              <li v-for="(item,index) in changeLine(scope.row.book)" :key="'a'+index">
                {{item}}
              </li>
              参考书目：&nbsp;
              <li v-for="(item,index) in changeLine(scope.row.resource)" :key="'b'+index">
                {{item}}
              </li>
            </ol>
          </div>
          <el-button slot="reference" size="mini">查看</el-button>
        </el-popover>
        <el-button
          size="mini"
          type="danger"
          @click="handleEdit()">添加</el-button>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'courseInfo',
  data(){
    return{
      courseInfo:[],
      course:[],
      dialogVisible:false
    }
  },
  async created(){
    let courseInfo = (await axios.get('http://api.moonyoung.top/api/admin/courseInstance?relations=course')).data.data;
    this.courseInfo = courseInfo;
    console.log(this.courseInfo);
  },
  methods:{
    changeLine:function (str) {
      if(str != null)
        // return str.replace(/\n/g,'<br>') 把/n替换成<br>
        // split按条件分割字符串
        return str.split("\r\n")
    }
  }
}
</script>

<style>

</style>
