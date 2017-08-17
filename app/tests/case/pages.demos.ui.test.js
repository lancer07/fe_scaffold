describe('Demo演示页面测试', function () {
	// 执行第一个测试用例之前调用
	before(function () {
		
	});
	// 执行完所有测试用例之后调用
	after(function () {
		
	});
	it('table组件测试', function (done) {
		require(['pages/demos/ui/index'], function (fn) {
            expect(fn.changePassword).to.be.a('function');
			done();
		});
	});
});