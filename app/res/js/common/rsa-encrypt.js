define('res/js/common/rsa-encrypt', ["vendor/jsencrypt/index.min"], function(JSEncrypt){
	var jsEncryptTool = JSEncrypt.JSEncrypt;
    var RSAPUBKEY = document.querySelector('#RSAPUBKEY').value;
	
    // rsa公钥加密；
	function rsaEncrypt(RSAPUBKEY){
		var encrypt = new jsEncryptTool();
		encrypt.setPublicKey(RSAPUBKEY);
		return function(pwd){
			return encrypt.encrypt(pwd)
		}
	}

    return rsaEncrypt(RSAPUBKEY)
})

