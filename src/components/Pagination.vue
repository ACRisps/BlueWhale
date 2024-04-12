<template>
  <div>
    <!-- 数据展示 -->
    <ul>
      <li v-for="item in dataList" :key="item.id">{
  { item.name }}</li>
    </ul>

    <!-- 分页 -->
    <el-pagination
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    ></el-pagination>
  </div>
</template>



<script>
import {
     Pagination } from 'element-ui';

export default {
    
  components: {
    
    [Pagination.name]: Pagination
  },
  data() {
    
    return {
    
      dataList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  methods: {
    
    fetchData(pageNum) {
    
      // 根据页码请求数据
      // 这里仅作示例，请求方式和具体实现需要根据实际情况调整
      // 假设后端接口返回的数据格式为：{ data: [], total: 0 }
      // data：当前页的数据列表
      // total：数据总数
      // 假设已定义了一个名为 'api' 的 Axios 实例


      this.$api.get(  {
     params: {
     pageNum, pageSize: this.pageSize } })
        .then(response => {
    
          this.dataList = response.data.data;
          this.total = response.data.total;
        })
        
    },
    handlePageChange(pageNum) {
    
      this.currentPage = pageNum;
      this.fetchData(pageNum);
    }
  },
  mounted() {
    
    this.fetchData(this.currentPage);
  }
};
</script>