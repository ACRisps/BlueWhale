<script setup lang="ts">
import {onMounted, ref} from "vue";

const role = sessionStorage.getItem("role");
import {Warning, CaretTop, ArrowRight, CaretBottom} from "@element-plus/icons-vue";
import "../style/base.css";
import {useTransition} from '@vueuse/core';
import {router} from "../router";
import {getTableUrl, statisticInfo} from "../api/statistic.ts";

const totalTurnoverCnt = ref(0);
const totalOrderCnt = ref(0);
const totalCustomerCnt = ref(0);
const monthTurnoverCnt = ref(0);
const monthOrderCnt = ref(0);
const monthCustomerCnt = ref(0);

const turnoverCntOutput = useTransition(totalTurnoverCnt, {
  duration: 1000,
});
const orderCntOutput = useTransition(totalOrderCnt, {
  duration: 1000,
});
const customerCntOutput = useTransition(totalCustomerCnt, {
  duration: 1000,
});
const monthTurnoverCntOutput = useTransition(monthTurnoverCnt, {
  duration: 1000,
});
const monthOrderCntOutput = useTransition(monthOrderCnt, {
  duration: 1000,
});
const monthCustomerCntOutput = useTransition(monthCustomerCnt, {
  duration: 1000,
});

const monthTurnoverRate = ref<number>(0);
const monthOrderRate = ref<number>(0);
const monthCustomerRate = ref<number>(0);


const tableUrl = ref("");

function handleTableExport() {
  loading.value = true;
  getTableUrl().then(res => {
    console.log(res.data.result);
    tableUrl.value = res.data.result;
    loading.value = false;
    window.open(tableUrl.value);
  });
}


onMounted(() => {
  statisticInfo().then(res => {
    console.log(res.data.result);
    totalTurnoverCnt.value = res.data.result.allTurnover;
    totalOrderCnt.value = res.data.result.allOrderNum;
    totalCustomerCnt.value = res.data.result.allUserNum;
    monthTurnoverCnt.value = res.data.result.monthTurnover;
    monthOrderCnt.value = res.data.result.monthOrderNum;
    monthCustomerCnt.value = res.data.result.monthUserNum;

    monthTurnoverRate.value = res.data.result.turnoverRate;
    monthOrderRate.value = res.data.result.orderRate;
    monthCustomerRate.value = res.data.result.userRate;

  });
});


const loading = ref(false);

</script>

<template>
  <el-main>
    <el-row justify="center" v-if="role=='CEO'">
      <div class="admin-title">在这里查看商场报表</div>
    </el-row>
    <el-row justify="center" v-if="role=='STAFF'">
      <div class="staff-title">在这里查看您商店的报表</div>
    </el-row>

    <el-row justify="center">
      <div style="width: 70%">
        <el-row :gutter="6" justify="center">
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="turnoverCntOutput">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    <span v-if="role=='CEO'">累计平台流水</span>
                    <span v-if="role=='STAFF'">累计商店流水</span>
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内所有商店流水之和"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店的累计流水"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">元</el-text>
                </template>
              </el-statistic>
              <div style="height: 25px"/>
              <el-statistic :value="monthTurnoverCntOutput">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    <span v-if="role=='CEO'">上月平台流水</span>
                    <span v-if="role=='STAFF'">上月商店流水</span>
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内上一个月所有商店流水之和"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店上一个月的总流水"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">元</el-text>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <span>环比趋势</span>
                <span style="color: #13ce66" v-if="monthTurnoverRate>=0">
              {{ monthTurnoverRate }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
                <span style="color: indianred" v-else>
              {{ monthTurnoverRate }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="orderCntOutput">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    累计订单数
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内累计交易成功的订单数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店累计交易成功的订单数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">单</el-text>
                </template>
              </el-statistic>
              <div style="height: 25px"/>
              <el-statistic :value="monthOrderCntOutput">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    上月订单数
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内上月交易成功的订单数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店上月交易成功的订单数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">单</el-text>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <span>环比趋势</span>
                <span style="color: #13ce66" v-if="monthOrderRate>=0">
              {{ monthOrderRate }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
                <span style="color: indianred" v-else>
              {{ monthOrderRate }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
                </span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="statistic-card">
              <el-statistic :value="customerCntOutput">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    累计顾客数
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内累计完成过交易的顾客数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店累计完成过交易的顾客数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">人</el-text>
                </template>
              </el-statistic>
              <div style="height: 25px"/>
              <el-statistic :value="monthCustomerCntOutput">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    上月顾客数
                    <el-tooltip
                        v-if="role=='CEO'"
                        content="平台内上个月完成过交易的顾客数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        v-if="role=='STAFF'"
                        content="您的商店上个月完成过交易的顾客数"
                        placement="top"
                    >
                      <el-icon style="margin-left: 4px" :size="12">
                        <Warning/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #suffix>
                  <el-text size="small">人</el-text>
                </template>
              </el-statistic>
              <div class="statistic-footer">
                <span>环比趋势</span>
                <span style="color: #13ce66" v-if="monthCustomerRate>=0">
              {{ monthCustomerRate }}%
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
                <span style="color: indianred" v-else>
              {{ monthCustomerRate }}%
              <el-icon>
                <CaretBottom/>
              </el-icon>
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-row>

    <el-row style="height: 50px"></el-row>
    <el-row justify="center">
      <el-card class="export-card" shadow="never">
        <el-row>
          <el-col :span="12">
            <div>
              <el-text>订单详情</el-text>
              <el-button link size="small" type="primary" @click="router.push('/orders')">
                全部订单
                <el-icon>
                  <ArrowRight/>
                </el-icon>
              </el-button>
            </div>

          </el-col>


          <el-col :span="6"></el-col>
          <el-col :span="6" style="text-align: right">
            <el-button type="primary" size="small" @click="handleTableExport" :loading="loading">导出订单报表
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-row>

  </el-main>
</template>

<style scoped>

.statistic-card {
  height: 160px;
  padding: 20px;
  margin: 6px;
  border-radius: 10px;
  background-color: aliceblue;
  min-width: 130px;
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 6px;
}

.export-card {
  width: 60%;
  border-radius: 6px;
}
</style>