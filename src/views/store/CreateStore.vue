<!--Lab2新增-创建商店界面-->
<!--你可以选择把创建商店改成一个弹窗或其他界面的一个部分。
这样的话，就不需要有这样一个views下的创建商店文件了，因为views下的文件一般会是一个单独的界面。
但如果你觉得这一个部分的代码较多，合到其他文件里会使那个文件太长，
可以在store文件夹下创建一个components子文件夹，里面存放store模块下产生的组件界面。把这个创建商店子组件放在里面
这个传递数据的过程可能需要用到props-->

<script setup lang="ts">
import {ref} from 'vue'
import {uploadImage} from '../../api/tools'
import {uploadStoreInfo} from '../../api/store.ts'

import {UploadFilled} from "@element-plus/icons-vue";

const imageFileList = ref([])
const logoUrl = ref('')

function handleChange(file: any, fileList: any) {
  imageFileList.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res => {
    logoUrl.value = res.data.result
  })
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
  uploadStoreInfo({
    address: storeAddress.value,
    storeName: storeName.value,
    imgURL: logoUrl.value,
    description: storeIntro.value,
  }).then(res => {
    if (res.data.code == '000') {
      ElMessage({
        message: "已提交，请勿重复提交",
        type: 'success',
        center: true,
      })
    } else {
      // console.log(res)
      // ElMessage({
      //   message: res.data.msg,
      //   type: 'warning',
      //   center: true,
      // })
      console.log("error")

    }
  })

}

</script>


<template>
  <el-main>

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

      <!--dev-->
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


      <el-row>
        <el-col :span="3"/>
        <el-col :span="5">
          <el-button type="primary" @click="handleStoreInfo"
          >创建
          </el-button>
        </el-col>
      </el-row>


    </el-form>

  </el-main>
</template>


<style scoped>
.input {
  width: 500px;
}
</style>
