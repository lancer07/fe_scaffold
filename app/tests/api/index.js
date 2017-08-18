var request = require('superagent');
var expect = require('chai').expect;
var apiList = require('./list');

describe('接口测试', function () {
	before(function () {});
	after(function () {});
    for(var i = 0;i<apiList.length;i++){
        let url = apiList[i].url;
        let type = apiList[i].type;
        it(apiList[i].key, function (done) {
            var req;
            if(type == 'get'){
                req = request.get(url);
            }else{
                req = request.post(url);
            }
            req.end(function(err, res){
                expect(res).to.be.an('object');
                expect(res.body.result).to.eql(0);
                done();
            });
        });
    }
});