/*project: skylar - version: 6.0.0*/
define("res/js/common/au_modules", function() {

	var modules_name = {
        "com_ent_softmgr":           "软件管家",
        "com_logcheck":              "沦陷迹象评估",
        "com_protectcheck":          "配置脆弱评估",
        "com_valuecheck":            "数据价值评估",
        // "com_360base":            "360天擎基础模块",
        // "com_report":             "标准报表",
        // "com_dataportal":         "级联报表",
        // "com_sd_qvm":             "杀毒QVM",
        // "com_engine_bd":          "BitDefender引擎",
        "com_ext_engine_bd":         "BitDefender引擎",
        "com_ext_engine_avira":      "小红伞引擎",
        // "com_engine_expand":      "病毒引擎扩展",
        "com_leakfix":               "补丁管理",
        // "com_illegallink":        "非法外联",
        "com_esmc_usb":              "移动存储管理",
        //"com_esmc":                "运维管控",
        "com_terminal":              "终端审计",
        // "com_flowcontrol":        "流控管理",
        "com_xpfix":                 "XP安全防护",
        // "com_baselinecheck":      "基线安全检查工具",
        // "com_360sm":              "软件管家",
        "com_360nac":                "强制合规",
        // "com_adreport":           "高级报表",
        // "com_policecloud":        "公安1所云平台接口",
        // "com_electricims":        "电力IMS接口",
        "com_360av":                 "安全防护",
        "com_360av_update":          "安全防护更新服务",
        // "func_change_logo":       "更改logo",
        "com_360av_server":          "安全防护",
        "com_leakfix_server":        "补丁管理",
        "windows_server":            "windows服务器",
        "linux":                     "国产系统",
        "windows":                   "windows终端",
        "linux_server":              "Linux服务器",
        "vm":                        "虚拟化平台",
        "com_vm_vm":                 "虚拟化模块",
        "mac":                       "Mac OS平台",
        // "com_sd":                 "杀毒",
        // "com_netdefense":         "入侵防御",
        // "com_firewall":           "防火墙",
        "com_leakfix_update":        "补丁管理更新服务",
        "com_windows":               "window客户端",
        "com_linux_360av":           "安全防护",
        "com_linux_360av_update":    "安全防护更新服务",
        "com_linuxser_360av":        "安全防护",
        "com_linuxser_360av_update": "安全防护更新服务",
        "com_winser_360av":          "安全防护",
        "com_winser_360av_update":   "安全防护更新服务",
        "com_winser_leakfix":        "补丁管理",
        "com_winser_leakfix_update": "补丁管理更新服务",
        "com_winser_ext_engine_bd":  "BitDefender引擎",
        "com_winser_ext_engine_avira":"小红伞引擎",
        "com_mac_360av_update":      "安全防护更新服务",
        "com_mac_360av":             "安全防护",
        "com_vm":                    "虚拟化",
        "com_mac":                   "Mac OS平台",
        "com_safe_check":            "安检合规",
        "com_sslvpn":                "SSL VPN",
        "com_tommc":                 "运维管控",
        "com_hassets":               "资产管理",
        "com_softwaredis":           "软件分发",
        "com_c_bcm_nacplugin":       "准入交行插件",
        "health_online":             "健康状况评估",
        "com_coremail":              "Coremail联动",
        "com_linuxser_appcontrol":   "应用控制",
        "com_winser_appcontrol":     "应用控制",
        "com_appcontrol":            "应用控制"     
    }

	var addModuleName = function(cert) {
		if (cert.hasModuleName) return;
		cert.hasModuleName = true;
		if (cert['product']){
			for (var platform in cert['product']){
				var p = cert['product'][platform];
				p['name'] = modules_name[platform];
				if (p['modules']){
					for (var m in p['modules']){	//加上模块名称
						p['modules'][m]['name'] = modules_name[m];
					}
				}

			}
		}

	}

	/**
	 * [hasAuth 通过模块名称判断该模块有没有授权]
	 * @param  {[Object]}  cert       [授权对象]
	 * @param  {[String]}  module_key [模块名称]
	 * @return {Boolean}
	 */
	window.hasAuth = function(cert, module_key){

		var authFlag = false;
        var platforms = cert['product'];
   		var moduleReg = regExpGenerator(module_key);
        for (var p in platforms){
        	if (authFlag) break;
        	if (platforms[p].hasOwnProperty('modules')){
	        	for (var module in platforms[p]['modules']){
	        		if (authFlag) break;
	        		if (!moduleReg.test(module)) continue;
	        		authFlag = platforms[p]['modules'][module]['status'] >= 0;
	        	}
	        }
        }

        return authFlag;
	}


	/**
	 * [regExpGenerator 正则匹配，去掉模块名称中的平台差异]
	 * @param  {[String]} key [模块名称]
	 * @return {[RegExp]}     [匹配名称正则表达式]
	 */
	var regExpGenerator = function(key){
		var _key = key.replace(/^com_/,'');
		return new RegExp('^com_(\\w*_)?' + _key + '$');
	}

	return {
		addModuleName: addModuleName,
		hasAuth:       hasAuth
	};
});

