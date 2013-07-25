/*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
 * This module is a part of Tizen Lib (tlib) developed in SPRC->DC Group
 * 
 * Tizen application life cycle handler
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
 */
"use strict";
if (typeof tlib.visibility === "undefined")
	tlib.visibility = function() {

		var states = {
			HIDDEN : "hidden",
			VISIBLE : "visible",
			PRERENDER : "prerender",
			UNLOADED : "unloaded"
		};

		var visibilityChanged = function() {
			switch (document.webkitVisibilityState) {
			case states.PRERENDER:
			case states.UNLOADED:
				break;
			case states.HIDDEN:
				onApplicationHidden();
				break;
			case states.VISIBLE:
				onApplicationVisible();
				break
			}
		};

		var onApplicationVisible = function() {
		};
		var onApplicationHidden = function() {
		};

		document.addEventListener("webkitvisibilitychange", visibilityChanged);

		return {

			/**
			 * Method to register onApplicationVisible event
			 * 
			 * @param callback {Function} - method to be called each time application goes to foreground
			 */
			onApplicationVisible : function(callback) {
				onApplicationVisible = callback;
			},

			/**
			 * Method to register onApplicationHidden event
			 * 
			 * @param callback {Function} - method to be called each time application goes to background
			 */
			onApplicationHidden : function(callback) {
				onApplicationHidden = callback;
			}
		};
	}();
else
	console.error("Unable to create tlib.visibility module");

/*
 * EXAMPLE
 * 
 * tlib.visibility.onApplicationVisible(function() { console.log("app visible"); });
 * 
 * tlib.visibility.onApplicationHidden(function() { console.log("app hidden"); });
 */

