<script setup lang="ts">

import PublishGlobalCoupon from "../../components/create-coupon/PublishGlobalCoupon.vue";
import PublishStoreCoupon from "../../components/create-coupon/PublishStoreCoupon.vue";


const role = sessionStorage.getItem("role");
</script>

<template>
  <PublishStoreCoupon v-if="role=='STAFF'"/>
  <PublishGlobalCoupon v-if="role=='MANAGER'||role=='CEO'"/>
</template>

<style scoped>

</style>