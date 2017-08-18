const baseUrl = 'http://127.0.0.1:12345';
const list = [
    {
        key : '登录',
        type : 'post',
        url : baseUrl + '/api/login'
    },
    {
        key : '用户列表',
        type : 'get',
        url : baseUrl + '/api/user'
    }
]

module.exports = list;