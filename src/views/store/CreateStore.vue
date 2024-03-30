<!--Lab2新增-创建商店界面-->
<script setup lang="ts">
import {ref} from 'vue';
import {uploadImage} from '../../api/tools';
import {uploadStoreInfo} from '../../api/store.ts';

import {UploadFilled} from "@element-plus/icons-vue";

// v-model 绑定file-list
const imageFileList = ref([] as any);

// 存返回的imgUrl
const imgURLs = ref([] as any);

let storeName = ref('');
let storeIntro = ref('');
let storeAddress = ref('');

// 异步上传
async function handleChangeUltimate() {
  console.log(imgURLs);
  await loopUpload();
  console.log(imgURLs);
  handleStoreInfo();
}

async function loopUpload() {
  for (let image of imageFileList.value) {
    let formData = new FormData();
    formData.append('file', image.raw);
    const res = await uploadImage(formData);
    imgURLs.value.push(res.data.result as string);
  }
}

// 在上传失败时，因为上传图片并保存url先于上传执行，将已经保存的url作废
function resetImgCache() {
  imgURLs.value = [];
}

// 成功时调用
function clearCache() {
  imgURLs.value = [];
  imageFileList.value = [];
  storeName.value = '';
  storeIntro.value = '';
  storeAddress.value = '';
}

function handleExceed() {
  ElMessage.warning(`当前限制选择 1 个文件`);
}

function uploadHttpRequest() {
  return new XMLHttpRequest();
}


function handleStoreInfo() {
  console.log(imgURLs.value)
  uploadStoreInfo({
    address: storeAddress.value,
    storeName: storeName.value,
    imgURL: imgURLs.value[0],
    description: storeIntro.value,
  }).then(res => {
    if (res.data.code == '000') {
      clearCache();
      ElMessage({
        message: "已提交，请勿重复提交",
        type: 'success',
        center: true,
      });
    } else {
      resetImgCache();
      ElMessage({
        message: "提交失败（" + res.data.msg + "）",
        type: 'warning',
        center: true,
      });
    }
  });
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
              :on-exceed="handleExceed"
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
            <el-button type="primary" @click="handleChangeUltimate"
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
