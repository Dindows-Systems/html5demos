/*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
 * This module is a part of Tizen Lib (tlib) developed in SPRC->DC Group
 * 
 * This module is responsible wifi and cellular network detection on Tizen platform.
 * 
 * @author Tomasz Scislo <<ahref='mailto:t.scislo@samsung.com'>t.scislo@samsung.com</a>>
 * 
 * 
 * **************************************************************************************
 * 
 * Copyright (c) 2012 Samsung Electronics All Rights Reserved.
 * 
 ******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/**
 * @version 0.0.2
 * This version is compatible with Tizen SDK 2.0 Magnolia final
 * 
 * REQUIRED: You MUST add to config.xml <feature name="http://tizen.org/privilege/systeminfo" required="true"/> 	<feature name="http://tizen.org/privilege/application.read"
		required="true" /> in order for this module to work.
 */
"use strict";
if (typeof tlib.network === "undefined")
	tlib.network = function() {
		try {
			var deviceCapabilities = tizen.systeminfo.getCapabilities();
		} catch (e) {
			tlib.logger.err("Unable to get tizen.systeminfo.getCapabilities");
		}
		return {
			/**
			 * Checks if WiFi network connection is available
			 * 
			 * @param callback {Function} - This callback is invoked with one boolean parameter which indicates if WiFi network connection is available
			 */
			isWifiConnection : function(callback) {
				tlib.logger.info('isWifiConnection');
				var errMsg = "Unable to determine WiFi status";
				if (typeof tizen !== "undefined" && tizen.systeminfo && deviceCapabilities.wifi) {
					tizen.systeminfo.getPropertyValue('WIFI_NETWORK', function(wifi) {
						try {
							tlib.logger.info(JSON.stringify(wifi));
							if ((wifi.status === "ON" && wifi.ssid) || (typeof wifi.status === "boolean" && wifi.status)) {
								tlib.logger.info("WiFi network connection enabled");
								callback(true);
							} else {
								tlib.logger.info("WiFi network connection disabled");
								callback(false);
							}
						} catch (exc) {
							tlib.logger.err(errMsg + 'a');
							callback(false);
						}
					}, function() {
						tlib.logger.err(errMsg + 'b');
						callback(false);
					});
				} else {
					tlib.logger.err(errMsg + 'c');
					callback(false);
				}
			},

			/**
			 * Checks if cellular network connection is available
			 * 
			 * @param callback {Function} - This callback is invoked with one boolean parameter which indicates if cellular network connection is available
			 */
			isCellularNetworkInternetConnection : function(callback) {
				tlib.logger.info('isCellularNetworkInternetConnection');
				var errMsg = "Unable to determine cellular status";
				if (typeof tizen !== "undefined" && tizen.systeminfo) {
					tizen.systeminfo.getPropertyValue('CELLULAR_NETWORK', function(cellular) {
						try {
							tlib.logger.info(JSON.stringify(cellular));
							if ((cellular.status === "ON" || (typeof cellular.status === "boolean" && cellular.status)) && cellular.ipAddress) {
								tlib.logger.info("Cellular network connection enabled");
								callback(true);
							} else {
								tlib.logger.info("Cellular network connection disabled");
								callback(false);
							}
						} catch (exc) {
							tlib.logger.err(errMsg);
							callback(false);
						}
					}, function() {
						tlib.logger.err(errMsg);
						callback(false);
					});
				} else {
					tlib.logger.err(errMsg);
					callback(false);
				}
			},

			/**
			 * 
			 * Method to check if either WiFi or Cellular Internet connection available
			 * 
			 * @param callback {Function} - This callback is invoked with one boolean parameter which indicates if network connection is available
			 */
			isInternetConnection : function(callback) {
				var that = this;
				tlib.logger.info('isInternetConnection');
				if (typeof callback !== "function") {
					tlib.logger.err("Invalid callback for isInternetConnection");
					return false;
				}
				var innerCallback = function(isConnection) {
					/**
					 * If there is WiFi connection invoke callback(true) immediately If not try with cellular network
					 */
					if (isConnection) {
						callback(true);
					} else {
						that.isCellularNetworkInternetConnection(callback);
					}
				};

				this.isWifiConnection(innerCallback);
			}

		};

	}();
else
	console.error("Unable to create tlib.network module");