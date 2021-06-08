<template>
  <div class="form">
    <el-form label-width="150px" label-position="left" ref="form" :model="form" :rules="rules">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="项目简介">
        <el-input v-model="form.intro"/>
      </el-form-item>
      <el-form-item label="项目仓库地址">
        <el-input v-model="form.url"/>
      </el-form-item>
      <el-form-item label="详细介绍" prop="detail">
        <el-input v-model="form.detail" type="textarea"/>
      </el-form-item>
      <el-form-item label="项目图片">
        <upload-image :limit="10" :key="flag" :image-list="form.images" @change="handleChange"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleEdit('form')">提交修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import uploadImage from '../../components/upload/image'
export default {
  components: {
    uploadImage
  },
  data () {
    return {
      form: {
        name: '',
        intro: '',
        url: '',
        detail: '',
        images: []
      },
      flag: false,
      rules: {
        name: {required: true, message: '请输入项目名称'},
        detail: {required: true, message: '请输入项目详细介绍'}
      }
    }
  },
  created () {
    if (!this.$route.query.id) {
      this.$message('您还未选择要编辑的项目！')
      this.$router.go(-1)
    } else {
      this.getData()
    }
  },
  methods: {
    async getData () {
      try {
        let project = (await axios.get('common/project/' + this.$route.query.id)).data.data
        this.form.name = project.name
        this.form.intro = project.intro
        this.form.url = project.url
        this.form.detail = project.detail
        this.form.images = project.images
        this.flag = truel
        console.log(this.form.images)
      } catch (err) {
        this.$router.push('/404')
      }
    },
    handleChange (imageList) {
      this.form.images = imageList
    },
    handleEdit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.patch('admin/project/' + this.$route.query.id, this.form).then(res => {
            this.$message('创建成功！')
            this.$router.push('/index')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>

</style>
