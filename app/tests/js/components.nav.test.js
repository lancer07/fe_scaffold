describe('导航栏组件测试', function () {
	var fn;
	// 执行第一个测试用例之前调用
	before(function () {
		
	});

	// 执行完所有测试用例之后调用
	after(function () {
		
	});

	it('变量类型检测', function (done) {
		require(['components/nav/index'], function (add) {
			expect(add(4,5)).to.be.equal(9);
			done(); // 通知Mocha测试结束
		});
	});

	// it('should return -1 when the value is not present', function() {
	// 	expect(4 + 5).to.be.equal(19);
	// });
});