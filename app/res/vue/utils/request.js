
export const get = (url, param, showLoading) => {
    return new Promise((resolve, reject) => {
        $.getJson(url, param, showLoading).then(res => {
            if (res.reason === 'success' && res.result == 0) {
                resolve(res);
            } else {
                reject(res.reason)
            }
            // resolve(res);
        })
    });
}

export const post = (url, param, showLoading) => {
    return new Promise((resolve, reject) => {
        $.postData(url, param, showLoading).then(res => {
            if (res.reason === 'success' && res.result == 0) {
                $.tips({
                    text: '操作成功！',
                    time: 1000,
                    success: true
                });
                resolve(res);
            } else {
                reject(res.reason)
            }
        })
    });
}

/**
 * 多个请求全部成功返回才会继续执行，否则调用catch
 * @param urls 多个拉取数据url的数组。数据元素可以是一个url字符串，也可以是一个返回pormise的函数
 */
export const when = (urls = []) => {
    $.loading.show();
    
    return new Promise((resolve, reject) => {
        Promise.all(urls.map(item => {
            return typeof item === "string" ? get(item, {}, false) : item;
        })).then(dataList => {
            resolve(dataList);
            $.loading.hide();
        }).catch(reason => {
            reject(reason)
            $.loading.hide();
        })
    })
}