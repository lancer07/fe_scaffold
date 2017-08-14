"use strict";
var should = require('chai').should();
import { pathToObject } from "../common/policy-inherit.js"
import pageMapData from "./data/pageMap-data.js"
import policyData from "./data/policy-data.js"

describe('策略继承基础处理逻辑 res/vue/common/policy-inherit.js', function() {
    before(function() {

    });

    // 执行完所有测试用例之后调用
    after(function() {

    });

    it("根据路径获取对象", function() {
        pageMapData.should.to.not.undefined;
        policyData.should.to.not.undefined;
        pathToObject.should.to.not.undefined;

        let policy = policyData.data.detail;
        let mapData = {
            a: {
                a1: {
                    a11: {
                        value: "a11 value"
                    },
                    value: "a1 value"
                },
                value: "a value"
            },
            b: {
                b1: {
                    b11: {
                        value: "b11 value"
                    },
                    value: "b1 value"
                }
            }
        }

        let tmp = pathToObject("baseSetting.base.protectPwd", policy);
        console.log("sdf:", JSON.stringify(tmp));
        // tmp.should.to.not.undefined;
        // tmp.enable.should.to.equal("false");
        // pathToObject("b.b1", mapData).value.should.to.equal("b1 value");
    })
})