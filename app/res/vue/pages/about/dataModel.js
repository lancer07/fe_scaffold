import { get, post, when } from "utils/request";

export function getContentDensity() {
    return new Promise((resolve, reject) => {
        get("/dlp/library/getdensity", {}, true).then(res => {
            resolve(res.data || {});
        }).catch(e => {
            reject(e);
        })
    });
}