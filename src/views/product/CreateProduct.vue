<!--Lab2新增-创建商品界面-->
<!--你可以选择把创建商品改成一个弹窗或其他界面的一个部分。
这样的话，就不需要有这样一个views下的创建商品文件了，因为views下的文件一般会是一个单独的界面。
但如果你觉得这一个部分的代码较多，合到其他文件里会使那个文件太长，
可以在product文件夹下创建一个components子文件夹，里面存放product模块下产生的组件界面。把这个创建商品子组件放在里面。
这个传递数据的过程可能需要用到props-->

<template>
    <el-button plain @click="dialogVisible = true">
      Click to open the Dialog
    </el-button>
  
    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="500"
      :before-close="handleClose"
    >
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
          <el-form-item>
            <label v-if="!hasNameInput" for="tel">商品名称</label>
            <el-input id="productName" type="text" v-model="productName"
                      required :class="{'error-warn-input' :(hasNameInput )}"
                      placeholder="请输入手机号"/>
          </el-form-item>
          <el-form-item>
            <label for="password">商品描述</label>
            <el-input id="password" type="password" v-model="description"
                      required
                      placeholder="请输入商品描述"/>
        </el-form-item>
        <el-form-item>
            <label for="password">商品种类</label>
            <el-input id="password" type="password" v-model="type"
                      required
                      placeholder="请输入商品种类"/>
        </el-form-item>
        <el-form-item>
            <label for="password">商品价格</label>
            <el-input id="password" type="password" v-model="value"
                      required
                      placeholder="请输入商品描述"/>
        </el-form-item>
        <el-form-item>
            <label for="password">商品数量</label>
            <el-input id="password" type="password" v-model="number"
                      required
                      placeholder="请输入商品数量"/>
        </el-form-item>
        
    </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </template>
  
  <script lang="ts" setup>
//todo检验合法
const hasNameInput = computed(() => productName.value != '')

import {uploadImage} from '../../api/tools'
import { ref , computed} from 'vue'
import { ElMessageBox ,ElForm} from 'element-plus'
function uploadHttpRequest() {
  return new XMLHttpRequest()
}

  const productName = ref('')
  const description = ref('')
  const type = ref('')
  const number = ref('')
  const value = ref('')

  
  const imageFileList = ref([])
    const logoUrl = ref('')


  const dialogVisible = ref(false)
  
  const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure to close this dialog?')
      .then(() => {
        done()
      })
      .catch(() => {
        // catch error
      })
  }

  
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
  </script>
