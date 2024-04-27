<script setup lang="ts">
import {onMounted, ref} from "vue";
import {UserCouponInfo, UserCouponParsedInfo, userCouponsInfo,} from "../../api/coupon.ts";

const couponData = ref([] as UserCouponInfo[]);
const parsedCouponData = ref([] as UserCouponParsedInfo[]);

const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(10);

function loadCoupons(page: number) {
  userCouponsInfo(page - 1).then(res => {
    couponData.value = res.data.result.content;
    totalItems.value = res.data.result.totalElements;
    console.log(couponData.value[0])
    parseCouponData();
  });
}

onMounted(() => {
  loadCoupons(currentPage.value);
});

function handlePageChange(page: number) {
  currentPage.value = page;
  parsedCouponData.value = [];
  loadCoupons(page);
}

function parseCouponData() {
  for (let i in couponData.value) {
    parsedCouponData.value[i] = {
      couponType: parseCouponType(couponData.value[i].couponType) as string,
      effective: couponData.value[i].effective,
      effectiveTime: String(couponData.value[i].effectiveTime),
      expiredTime: String(couponData.value[i].expiredTime),
      full: couponData.value[i].full,
      reduction: couponData.value[i].reduction,
      storeName: couponData.value[i].storeName,
    };
  }
}

function parseCouponType(raw: string) {
  if (raw == "FULL_REDUCTION") {
    return "满减券";
  } else if (raw == "SPECIAL") {
    return "蓝鲸券";
  }
}

</script>

<template>
  <el-main>
    <el-row justify="center">
      <div class="title">在这里查看已领取的优惠券</div>
    </el-row>
    <el-row justify="center">
      <el-table :data="parsedCouponData" class="coupon-table">
        <el-table-column prop="couponType" label="优惠类型"/>
        <el-table-column prop="storeName" label="所属商店"/>
        <el-table-column prop="effectiveTime" label="生效日期"/>
        <el-table-column prop="expiredTime" label="截止日期"/>
      </el-table>


    </el-row>
    <el-row justify="center">
      <div>
        <el-pagination
            layout="prev, pager, next"
            :page-count="Math.ceil(totalItems / pageSize)"
            :current-page="currentPage"
            @current-change="handlePageChange"
        />
      </div>
    </el-row>
  </el-main>


</template>

<style scoped>
.coupon-table {
  width: 50%;
  margin: 20px;
}

.title {
  margin-top: 10px;
  margin-bottom: 40px;
  font-size: large;
  color: cornflowerblue;
}
</style>