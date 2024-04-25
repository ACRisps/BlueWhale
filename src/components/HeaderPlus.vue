<script setup lang="ts">
import {router} from '../router';
// import {parseRole} from "../utils";
import {User, SwitchButton, Edit, Tickets, Menu} from "@element-plus/icons-vue";
import {ref} from "vue";   //图标

const role = sessionStorage.getItem('role');    //登录的时候插入的

let activeIndex = ref('0');

//退出登录
function logout() {
  ElMessageBox.confirm(
      '是否要退出登录？',
      '提示',
      {
        customClass: "customDialog",
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: "warning",
        showClose: false,
        roundButton: true,
        center: true
      }
  ).then(() => {
    sessionStorage.setItem('token', '');
    router.push({path: "/login"});
  });
}


const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
  console.log(activeIndex.value);
};
</script>


<template>
  <el-header class="header">
    <el-menu
        :default-active="$route.path"
        class="el-menu"
        mode="horizontal"
        @select="handleSelect"
        router
        :ellipsis-icon="Menu"
    >
      <el-menu-item index="/allStore"><img
          style="width: 30px"
          src="/src/assets/blueWhale.svg"
          alt="Element logo"
      />&nbsp;&nbsp;BlueWhale首页
      </el-menu-item>

      <div class="flex-grow"/>

      <el-sub-menu v-if="role=='MANAGER'||role=='STAFF'" index="">
        <template #title>
          <el-icon :size="20">
            <Edit/>
          </el-icon>
          管理
        </template>
        <el-menu-item v-if="role=='MANAGER'" index="/createStore">创建商店</el-menu-item>
        <el-menu-item v-if="role=='STAFF'" index="/createProduct">创建商品</el-menu-item>
        <el-menu-item v-if="role=='MANAGER'||role=='STAFF'" index="/publishCoupon">发布优惠券</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/orders">
        <el-icon :size="20">
          <Tickets/>
        </el-icon>
        订单
      </el-menu-item>

      <el-menu-item index="/dashboard">
        <el-icon :size="20">
          <User/>
        </el-icon>
        个人
      </el-menu-item>
      <el-menu-item index="" @click="logout">
        <el-icon :size="20" >
          <SwitchButton/>
        </el-icon>
      </el-menu-item>
    </el-menu>
  </el-header>

</template>


<style scoped>
.el-menu {
  height: 50px;
}

.flex-grow {
  flex-grow: 1;
}

.header {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 50px;
}


</style>
