<template>
  <div>
     <p class=text>创建项目时您将会自动成为该项目的负责人</p>
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
          <upload-image :limit="10" :image-list="form.images" @change="handleChange"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('form')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import uploadImage from '../../components/upload/image'
import axios from 'axios'
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
      rules: {
        name: {required: true, message: '请输入项目名称'},
        detail: {required: true, message: '请输入项目详细介绍'}
      }
    }
  },
  created () {
    axios.options('admin/account')
  },
  methods: {
    handleChange (imageList) {
      this.form.images = imageList
    },
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('admin/project', this.form).then(res => {
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
.text {
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
