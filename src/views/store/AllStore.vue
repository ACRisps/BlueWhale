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

onMounted(() => {
  loadStores()
})

</script>


<template>
  <el-main>
    <div v-for="store in storeList">
      <el-row justify="center">
        <el-card style="width: 800px" class="card">
          <template #header>
            <el-row>
              <el-col :span="22">
                {{ store.storeName }}
              </el-col>
              <el-col :span="2">
                <router-link :to="'/storeDetail/'+store.storeId" v-slot="{navigate}" class="no-link">
                  <el-button type="primary" @click="navigate">进店</el-button>
                </router-link>

              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="6">
              <el-image style="width: 100px; height: 100px" :src="store.imgURL" :fit="'cover'"/>
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

</style>
