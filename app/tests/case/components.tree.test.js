describe('树组件测试', function () {
	// 执行第一个测试用例之前调用
	before(function () {

	});

	// 执行完所有测试用例之后调用
	after(function () {

	});

	it('变量类型检测', function (done) {
		requirejs(['components/tree/index'], function (tree) {
			expect(tree).to.be.a('function');
			expect(tree(1, 1)).to.be.equal(2);
			done();
		});
	});
});