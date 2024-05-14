import {axios} from "../utils/request.ts";
import {PAY_MODULE} from "./_prefix.ts";

export interface ProductsPassInfo {
    products: ProductPassInfo[];
}

export interface ProductPassInfo {
    productId: number;
    num: number;
    storeId: number;
}

export interface ProductPayInfo {
    productId: number;
    num: number;
}

export interface StorePayInfo {
    storeId: number;
    products: ProductPayInfo[];
    couponId: number;
}

export interface PayInfo {
    stores: StorePayInfo[];
    couponId: number;
}


export const uploadPay = (orderContainerId: number, coupons: number[]) => {

    return axios.get(`${PAY_MODULE}/payMultiOrder`, {
        params: {
            multiOrderId: orderContainerId,
            couponIdsString: coupons.toString()
        }
    })
        .then(res => {
            console.log(res.data);
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const uploadPayItem = (orderItemSerial: string) => {

    return axios.get(`${PAY_MODULE}/payOrderItem`, {params: {orderSerialNumber: orderItemSerial.toString()}})
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