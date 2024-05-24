<script setup lang="ts">
import {onMounted, ref} from "vue";
import {payCouponsInfo} from "../../api/coupon.ts";
import {CirclePlus, CircleCheckFilled, Remove} from "@element-plus/icons-vue";
import {ElTable} from "element-plus";
import {getOrderItems} from "../../api/orderContainer.ts";
import {calculateBest, calculatePrice} from "../../api/pay.ts";

defineExpose({openDialog, getData});
const emit = defineEmits(['payment-finish']);

const activeNames = ref(['0']);
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
  // console.log(currentRow.value);
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
  // uploadPay(orderId.value, currentRow.value ? [currentRow.value.id] : []).then((res) => {
  //   if (res.data.code == '000') {
  //     ElMessage({
  //       message: "购买成功",
  //       type: "success",
  //       center: true,
  //     });
  //     paySuccess.value = true;
  //     showDialog.value = false;
  //     emit('payment-finish');
  //   } else {
  //     ElMessage({
  //       message: "支付失败（" + res.data.msg + "）",
  //       type: 'warning',
  //       center: true,
  //     });
  //   }
  // });
  window.open(`http://localhost:8080/api/pay/payMultiOrder?multiOrderId=`
      + orderId.value + '&couponIdsString=' + (currentRow.value ? [currentRow.value.id] : []).toString(), "_blank");

}

function loadPayCoupons() {
  payCouponsInfo(orderId.value).then(res => {
    couponData.value = res.data.result;
    badgeCnt.value = couponData.value.length;
  });
}

function getData(orderContainerId: number) {
  orderId.value = orderContainerId;
  loadOrderDetail();
  loadOriginalPrice();
  loadCurrentPrice();
  loadPayCoupons();
  loadBestPrice();
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

onMounted(() => {
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
      @close="handleCancel"
      :close-on-click-modal="false"
  >
    <el-row justify="center">
      <el-col style="text-align: center">
        <div class="price">
          <el-text v-if="currentRow" size="small">原价：{{ oriPrice }}</el-text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价格：
          <el-text size="large">{{ currentPrice }}</el-text>&nbsp;￥
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2"></el-col>
      <el-col :span="6">

      </el-col>

    </el-row>
    <el-row justify="center">

      <el-collapse v-model="activeNames" style="width: 90%">
        <el-collapse-item name="0" title="订单明细">
          <div v-for="item in orderDetail">
            <el-text> {{ item.productName }}&nbsp;*{{ item.productNumber }}</el-text>
          </div>
        </el-collapse-item>
        <el-collapse-item name="1">
          <template #title>
            优惠券
            <el-badge :value="badgeCnt" type="primary" :show-zero="false"></el-badge>
          </template>
          <el-row justify="center">

            <el-table :data="couponData" style="width: 90%" :cell-style="{'text-align':'center'}"
                      :header-cell-style="{'text-align':'center',height:'50px'}" @selection-change=""
                      highlight-current-row @current-change="handleCurrentChange" ref="tableRef" max-height="250">
              <el-table-column prop="couponType" label="优惠类型" :formatter="couponTypeFormatter"/>
              <el-table-column prop="storeName" label="所属商店"/>
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
                  <el-button v-if="currentRow" size="small" type="danger" @click="setCurrent()" plain>
                    <el-icon>
                      <Remove/>
                    </el-icon>
                  </el-button>
                </template>
                <template #default="scope">
                  <el-icon v-if="scope.row==currentRow" style="" :size="20">
                    <CircleCheckFilled/>
                  </el-icon>

                  <el-icon v-else style="" :size="20">
                    <CirclePlus/>
                  </el-icon>
                </template>
              </el-table-column>
              <!--              <el-table-column type="selection"/>-->
            </el-table>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-row>
    <!--    <div style="flex-grow: 1;"/>-->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handlePay">付款</el-button>
        <el-button @click="showDialog=false">取消</el-button>
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