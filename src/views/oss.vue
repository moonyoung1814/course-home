<template>
    <div>
        <div>
            <input type="file" id="uploadImage" @change="toUpload" placeholder=""/>
        </div>
        <div>
            <span>{{uploadFilesName}}</span>
        </div>
    </div>
</template>
<script>
// 引入oss
const OSS = require('ali-oss')
export default {
  name: 'upload',
  props: ['fileList', 'imageMax'],
  data () {
    return {
      uploadFilesName: '',
      uploadfile: [],
      maxLength: 1, // 限制上传个数
      id: 'uploadImage'
    }
  },
  methods: {
    toUpload () {
      const urls = []
      // oss 基本配置
      var client = new OSS({
        region: 'oss-cn-shanghai',
        // endpoint: 'oss-cn-shanghai',
        accessKeyId: 'LTAI5tFLYvjjdYAMQTuDv2JH',
        accessKeySecret: 'W6J3MDSAdyynHlzNVAqWJySKAVcDKn',
        bucket: 'moonyoung'
      })
      // 获取文件信息
      const files = document.getElementById(this.id)
      if (files.files) {
        const fileLen = document.getElementById(this.id).files
        const file = document.getElementById(this.id).files[0]
        let consat = file.name

        // 限制上传文件的个数
        const check = this.uploadfile.length < this.maxLength
        if (!check) {
          this.$Notice.warning({
            title: '最多只能上传' + this.maxLength + '张图片。'
          })
          return false
        }
        let name = fileLen[0].name
        for (let i = 0; i < fileLen.length; i++) {
          const file = fileLen[i]
          client.put(name, file).then((res) => {
            this.uploadfile.push({
              url: res.res.requestUrls[0],
              fileUrl: res.res.requestUrls[0],
              name: results.name
            })
            this.$Message.success('上传成功')
          }).catch((err) => {
            console.log(err)
          })
        }
      }
      this.$emit('getUploadData', this.uploadfile)
    }
  },
  created () {
    this.maxLength = this.imageMax
  }
}
</script>
