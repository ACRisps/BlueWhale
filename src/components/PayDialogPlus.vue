<script setup lang="ts">
import {onMounted, ref} from "vue";
import {payCouponsInfo} from "../api/coupon.ts";
import {CirclePlus, CircleCheckFilled, Remove} from "@element-plus/icons-vue";
import {ElTable} from "element-plus";
import {getOrderItems} from "../api/orderContainer.ts";
import {calculateBest, calculatePrice, PayInfo, ProductPayInfo, ProductsPassInfo} from "../api/pay.ts";
import {searchProduct} from "../api/product.ts";
import {storeInfoDetail} from "../api/store.ts";
import {uploadOrderItem00} from "../api/orderItem.ts";

defineExpose({openDialog, getData});
const emit = defineEmits(['payment-finish']);

const payBasicInfo = ref<PayInfo>();

const activeNames = ref(['']);
const badgeCnt = ref(0);

const couponData = ref([] as any);

let showDialog = ref();

const orderId = ref();
const orderDetail = ref();
const oriPrice = ref<number>();
const currentPrice = ref<number>();

const bestCouponId = ref();

const paySuccess = ref(false);

const tableRef = ref<InstanceType<typeof ElTable>>();
const currentRow = ref(null as any);
const setCurrent = (row?: any) => {
  tableRef.value!.setCurrentRow(row);
};

const handleCurrentChange = (val: any) => {
  currentRow.value = val;
  loadCurrentPrice();
};

function openDialog() {
  showDialog.value = true;
}

function handleCancel() {
  if (!paySuccess.value) {
    ElMessage({
      message: "支付取消，可稍后支付",
      type: 'warning',
      center: true,
    });
  }
  paySuccess.value = false;
  {
    activeNames.value = ['0'];
    currentRow.value = null;
  }
}

function handlePay() {
  window.open(`http://localhost:8080/api/pay/payMultiOrder?multiOrderId=`
      + orderId.value + '&couponIdsString=' + (currentRow.value ? [currentRow.value.id] : []).toString(), "_blank");
}

function loadPayCoupons() {
  payCouponsInfo(orderId.value).then(res => {
    couponData.value = res.data.result;
    badgeCnt.value = couponData.value.length;
  });
}

function getData(payProducts: ProductsPassInfo) {
  payBasicInfo.value = {stores: [], couponId: 0};
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
  for (let store of payBasicInfo.value.stores) {
    loadStoreName(store.storeId);
  }
  console.log(payBasicInfo.value);
  // loadOrderDetail();
  // loadOriginalPrice();
  // loadCurrentPrice();
  // loadPayCoupons();
  // loadBestPrice();
}

onMounted(() => {

  getData({
    products: [
      {productId: 2, num: 1, storeId: 7},
      {productId: 2, num: 1, storeId: 7},
      {productId: 3, num: 1, storeId: 7}
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

function loadOrderDetail() {
  getOrderItems(orderId.value).then(res => {
    orderDetail.value = res.data.result;
  });
}

function loadOriginalPrice() {
  calculatePrice(orderId.value, []).then(res => {
    oriPrice.value = res.data.result;
  });
}

function loadCurrentPrice() {
  if (currentRow.value == null) {
    calculatePrice(orderId.value, []).then(res => {
      currentPrice.value = res.data.result;
    });
  } else {
    calculatePrice(orderId.value, [currentRow.value.id]).then(res => {
      currentPrice.value = res.data.result;
    });
  }
}

function loadBestPrice() {
  calculateBest(orderId.value).then(res => {
    if (res.data.code == '000') {
      ElMessage({
        message: "已自动选择最优优惠",
        type: "success",
        center: true,
      });
      bestCouponId.value = res.data.result;
      // console.log("best");
      // console.log(bestCouponId.value);
      for (let i in couponData.value) {
        if (couponData.value[i].id == bestCouponId.value.id) {
        }
        setCurrent(couponData.value[i]);
      }
    }

  });
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

function couponContentFormatter(row: any) {
  if (row.couponType == "FULL_REDUCTION") {
    return "满 " + row.full + " 减 " + row.reduction;
  } else if (row.couponType == "SPECIAL") {
    return "蓝鲸券 标准优惠";
  } else {
    return 'invalid coupon type';
  }
}

const storeNameData = ['bobo cafe', 'logitech旗舰店', 'apple中国'];
const boboCafeItem = ['bobo至臻卡布奇诺 *1', '豹2A5 *1', '大师抽象画 *5'];

activeNames.value = [storeNameData[0]];

const storeNames = ref<Map<number, string>>(new Map());

function loadStoreName(id: number) {
  storeInfoDetail(id).then(res => {
    console.log(res.data);
    storeNames.value.set(id, res.data.result.storeName);

    console.log(storeNames.value);
  });

}

function handleTest() {
  if (payBasicInfo.value != undefined) {
    uploadOrderItem00(payBasicInfo.value);
  }

}

</script>

<template>
  <el-dialog
      v-model="showDialog"
      title="支付订单"
      width=60%
      @close="handleCancel"
      :close-on-click-modal="false"
      top="10vh"
  >
    <el-row justify="center">
      <el-col style="text-align: center">
        <div class="price">
          <el-text v-if="currentRow" size="small">原价：{{ oriPrice }}</el-text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价格：
          <el-text size="large">{{ currentPrice }}</el-text>&nbsp;￥
        </div>
      </el-col>
    </el-row>
    <div style="max-height: 500px; overflow-y: scroll;">
      <el-row justify="center">
        <el-collapse v-model="activeNames" style="width: 90%">
          <el-collapse-item v-for="store in payBasicInfo?.stores" :title="storeNames?.get(store.storeId)">
            <el-row v-for="item in store.products">
              <el-text> {{ item }}</el-text>
            </el-row>

            <el-row justify="center">
              <div style="height: 100px;width: 90%;background-color: dodgerblue;text-align: center;margin: 10px;">
                优惠选择优惠选择优惠选择优惠选择优惠选择优惠选择优惠选择优惠选择优惠选择优惠选择优惠选择优惠选择
              </div>
            </el-row>

          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row justify="center">
        <div style="height: 100px;width: 90%;background-color: indianred;text-align: center;margin: 10px;">
          全局优惠选择全局优惠选择全局优惠选择全局优惠选择全局优惠选择全局优惠选择全局优惠选择全局优惠选择
        </div>
      </el-row>
    </div>


    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handlePay">付款</el-button>
        <el-button @click="handleTest">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.price {
  margin-top: 10px;
  margin-bottom: 20px;
}
</style>