<script setup lang="ts">
import {router} from '../router';
import {parseRole} from "../utils";
import {User, SwitchButton, Edit, Tickets} from "@element-plus/icons-vue";
import {ref} from "vue";   //图标

const role = sessionStorage.getItem('role');    //登录的时候插入的

let showEditDialog = ref(false);

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

function toCreateStore() {
  showEditDialog.value = false;
  router.push({path: '/createStore'});
}

function toCreateProduct() {
  showEditDialog.value = false;
  router.push({path: '/createProduct'});
}

function toCreateStoreCoupon() {
  showEditDialog.value = false;
}

function toCreateGlobalCoupon() {
  showEditDialog.value = false;
}

</script>


<template>
  <el-header class="header" height="20">
    <el-row :gutter="10">
      <el-col :span="3" class="header-icon">
        <router-link to="/allStore" v-slot="{navigate}" class="no-link">
          <h1 @click="navigate" class="header-text">BlueWhale!</h1>
        </router-link>
      </el-col>
      <el-col :span="6">
        <el-tag class="role-tag" size="large">{{ parseRole(role) }}版</el-tag>
      </el-col>
      <el-col :span="11"/>
      <!--“创建”button-->
      <el-col :span="1" class="header-icon">
        <div v-if="role=='MANAGER'||role=='STAFF'">
          <el-icon @click="showEditDialog=true" :size="27" color="white">
            <Edit/>
          </el-icon>
        </div>

      </el-col>
      <!--订单button-->
      <el-col :span="1" class="header-icon">
        <router-link to="/orders" v-slot="{navigate}">
          <el-icon @click="navigate" :size="27" color="white">
            <Tickets/>
          </el-icon>
        </router-link>
      </el-col>
      <!--用户button-->
      <el-col :span="1" class="header-icon">
        <router-link to="/dashboard" v-slot="{navigate}">
          <el-icon @click="navigate" :size="27" color="white">
            <User/>
          </el-icon>
        </router-link>
      </el-col>
      <!--退出登录button-->
      <el-col :span="1" class="header-icon">
        <a @click="logout">
          <el-icon :size="27" color="white">
            <SwitchButton/>
          </el-icon>
        </a>
      </el-col>
    </el-row>
  </el-header>

  <el-dialog
      v-model="showEditDialog"
      title="选择您想进行的操作"
      width=30%
  >
    <el-row justify="center">
      <div v-if="role=='MANAGER'">
        <el-button type="primary" @click="toCreateStore">创建商店</el-button>
        <el-button type="primary" @click="toCreateGlobalCoupon">发布全局优惠券</el-button>

      </div>
      <div v-if="role=='STAFF'">
        <el-button type="primary" @click="toCreateProduct">创建商品</el-button>
        <el-button type="primary" @click="toCreateStoreCoupon">发布商店优惠券</el-button>
      </div>

    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showEditDialog=false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>


<style scoped>
.header {
  background-color: #409eff;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 50px;
}

.no-link {
  text-decoration: none;
}

.role-tag {
  margin-top: 10px;
  font-size: 20px;
}

.header-text {
  color: white;
  font-size: x-large;
  min-width: max-content;
  margin-top: 10px;
  margin-bottom: 15px;
}

.header-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

</style>
