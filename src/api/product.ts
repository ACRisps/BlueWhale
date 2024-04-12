// Lab2新增

import {axios} from "../utils/request.ts";
import {PRODUCT_MODULE} from "./_prefix.ts";

export type ProductInfo = {
    productId: number,
    productName: string,
    productType: string,
    imgURLs: string[],
    description: string
    storeId: number
    price: String
    createTime: string
    number: number
}

export type ProductUploadInfo = {
    productName: string,
    productType: string,
    imgURLs: string[],
    description: string
    storeId: number
    price: number
    number: number
}

export type ProductNumUpdateInfo = {
    productId: number,
    number: number
}

export const uploadProductInfo = (payload: ProductUploadInfo) => {
    return axios.post(`${PRODUCT_MODULE}/create`, payload,)
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};

export const productInfoDetail = (productId: number) => {
    return axios.get(`${PRODUCT_MODULE}/getProductDetail`, {params: {productId: productId}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const uploadProductNumUpdate = (payload: ProductNumUpdateInfo) => {
    return axios.post(`${PRODUCT_MODULE}`, payload,)
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};