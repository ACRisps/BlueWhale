// 开发中，暂时搁置

<script setup lang="ts">

import {Clock, Wallet} from "@element-plus/icons-vue";
import {ref} from "vue";
import {orderConfirm} from "../../api/order.ts";

const orderId = ref();

const showConfirm = ref(false);
const showDuringPay = ref(false);

const loading = ref(true);

const confirmInfo = ref({totalAfterCoupon: NaN, products: [] as any[]});

function toPay() {
  showConfirm.value = false;
  window.open(`http://localhost:8080/api/pay/payMultiOrder?multiOrderId=`
      + orderId.value, "_blank");

  showDuringPay.value = true;
}

function getData(id: string) {
  orderId.value = id;
}

function openDialog() {
  showConfirm.value = true;
  orderConfirm(orderId.value).then(res => {
    // console.log(res.data);
    confirmInfo.value = res.data.result;
    loading.value = false;
  });
}

defineExpose({openDialog, getData});


const emit = defineEmits(["complete"]);

function handlePayComplete() {
  showDuringPay.value = false;
  emit("complete");
}

</script>

<template>
  <el-dialog
      v-model="showConfirm"
      title="确认订单"
      width=40%
      :close-on-click-modal="false"
      style="border-radius: 9px;"
  >
    <el-scrollbar style="height: 200px" v-loading="loading">
      <el-row justify="center">
        <el-text style="margin: 10px" size="large">{{ confirmInfo.totalAfterCoupon }}&nbsp;￥</el-text>
      </el-row>
      <el-row justify="center" v-for="product in confirmInfo.products">
        <el-text>{{ product.productName }}&nbsp;*{{product.num}}</el-text>
      </el-row>
    </el-scrollbar>
    <el-row justify="center">
      {{ orderId }}
    </el-row>
    <template #footer>
      <div class="dialog-footer" style="margin-top: 5px">
        <el-button type="primary" @click="toPay" :disabled="loading">付款</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
      v-model="showDuringPay"
      title="等待完成支付"
      width=40%
      :close-on-click-modal="false"
      style="border-radius: 9px;"
  >
    <el-row justify="center">
      <div style="margin-top: 20px;margin-bottom: 30px">
        <el-icon :size="20">
          <Wallet/>
        </el-icon>
        ` ` `
        <el-icon :size="20">
          <Clock/>
        </el-icon>
      </div>

    </el-row>
    <el-row justify="center">
      <el-text style="margin-bottom: 30px">请在外部页面完成支付，支付完成后请点击“我已完成支付”</el-text>
    </el-row>
    <el-row justify="center"></el-row>

    <template #footer>
      <div style="text-align: center">
        <el-button type="primary" @click="handlePayComplete" plain>
          我已完成支付
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>

</style>