<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {type OrderItemsInfo, orderItemPageInfo} from '../../api/orderItem.ts';


const orderList = ref([] as OrderItemsInfo);
const currentPage = ref(1 as number);
const pageSize = ref(5 as number);
const totalItems = ref(0 as number);


function loadOrders(page: number) {
  orderItemPageInfo(page - 1, pageSize.value).then(res => {
    totalItems.value = res.data.result.totalElements;
    orderList.value = res.data.result.content;
  });
}

function handlePageChange(page: number) {
  currentPage.value = page;
  loadOrders(page);
}

function handleSizeChange(newSize: number) {
  pageSize.value = newSize;
  currentPage.value = 1; // Reset to the first page
  loadOrders(currentPage.value);
}

onMounted(() => {
  loadOrders(currentPage.value);
});


</script>

<template>
  <el-main class="page-main">
    <el-row justify="center">
      <div class="title">在这里查看您的商店收到的订单</div>
    </el-row>
    <div v-for="order in orderList">
      <el-row justify="center">
        <el-card style="width: 800px" class="card">
          <template #header>
            <el-row>
              <el-col :span="22">
                {{ order.productName }}
              </el-col>
              <el-col :span="2">

              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="6">
              <el-image style="width: 100px; height: 100px" :src="order.imgURL" :fit="'cover'"/>
            </el-col>
            <el-col :span="16">
            </el-col>
          </el-row>
        </el-card>
      </el-row>
    </div>
    <el-row justify="center">
      <div>
        <el-pagination
            layout="prev, pager, next"
            :page-count="Math.ceil(totalItems / pageSize)"
            :current-page="currentPage"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
        />
      </div>
    </el-row>
  </el-main>

</template>


<style scoped>
.page-main {
  position: absolute;
  top: 52px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
}

.card {
  margin: 5px;
}

.title {
  margin-top: 10px;
  margin-bottom: 40px;
  font-size: large;
  color: dodgerblue;
}
</style>
