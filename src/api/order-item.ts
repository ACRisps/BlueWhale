import {axios} from "../utils/request.ts";
import {ORDER_MODULE} from "./_prefix.ts";


export type UploadOrderItemInfo = {
    orderSerialNumber: string
    deliverSerialNumber: string
    total: string
    productId: number
    productName: string
    productNumber: number
    productPrice: string
    imgURL: string
    storeId: number
    userPhone: string
    method: string
    state: string
    address: string
}

export type OrderItemInfo = {
    orderSerialNumber: string
    deliverSerialNumber: string
    total: string
    totalAfter: string
    productId: number
    productName: string
    productNumber: number
    productPrice: string
    imgURL: string
    createTime: string,
    storeId: number
    userPhone: string
    method: string
    state: string
    address: string
    bind?: boolean
}

export type OrderItemsInfo = OrderItemInfo[];

export const uploadOrderItem = (payload: UploadOrderItemInfo) => {
    return axios.post(`${ORDER_MODULE}/orderItems/create`, payload)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const orderItemPageInfo = (page: number, size: number) => {
    return axios.get(`${ORDER_MODULE}/orderItems`, {params: {page: page, size: size}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const orderItemSend = (orderSerialNumber: string) => {
    return axios.get(`${ORDER_MODULE}/orderItems/send`, {params: {orderSerialNumber: orderSerialNumber}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const orderItemGet = (orderSerialNumber: string) => {
    return axios.get(`${ORDER_MODULE}/orderItems/get`, {params: {orderSerialNumber: orderSerialNumber}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

