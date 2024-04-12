
import {axios} from "../utils/request.ts";
import {BIGORDER_MODULE} from "./_prefix.ts";
import { OrderItemInfo } from "./orderItem.ts";

export type BigOrder = {
    method:String
    state:String
    totalAfterCoupon:String
    totalBeforeCoupon:String
    orders:String[]
    userPhone:String
    address:String
};

export const uploadBigOrder = (payload: BigOrder) => {

    return axios.post(`${BIGORDER_MODULE}/create`,payload)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};
