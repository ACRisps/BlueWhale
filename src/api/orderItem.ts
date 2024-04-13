import {axios} from "../utils/request.ts";
import {ORDER_MODULE} from "./_prefix.ts";


export type OrderItemInfo = {
    orderSerialNumber: String
    deliverSerialNumber: String
    total: String
    productId: number
    productName: String
    productNumber: number
    productPrice: String
    imgURL: String
    storeId: number
    userPhone: String
    method: String
    state: String
    address: String
}

export const uploadOrderItem = (payload: OrderItemInfo) => {
    return axios.post(`${ORDER_MODULE}/orderItems/create`, payload)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

