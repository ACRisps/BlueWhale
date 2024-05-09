<script setup lang="ts">

import {Search, Filter, ArrowRight} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import {router} from "../../router";
import {useRoute} from "vue-router";
import {searchProduct} from "../../api/product.ts";

const searchCtx = ref("");
const searchTypeSelect = ref('product');


// const routeParamSearchType = ref(null);

const showDetail = ref(false);
const showFilterDrawer = ref(false);
const underFilter = ref(false);

const searchResult = ref(null as any);

const route = useRoute();

const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = ref(12);

let navigateBlock = false;

function navigate(path: string) {
  if (!navigateBlock) {
    router.push(path);
  }

}

function loadResult() {
  searchProduct({
    name: searchCtx.value,
  }, currentPage.value - 1, pageSize.value).then(res => {
    totalItems.value = res.data.result.totalElements;
    searchResult.value = res.data.result.content;
    console.log(res.data.result.content);
  });
}

onMounted(() => {
  if (route.query.ctx != null && typeof (route.query.ctx) == "string") {
    showDetail.value = true;
    {
      searchProduct({
        name: route.query.ctx as string,
      }, currentPage.value - 1, pageSize.value).then(res => {
        totalItems.value = res.data.result.totalElements;
        searchResult.value = res.data.result.content;
        console.log(res.data.result.content);
      });
    }


  }
});

function handlePageChange(page: number) {
  currentPage.value = page;
  loadResult();
}

function handleSizeChange(newSize: number) {
  pageSize.value = newSize;
  currentPage.value = 1; // Reset to the first page
  loadResult();
}

function toSearch() {
  searchResult.value = null;
  if (searchCtx.value != "") {
    router.push(`/search?ctx=${searchCtx.value}`);
    showDetail.value = true;
  } else {
    console.log("/s");
    router.push(`/search`);
    showDetail.value = false;
  }
  loadResult();

  underFilter.value = false;
}


</script>

<template>
  <el-main>
    <el-row justify="center" v-if="!showDetail">
      <el-image style="height: 200px" src="../../../material/logo.png"></el-image>
    </el-row>
    <el-row justify="center">
      <el-input
          v-model="searchCtx"
          style="max-width: 600px; margin: 10px"
          placeholder="蓝鲸一下，你就知道"
          class="input-with-select"
          @keyup.enter.native="toSearch"
      >
        <template #prepend>
          <el-select v-model="searchTypeSelect" style="width: 90px">
            <el-option label="搜商品" value="product"/>
            <el-option label="搜商店" value="store" disabled/>
          </el-select>
        </template>
        <template #append>
          <el-button @click="toSearch">
            <el-icon style="color: dodgerblue" :size="16">
              <Search/>
            </el-icon>
          </el-button>
        </template>
      </el-input>
    </el-row>


    <el-row justify="center" v-if="showDetail&&searchResult!=null">
      <div style="width: 90%;margin-top: 10px">
        <el-row justify="center">
          <el-card style="width: 300px" class="card"
                   @click="navigate('/productDetail/'+product.productId)"
                   v-for="product in searchResult" shadow="hover">
            <template #header>
              <el-row>
                <el-col :span="20">
                  <el-text line-clamp="1">{{ product.productName }}</el-text>
                </el-col>
                <el-col :span="4" style="text-align: center">
                  <el-text line-clamp="1">{{ product.price }}￥</el-text>
                </el-col>
              </el-row>
            </template>
            <el-image :src="product.imgURLs[0]" alt="" class="img" :fit="'cover'"/>
            <template #footer>
              <el-row>
                <el-col :span="12">
                  <el-link @click="navigate(`/storeDetail/${product.storeId}`);navigateBlock=true">
                    <el-text size="small" line-clamp="1">{{ product.storeName }}</el-text>
                    <el-text size="small">
                      <el-icon>
                        <ArrowRight/>
                      </el-icon>
                    </el-text>
                  </el-link>
                </el-col>
                <el-col :span="8"></el-col>
                <el-col :span="4" style="text-align: center">
                  <el-text size="small">{{ product.grade }}⭐</el-text>
                </el-col>
              </el-row>

            </template>
          </el-card>
        </el-row>

      </div>

    </el-row>
    <el-row justify="center" v-if="searchResult!=null&&searchResult.length==0">
      <div>
        <el-empty :image-size="200" description="什么都没有找到 ..."/>
      </div>
    </el-row>

    <el-row justify="center" v-else-if="showDetail">
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

  <el-drawer v-model="showFilterDrawer">
    <template #header>
      <el-text size="large">筛选</el-text>
    </template>

    <span>Hi there!</span>
  </el-drawer>


  <el-backtop style="position: fixed; right: 30px;bottom: 160px" :visibility-height="100"/>
  <el-button style="position: fixed; right: 30px;bottom: 100px" circle size="large"
             @click="showFilterDrawer=true;underFilter=true" v-if="!underFilter">
    <el-icon size="large">
      <Filter style="color: #409eff"/>
    </el-icon>
  </el-button>
  <el-button style="position: fixed; right: 30px;bottom: 120px" circle type="primary" size="large"
             @click="showFilterDrawer=true;" v-else>
    <el-icon size="large">
      <Filter/>
    </el-icon>
  </el-button>


</template>

<style scoped>

.img {
  width: 100%;
  height: 160px;
}

.card {
  margin: 6px;
}

</style>