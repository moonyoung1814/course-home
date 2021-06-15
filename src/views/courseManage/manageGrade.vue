<template>
  <div>
    <el-table :data="grade" style="width: 100%" border>
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="student.studentID" label="学号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.student.studentID}} </span>
      </template>
      </el-table-column>
      <el-table-column prop="student.name" label="姓名" width="180">
        <template slot-scope="scope">
        <!-- <el-input v-model="scope.row.student.name">
        </el-input> -->
        <span>{{scope.row.student.name}} </span>
      </template>
      </el-table-column>
      <el-table-column prop="team" label="团队表现" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.team">
        </el-input>
      </template>
      </el-table-column>
      <el-table-column prop="work" label="作品分" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.work">
        </el-input>
      </template>
      </el-table-column>
      <el-table-column prop="replay" label="答辩分" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.replay">
        </el-input>
      </template>
      </el-table-column>
      <el-table-column prop="document" label="文档分" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.document">
        </el-input>
      </template>
      </el-table-column>
      <el-table-column prop="total" label="总评分" width="180">
        <template slot-scope="scope">
        <el-input v-model="scope.row.total">
        </el-input>
      </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button @click="handleExport" type="primary" class="confirm">
        导出表格
      </el-button>
      <el-button @click="handleConfirm" type="primary" class="confirm">
        提交更改
      </el-button>
    </div>
  </div>
</template>

<script>
// import { saveAs } from 'file-saver'
import axios from 'axios'
export default {
  data () {
    return {
      grade: []
    }
  },
  beforeCreate () {
    // console.log(this.$route.query.courseInstance)
    if (!this.$route.query.courseInstance) {
      this.$message('您还未选择课程！')
      this.$router.go(-1)
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleExport () {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../vendor/Export2Excel')
        const tHeader = ['学号', '姓名', '团队表现', '作品', '答辩', '文档', '总评']
        const filterVal = ['id', 'name', 'team', 'work', 'replay', 'document', 'total']
        const list = this.grade
        const data = this.formatJson(filterVal, list)
        console.log(data)
        export_json_to_excel(tHeader, data, '学生成绩册')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async getData () {
      this.grade = (await axios.get('admin/grade', {params: {courseInstance: this.$route.query.courseInstance}})).data.data
      console.log(this.grade)
    },
    async handleConfirm () {
      try {
        let res = await axios.post('admin/grade/update', this.grade)
        console.log(res)
        this.$message('成功！')
      } catch (err) {
        console.log(err)
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
