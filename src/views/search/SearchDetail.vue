<script setup lang="ts">

import {Search} from "@element-plus/icons-vue";
import {ref} from "vue";
// import {router} from "../../router";

const searchCtx = ref();
const searchSelect = ref('product');


function toSearch() {


}

</script>

<template>
  <el-main>
    <el-row justify="center">
      <el-input
          v-model="searchCtx"
          style="max-width: 600px; margin: 10px"
          placeholder="蓝鲸一下，你就知道"
          class="input-with-select"
      >
        <template #prepend>
          <el-select v-model="searchSelect" style="width: 90px">
            <el-option label="搜商品" value="product"/>
            <el-option label="搜商店" value="store"/>
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
    <el-row justify="center">
      <div style="width: 80%; margin: 10px">this is detail</div>

    </el-row>
  </el-main>
</template>

<style scoped>

</style>