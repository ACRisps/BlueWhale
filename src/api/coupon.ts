import {axios} from "../utils/request.ts";
import {COUPON_MODULE} from "./_prefix.ts";


export type CouponUploadInfo = {
    couponType: string;
    effectiveTime: string;
    expiredTime: string;
    full: number;
    reduction: number;
    storeId: number;
    [property: string]: any;
}


export const uploadCouponInfo = (payload: CouponUploadInfo, num: number) => {
    return axios.post(`${COUPON_MODULE}/publish`, payload, {params: {couponNum: num}})
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};

