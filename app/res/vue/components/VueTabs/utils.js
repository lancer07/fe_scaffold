import Vue from 'vue'
import isEmpty from 'lodash/isEmpty';

import { changeHash, KebabToCamel, camelToKebab } from "utils/utils"

/**
 * 从策略映射文件中提取出tab组件每个页卡的信息，和每个页卡内需要显示的组件
 * 
 * @return {[type]} [description]
 */
export function pageMapToTabData(clientType = 0) {

    return createTabData(policyPageMap, clientType)
}

export function createTabData(pageMapData, clientType) {
    if(!pageMapData) {
        return {};
    }

    let tabData = [], firstNum = 0;

    for(let parentKey in pageMapData) {
        let parentLevel = pageMapData[parentKey], objTab = {};
        // tab页面在当前选择的平台下没有，则跳过获取tab页的内容
        if(!parentLevel.name || parentLevel.isShow === false) {
            continue;
        }

        if(parentLevel.typeList && parentLevel.typeList.indexOf(clientType) === -1) {
            continue;
        }
        // 根据hash值，默认选中对应的tab。如果hash值没有，选中第一个
        let hashData = changeHash();
        let active = false;
        if(hashData.tab) {
            active = hashData.tab === parentKey
        } else {
            active = firstNum === 0? true:false;
        }
        objTab = {
            name: parentLevel.name,
            key: parentKey,
            active: active,
            isShow: parentLevel.isShow
        };
        firstNum = 1;

        if(isExistChild(parentLevel)) {
            // 如果有二级tab，生成第二级tab组件的内容
            objTab.tabs = createTabData(parentLevel, clientType);
        } else {
            // 获取tab页下面所有的组件列表
            objTab.components = [];
            for(let childKey in parentLevel) {
                if(typeof parentLevel[childKey] !== "object") {
                    continue;
                }
                // 根据配置，一些策略配置项不需要在某些平台下显示
                // if(parentLevel[childKey].typeList && parentLevel[childKey].typeList.indexOf(clientType) === -1) {
                //     console.log(childKey, " : ", parentLevel[childKey].typeList);
                //     continue;
                // }
                objTab.components.push(
                    {
                        name: KebabToCamel(camelToKebab(childKey), true),
                        isShow: true
                    }
                )
            }
            
        }

        tabData.push(objTab);
    }

    return tabData;
}

/**
 * 是否存在二级tab的配置信息
 * @return {Boolean} true: 有二级tab的配置; 反之：false
 */
function isExistChild(objLevel1) {
    if(!objLevel1) {
        return;
    }

    let res = false;
    for(let key in objLevel1) {
        let objLevel2 = objLevel1[key]
        if((typeof objLevel2 === "object") && ("name" in objLevel2)) {
            res = true;
            break;
        }
    }

    return res;
}

/**
 * 从数据中找出所有的组件名配置信息，组装成一个数组返回
 * @param  {[type]} objData [description]
 * @return {[type]}         [description]
 */
export function searchComponentName(objData) {
    if(!objData) {
        return;
    }
    let componentList = {};
    searchName(objData);

    function searchName(obj) {
        for(let key in obj) {
            if("components" === key) {
                for(let i in obj[key]) {
                    !isEmpty(obj[key][i].name) && (componentList[obj[key][i].name] = obj[key][i].name);
                }
            } else if(typeof obj[key] === "object") {
                searchName(obj[key])
            }
        }
    }
    return componentList;
}

/**
 * 将tabsData里面包含的组件，先注册到Vue中，便于后面动态加载使用
 * 
 * @export
 * @param {any} [tabsData={}]
 * @param {string} [componentPath="."]
 */
export function registerComponent(tabsData = {}, componentPath = "../") {
    // 取出所有的组件配置信息，先将这些组件注册到vue中，方面后面使用
    let compList = searchComponentName(tabsData);
    for(let key in compList) {
        try{
            // console.log(`./${componentPath}${key}.vue`);
            let objComp = require(`../../${componentPath}/${key}.vue`);
            if(objComp) {
                Vue.component(key, objComp);
            }
        } catch(e) {
            console.error("注册模块失败，请检查配置：", e);                    
        }
    }
}