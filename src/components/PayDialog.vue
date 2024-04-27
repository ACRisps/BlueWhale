<script setup lang="ts">
import {ref} from "vue";

defineExpose({openDialog})
const emit = defineEmits(['payment-finish']);

let showDialog = ref();

function openDialog(){
  showDialog.value = true;
}

function handleCancel() {
  showDialog.value = false;
}

function handlePay(){
  emit('payment-finish')
}

</script>

<template>
  <el-dialog
      v-model="showDialog"
      title="支付订单"
      width=60%
  >
    <!--    <el-row justify="center">-->
    <!--      <el-switch v-model="useDelivery" active-text="快递送达" inactive-text="到店自提"-->
    <!--                 style="&#45;&#45;el-switch-off-color: #13ce66"/>-->
    <!--    </el-row>-->
    <!--    <br>-->
    <!--    <el-row justify="center">-->
    <!--      <el-input-number v-model="buyNum" :min="1" :max="100" size="small"/>-->
    <!--    </el-row>-->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handlePay">付款</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>