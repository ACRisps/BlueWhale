// Lab2新增
// 开发时请解除3-4行的注释
import {axios} from '../utils/request'
import {STORE_MODULE} from './_prefix'

type StoreInfo = {
    address: string,
    storeName: string,
    imgURL: string,
    description: string
}

export const uploadStoreInfo = (payload: StoreInfo) => {
    return axios.post(`${STORE_MODULE}/create`, payload,)
        .then(res => {
            return res
        })
        .catch( err=>{
            return err.response
        }
        )
}
