import {axios} from "../utils/request.ts";
import {PAY_MODULE} from "./_prefix.ts";

export const uploadPay = (orderContainerId: number) => {

    return axios.post(`${PAY_MODULE}/${orderContainerId}`)
        .then(res => {
            return res;
        })
        .catch(err => {
            return err.response;
        });
};
