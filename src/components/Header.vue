<script setup lang="ts">
import {router} from '../router';
import {parseRole} from "../utils";
import {User, SwitchButton, Edit} from "@element-plus/icons-vue";   //图标

const role = sessionStorage.getItem('role');    //登录的时候插入的

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
      <el-col :span="12"/>
      <!--“创建”button-->
      <el-col :span="1" class="header-icon">
        <router-link to="/createStore" v-slot="{navigate}" v-if="role=='MANAGER'">
          <el-icon @click="navigate" :size="27" color="white">
            <Edit/>
          </el-icon>
        </router-link>
        <router-link to="/createProduct" v-slot="{navigate}" v-if="role=='STAFF'">
          <el-icon @click="navigate" :size="27" color="white">
            <Edit/>
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
