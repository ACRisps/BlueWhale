<!--Lab2新增-商品详情界面-->
<script setup lang="ts">

import {onMounted, ref} from "vue";
import {ProductInfo, productInfoDetail, uploadProductNumUpdate} from "../../api/product.ts";
import {useRoute} from "vue-router";
import {ArrowLeft} from "@element-plus/icons-vue";

const productDetail = ref({} as ProductInfo);

const role = sessionStorage.getItem("role");
const storeId = (Number)(sessionStorage.getItem('userStoreId'));

let newNumber = ref();
let showNumUpdateInput = ref(false);

// 加载；同时给newNumber初始化
function loadProductInfo(x: number) {
  productInfoDetail(x).then(res => {
    productDetail.value = res.data.result;
    newNumber.value = productDetail.value.number;
  });
}

onMounted(() => {
  const productId = Number(useRoute().params.productId);
  loadProductInfo(productId);
});

function handleDialogCancel() {
  showNumUpdateInput.value = false;
}

function handleDialogConfirm() {
  uploadProductNumUpdate({
    productId: productDetail.value.productId,
    number: newNumber.value
  }).then(res => {
    if (res.data.code == '000') {
      showNumUpdateInput.value = false;
      ElMessage({
        message: "已提交，请勿重复提交",
        type: 'success',
        center: true,
      });
    } else {
      ElMessage({
        message: "提交失败（" + res.data.msg + "）",
        type: 'warning',
        center: true,
      });
    }
  });
}

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
        <el-col :span="16">
          <el-text class="number">剩余库存：{{ productDetail.number }}件</el-text>
        </el-col>
        <el-col :span="8" v-if="role==='STAFF'&&storeId===productDetail.storeId">
          <el-button type="primary" size="small" @click="showNumUpdateInput=true">修改库存数
          </el-button>
          <el-dialog
              v-model="showNumUpdateInput"
              title="修改商品库存数"
              width="500"
          >
            <el-input v-model="newNumber" class="input"
                      type="textarea" :rows="1" resize="none"/>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="handleDialogCancel">取消</el-button>
                <el-button type="primary" @click="handleDialogConfirm">
                  确认更改
                </el-button>
              </div>
            </template>
          </el-dialog>
        </el-col>

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

.number {
  margin: 20px;
  color: darksalmon;
}

.img {
  height: 500px;
  width: 600px;
  margin: 20px;
}
</style>
