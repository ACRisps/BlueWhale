import {axios} from "../utils/request.ts";
import {PAY_MODULE} from "./_prefix.ts";

export const uploadPay = (orderContainerId: number) => {

    return axios.post(`${PAY_MODULE}/payMultiOrder/${orderContainerId}`)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};

export const uploadPayItem = (orderItemSerial: string) => {

    return axios.post(`${PAY_MODULE}/payOrderItem/${orderItemSerial}`)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};
