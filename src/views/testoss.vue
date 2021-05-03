<template>
  <div>
    <input type="file" ref="input" @input="upload"/>
    <button @click="$refs.input.click()" >确认</button>
    <upload :fileList="file" imageMax="1"></upload>
    <img src="http://moonyoung.oss-cn-shanghai.aliyuncs.com/123.jpg" />
  </div>
</template>

<script>
import axios from 'axios'

import upload from './oss.vue'
// import oss from 'ali-oss'
const oss = require('ali-oss')


export default {
  name: 'testoss',
  components: {
    upload
  },
  data () {
    return {
      file: [],
      client: {}
    }
  },
  async created () {
    let ossKey = (await axios.get('http://localhost:7001/api/admin/account/oss')).data.data
    this.client = oss({
      bucket: 'moonyoung',
      region: 'oss-cn-shanghai',
      accessKeyId: ossKey.accessKeyId,
      accessKeySecret: ossKey.accessKeySecret,
      // secure: false,
      // endpoint: 'oss-cn-shanghai',
      stsToken: ossKey.securityToken
    })
    // this.client.listBuckets().then(res => {
    //   console.log(res)
    // })
  },

  methods: {
    async upload () {
      let blob = this.$refs.input.files[0]
      console.log(blob)// 文件对象到手
      let result = await this.client.put('123.jpg', blob)
      console.log(result)
    }
  }
}
</script>

<style scoped>

</style>
