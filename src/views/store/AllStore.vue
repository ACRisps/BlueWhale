<!--Lab2新增-全部商店界面/主页-->
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {storesInfo, type StoresInfo} from "../../api/store.ts";

const storeList = ref([] as StoresInfo)

function loadStores() {
  storesInfo().then(res => {
    storeList.value = res.data.result;
  })
}

function showMessage() {
  ElMessage({
    message: "施工中",
    type: 'warning',
    center: true,
  })
}

onMounted(() => {
  loadStores()
})

</script>


<template>
  <el-main>
<!--    <el-carousel :interval="5000" type="card" height="300px">-->
<!--      <el-carousel-item v-for="item in 6" :key="item">-->
<!--      </el-carousel-item>-->
<!--    </el-carousel>-->
    <div v-for="store in storeList">
      <el-row justify="center">
        <el-card style="width: 800px" class="card">
          <template #header>
            <el-row>
              <el-col :span="22">
                {{ store.storeName }}
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="showMessage">进店</el-button>
              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="6">
              <el-image style="width: 100px; height: 100px" :src="store.imgURL" :fit="'contain'"/>
            </el-col>
            <el-col :span="16">
            </el-col>
          </el-row>

        </el-card>
      </el-row>
    </div>

  </el-main>

  <el-footer>
    <el-row justify="center">
      <div class="example-pagination-block">
        <el-pagination layout="prev, pager, next" :page-count="1"/>
      </div>
    </el-row>

  </el-footer>

</template>


<style scoped>
.card {
  margin: 5px;
}

/* 走马灯
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(n) {
  background-color: #99a9bf;
}
*/
</style>
