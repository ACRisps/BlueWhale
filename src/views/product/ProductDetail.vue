<!--Lab2新增-商品详情界面-->
<script setup lang="ts">

import {onMounted, ref} from "vue";
import {ProductInfo, productInfoDetail} from "../../api/product.ts";
import {useRoute} from "vue-router";
import {ArrowLeft} from "@element-plus/icons-vue";

const productDetail = ref({} as ProductInfo);

function loadProductInfo(x: number) {
  productInfoDetail(x).then(res => {
    productDetail.value = res.data.result;
    console.log(productDetail.value);
  });
}

onMounted(() => {
  const productId = Number(useRoute().params.productId);
  loadProductInfo(productId);
});

</script>


<template>
  <el-container>
    <!--商品详情的一部分内容放在侧边栏里-->
    <el-aside width="25%" class="page-aside">

      <el-row justify="center" align="middle">
        <el-col :span="4">
          <router-link :to="'/storeDetail/'+productDetail.storeId" v-slot="{navigate}">
            <el-icon class="arrow" @click="navigate">
              <ArrowLeft/>
            </el-icon>
          </router-link>
        </el-col>
        <el-col :span="16">
          <div class="productTitle">{{ productDetail.productName }}</div>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>

      <el-row>
        <el-text class="description">{{ productDetail.description }}</el-text>
      </el-row>
      <el-row>
        <el-text class="number">剩余库存：{{ productDetail.number }}件</el-text>
      </el-row>
    </el-aside>

    <el-main>
      <el-row justify="center">
        <el-col :span="24" v-for="url in productDetail.imgURLs" style="text-align: center">
          <el-image :src="url" alt="" :fit="'cover'" class="img"/>
        </el-col>

      </el-row>
    </el-main>
  </el-container>
</template>


<style scoped>
.arrow {
  font-size: 25px;
  margin-top: 5px;
  margin-left: 8px
}

.page-aside {
  border-right: lightgrey solid 1px;
}

.productTitle {
  color: cornflowerblue;
  font-size: 20px;
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;
}

.description {
  margin: 20px;
}

.number{
  margin: 20px;
  color: darksalmon;
}

.img {
  height: 500px;
  width: 600px;
  margin: 20px;
}
</style>
