var request = require('superagent');
var expect = require('chai').expect;

describe('接口测试', function () {
    // 执行第一个测试用例之前调用
    var list = [
        {
            key : '登录',
            url : 'http://127.0.0.1:12345/api/login'
        },
        {
            key : '用户列表',
            url : 'http://127.0.0.1:12345/api/user'
        }
    ];
	before(function () {
		
	});
	// 执行完所有测试用例之后调用
	after(function () {
		
    });
    for(var i = 0;i<list.length;i++){
        let url = list[i].url;
        it(list[i].key, function (done) {
            request.post(url).end(function(err, res){
                expect(res).to.be.an('object');
                expect(res.body.result).to.eql(0);
                done();
            });
        });
    }
});