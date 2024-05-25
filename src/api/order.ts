import {axios} from "../utils/request.ts";
import {ORDER_MODULE} from "./_prefix.ts";
import {PayInfo} from "./pay.ts";

export const getOrderItems = (id: number) => {
    return axios.get(`${ORDER_MODULE}/multiOrders/${id}`)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const uploadOrder = (payload: PayInfo) => {
    return axios.post(`${ORDER_MODULE}/multiOrders/create`, payload)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const getMultiOrder = (serial: string) => {
    return axios.get(`${ORDER_MODULE}/multiOrders/getMultiOrder`, {
        params: {
            orderSerialNumber:serial
        }
    })
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};