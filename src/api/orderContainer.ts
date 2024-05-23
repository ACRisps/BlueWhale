import {axios} from "../utils/request.ts";
import {ORDER_MODULE} from "./_prefix.ts";
import {PayInfo} from "./pay.ts";

export type OrderContainer = {
    method: String
    state: String
    totalAfterCoupon: String
    totalBeforeCoupon: String
    orders: String[]
    userPhone: String
    address: String
    storeId: number
};

export const uploadOrderContainer = (payload: OrderContainer) => {
    return axios.post(`${ORDER_MODULE}/multiOrders/create`, payload)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};
export const getOrderItems = (id: number) => {
    return axios.get(`${ORDER_MODULE}/multiOrders/${id}`)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const uploadOrderItem00 = (payload: PayInfo) => {
    return axios.post(`${ORDER_MODULE}/multiOrders/create`, payload)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};
