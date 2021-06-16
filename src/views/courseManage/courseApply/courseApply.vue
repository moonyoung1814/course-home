<template>
  <div>
    <student v-if="role==='student'" />
    <teacher v-if="role==='teacher'"/>
  </div>
</template>

<script>
import axios from 'axios'
import student from './_student.vue'
import teacher from './_teacher.vue'
export default {
  name: 'courseApply',
  data () {
    return {
      courseInstance: [],
      role: this.$store.getters.info.role
    }
  },
  components: {
    student,
    teacher
  },
  created () {
  },
  methods: {
    async getList () {
      await axios.get()
    }
  }
}
</script>

<style>

</style>
