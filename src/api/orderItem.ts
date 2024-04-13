import {axios} from "../utils/request.ts";
import {ORDER_MODULE, PRODUCT_MODULE} from "./_prefix.ts";
import {ProductNumUpdateInfo} from "./product.ts";


export type OrderItemInfo = {
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

export type OrderItemsInfo = OrderItemInfo[];

export const uploadOrderItem = (payload: OrderItemInfo) => {
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

