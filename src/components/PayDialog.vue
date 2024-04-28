<script setup lang="ts">
import {onMounted, ref} from "vue";
import {payCouponsInfo} from "../api/coupon.ts";

defineExpose({openDialog});
const emit = defineEmits(['payment-finish']);

const activeNames = ref(['1']);

const couponData = ref();

let showDialog = ref();

function openDialog() {
  showDialog.value = true;
}

function handleCancel() {
  showDialog.value = false;
}

function handlePay() {
  emit('payment-finish');
}


function loadPayCoupons() {
  payCouponsInfo().then(res => {
    couponData.value = res.data.result;
    console.log(couponData.value);
  });
}

onMounted(() => {
  loadPayCoupons();
});

function couponTypeFormatter(row: any) {
  if (row.couponType == "FULL_REDUCTION") {
    return "满减券";
  } else if (row.couponType == "SPECIAL") {
    return "蓝鲸券";
  } else {
    return 'invalid coupon type';
  }
}

function couponContentFormatter(row: any) {
  if (row.couponType == "FULL_REDUCTION") {
    return "满 " + row.full + " 减 " + row.reduction;
  } else if (row.couponType == "SPECIAL") {
    return "蓝鲸券 标准优惠";
  } else {
    return 'invalid coupon type';
  }
}


</script>

<template>
  <el-dialog
      v-model="showDialog"
      title="支付订单"
      width=60%
  >
    <el-row justify="center">100yuan</el-row>
    <el-row justify="center">
      <el-collapse v-model="activeNames" style="width: 90%">
        <el-collapse-item title="优惠券" name="1">
          <el-row justify="center">

            <el-table :data="couponData" style="width: 90%" :cell-style="{'text-align':'center'}"
                      :header-cell-style="{'text-align':'center'}">
              <el-table-column prop="couponType" label="优惠类型" :formatter="couponTypeFormatter"/>
              <el-table-column prop="storeName" label="所属商店"/>
              <el-table-column prop="expiredTime" label="截止日期"/>
              <el-table-column label="折扣明细" :formatter="couponContentFormatter"/>
              <el-table-column label="状态">
                <template #default="scope">
                  <el-text v-if="scope.row.effective==2" style="color: forestgreen">√生效中</el-text>
                  <el-text v-if="scope.row.effective==1" style="color: deepskyblue">+未生效</el-text>
                  <el-text v-if="scope.row.effective==0" style="color: indianred">×已过期</el-text>
                </template>
              </el-table-column>
              <el-table-column type="selection"/>
            </el-table>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-row>

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