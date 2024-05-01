<script setup lang="ts">
import {storeInfoDetail, type StoreInfoDetail} from "../../api/store.ts";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {ArrowLeft} from "@element-plus/icons-vue";
import {storeCouponNumInfo, uploadReceiveCouponsInfo, userStoreCouponsInfo} from "../../api/coupon.ts";
import {progressColors} from "../../utils/style.ts";

const role = sessionStorage.getItem("role");

const storeDetail = ref({} as StoreInfoDetail);
const grade = ref<number>();
const storeId = ref();

const badgeCnt = ref(0);
const showCouponsDialog = ref(false);

const couponData = ref();
const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(5);

function loadStoreDetail(x: number) {
  storeInfoDetail(x).then(res => {
    storeDetail.value = res.data.result;
    grade.value = Number(storeDetail.value.grade);
    storeId.value = res.data.result.storeId;

    loadStoreCoupons(currentPage.value);


  });
}

onMounted(() => {
  const storeId = Number(useRoute().params.storeId);
  loadStoreDetail(storeId);
});

function couponContentFormatter(row: any) {
  if (row.couponType == "FULL_REDUCTION") {
    return "满 " + row.full + " 减 " + row.reduction;
  } else if (row.couponType == "SPECIAL") {
    return "蓝鲸券 标准";
  } else {
    return 'invalid coupon type';
  }
}

function couponTypeFormatter(row: any) {
  if (row.couponType == "FULL_REDUCTION") {
    return "满减券";
  } else if (row.couponType == "SPECIAL") {
    return "蓝鲸券";
  } else {
    return 'invalid coupon type';
  }
}

function receiveCoupon(id: number) {
  uploadReceiveCouponsInfo(id).then(res => {
    if (res.data.code == '000') {
      loadStoreCoupons(currentPage.value);
      ElMessage({
        message: "已领取",
        type: 'success',
        center: true,
      });
    } else {
      ElMessage({
        message: "领取失败（" + res.data.msg + "）",
        type: 'warning',
        center: true,
      });
    }
  });
}

function loadStoreCoupons(page: number) {
  if (role == "CUSTOMER") {
    userStoreCouponsInfo(page - 1, pageSize.value, storeId.value).then(res => {
      couponData.value = res.data.result.content;
      totalItems.value = res.data.result.totalElements;
      getCouponCnt();
    });
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
  loadStoreCoupons(page);
}

function getCouponCnt() {
  storeCouponNumInfo(storeId.value).then(res => {
    badgeCnt.value = res.data.result;
  });
}
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
      <el-row style="height: 20px">
      </el-row>
      <el-row justify="center" v-if="role=='CUSTOMER'">
        <el-badge :value="badgeCnt" type="primary" :show-zero="false">
          <el-button @click="showCouponsDialog= true">本店优惠券</el-button>
        </el-badge>

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


  <el-dialog
      v-model="showCouponsDialog"
      title="本店可领取优惠券"
      width="60%"
  >
    <el-row justify="center">
      <el-table :data="couponData" class="coupon-table" style="width: 90%; min-height: 300px"
                :cell-style="{'text-align':'center'}"
                :header-cell-style="{'text-align':'center'}">
        <el-table-column prop="couponType" label="优惠类型" :formatter="couponTypeFormatter"/>
        <el-table-column prop="effectiveTime" label="生效日期"/>
        <el-table-column prop="expiredTime" label="截止日期"/>
        <el-table-column label="折扣明细" :formatter="couponContentFormatter"/>

        <el-table-column label="领取状态">
          <template #default="scope">
            <el-progress :percentage="scope.row.allCouponNum==0?0:scope.row.currentCouponNum*100/scope.row.allCouponNum"
                         :color="progressColors">
              <el-text>{{ scope.row.currentCouponNum }} / {{ scope.row.allCouponNum }}</el-text>
            </el-progress>

          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template #default="scope">
            <el-text v-if="scope.row.effective==2" style="color: forestgreen">√生效中</el-text>
            <el-text v-if="scope.row.effective==1" style="color: deepskyblue">+未生效</el-text>
            <el-text v-if="scope.row.effective==0" style="color: indianred">×已过期</el-text>
          </template>
        </el-table-column>
        <el-table-column label="">
          <template #default="scope">
            <el-button
                v-if="scope.row.received==false&&scope.row.effective>0&&!scope.row.used&&scope.row.currentCouponNum"
                size="small"
                type="primary"
                @click="receiveCoupon(scope.row.id)">
              领取
            </el-button>
            <el-text v-else-if="scope.row.received==true&&!scope.row.used" style="color: #13ce66" size="large">√
            </el-text>
            <el-text v-else-if="scope.row.used" style="color: lightgray" size="small">已使用</el-text>
            <el-text v-else-if="!scope.row.currentCouponNum" style="color: lightgray" size="small">已领完</el-text>
            <el-text v-else size="small" style="color: lightgray">不可领取</el-text>
          </template>
        </el-table-column>
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

  </el-dialog>
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