<!--Lab2新增-商店详情界面-->
<script setup lang="ts">
import {storeInfoDetail, type StoreInfoDetail} from "../../api/store.ts";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {ArrowLeft} from "@element-plus/icons-vue";

const storeDetail = ref({} as StoreInfoDetail);
const grade = ref<number>();

function loadStoreDetail(x: number) {
  storeInfoDetail(x).then(res => {
    storeDetail.value = res.data.result;
    grade.value = Number(storeDetail.value.grade);
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
      <el-row justify="center" class="grade-stars">
        <el-rate
            v-model="grade"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value} points"
        />
      </el-row>
      <el-row justify="center">
        <el-image class="storeImg" :src="storeDetail.imgURL" :fit="'cover'"/>
      </el-row>
      <el-row>
        <el-text class="description">{{ storeDetail.description }}</el-text>
      </el-row>
    </el-aside>

    <el-main class="page-main">
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
              <el-image v-for="URL in product.imgURLs" :src="URL" alt="" class="img" :fit="'cover'"/>
            </el-card>
          </router-link>
        </el-row>

      </div>
    </el-main>
  </el-container>
</template>


<style scoped>
.grade-stars {
  margin-top: 1px;
  margin-bottom: 30px;
}


.page-aside {
  border-right: lightgrey solid 1px;
  position: absolute;
  left: 0;
  top: 51px;
  bottom: 0;
}

.page-main {
  position: absolute;
  left: 25%;
  right: 0;
  top: 52px;
  bottom: 0;
  overflow-y: scroll;
}


.storeTitle {
  color: cornflowerblue;
  font-size: 20px;
  margin-top: 15px;
  margin-bottom: 25px;
  text-align: center;
}

.storeImg {
  margin-left: 20px;
  margin-right: 20px;
  max-height: 360px;
}

.arrow {
  font-size: 25px;
  margin-top: 16px;
  margin-left: 8px;
  margin-bottom: 25px;
}

.description {
  margin: 20px;
}

.card {
  margin: 5px;
  height: 300px;
}

a {
  text-decoration: none;
}

.img {
  height: 200px;
  width: 250px;
  margin: 5px 15px;

}
</style>