// Lab2新增

import {axios} from "../utils/request.ts";
import {PRODUCT_MODULE, STORE_MODULE} from "./_prefix.ts";

export type ProductInfo = {
    productName: string,
    productType: string,
    imgURLs: string[],
    description: string
    storeId: number
    price:number
}

export const uploadProductInfo = (payload: ProductInfo) => {
    return axios.post(`${PRODUCT_MODULE}/create`, payload,)
        .then(res => {
            return res
        })
        .catch(err => {
                return err.response
            }
        )
}

export const productInfoDetail = (productId: number) => {
    return axios.get(`${STORE_MODULE}/getProductDetail`, {params: {storeId: productId}})
        .then(res => {
            return res
        })
        .catch(err => {
            return err.response
        })
}