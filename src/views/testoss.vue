<template>
  <div>
    <upload-image :limit="5" :image-list="imageList" @change="handleChange"/>
  </div>
</template>

<script>
import axios from 'axios'
import uploadImage from '../components/upload/image'
// const oss = require('ali-oss')


export default {
  name: 'testoss',
  components: {
    uploadImage
  },
  data () {
    return {
      // imageList: [
      //   {
      //     name: 'https://moonyoung.oss-cn-shanghai.aliyuncs.com/1622393790081.png',
      //     url: 'https://moonyoung.oss-cn-shanghai.aliyuncs.com/1622393790081.png'
      //   }
      // ],
      imageList: [
        'https://moonyoung.oss-cn-shanghai.aliyuncs.com/1622393790081.png'
      ]
    }
  },
  async created () {
    await axios.options('admin/account')
    if (!this.$store.state.oss) {
      let oss = (await axios.get('admin/account/oss')).data.data
      await this.$store.dispatch('setOss', oss)
    }
  },

  methods: {
    async upload () {
      let blob = this.$refs.input.files[0]
      console.log(blob)// 文件对象到手
      let result = await this.client.put('123.jpg', blob)
      console.log(result)
    },
    handleChange (fileList) {
      this.imageList = fileList
    }
  }
}
</script>

<style scoped>

</style>
