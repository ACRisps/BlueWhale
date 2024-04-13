import {axios} from "../utils/request.ts";
import {ORDER_MODULE} from "./_prefix.ts";


export type commentInfo = {
    content: string;
    grade: number;
    orderSerialNumber: string;
    productId: number;
    [property: string]: any;
}

export const uploadCommemt = (payload: commentInfo) => {
    return axios.post(`${ORDER_MODULE}/orderItems/comment`, payload,)
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};