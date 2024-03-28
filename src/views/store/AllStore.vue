<!--Lab2新增-全部商店界面/主页-->
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {storesInfo} from "../../api/store.ts";


let storeList = ref([]);

storesInfo().then(res => {
  storeList.value = res.data.result
  console.log("here")
  console.log(storeList.value)
})

onMounted(() => {
  storesInfo()
})

</script>


<template>
  <el-main>
    <div v-for="store in storeList">
      {{ store }}
    </div>

  </el-main>

  <el-footer>
    <el-row justify="center">
      <div class="example-pagination-block">
        <el-pagination layout="prev, pager, next" :total="10"/>
      </div>
    </el-row>

  </el-footer>

</template>


<style scoped>

</style>
