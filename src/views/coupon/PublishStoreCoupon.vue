<script setup lang="ts">
import {ref} from 'vue';

import {uploadCouponInfo} from "../../api/coupon.ts";

const storeId = sessionStorage.getItem('userStoreId');


let couponType = ref('FULL_REDUCTION');
let time = ref('');
let effectiveTime = ref();
let expiredTime = ref();
let number = ref();
let full = ref();
let reduction = ref();


// 清空缓存
function clearCache() {
  couponType.value = '';
  expiredTime.value = '';
  number.value = '';
  reduction.value = null;
}

function handlePublish() {
  parseTime();
  handleCouponInfo();
}

function handleCouponInfo() {
  uploadCouponInfo({
    couponType: couponType.value,
    createTime: time.value,
    expiredTime: expiredTime.value,
    full: full.value,
    reduction: reduction.value,
    storeId: Number(storeId),
  }).then(res => {
    if (res.data.code == '000') {
      clearCache();
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

function parseTime() {
  effectiveTime.value = time.value[0];
  expiredTime.value = time.value[1];
}

</script>


<template>
  <el-main>
    <el-row justify="center">
      <div class="title">您可以在这里为您的商店发布优惠券</div>
    </el-row>
    <el-row justify="center">
      <el-form style="width: 540px">
        <el-form-item label="优惠类型">
          <el-select id="identity"
                     v-model="couponType"
                     style="width: 100%;"
          >
            <el-option value="FULL_REDUCTION" label="满减券"/>
            <el-option value="SPECIAL" label="蓝鲸券"/>
          </el-select>
        </el-form-item>

        <el-form-item label="起止日期">
          <el-date-picker
              v-model="time"
              type="daterange"
              range-separator="To"
              start-placeholder="生效日期"
              end-placeholder="截至日期"
          />
        </el-form-item>

        <el-form-item label="消费达到" v-if="couponType=='FULL_REDUCTION'">
          <el-input v-model="full" class="input" placeholder="满多少 （单位：元）"
                    type="number"/>
        </el-form-item>
        <el-form-item label="折扣金额" v-if="couponType=='FULL_REDUCTION'">
          <el-input v-model="reduction" class="input" placeholder="减多少 （单位：元）"
                    type="number"/>
        </el-form-item>
        <el-row justify="center">
          <el-col :span="3"/>
          <el-col :span="5">
            <el-button type="primary" @click="handlePublish"
            >点击创建
            </el-button>
          </el-col>
        </el-row>
      </el-form>

    </el-row>
  </el-main>
</template>


<style scoped>
.input {
  width: 500px;
}

.title {
  margin-top: 10px;
  margin-bottom: 40px;
  font-size: large;
  color: dodgerblue;
}
</style>
