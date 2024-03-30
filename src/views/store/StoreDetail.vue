<!--Lab2新增-商店详情界面-->
<script setup lang="ts">
import {storeInfoDetail, type StoreInfoDetail} from "../../api/store.ts";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {ArrowLeft} from "@element-plus/icons-vue";

const storeDetail = ref({} as StoreInfoDetail);

function loadStoreDetail(x: number) {
  storeInfoDetail(x).then(res => {
    storeDetail.value = res.data.result;
  });
}

onMounted(() => {
  const storeId = Number(useRoute().params.storeId);
  loadStoreDetail(storeId);
});
</script>


<template>
  <el-container>
    <!--商店详情的一部分内容放在侧边栏里-->
    <el-aside width="25%" class="page-aside">
      <el-row justify="center" align="middle">
        <el-col :span="4">
          <router-link :to="'/allStore'" v-slot="{navigate}">
            <el-icon class="arrow" @click="navigate">
              <ArrowLeft/>
            </el-icon>
          </router-link>
        </el-col>
        <el-col :span="16">
          <div class="storeTitle">{{ storeDetail.storeName }}</div>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
      <el-row justify="center">
        <el-image class="storeImg" :src="storeDetail.imgURL" :fit="'fill'"/>
      </el-row>
      <el-row>
        <el-text class="description">{{ storeDetail.description }}</el-text>
      </el-row>
    </el-aside>

    <el-main>
      <div>{{ storeDetail.products }}</div>
      <div v-for="product in storeDetail.products">

        <el-row justify="center">
          <router-link :to="'/productDetail/'+product.productId" v-slot="{navigate}">
            <el-card style="width: 600px" class="card" @click="navigate">
              <template #header>
                <el-row>
                  <el-col :span="20">
                    {{ product.productName }}
                  </el-col>
                </el-row>
              </template>

              <div v-for="URL in product.imgURLs">
                <el-image :src="URL" alt=""/>
              </div>
            </el-card>
          </router-link>
        </el-row>

      </div>
    </el-main>
  </el-container>
</template>


<style scoped>
.page-aside {
  border-right: lightgrey solid 1px;
}

.storeTitle {
  color: cornflowerblue;
  font-size: 20px;
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;
}

.storeImg {
  margin-left: 20px;
  margin-right: 20px;
  max-height: 400px;
}

.arrow {
  font-size: 25px;
  margin-top: 5px;
  margin-left: 8px
}

.description {
  margin: 20px;
}

.card {
  margin: 5px;
}

a {
  text-decoration: none;
}
</style>