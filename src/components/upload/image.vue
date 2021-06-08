<template>
  <div>
    <el-upload
      v-loading="loading"
      element-loading-text="上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      action=""
      ref="upload"
      :http-request="httpRequest"
      accept="image/*"
      list-type="picture-card"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="limit"
      :show-file-list="!loading"
      :on-success="handleSuccess">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import axios from 'axios'
import getSuffix from '../../utils/getSuffix'
const oss = require('ali-oss')

export default {
  props: {
    limit: Number,
    imageList: {
      type: Array,
      ruquired: false
    }
  },
  name: 'uploadImage',
  data () {
    return {
      clint: {},
      fileList: [],
      loading: false
    }
  },
  created () {
    if (this.imageList) {
      this.imageList.forEach(val => {
        let image = {}
        image.name = val
        image.url = val
        this.fileList.push(image)
      })
    }
    // 初始化oss
    let ossKey = this.$store.state.oss
    console.log(ossKey)
    this.client = oss({
      bucket: 'moonyoung',
      region: 'oss-cn-shanghai',
      accessKeyId: ossKey.accessKeyId,
      accessKeySecret: ossKey.accessKeySecret,
      stsToken: ossKey.securityToken,
      refreshSTSToken: async () => {
        let newOss = (await axios.get('admin/account/oss')).data.data
        await this.$store.dispatch('setOss', newOss)
        return {
          accessKeyId: newOss.accessKeyId,
          accessKeySecret: newOss.accessKeySecret,
          stsToken: newOss.securityToken
        }
      }
    })
  },
  computed: {
    list () {
      return this.fileList.map(val => {
        return val.url
      })
    }
  },
  methods: {
    handleRemove (file, fileList) {
      this.fileList = fileList
      this.$emit('change', this.list)
    },
    async httpRequest (param) {
      console.log(this.$store.state)
      this.loading = true
      let suffix = getSuffix(param.file.name)
      let fileName = param.file.uid + suffix
      let res = await this.client.put(fileName, param.file)
      param.file.urll = res.url
      this.fileList.push({name: res.rul, url: res.url})
      this.loading = false
      this.$emit('change', this.list)
    },
    handleSuccess (response, file, fileList) {
      console.log(fileList)
    }
  }
}
</script>

<style>

</style>
