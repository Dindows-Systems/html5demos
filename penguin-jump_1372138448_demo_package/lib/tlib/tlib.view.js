/*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
 * This module is a part of Tizen Lib (tlib) developed in SPRC->DC Group
 * 
 * This module is responsible for showing custom jQueryMobile UI elements on screen and some screen modifications.
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
 * 
 * REQUIRES jQuery & jQueryMobile
 * 
 * @version 0.0.2
 */
"use strict";
if (typeof tlib.view === "undefined")
	tlib.view = function() {

		return {
			/**
			 * Displays popup message
			 * 
			 * This method requires the following HTML code to be placed on page:
			 * 	<div data-role="popup" class="popup">
			 * 		<a href="#" data-rel="back" data-role="button" data-theme="a"
			 *		data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>
			 * 	<p></p>
			 *	</div>
			 * 
			 * @param msg {String} Popup message to display
			 */
			showPopup : function(msg) {
				/**
				 * Timeout for popup needed if we want to show popup in pageshow event
				 */
				setTimeout(function() {
					$($.mobile.activePage).find('.popup p').html(msg);
					$($.mobile.activePage).find('.popup').popup("open");
					$($.mobile.activePage).find('.popup');
				}, 600);
			},

			/**
			 * Shows jQuery Mobile loader
			 * 
			 */
			showLoader : function() {
				try {
					$.mobile.loading('show', {
						theme : "d",
					});
				} catch (e) {
					tlib.logger.warn("Unable to show loader");
				}
			},

			updateLoaderMsg : function(msg) {
				$.mobile.loading('show', {
					theme : "b",
					text : msg,
				});
			},

			/**
			 * Hides jQuery Mobile loader
			 * 
			 */
			hideLoader : function() {
				try {
					$.mobile.loading('hide');
				} catch (e) {
					tlib.logger.warn("Unable to hide loader");
				}
			},

			/**
			 * Gets screen widht
			 * 
			 * @returns {Number} screen width
			 */
			getScreenWidth : function() {
				tlib.logger.info("screen width", $(window).width());
				return $(window).width();
			},

			/**
			 * Gets screen height
			 * 
			 * @returns {Number} screen height
			 */
			getScreenHeight : function() {
				tlib.logger.info("screen height", $(window).height());
				return $(window).height();
			}
		};
	}();
else
	console.error("Unable to create tlib.view module");