<!--Lab2新增-创建商品界面-->
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {uploadImage} from '../../api/tools'

import {UploadFilled} from "@element-plus/icons-vue";
import {uploadProductInfo} from "../../api/product.ts";
import {userInfo} from "../../api/user.ts";

const imageFileList = ref([])
const imgURLs = ref([''])
const storeId = ref()

function getStoreId() {
  userInfo().then(res => {
    storeId.value = res.data.result.storeId
  })
}

onMounted(() => {
  getStoreId()
})

function handleChange(file: any, fileList: any) {
  imageFileList.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res =>{
    imgURLs.value.push(res.data.result as string);
  })
}

function handleExceed() {
  ElMessage.warning(`当前限制选择 5 个文件`);
}

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

let productName = ref('');
let productIntro = ref('');
let price = ref();
let productType = ('');

function handleProductInfo() {
  uploadProductInfo({
    productName: productName.value,
    imgURLs: imgURLs.value,
    description: productIntro.value,
    productType: '',
    storeId: storeId.value,
    price: price.value
  }).then(res => {
    if (res.data.code == '000') {
      ElMessage({
        message: "已提交，请勿重复提交",
        type: 'success',
        center: true,
      })
    } else {
      console.log(res)
      ElMessage({
        message: "提交失败（" + res.data.msg + "）",
        type: 'warning',
        center: true,
      })
    }
  })
}
</script>


<template>
  <el-main>
    <el-row justify="center">
      <el-form>
        <el-form-item label="商品图片">
          <el-upload
              v-model:file-list="imageFileList"
              :limit="5"
              :on-change="handleChange"
              :on-exceed="handleExceed"
              :on-remove="handleChange"
              class="upload-demo input"
              list-type="picture"
              :http-request="uploadHttpRequest"
              drag
          >
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处或单击此处上传，最多允许上传5份文件。
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="productName" class="input" placeholder="商品名" clearable/>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="price" class="input" placeholder="多少钱？单位：元"
                    type="textarea" :rows="1" resize="none"/>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-input v-model="productType" class="input" placeholder="FOOD"
                    type="textarea" :rows="1" resize="none"/>
        </el-form-item>
        <el-form-item label="商品简介">
          <el-input v-model="productIntro" class="input" placeholder="在这里写下商品简介"
                    type="textarea" :rows="5" resize="none"/>
        </el-form-item>

        <el-row justify="center">
          <el-col :span="3"/>
          <el-col :span="5">
            <el-button type="primary" @click="handleProductInfo"
            >点击创建
            </el-button>
          </el-col>
        </el-row>


      </el-form>
    </el-row>
  </el-main>
</template>


<style scoped>
.input {
  width: 500px;
}
</style>
