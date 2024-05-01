import {axios} from "../utils/request.ts";
import {PAY_MODULE} from "./_prefix.ts";

export const uploadPay = (orderContainerId: number, coupons: number[]) => {

    return axios.get(`${PAY_MODULE}/payMultiOrder/${orderContainerId}`, {params: {couponIdsString: coupons.toString()}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const uploadPayItem = (orderItemSerial: string) => {

    return axios.get(`${PAY_MODULE}/payOrderItem/${orderItemSerial}`)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const calculatePrice = (multiOrderId: number, coupons: number[]) => {

    return axios.get(`${PAY_MODULE}/countDiscount`, {
        params: {
            multiOrderId: multiOrderId,
            couponIdsString: coupons.toString()
        }
    })
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const calculateBest = (multiOrderId: number) => {

    return axios.get(`${PAY_MODULE}/best`, {
        params: {
            multiOrderId: multiOrderId,
        }
    })
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};