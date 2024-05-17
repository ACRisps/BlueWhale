<script setup lang="ts">
import {onMounted, ref} from "vue";
import {payCouponsInfo, payDisplayInfo} from "../api/coupon.ts";
import {ElTable} from "element-plus";
import {getOrderItems} from "../api/orderContainer.ts";
import {calculateBest, calculatePrice, PayDisplayInfo, PayInfo, ProductsPassInfo} from "../api/pay.ts";
import {uploadOrderItem00} from "../api/orderItem.ts";
import {CircleCheckFilled, CirclePlus, Remove, Goods} from "@element-plus/icons-vue";

defineExpose({openDialog, getData});
const emit = defineEmits(['payment-finish']);

const payBasicInfo = ref<PayInfo>({stores: [], couponId: 0});
const payDetailedInfo = ref<PayDisplayInfo>();

const activeNames = ref([0]);


let showDialog = ref();


const paySuccess = ref(false);

// const setCurrent = (row?: any) => {
//   tableRef.value!.setCurrentRow(row);
// };

function refreshInfo() {
  payDisplayInfo(payBasicInfo.value).then(res => {
    payDetailedInfo.value = res.data.result;
    console.log("这是后端返回的：");
    console.log(payDetailedInfo.value);
  });
}

const handleRowSelect = (row: any) => {
  if (row == null) {
    return;
  }
  if (row.selected) {
    return;
  }

  console.log("这是选中的行：");
  console.log(row);

  if (row.storeId == 0) {
    payBasicInfo.value.couponId = row.id;
  } else {
    let storeIdx = searchStoreId(payBasicInfo.value, row.storeId);
    if (storeIdx != -1) {
      payBasicInfo.value.stores[storeIdx].couponId = row.id;
    } else {
      console.log("search error");
    }
  }

  console.log("这是传给后端的：");
  console.log(payBasicInfo.value);
  refreshInfo();
};

function openDialog() {
  showDialog.value = true;
}

// function handleCancel() {
//   if (!paySuccess.value) {
//     ElMessage({
//       message: "支付取消，可稍后支付",
//       type: 'warning',
//       center: true,
//     });
//   }
//   paySuccess.value = false;
//   {
//     activeNames.value = ['0'];
//     currentRow.value = null;
//   }
// };

// function handlePay() {
//   window.open(`http://localhost:8080/api/pay/payMultiOrder?multiOrderId=`
//       + orderId.value + '&couponIdsString=' + (currentRow.value ? [currentRow.value.id] : []).toString(), "_blank");
// }

// function loadPayCoupons() {
//   payCouponsInfo(orderId.value).then(res => {
//     couponData.value = res.data.result;
//     badgeCnt.value = couponData.value.length;
//   });
// }

function getData(payProducts: ProductsPassInfo) {
  payBasicInfo.value = {stores: [], couponId: 0};// ?
  for (let payProduct of payProducts.products) {
    let storeId = payProduct.storeId;
    let productId = payProduct.productId;
    let num = payProduct.num;
    let idx = searchStoreId(payBasicInfo.value, storeId);
    if (idx < 0) {
      // 没找到
      payBasicInfo.value.stores.push({storeId: storeId, products: [], couponId: 0});
      idx = searchStoreId(payBasicInfo.value, storeId);
    }
    // 找到了
    payBasicInfo.value.stores[idx].products.push({productId: productId, num: num});
  }

  console.log(payBasicInfo.value);

  refreshInfo();
}

onMounted(() => {
  getData({
    products: [
      {productId: 1, num: 1, storeId: 7},
      {productId: 2, num: 1, storeId: 7},
      {productId: 4, num: 1, storeId: 14}
    ]
  });

});

function searchStoreId(payInfo: PayInfo, storeId: number) {
  for (let a in payInfo.stores) {
    if (payInfo.stores[a].storeId == storeId) {
      // console.log("src: " + storeId + ", find " + a);
      return Number(a);
    }
  }
  // console.log("src: " + storeId + ", find nothing");
  return -1;
}

// function loadCurrentPrice() {
//   if (currentRow.value == null) {
//     calculatePrice(orderId.value, []).then(res => {
//       currentPrice.value = res.data.result;
//     });
//   } else {
//     calculatePrice(orderId.value, [currentRow.value.id]).then(res => {
//       currentPrice.value = res.data.result;
//     });
//   }
// }

// function loadBestPrice() {
//   calculateBest(orderId.value).then(res => {
//     if (res.data.code == '000') {
//       ElMessage({
//         message: "已自动选择最优优惠",
//         type: "success",
//         center: true,
//       });
//       bestCouponId.value = res.data.result;
//       // console.log("best");
//       // console.log(bestCouponId.value);
//       for (let i in couponData.value) {
//         if (couponData.value[i].id == bestCouponId.value.id) {
//         }
//         setCurrent(couponData.value[i]);
//       }
//     }
//
//   });
// }


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


function handleTest() {
  uploadOrderItem00(payBasicInfo.value);

}

function handleTest2() {
  payDisplayInfo(payBasicInfo.value);

}

function calculateShowClear(storeId: number) {
  if (storeId == 0) {
    return payBasicInfo.value.couponId != 0;
  }
  let storeIdx = searchStoreId(payBasicInfo.value, storeId);
  if (storeIdx < 0) {
    return false;
  }
  return payBasicInfo.value.stores[storeIdx].couponId != 0;
}


function handleCouponSelectClear(storeId: number) {
  if (storeId == 0) {
    payBasicInfo.value.couponId = 0;
    refreshInfo();
    return;
  }
  let storeIdx = searchStoreId(payBasicInfo.value, storeId);
  if (storeIdx < 0) {
    return;
  }
  payBasicInfo.value.stores[storeIdx].couponId = 0;
  refreshInfo();
}

const tableRowClassName = ({row}: { row: any }) => {
  if (row.selected) {
    return 'success-row';
  }
  return '';
};

</script>

<template>


  <el-dialog
      v-model="showDialog"
      title="支付订单"
      width=60%
      @close=""
      :close-on-click-modal="false"
      top="10vh"
  >
    <el-row justify="center">
      <el-col style="text-align: center">
        <div class="price">
          <el-text v-if="payDetailedInfo?.totalBefore!=payDetailedInfo?.totalAfter" size="small">
            原价：{{ payDetailedInfo?.totalBefore }}
          </el-text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价格：
          <el-text size="large">{{ payDetailedInfo?.totalAfter }}</el-text>&nbsp;￥
        </div>
      </el-col>
    </el-row>
    <el-row>

    </el-row>
    <el-scrollbar height="500px">
      <el-divider>
        <el-text class="div-text">商品明细</el-text>
      </el-divider>
      <el-row justify="center">
        <el-collapse v-model="activeNames" style="width: 90%">
          <el-collapse-item v-for="(item,index) in payDetailedInfo?.stores" :name="index">
            <template #title>
              <el-icon size="16" style="margin-right: 6px;margin-left: 5px; color: goldenrod">
                <Goods/>
              </el-icon>
              <el-text style="">{{ item.storeName }}</el-text>
            </template>
            <el-row v-for="product in item.products">
              <el-col :span="1"></el-col>
              <el-col :span="17">
                <el-text>
                  {{ product.productName }}&nbsp;*{{ product.productNum }}
                </el-text>
              </el-col>
              <el-col :span="5" style="text-align: right">
                <el-text v-if="product.before==product.after">
                  {{ product.after }}￥
                </el-text>
                <el-text v-else>
                  <el-text tag="del" size="small" style="margin-right: 3px">{{ product.before }}￥</el-text>
                  {{ product.after }}￥
                </el-text>
              </el-col>
              <el-col :span="1"></el-col>

            </el-row>

            <el-row justify="center">
              <el-table :data="item.coupons" style="width: 80%" :cell-style="{'text-align':'center'}"
                        :header-cell-style="{'text-align':'center',height:'50px'}"
                        empty-text="无可用优惠"
                        @row-click="row=>handleRowSelect(row)" :row-class-name="tableRowClassName"
                        max-height="250">
                <el-table-column prop="couponType" label="优惠类型" :formatter="couponTypeFormatter"/>
                <el-table-column prop="expiredTime" label="截止日期"/>
                <el-table-column label="折扣明细" :formatter="couponContentFormatter"/>
                <el-table-column label="状态">
                  <template #default="scope">
                    <el-text v-if="scope.row.effective==2" style="color: forestgreen">√可使用</el-text>
                    <el-text v-if="scope.row.effective==1" style="color: deepskyblue">+未生效</el-text>
                    <el-text v-if="scope.row.effective==0" style="color: indianred">×已过期</el-text>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template #header>
                    <el-button v-if="calculateShowClear(item.storeId)" size="small" type="danger"
                               @click="handleCouponSelectClear(item.storeId)" plain>
                      <el-icon>
                        <Remove/>
                      </el-icon>
                    </el-button>
                  </template>
                  <template #default="scope">
                    <el-icon v-if="scope.row.selected" style="" :size="20">
                      <CircleCheckFilled/>
                    </el-icon>

                    <el-icon v-else style="" :size="20">
                      <CirclePlus/>
                    </el-icon>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>

          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row>
        <el-divider>
          <el-text class="div-text">全局优惠</el-text>
        </el-divider>
      </el-row>
      <el-row justify="center">
        <el-table :data="payDetailedInfo?.coupons" style="width: 72%" :cell-style="{'text-align':'center'}"
                  :header-cell-style="{'text-align':'center',height:'50px'}"
                  empty-text="无可用优惠" :row-class-name="tableRowClassName"
                  @row-click="row=>handleRowSelect(row)" max-height="250">
          <el-table-column prop="couponType" label="优惠类型" :formatter="couponTypeFormatter"/>
          <el-table-column prop="expiredTime" label="截止日期"/>
          <el-table-column label="折扣明细" :formatter="couponContentFormatter"/>
          <el-table-column label="状态">
            <template #default="scope">
              <el-text v-if="scope.row.effective==2" style="color: forestgreen">√可使用</el-text>
              <el-text v-if="scope.row.effective==1" style="color: deepskyblue">+未生效</el-text>
              <el-text v-if="scope.row.effective==0" style="color: indianred">×已过期</el-text>
            </template>
          </el-table-column>
          <el-table-column label="">
            <template #header>
              <el-button v-if="calculateShowClear(0)" size="small" type="danger"
                         @click="handleCouponSelectClear(0)" plain>
                <el-icon>
                  <Remove/>
                </el-icon>
              </el-button>
            </template>
            <template #default="scope">
              <el-icon v-if="scope.row.selected" style="" :size="20">
                <CircleCheckFilled/>
              </el-icon>

              <el-icon v-else style="" :size="20">
                <CirclePlus/>
              </el-icon>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <div style="height: 30px"></div>
      </el-row>
    </el-scrollbar>


    <template #footer>
      <div class="dialog-footer" style="margin-top: 10px">
        <el-button type="primary" @click="">付款</el-button>
        <el-button @click="handleTest">取消</el-button>
        <el-button @click="handleTest2">suan'jia'ge</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.price {
  margin-top: 10px;
  margin-bottom: 20px;
}

.div-text {
  color: #409eff;
}
</style>

<style>
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>