<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {ArrowRight, Goods,} from "@element-plus/icons-vue";
import "../../style/base.css";
import ConfirmDialog from "../../components/pay/PayConfirmDialog.vue";

import {getShoppingCart} from "../../api/shopping-cart.ts";
import {router} from "../../router";
import {ProductsPassInfo} from "../../api/pay.ts";

const cartItems = ref([] as any);
const checked = ref([] as number[]);


onMounted(() => {
  getShoppingCart().then(res => {
    console.log(res.data.result);
    cartItems.value = res.data.result;
    for (let item of cartItems.value) {
      numArray.value.products.push({productId: item.productId, num: 1, storeId: item.storeId});
    }
  });
});


const numArray = ref<ProductsPassInfo>({products: []});


const resArray = computed(() => {
  let array: ProductsPassInfo = {products: []};
  for (let temp of numArray.value.products) {
    if (checked.value.includes(temp.productId)) {
      array.products.push(temp);
    }
  }
  return array;
});


function getNumArrayIdx(id: number) {
  for (let i in numArray.value.products) {
    if (numArray.value.products[i].productId == id) {
      return Number(i);
    }
  }
  return -1;
}

function handleChange() {
  console.log(resArray.value);
}
</script>

<template>

  <el-main class="main">
    <el-row justify="center">
      <div class="customer-title">在这里查看您的购物车</div>
    </el-row>
    <el-row justify="center">

    </el-row>
    <div v-for="item in cartItems">
      <el-row justify="center">
        <el-card style="width: 800px" class="card" shadow="never">
          <template #header>
            <el-row>
              <el-col :span="2" style="text-align: center">
                <el-checkbox-group v-model="checked" @change="handleChange">
                  <el-checkbox label="" :value="item.productId" size="large">
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
              <el-col :span="20">
                <el-text size="large" style="display: flex;margin-top: 7px">
                  {{ item.productName }}
                </el-text>
              </el-col>
              <el-col :span="2" style="text-align: center">
                <el-text size="large" style="display: flex;margin-top: 7px">
                  {{ item.price }}￥
                </el-text>
              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="2"></el-col>
            <el-col :span="6">
              <el-image style="width: 100px; height: 100px;border-radius: 6px" :src="item.imgURLs[0]" :fit="'cover'"/>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-link @click="router.push(`/storeDetail/${item.storeId}`)">
                  <el-text line-clamp="1">
                    <el-icon>
                      <Goods></Goods>
                    </el-icon>
                    {{ item.storeName }}&nbsp;
                  </el-text>
                  <el-text>
                    <el-icon>
                      <ArrowRight/>
                    </el-icon>
                  </el-text>
                </el-link>
              </el-row>
              <div style="height: 20px"></div>
              <el-row>
                <!--                <el-text>剩余库存：{{item.number}}</el-text>-->
              </el-row>

              <el-row>


              </el-row>
              <el-row>

              </el-row>
            </el-col>
            <el-col :span="4">
              <el-row>
                <el-input-number v-model="numArray.products[getNumArrayIdx(item.productId)].num" :min="1" :max="99"
                                 size="small"
                                 @change="handleChange"/>
              </el-row>

            </el-col>
          </el-row>
        </el-card>

      </el-row>
    </div>
    <el-row justify="center">


    </el-row>
  </el-main>


  <ConfirmDialog ref="confirmDialog" @complete=""></ConfirmDialog>
  <transition name="el-fade-in-linear">
    <el-card class="float-card" shadow="never" v-if="checked.length>0">
      <el-row>
        <el-text>原价：99999&nbsp;￥</el-text>
      </el-row>
      <el-row>
        <el-text size="large">现价：00000!&nbsp;￥</el-text>
      </el-row>
      <div style="height: 175px"></div>
      <el-row justify="center">
        <el-button type="primary" color="#f78989" style="color: white">点我去支付</el-button>
      </el-row>
      <el-row>
      </el-row>
      <el-row></el-row>

    </el-card>
  </transition>


</template>


<style scoped>
.main {
  position: absolute;
  right: 0;
  left: 0;
  top: 52px;
  bottom: 0;
  overflow-y: scroll;
}

.card {
  margin: 5px;
}

.float-card {
  position: fixed;
  right: 100px;
  bottom: 100px;
  height: 300px;
  width: 200px;
  border-radius: 6px
}


</style>
