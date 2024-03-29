// Lab2新增
// 开发时请解除3-4行的注释
import {axios} from '../utils/request'
import {STORE_MODULE} from './_prefix'
import {ProductInfo} from "./product.ts";

export type StoreInfo = {
    address: string,
    storeName: string,
    imgURL: string,
    description: string
}

export type StoresInfo = {
    storeId: number,
    storeName: string,
    address: string,
    createTime: string,
    imgURL: string,
    description: string
}[]

export interface StoreInfoDetail {
    address: string;
    createTime: string;
    description: string;
    imgURL: string;
    products: ProductInfo[];
    storeId: number;
    storeName: string;

    [property: string]: any;
}

export const uploadStoreInfo = (payload: StoreInfo) => {
    return axios.post(`${STORE_MODULE}/create`, payload,)
        .then(res => {
            return res
        })
        .catch(err => {
                return err.response
            }
        )
}

// 获取商店列表
export const storesInfo = () => {
    return axios.get(`${STORE_MODULE}/getStores`,)
        .then(res => {
            return res
        })
        .catch(err => {
            return err.response
        })
}

export const storeInfoDetail = (storeId: number) => {
    return axios.get(`${STORE_MODULE}/getStoreDetail`, {params: {storeId: storeId}})
        .then(res => {
            return res
        })
        .catch(err => {
            return err.response
        })
}
