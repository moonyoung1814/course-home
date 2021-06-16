<template>
  <div>
    教师
    <el-table :data="course" style="width: 100%">
      <el-table-column
        type="index"
        width="150">
      </el-table-column>
      <el-table-column
        label="申请序号"
        width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop=""
        label="申请序号">
      </el-table-column>
      <el-table-column
        prop="student"
        label="学生姓名">
      </el-table-column>
      <el-table-column
        prop="coursename"
        label="课程名">
      </el-table-column>
      <el-table-column
        prop="coursetime"
        label="上课时间">
      </el-table-column>
      <el-table-column
        prop="state"
        label="申请状态">
      </el-table-column> -->
      <el-table-column
        label="学生姓名"
        width="200">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.teacher.name }}</span> -->
          <el-popover
            placement="top-start"
            title="学生详情"
            width="500"
            trigger="hover">
            <div>
              <p style="margin-top:10px">{{ "学号："+scope.row.student.studentID}}</p>
              <p style="margin-top:10px">{{ "班级号："+scope.row.student.classID}}</p>
              <p style="margin-top:10px">{{ "学生简介："+scope.row.student.intro}}</p>
              <p style="margin-top:10px">{{ "项目数："+scope.row.student.project_num}}</p>
            </div>
            <span  slot="reference"> <i class="el-icon-view" />  {{scope.row.student.name}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="课程名"
        width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.courseInstance.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上课时间"
        width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.courseInstance.weekday+scope.row.courseInstance.time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="申请状态"
        width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="400"
        label="操作">
        <template slot-scope="scope">
          <el-button 
            size="mini"
            type="success"
            @click="getclass(scope.$index, scope.row)"> 
            同意
          </el-button>
          <el-button 
            size="mini"
            type="danger"
            @click="decline(scope.$index, scope.row)"
            > 
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%">
    <span>请选择该同学加入的班级</span>
    <el-select v-model="classes.id" placeholder="请选择">
      <el-option
        v-for="item in classes"
        :key="item.id"
        :label="item.id"
        :value="item.id">
      </el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="agree(classes.id,requestid)">确 定</el-button>
    </span>
  </el-dialog>  
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data (){
    return{
      requestid: null,
      course: null,
      classes: [],
      dialogVisible: false
    }
  },
  async created () {
    this.getDate()
  },
  methods: {
    async getDate () {
      this.course = (await axios.get('http://api.moonyoung.top/api/admin/instanceStudent?state=待确认')).data.data
      console.log(this.course)
    },
    async getclass(index,row){
      this.dialogVisible = true
      this.requestid = row.id
      this.classes = (await axios.get('http://api.moonyoung.top/api/admin/class')).data.data
      console.log(this.classes)
    },
    async decline(index,row){
      let id = row.id
      let res = (await axios.post('http://api.moonyoung.top/api/admin/instanceStudent/'+id+'/refuse')).data.data
      console.log(res)
      this.getDate()
    },
    async agree(classid,id){
      console.log(classid)
      console.log(id)
      this.dialogVisible = false
      let res = (await axios.post('http://api.moonyoung.top/api/admin/instanceStudent/'+id+'/pass', {classid: classid})).data.data
      this.getDate()
    }
  }
}
</script>

<style>

</style>
