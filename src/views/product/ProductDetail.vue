<!--Lab2新增-商品详情界面-->
<script setup lang="ts">

import {onMounted, ref} from "vue";
import {ProductInfo, productInfoDetail} from "../../api/product.ts";
import {useRoute} from "vue-router";

const productDetail = ref({} as ProductInfo);

function loadProductInfo(x: number) {
  productInfoDetail(x).then(res => {
    productDetail.value = res.data.result;
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

    </el-aside>

    <el-main>

    </el-main>
  </el-container>
</template>


<style scoped>
.page-aside {
  border-right: lightgrey solid 1px;
}
</style>
