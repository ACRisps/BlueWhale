<!--Lab2新增-商品详情界面-->
<script setup lang="ts">

import {onMounted, ref} from "vue";
import {ProductInfo, productInfoDetail, uploadProductNumUpdate} from "../../api/product.ts";
import {uploadOrderItem} from "../../api/orderItem.ts";

import {uploadOrderContainer} from "../../api/orderContainer.ts";
import {useRoute} from "vue-router";
import {ArrowLeft} from "@element-plus/icons-vue";
import {parseTime} from "../../utils";

import PayDialog from "../../components/PayDialog.vue";


const productDetail = ref({} as ProductInfo);
const grade = ref();

const role = sessionStorage.getItem("role");
const storeId = (Number)(sessionStorage.getItem('userStoreId'));

let newNumber = ref();
let showNumUpdateInput = ref(false);

let showBuyOptions = ref(false);
let useDelivery = ref(true);
let buyNum = ref(1);


let phone = String(sessionStorage.getItem("phone"));
let productPrice = ref();
let state = ref();
let address = ref();

const payDialog = ref();


onMounted(() => {
  const productId = Number(useRoute().params.productId);
  loadProductInfo(productId);

});

function loadProductInfo(x: number) {
  productInfoDetail(x).then(res => {
    productDetail.value = res.data.result;
    newNumber.value = productDetail.value.number;
    productPrice.value = productDetail.value.price;
    grade.value = Number(productDetail.value.grade);
  });
}

function handleNumDialogCancel() {
  showNumUpdateInput.value = false;
}

function handleNumDialogConfirm() {
  uploadProductNumUpdate({
    productId: productDetail.value.productId,
    number: newNumber.value
  }).then(res => {
    if (res.data.code == '000') {
      showNumUpdateInput.value = false;
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

function getMethod() {
  if (useDelivery.value) {
    return "DELIVERY";
  } else {
    return "PICKUP";
  }
}

function handlePayLater() {
  uploadOrderItem
  ({
        productName: productDetail.value.productName,
        storeId: productDetail.value.storeId,
        productPrice: productDetail.value.price,
        productNumber: buyNum.value,
        orderSerialNumber: "",
        deliverSerialNumber: "",
        total: String(parseFloat(productPrice.value) * buyNum.value),
        productId: productDetail.value.productId,
        imgURL: productDetail.value.imgURLs[0],
        userPhone: phone,
        method: getMethod(),
        state: state.value,
        address: address.value
      }
  ).then(res => {
        if (res.data.code == '000') {
          let orders = ref([] as String[]);
          orders.value.push(res.data.result);
          //应该再包装成大订单
          uploadOrderContainer({
            orders: orders.value,
            method: getMethod(),
            state: state.value,
            totalAfterCoupon: String(parseFloat(productPrice.value) * buyNum.value),
            totalBeforeCoupon: String(parseFloat(productPrice.value) * buyNum.value),
            userPhone: phone,
            address: address.value,
            storeId: storeId
          }).then(res => {
            if (res.data.code == '000') {
              {
                showBuyOptions.value = false;
                buyNum.value = 1;
              }
              ElMessage({
                message: "订单提交成功，可稍后支付",
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
      }
  );
}

function handlePayImmediately() {
  uploadOrderItem
  ({
        productName: productDetail.value.productName,
        storeId: productDetail.value.storeId,
        productPrice: productDetail.value.price,
        productNumber: buyNum.value,
        orderSerialNumber: "",
        deliverSerialNumber: "",
        total: String(parseFloat(productPrice.value) * buyNum.value),
        productId: productDetail.value.productId,
        imgURL: productDetail.value.imgURLs[0],
        userPhone: phone,
        method: getMethod(),
        state: state.value,
        address: address.value
      }
  ).then(res => {
        if (res.data.code == '000') {
          let orders = ref([] as String[]);
          orders.value.push(res.data.result);
          //应该再包装成大订单
          uploadOrderContainer({
            orders: orders.value,
            method: getMethod(),
            state: state.value,
            storeId: productDetail.value.storeId,
            totalAfterCoupon: String(parseFloat(productPrice.value) * buyNum.value),
            totalBeforeCoupon: String(parseFloat(productPrice.value) * buyNum.value),
            userPhone: phone,
            address: address.value
          }).then(res => {
            if (res.data.code == '000') {
              {
                showBuyOptions.value = false;
                buyNum.value = 1;
              }
              ElMessage({
                message: "订单已提交，等待支付",
                type: 'success',
                center: true,
              });
              callPayDialog();
              payDialog.value.getData(res.data.result);
              // uploadPay(res.data.result).then(res => {
              //   if (res.data.code == '000') {
              //     ElMessage({
              //       message: "购买成功",
              //       type: "success",
              //       center: true,
              //     });
              //   } else {
              //     ElMessage({
              //       message: "支付失败（" + res.data.msg + "）",
              //       type: 'warning',
              //       center: true,
              //     });
              //   }
              // });
            } else {
              ElMessage({
                message: "产生订单失败（" + res.data.msg + "）",
                type: 'warning',
                center: true,
              });
            }
          });
        }
      }
  );
}

function callPayDialog() {
  showBuyOptions.value = false;
  payDialog.value.openDialog();

}

function handlePaymentFinish() {
  // ElMessage({
  //   message: "支付成功！",
  //   type: 'success',
  //   center: true,
  // });
}

</script>

<template>
  <el-container>
    <!--商品详情的一部分内容放在侧边栏里-->
    <el-aside width="25%" class="page-aside">
      <el-row justify="center" align="middle">
        <el-col :span="4">
          <router-link :to="'/storeDetail/'+productDetail.storeId" v-slot="{navigate}">
            <el-icon class="arrow" @click="navigate">
              <ArrowLeft/>
            </el-icon>
          </router-link>
        </el-col>
        <el-col :span="16">
          <div class="productTitle">{{ productDetail.productName }}</div>
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
      <el-row>
        <el-col :span="24">
          <div class="description">
            <el-text>{{ productDetail.description }}</el-text>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-text class="number">剩余库存：{{ productDetail.number }}件</el-text>
        </el-col>

        <el-col :span="8" v-if="role==='STAFF'&&storeId===productDetail.storeId">
          <el-button type="primary" size="small" @click="showNumUpdateInput=true">修改库存数
          </el-button>
        </el-col>
      </el-row>
      <el-row style="height: 40%"></el-row>

      <el-row justify="center" style="margin: 10px">
        <el-col :span="24" class="price">
          <el-text size="large">ONLY {{ productDetail.price }} ¥!
          </el-text>
        </el-col>
        <el-col :span="24" style="text-align: center">
          <el-button type="primary" v-if="role=='CUSTOMER'" @click="showBuyOptions=true">立即购买</el-button>
        </el-col>
      </el-row>

    </el-aside>

    <el-main class="page-main">
      <el-row justify="center">
        <el-col :span="24" v-for="url in productDetail.imgURLs" style="text-align: center">
          <el-image :src="url" alt="" :fit="'cover'" class="img"/>
        </el-col>
      </el-row>
      <el-row justify="center">
        <div class="comment-title">--- 评论 ---</div>
      </el-row>
      <el-row>
        <el-col :span="24" v-for="comment in productDetail.productComments" class="comment-box">
          <el-row justify="center">
            <el-text>{{ comment.userName }}&nbsp;&nbsp;&nbsp;&nbsp;{{ parseTime(comment.createTime) }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                comment.grade
              }}⭐
            </el-text>
          </el-row>
          <el-row justify="center">
            <el-text line-clamp="3" style="max-width: 50%">
              {{ comment.content }}
            </el-text>
          </el-row>
        </el-col>
      </el-row>

    </el-main>
  </el-container>

  <el-dialog
      v-model="showNumUpdateInput"
      title="修改商品库存数"
      width="500"
  >
    <el-input v-model="newNumber" class="input"
              type="textarea" :rows="1" resize="none"/>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleNumDialogCancel">取消</el-button>
        <el-button type="primary" @click="handleNumDialogConfirm">
          确认更改
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
      v-model="showBuyOptions"
      title="选择数量和提货方式"
      width=40%
  >
    <el-row justify="center">
      <el-switch v-model="useDelivery" active-text="快递送达" inactive-text="到店自提"
                 style="--el-switch-off-color: #13ce66"/>
    </el-row>
    <br>
    <el-row justify="center">
      <el-input-number v-model="buyNum" :min="1" :max="100" size="small"/>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handlePayLater">提交订单</el-button>
        <el-button type="primary" @click="handlePayImmediately">立即支付</el-button>
        <el-button @click="showBuyOptions=false">取消</el-button>
      </div>
    </template>
  </el-dialog>

  <PayDialog ref="payDialog" @payment-finish="handlePaymentFinish"></PayDialog>
</template>


<style scoped>
.price {
  text-align: center;
  margin: 20px;
}

.grade-stars {
  margin-top: 1px;
  margin-bottom: 30px;
}

.comment-box {
  text-align: center;
  margin: 10px;
}

.comment-title {
  margin-top: 100px;
  margin-bottom: 30px;
  font-size: large;
  color: dodgerblue;
}

.arrow {
  font-size: 25px;
  margin-top: 16px;
  margin-left: 8px;
  margin-bottom: 25px;
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


.productTitle {
  color: cornflowerblue;
  font-size: 20px;
  margin-top: 15px;
  margin-bottom: 25px;
  text-align: center;
}

.description {
  margin: 20px;
}

.number {
  margin: 20px;
  color: darksalmon;
}

.img {
  height: 500px;
  width: 600px;
  margin: 20px;
}
</style>
