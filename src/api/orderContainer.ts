import {axios} from "../utils/request.ts";
import {ORDER_MODULE} from "./_prefix.ts";

export type OrderContainer = {
    method: String
    state: String
    totalAfterCoupon: String
    totalBeforeCoupon: String
    orders: String[]
    userPhone: String
    address: String
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
