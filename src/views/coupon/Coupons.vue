<script setup lang="ts">


import UserCoupons from "../../components/view-coupon/UserCoupons.vue";
import StoreCoupons from "../../components/view-coupon/StoreCoupons.vue";
import AllCoupons from "../../components/view-coupon/AllCoupons.vue";


const role = sessionStorage.getItem("role");
</script>

<template>
  <UserCoupons v-if="role=='CUSTOMER'"/>
  <StoreCoupons v-if="role=='STAFF'"/>
  <AllCoupons v-if="role=='MANAGER'||role=='CEO'"/>
</template>

<style scoped>

</style>