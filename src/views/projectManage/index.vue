<template>
  <div class="container">
    <el-button type="primary" class="new" @click="handleNew">创建新项目</el-button>
    <el-table
      v-loading="loading"
      :data="list"
      style="width:100%">
        <el-table-column type="index" width="50"/>
      <el-table-column prop="name" label="项目名称" width="180"/>
      <el-table-column prop="intro" label="项目简介"/>
      <el-table-column prop="url" label="项目仓库地址" width="180"/>
      <el-table-column label="担任职务">
        <template slot-scope="scope" width="100">
          <span>{{ scope.row.projectStudent[0].isManager? '组长' : '组员' }}</span>
      </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleShow(scope.$index, scope.row)">查看详情
          </el-button>
          <el-button
            v-show="scope.row.projectStudent[0].isManager"
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      loading: false,
      list: []
    }
  },
  async created () {
    this.loading = true
    await this.getList()
    this.loading = false
  },
  methods: {
    async getList () {
      this.list = (await axios.get('admin/project')).data.data
      console.log(this.list)
    },
    handleEdit (index, row) {
      console.log(index)
      console.log(row)
      this.$router.push({path: '/projectManage/edit', query: {id: row.id}})
    },
    handleShow (index, row) {
      return true
    },
    handleNew () {
      this.$router.push('/projectManage/new')
    }
  }
}
</script>

<style scoped>
.new {
  margin-bottom: 20px;
}
</style>
