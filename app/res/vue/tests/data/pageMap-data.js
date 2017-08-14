export default {
    "baseSetting": {
        "name": "基本设置",
        "typeList": "0,1,2,3,5",
        "base": {
            "name": "基本设置",
            "typeList": "0,1,2,3,5",
            "protectPwd": {
                "inherit": 1,
                "typeList": "0,1,5",
                "policyList": [
                    "base_config.close_protect",
                    "base_config.uninstall_protect"
                ],
                "isHide": false
            },
            "updateSetting": {
                "inherit": 1,
                "typeList": "0,1,2,3,5",
                "policyList": [
                    "ws.base_setting.update_setting.auto_update",
                    "ws.base_setting.update_setting.auto_update.not_update.update_trojan_lib",
                    "ws.base_setting.update_setting.not_update_on_use3g",
                    "ws.base_setting.update_setting.check_update_by_using",
                    "ws.base_setting.update_setting.proxysetting",
                    "ws.base_setting.update_setting.update_source_set",
                    "ws.base_setting.update_setting.http_download_server",
                    "ws.base_setting.update_setting.multi_update"
                ],
                "isHide": false
            },
            "startupSetting": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.base_setting.startup_setting.autorun_safecenter"
                ],
                "isHide": false
            },
            "userExperiencePlan": {
                "inherit": 1,
                "typeList": "0",
                "policyList": [
                    "ws.base_setting.user_experience_plan.join_user_experience"
                ],
                "isHide": false
            },
            "cloudSafePlan": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.base_setting.cloud_safe_plan.join_cloud_safe"
                ],
                "isHide": false
            },
            "timeSync": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "base_config.time_sync",
                    "base_config.clock_sync"
                ],
                "isHide": false
            },
            "enforce": {
                "inherit": 1,
                "typeList": "0",
                "policyList": [
                    "base_config.enforce",
                    "base_config.modify"
                ],
                "isHide": false
            },
            "needLogin": {
                "inherit": 1,
                "typeList": "0",
                "policyList": [
                    "base_config.need_login"
                ],
                "isHide": false
            },
            "isHide": false
        },
        "communicate": {
            "name": "通讯设置",
            "typeList": "0,1,2,3",
            "communicate": {
                "inherit": 1,
                "typeList": "0,1,2,3",
                "policyList": [
                    "base_config.ping_time",
                    "base_config.net_env",
                    "sd.sd_settings.sysfix",
                    "base_config.lib_update",
                    "base_config.leak_update",
                    "base_config.net_protocol"
                ],
                "isHide": false
            },
            "bandwithSetting": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "bandwith_setting.client_upload_log"
                ],
                "isHide": false
            },
            "p2p": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "p2p_setting"
                ],
                "isHide": false
            },
            "persistentConnetion": {
                "inherit": 1,
                "typeList": "0",
                "policyList": [
                    "base_config.persistent_connetion.enable",
                    "base_config.persistent_connetion.server"
                ],
                "isHide": false
            },
            "isHide": false
        },
        "customize": {
            "name": "终端定制",
            "typeList": "0,1",
            "language": {
                "inherit": 1,
                "policyList": [
                    "ui.language"
                ],
                "isHide": false
            },
            "exterior": {
                "inherit": 1,
                "policyList": [
                    "ui.exterior",
                    "ui.client_skin"
                ],
                "isHide": false
            },
            "cliententry": {
                "inherit": 1,
                "policyList": [
                    "ui.cliententry"
                ],
                "isHide": false
            },
            "administrator": {
                "inherit": 1,
                "typeList": "0",
                "policyList": [
                    "ui.administrator"
                ],
                "isHide": false
            },
            "md": {
                "inherit": 1,
                "policyList": [
                    "md",
                    "custom_advtools"
                ],
                "isHide": false
            },
            "isHide": false
        },
        "configFor8021xLogon": {
            "name": "认证小助手",
            "configFor8021xLogon":{
                "inherit": 1,
                "typeList": "0",
                "policyList": [
                    "base_config.config_for_8021x_logon"
                ],
                "isHide": false
            },
            "isHide": false
        },
        "isHide": false
    },
    "sd": {
        "name": "病毒查杀",
        "typeList": "0,1,2,3,5",
        "securityCenter": {
            "name": "安全防护中心",
            "typeList": "0,1,2",
            "hvmSafe": {
                "inherit": 1,
                "typeList": "0,1",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.hvm_safe"
                ]
            },
            "safeProtect": {
                "inherit": 1,
                "typeList": "0,1",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.safe_setting.webpage",
                    "ws.safe_protect.safe_setting.sbx",
                    "ws.safe_protect.safe_setting.payguard",
                    "ws.safe_protect.safe_setting.search",
                    "ws.safe_protect.safe_setting.homepage",
                    "ws.safe_protect.safe_setting.defaultsearch",
                    "ws.safe_protect.safe_setting.defaultbrowser",
                    "ws.safe_protect.safe_setting.mail",
                    "ws.safe_protect.safe_setting.camera",
                    "ws.safe_protect.safe_setting.keylogger",
                    "ws.safe_protect.safe_setting.filemon",
                    "ws.safe_protect.safe_setting.drvmon",
                    "ws.safe_protect.safe_setting.appmon",
                    "ws.safe_protect.safe_setting.regmon",
                    "ws.safe_protect.safe_setting.download",
                    "ws.safe_protect.safe_setting.udisk",
                    "ws.safe_protect.safe_setting.hacker",
                    "ws.safe_protect.safe_setting.arp",
                    "ws.safe_protect.safe_setting.sbxunknow",
                    "ws.safe_protect.sbx_unknow_safe.run_risk_program_in_sandbox"
                ]
            },
            "fileMonitor": {
                "inherit": 1,
                "typeList": "0,1,2",
                "isHide": false,
                "policyList": [
                    "sd.rp_settings.file_monitor",
                    "sd.sd_settings.file_monitor",
                    "sd.sd_settings.guard_level",
                    "sd.sd_settings.guard_file_style",
                    "sd.sd_settings.guard_handle_type",
                    "sd.sd_settings.guard_spy_files",
                    "sd.sd_settings.guard_local_area_network_virus",
                    "sd.sd_settings.anti_ransom",
                    "sd.sd_settings.package_scan_policy_switch",
                    "sd.sd_settings.skip_encrypted_package",
                    "sd.sd_settings.max_package_size_switch",
                    "sd.sd_settings.max_package_size",
                    "sd.sd_settings.max_package_level_switch",
                    "sd.sd_settings.max_package_level",
                    "sd.sd_settings.package_scan_list"
                ]
            },
            "lapseKill": {
                "inherit": 1,
                "typeList": "0,1",
                "isHide": false,
                "policyList": [
                    "sd.sd_settings.gray_file_monitor"
                ]
            },
            "webpageSafe": {
                "inherit": 1,
                "typeList": "0,1",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.webpage_safe.base_setting.trojan_invasion_website_block",
                    "ws.safe_protect.webpage_safe.base_setting.use_webpage_safemode",
                    "ws.safe_protect.webpage_safe.base_setting.use_url_query",
                    "ws.safe_protect.webpage_safe.base_setting.auto_block_cheat",
                    "ws.safe_protect.webpage_safe.base_setting.auto_upload_risk_code",
                    "ws.safe_protect.webpage_safe.ie_strengthen_setting.show_website_card",
                    "ws.safe_protect.webpage_safe.ie_strengthen_setting.add_icon_and_menu",
                    "ws.safe_protect.webpage_safe.ie_strengthen_setting.intelligence_error_page"
                ]
            },
            "searchSafe": {
                "inherit": 1,
                "typeList": "0",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.search_safe.forbid_track"
                ]
            },
            "netsafe": {
                "inherit": 1,
                "typeList": "0",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.network_safe.auto_analyze_and_block",
                    "ws.safe_protect.safe_setting.netsafe"
                ]
            },
            "cameraSafe": {
                "inherit": 1,
                "typeList": "0",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.camera_safe.popwnd_mode"
                ]
            },
            "imSafe": {
                "inherit": 1,
                "typeList": "0",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.im_safe.monitor_transfer_file",
                    "ws.safe_protect.im_safe.remove_rename_suffix",
                    "ws.safe_protect.im_safe.monitor_url_safe",
                    "ws.safe_protect.im_safe.monitor_on_add_chat_number",
                    "ws.safe_protect.safe_setting.im"
                ]
            },
            "downloadSafe": {
                "inherit": 1,
                "typeList": "0",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.download_safe.monitor_udisk_file_to_sys",
                    "ws.safe_protect.download_safe.monitor_sharedfile"
                ]
            },
            "udiskSafe": {
                "inherit": 1,
                "typeList": "0",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.udisk_safe.scan_mode",
                    "ws.safe_protect.udisk_safe.show_floating_window",
                    "ws.safe_protect.udisk_safe.show_taskbar_icon",
                    "ws.safe_protect.udisk_safe.show_desktop_icon"
                ]
            },
            "sbxunknow": {
                "inherit": 1,
                "typeList": "0,1",
                "isHide": false,
                "policyList": []
            },
            "browserSafe": {
                "inherit": 1,
                "typeList": "0",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.application_safe.browser_safe.popwnd_on_default_browser_change",
                    "ws.safe_protect.application_safe.browser_safe.lock_default_browser"
                ]
            },
            "inputSafe": {
                "inherit": 1,
                "typeList": "0",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.application_safe.input_safe.block_trojan_input",
                    "ws.safe_protect.application_safe.input_safe.block_autorun_trojan"
                ]
            },
            "desktopIcon": {
                "inherit": 1,
                "typeList": "0",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.application_safe.desktop_icon.popwnd_on_modify_desktop_icon"
                ]
            },
            "installSafe": {
                "inherit": 1,
                "typeList": "0",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.application_safe.install_safe.open_software_clean"
                ]
            },
            "selftProtect": {
                "inherit": 1,
                "typeList": "0,1",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.selft_protect.open_selft_protect"
                ]
            },
            "zhudongfangyuServer": {
                "inherit": 1,
                "typeList": "0,1",
                "isHide": false,
                "policyList": [
                    "ws.safe_protect.zhudongfangyu_server.open_zhudongfangyu",
                    "ws.safe_protect.zhudongfangyu_server.kill_all_trojan_file"
                ]
            },
            "isHide": false
        },
        "virusScan": {
            "name": "病毒扫描设置",
            "typeList": "0,1,2,3",
            "virusSetting": {
                "inherit": 1,
                "typeList": "0,1,2,3",
                "isHide": false,
                "policyList": [
                    "sd.sd_settings.file_style",
                    "sd.sd_settings.operating"
                ]
            },
            "otherSetting": {
                "inherit": 1,
                "typeList": "0,1,2,3",
                "isHide": false,
                "policyList": [
                    "sd.sd_settings.scan_disk_sector",
                    "sd.sd_settings.scan_rootkit",
                    "sd.sd_settings.archive",
                    "sd.sd_settings.is_scan_archive_size",
                    "sd.sd_settings.scan_archive_size",
                    "sd.sd_settings.is_scan_archive_level",
                    "sd.sd_settings.scan_archive_level",
                    "sd.sd_settings.scan_archive_list",
                    "sd.sd_settings.scan_use_speedup",
                    "sd.sd_settings.skip_unc_path",
                    "sd.sd_settings.skip_net_driver",
                    "sd.sd_settings.skip_net_driver_low_right",
                    "sd.sd_settings.CPU_limit"
                ]
            },
            "sdTimer": {
                "inherit": 1,
                "typeList": "0,1",
                "isHide": false,
                "policyList": [
                    "sd.sd_settings.timer_open",
                    "sd.sd_settings.timer_scan_type",
                    "sd.sd_settings.timer_type",
                    "sd.sd_settings.timer_month_index",
                    "sd.sd_settings.timer_week_index",
                    "sd.sd_settings.timer_day_hour",
                    "sd.sd_settings.timer_day_minute",
                    "sd.sd_settings.timer_antivirus_setting"
                ]
            },
            "trustPath": {
                "inherit": 1,
                "typeList": "0,1,2,3",
                "isHide": false,
                "policyList": [
                    "sd.sd_settings.trust_path.folder",
                    "sd.sd_settings.trust_path.ext_name"
                ]
            },
            "isHide": false
        },
        "multiEngine": {
            "name": "多引擎设置",
            "typeList": "0,1",
            "multiEngine": {
                "inherit": 1,
                "typeList": "0,1",
                "isHide": false,
                "policyList": [
                    "sd.sd_settings.cloud_engine_scan",
                    "sd.sd_settings.cloud_engine_protect",
                    "sd.sd_settings.ave_scan",
                    "sd.sd_settings.qex_scan",
                    "sd.sd_settings.qex_monitor",
                    "sd.sd_settings.qvm_scan",
                    "sd.sd_settings.qvm_moniter",
                    "sd.sd_settings.sys_file_scan",
                    "sd.sd_settings.bd_scan",
                    "sd.sd_settings.bd_moniter",
                    "sd.sd_settings.engine_avira_scan",
                    "sd.sd_settings.engine_bd_scan",
                    "sd.sd_settings.engine_avira_moniter",
                    "sd.sd_settings.engine_bd_moniter"
                ]
            },
            "cloudQvmMode": {
                "inherit": 1,
                "typeList": "0,1,2,3",
                "isHide": false,
                "policyList": [
                    "sd.rp_settings.cloud_qvm_mode"
                ]
            },
            "isHide": false
        },
        "cloud_query": {
            "name": "云查杀设置",
            "typeList": "0,1,5",
            "cloudQvmMode": {
                "inherit": 1,
                "policyList": [
                    "sd.sd_settings.private_cloud_server",
                    "sd.sd_settings.use_private_cloud",
                    "sd.sd_settings.heartbeat_server",
                    "sd.sd_settings.cloud_query",
                    "sd.sd_settings.qvm_query",
                    "sd.sd_settings.smart_mode",
                    "sd.sd_settings.smart_order"
                ]
            },
            "uploadfile": {
                "typeList": "0,1,2,3",
                "inherit": 1,
                "isHide": false,
                "policyList": [
                    "sd.sd_settings.upload_file_mode",
                    "sd.sd_settings.upload_file_server"
                ]
            },
            "isHide": false
        },
        "popup": {
            "name": "弹窗设置",
            "typeList": "0,1",
            "popwnd_mode": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.popwnd_setting.popwnd_mode"
                ],
                "isHide": false
            },
            "popwnd_online_shopping": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.popwnd_setting.popwnd_online_shopping.popwnd_online_trading",
                    "ws.popwnd_setting.popwnd_online_shopping.popwnd_entering_website",
                    "ws.popwnd_setting.popwnd_online_shopping.popwnd_exit_pay_guard"
                ],
                "isHide": false
            },
            "popwnd_email": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.popwnd_setting.popwnd_email.popwnd_find_risk_urllink",
                    "ws.popwnd_setting.popwnd_email.popwnd_entering_email"
                ],
                "isHide": false
            },
            "popwnd_im": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.popwnd_setting.popwnd_im.popwnd_scaning_received_file",
                    "ws.popwnd_setting.popwnd_im.popwnd_received_file_be_safe",
                    "ws.popwnd_setting.popwnd_im.popwnd_received_file_be_unknown",
                    "ws.popwnd_setting.popwnd_im.popwnd_received_file_not_pe",
                    "ws.popwnd_setting.popwnd_im.popwnd_received_zipfile_be_safe"
                ],
                "isHide": false
            },
            "popwnd_download": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.popwnd_setting.popwnd_download.popwnd_scaning_downloaded_file",
                    "ws.popwnd_setting.popwnd_download.popwnd_downloaded_file_be_safe",
                    "ws.popwnd_setting.popwnd_download.popwnd_downloaded_file_be_unknown",
                    "ws.popwnd_setting.popwnd_download.popwnd_downloaded_file_not_pe",
                    "ws.popwnd_setting.popwnd_download.popwnd_downloaded_zipfile_be_safe"
                ],
                "isHide": false
            },
            "popwnd_download_clearupbox": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.popwnd_setting.popwnd_download_clearupbox.popwnd_clearup"
                ],
                "isHide": false
            },
            "popwnd_leak_repair": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.popwnd_setting.popwnd_leak_repair"
                ],
                "isHide": false
            },
            "soft_autorun": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.popwnd_setting.soft_autorun"
                ],
                "isHide": false
            },
            "hardware_dirver": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.popwnd_setting.hardware_dirver.popwnd_hardware_dirver"
                ],
                "isHide": false
            },
            "isHide": false
        },
        "startupAssistant": {
            "name": "开机小助手",
            "typeList": "0",
            "startup": {
                "inherit": 1,
                "policyList": [
                    "ws.startup_assistant.startup_assistant_group.startup_time_tips",
                    "ws.startup_assistant.startup_assistant_group.show_festival_skin",
                    "ws.startup_assistant.startup_assistant_group.show_hotnews",
                    "ws.startup_assistant.startup_assistant_group.show_weather",
                    "ws.startup_assistant.startup_assistant_group.show_recommend",
                    "ws.startup_assistant.startup_assistant_group.record_startup_time",
                    "ws.startup_assistant.startup_assistant_group.join_startup_time_survey"
                ],
                "isHide": false
            },
            "isHide": false
        },
        "otherSetting": {
            "name": "其他设置",
            "typeList": "0,1",
            "rightClickMenu": {
                "inherit": 1,
                "typeList": "0",
                "policyList": [
                    "ws.base_setting.right_click_menu.relieve_occupy",
                    "ws.base_setting.right_click_menu.delete_force",
                    "ws.base_setting.right_click_menu.cloud_killing"
                ],
                "isHide": false
            },
            "urlCloudSafePlan": {
                "inherit": 1,
                "typeList": "0,1",
                "policyList": [
                    "ws.base_setting.url_cloud_safe_plan.join_url_cloud_safe"
                ],
                "isHide": false
            },
            "isHide": false
        },
        "isHide": false
    },
    "leak": {
        "name": "漏洞管理",
        "typeList": "0,1",
        "autoFix": {
            "inherit": 1,
            "policyList": [
                "ws.leak_repair.auto_fix"
            ],
            "isHide": false
        },
        "installOrder": {
            "inherit": 1,
            "policyList": [
                "ws.leak_repair.patch_download_and_install_order"
            ],
            "isHide": false
        },
        "blackList": {
            "inherit": 1,
            "policyList": [
                "black_leaks"
            ],
            "isHide": false
        },
        "otherSetting": {
            "inherit": 1,
            "policyList": [
                "ws.leak_repair.other_setting.close_windows_update",
                "ws.leak_repair.other_setting.use_bluescreen_repair",
                "ws.leak_repair.other_setting.popwnd_on_affect_office"
            ],
            "isHide": false
        },
        "isHide": false
    },
    "netProtect": {
        "name": "网络防护",
        "typeList": "0,1,3",
        "isHide": false,
        "firewall": {
            "inherit": 1,
            "typeList": "0,1,3",
            "policyList": [
                "firewall"
            ],
            "isHide": false
        },
        "ips": {
            "inherit": 1,
            "typeList": "0,1",
            "policyList": [
                "ips"
            ],
            "isHide": false
        }
    },
    "xpFix": {
        "name": "XP盾甲",
        "typeList": "0",
        "xpSetting": {
            "inherit": 1,
            "policyList": [
                "xp_fix.app_switch",
                "xp_fix.sys_switch",
                "xp_fix.hothook_switch",
                "xp_fix.key_app_switch",
                "xp_fix.show_boot_logo",
                "xp_fix.hide_sub_page",
                "xp_fix.use_lower_privilege"
            ],
            "isHide": false
        },
        "isHide": false
    },
    "omList": {
        "name": "运维管控",
        "typeList": "0",
        "isHide": true
    },
    "audit": {
        "name": "审计日志",
        "typeList": "0",
        "isHide": true
    },
    "securityCheck": {
        "typeList": "0",
        "isHide": true
    },
    "nacSecCheck": {
        "name": "安全检查",
        "typeList": "0",
        "nacSecCheckSetting": {
            "inherit": 1,
            "policyList": [
                "nac_sec_check"
            ],
            "typeList": "0,1",
            "isHide": false
        },
        "isHide": false
    },
    "safeCheck": {
        "typeList": "0",
        "isHide": false
    },
    "softmgrSetting": {
        "name": "软件管家",
        "typeList": "0",
        "isHide": false,
        "softmgr": {
            "inherit": 1,
            "policyList": [
                "softmgr"
            ],
            "isHide": false
        }
    },
    "dataCollection": {
        "name": "数据采集",
        "typeList": "0,1",
        "isHide": false,
        "neteye": {
            "inherit": 1,
            "policyList": [
                "neteye"
            ],
            "isHide": false
        },
        "clientDataCollection": {
            "inherit": 1,
            "policyList": [
                "client_data_collection"
            ],
            "isHide": false
        },
        "data_linkage": {
            "inherit": 1,
            "policyList": [
                "data_linkage"
            ],
            "isHide": false
        },
        "nac_linkage": {
            "inherit": 1,
            "policyList": [
                "nac_linkage"
            ],
            "isHide": false
        }
    }
}