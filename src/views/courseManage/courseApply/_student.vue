<template>
  <div>
    <el-table
      :data="courseInstance"
      border
      style="width: 100%">
      <el-table-column
        label="课程名"
        width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.course.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上课时间">
        <template slot-scope="scope">
          <span>{{ scope.row.weekday + '' + scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="教师姓名"
        width="180">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.teacher.name }}</span> -->
          <el-popover
            placement="top-start"
            title="教师详情"
            width="600"
            trigger="hover">
            <div class="detail">
              <el-row :gutter="30">
                <el-col :span="8">
                  <el-image :src="scope.row.teacher.image"/>
                </el-col>
                <el-col :span="16">
                  <h2 class="detail-name">{{scope.row.teacher.name}}</h2>
                  <p class="detail-intro">{{scope.row.teacher.intro}}</p>
                </el-col>
              </el-row>
            </div>
            <span  slot="reference"> <i class="el-icon-view" />  {{scope.row.teacher.name}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="学分"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.course.credit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="year"
        label="开课学年">
      </el-table-column>
      <el-table-column
        prop="semeter"
        label="开课学期">
      </el-table-column>
      <el-table-column
        width="450"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleApply(scope.$index, scope.row)">申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 200px">
      <h2>已经提交的申请 </h2>
      <el-table
        :data="courseApply"
        border
        style="width: 100%; margin-top:25px">
        <el-table-column
          label="课程名">
          <template slot-scope="scope">
            <span>{{ scope.row.course.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="教师">
          <template slot-scope="scope">
            <span>{{ scope.row.teacher.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上课时间">
          <template slot-scope="scope">
            <span>{{ scope.row.weekday + '' + scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="申请状态">
          <template slot-scope="scope">
            <span>{{ scope.row.instanceStudent[0].state}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      courseInstance: [],
      courseApply: []
    }
  },
  beforeCreate () {
    axios.get('admin/account').then(res => {
      if (res.data.data.detail.class) {
        this.$message('您已经选过课程了，无需再次选择')
        this.$router.go(-1)
      }
    })
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      axios.get('common/courseInstance', {params: {relations: 'teacher,course'}}).then(res => {
        this.courseInstance = res.data.data
        console.log(this.courseInstance)
      })
      axios.get('admin/courseInstance', {params: {relations: 'teacher,course'}}).then(res => {
        this.courseApply = res.data.data
        console.log(this.courseApply)
      })
    },
    handleApply (index, row) {
      axios.post('admin/instanceStudent', {courseInstance: row.id}).then(res => {
        this.$message('成功！')
      }).catch(err => {
        console.log(err)
        this.$message('申请失败，您已有该门课程的申请')
      }).finally(() => {
        this.getData()
      })
    }
  }
}
</script>

<style scoped>
.detail{
  height: 300px;
}

.detail-intro{
  margin-top: 30px;
}
</style>
