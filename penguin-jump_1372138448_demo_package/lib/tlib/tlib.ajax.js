/*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
 * 
 * This module is a part of Tizen Lib (tlib) developed in SPRC->DC Group
 * 
 * Globaj $.ajax configuration for the whole project
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
 * REQUIRES jQuery
 * 
 * @version 0.0.1
 */
"use strict";
if (typeof tlib.ajax === "undefined")
	tlib.ajax = function() {
		$.ajaxSetup({
			type : "GET",
			timeout : 90000,
			crossDomain : false,
			dataType : "json",
			cache : false,
			async : true,
			beforeSend : function(XMLHttpRequest) {
				$.mobile.loading('show', {
					theme : "d",
				});
			},

			complete : function(XMLHttpRequest, status) {
				tlib.logger.info("AJAX|INFO", "Complete");
				$.mobile.loading('hide');
			},

			success : function() {
				tlib.logger.info("AJAX|INFO", "Success");
			},

			error : function(err) {
				tlib.logger.err("AJAX|INFO", "Error", err);
				view.showPopup("Server request error");
			}
		});
	};
else
	console.err("Unable to create tlib.ajax module");