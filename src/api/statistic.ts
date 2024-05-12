// Lab2新增

import {axios} from "../utils/request.ts";
import {STATISTIC_MODULE} from "./_prefix.ts";


export const getTable = async () => {
    return axios.post(`${STATISTIC_MODULE}/formtest`, {},
        {responseType: 'blob'})
        .then(res => {
            return res;
        })
        .catch(err => {

            return err.response;
        });
};


export const statisticInfo = () => {
    return axios.post(`${STATISTIC_MODULE}/getInfo`, {start: null, end: null})
        .then(res => {
            return res;
        })
        .catch(err => {
                return err.response;
            }
        );
};

