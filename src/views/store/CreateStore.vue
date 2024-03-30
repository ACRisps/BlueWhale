<!--Lab2新增-创建商店界面-->
<script setup lang="ts">
import {ref} from 'vue'
import {uploadImage} from '../../api/tools'
import {uploadStoreInfo} from '../../api/store.ts'

import {UploadFilled} from "@element-plus/icons-vue";

const imageFileList = ref([] as any)
const logoURLs = ref([''])

function handleChangeUltimate() {
  for (let image of imageFileList.value) {
    let formData = new FormData()
    formData.append('file', image.raw);
    uploadImage(formData).then(res => {
      logoURLs.value.push(res.data.result as string);
    })
  }
}
function handleChange(_file: any, fileList: any) {
  imageFileList.value = fileList
}

function handleExceed() {
  ElMessage.warning(`当前限制选择 1 个文件`);
}

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

let storeName = ref('');
let storeIntro = ref('');
let storeAddress = ref('');

function handleStoreInfo() {
  handleChangeUltimate()
  uploadStoreInfo({
    address: storeAddress.value,
    storeName: storeName.value,
    imgURL: logoURLs.value[0],
    description: storeIntro.value,
  }).then(res => {
    if (res.data.code == '000') {
      ElMessage({
        message: "已提交，请勿重复提交",
        type: 'success',
        center: true,
      })
    } else {
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
        <el-form-item label="商店Logo">
          <el-upload
              v-model:file-list="imageFileList"
              :limit="1"
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
              将文件拖到此处或单击此处上传。仅允许上传一份文件。
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="商店名称">
          <el-input v-model="storeName" class="input" placeholder="给商店取个好听的名字" clearable/>
        </el-form-item>
        <el-form-item label="商店地址">
          <el-input v-model="storeAddress" class="input" placeholder="在这里写下商店地址"
                    type="textarea" :rows="2" resize="none"/>
        </el-form-item>
        <el-form-item label="商店简介">
          <el-input v-model="storeIntro" class="input" placeholder="在这里写下商店简介"
                    type="textarea" :rows="5" resize="none"/>
        </el-form-item>

        <el-row justify="center">
          <el-col :span="3"/>
          <el-col :span="5">
            <el-button type="primary" @click="handleStoreInfo"
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
