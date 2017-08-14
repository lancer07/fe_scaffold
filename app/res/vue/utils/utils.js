import { isEmpty, isObject } from "lodash"

export function insertTemplate(html){
    return "";
}

/**
 * 驼峰转横线
 * 例： UserList => user-list
 * @param  {[type]} strCamel [description]
 * @return {[type]}          [description]
 */
export function camelToKebab(strCamel = "") {
    if(!strCamel) {
        return;
    }

    let tmp = strCamel.replace(/([A-Z])/g,"-$1").toLowerCase();
    if(tmp.charAt(0) === "-") {
        tmp = tmp.substr(1);
    }
    return tmp;
}

/**
 * 横线转驼峰
 * 例： uesr-list => userList
 * @param {[type]} strKebab [description]
 * @param {[boolean]} firstUpcase 首字母是否大写。默认：否
 */
export function KebabToCamel(strKebab, firstUpcase = false){
    if(!strKebab) {
        return;
    }

    let tmp = strKebab.replace(/\-(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });

    if(firstUpcase === true) {
        let fisrtLetter = tmp.charAt(0).toUpperCase();
        tmp = fisrtLetter + tmp.substr(1);
    }

    return tmp;
}

/**
 * 修改或获取url里面的hash值
 * 
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
 */
export function changeHash(json) {
    let hash = (location.hash || "#").substr(1);
    let obj = queryUrl(hash);
    if (!json) {
        return obj;
    };
    json = json || {};
    obj = Object.assign(obj, json);
    for (let name in obj) {
        if (obj[name] === null) {
            delete obj[name];
        };
    }
    hash = encodeURIJson(obj);
    location.hash = hash;
    return obj;

}

function queryUrl(url, key) {
    url = url || "";
    url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
    let json = {};
    //考虑到key中可能有特殊符号如“[].”等，而[]却有是否被编码的可能，所以，牺牲效率以求严谨，就算传了key参数，也是全部解析url。
    url.replace(/(^|&)([^&=]+)=([^&]*)/g, function(a, b, key, value) {
        //对url这样不可信的内容进行decode，可能会抛异常，try一下；另外为了得到最合适的结果，这里要分别try
        try {
            key = decodeURIComponent(key);
        } catch (e) {}

        try {
            value = decodeURIComponent(value);
        } catch (e) {}

        if (!(key in json)) {
            json[key] = /\[\]$/.test(key) ? [value] : value; //如果参数名以[]结尾，则当作数组
        } else if (json[key] instanceof Array) {
            json[key].push(value);
        } else {
            json[key] = [json[key], value];
        }
    });
    return key ? json[key] : json;
}

/**
 * 将json对象编码后转成字符串输出
 * 
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
 */
function encodeURIJson(json) {
    let s = [];
    for (let p in json) {
        if (json[p] == null) continue;
        if (json[p] instanceof Array) {
            for (let i = 0; i < json[p].length; i++) s.push(encodeURIComponent(p) + '=' + encodeURIComponent(json[p][i]));
        } else {
            s.push((p) + '=' + encodeURIComponent(json[p]).replace(/\(/g, '%28').replace(/\)/g, '%29'));
        }
    }
    return s.join('&');
}


const converJson = (json, path, result) => {
    let tmpPath = "";
    for (let key in json) {
        if (typeof json[key] === "object") {
            tmpPath = path + (path == "" ? `${key}` : `[${(key)}]`);
            converJson(json[key], tmpPath, result);
        } else {
            let tmpKey = encodeURIComponent(`[${key}]`);
            result.push(path == "" ? `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}` : `${encodeURIComponent(path)}${tmpKey}=${encodeURIComponent(json[key])}`);
        }
    }
}

/**
 * 将json对象转成form表单的数据格式
 * 
 * @param  {[type]} json [description]
 * @return {[type]}      [description]
 */
export const converJsonToForm = (json) => {
    let list = [];
    converJson(json, "", list);
    return list.join("&");
}

/**
 * 将对象中的字符串'0',转成数字0。
 * 
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export function strNumToNumber(obj) {
    if(!obj || "string" === typeof obj) {
        return;
    }

    for(let key in obj) {
        let tmpObj = obj[key];
        if("object" !== typeof tmpObj) {
            if(tmpObj === '0') {
                obj[key] = 0;
            } else if(tmpObj === '1') {
                obj[key] = 1;
            }
        } else {
            if(Array.isArray(tmpObj)) {
                tmpObj.forEach((value) => {
                    strNumToNumber(value)
                })
            } else {
                strNumToNumber(tmpObj);
            }
        }
    }
}

/**
 * 将数字类型的数据转换成字符串形式
 * 
 * @export
 * @param {any} obj 
 */
export function numberToStrNum(obj) {
    let key = null;
    for (key in obj) {
        if (typeof obj[key] === 'object') {
            if(Array.isArray(obj[key])){
                for(let i = 0, len = obj[key].length; i < len; i++){
                    numberToStrNum(obj[key][i])
                }
            } else {
                numberToStrNum(obj[key]);
            }
        } else if (typeof obj[key] === "number") {
            obj[key] = obj[key] + "";
        }
    }
}

/**
 * 将对象中的false => 0, true => 1
 * 
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export function booleanToNumber(obj) {
    if(!obj || "string" === typeof obj) {
        return;
    }

    for(let key in obj) {
        let tmpObj = obj[key];
        if("object" !== typeof tmpObj) {
            if(tmpObj === false) {
                obj[key] = 0;
            } else if(tmpObj === true) {
                obj[key] = 1;
            }
        } else {
            if(Array.isArray(tmpObj)) {
                tmpObj.forEach((value) => {
                    booleanToNumber(value)
                })
            } else {
                booleanToNumber(tmpObj);
            }
        }
    }
}

const IGNORE_LIST = [
    "sd.sd_settings.timer_antivirus_setting.value"
];
/**
 * 清除策略数据中的空对象
 * 
 * 如下情况例外
 * 1、值是数组，并且inherit=0
 * 
 * @param {any} data
 * @returns
 */
export function clearEmptyObject(data, parentKey) {
    let value;
    parentKey = parentKey || "";
    for (let key in data) {
        value = data[key];
        let pKey = parentKey === "" ? key : parentKey + "." + key;
        if (isObject(value) && !isEmpty(value)) {
            value = clearEmptyObject(value, pKey);
        } 

        if (Array.isArray(value)) {
            if (isEmpty(value) && IGNORE_LIST.indexOf(parentKey) === -1 && !("inherit" in data)) {
                delete data[key];
            }
        } else {
            if (isEmpty(value) && value !== 0 && value !== "") {
                delete data[key];
            }
        }
    }
    return data;
}

