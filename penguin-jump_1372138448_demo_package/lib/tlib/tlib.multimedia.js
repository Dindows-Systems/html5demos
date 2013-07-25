/*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
 * This module is a part of Tizen Lib (tlib) developed in SPRC->DC Group
 *  
 * Module designed to use HTML5 audio/video elements to playback multimedia content.
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
if (typeof tlib.multimedia === "undefined")
	tlib.multimedia = function() {
		var multimediaInstance;
		var multimediaInstanceJQ;
		var that = this;
		var callbacks = {};
		var elementName = 'multimedia';
		var options;

		var types = {
			VIDEO : 0,
			AUDIO : 1
		};

		var setCallbacks = function() {
			if (typeof callbacks.ended === "function")
				multimediaInstance.addEventListener('ended', callbacks.ended);
			if (typeof callbacks.error === "function")
				multimediaInstance.addEventListener('error', callbacks.error);
		};

		return {

			/**
			 * Initializes module to start playback of a given file
			 * 
			 * @param optionsInit {Object} List of options to initialize playback
			 */
			initialize : function(optionsInit) {
				var that = this;
				if (typeof optionsInit === "undefined")
					options = {
						file : null,
						swipe : true,
						autostart : false,
						fullscreen : false,
						playerPageId : 'player',
						type : types.VIDEO
					};
				else
					options = optionsInit;

				var page = $('#' + options.playerPageId);

				page.find('#' + elementName).remove();
				if (options.type === types.AUDIO) {
					page.append('<audio id="' + elementName + '" controls="controls"></audio>');
					page.find('#controls').hide();
				} else {
					page.append('<video id="' + elementName + '" width="360"></video>');
					page.find('#controls').show();
				}

				multimediaInstance = document.getElementById(elementName);
				multimediaInstanceJQ = $('#' + elementName);
				setCallbacks();

				if (multimediaInstanceJQ.find("source").length === 0)
					multimediaInstanceJQ.append('<source src="' + options.file + '">');
				else {
					multimediaInstanceJQ.find("source").attr('src', options.file);
					multimediaInstanceJQ.load();
				}

				$.mobile.changePage('#' + options.playerPageId);

				page.live('pagehide', function() {
					that.stop();
				})
				if (options.autostart)
					that.play();

				if (options.fullscreen && options.type === types.VIDEO)
					that.fullscreen(true);

			},

			setmultimediaInstance : function(id) {
				multimediaInstance = document.getElementById(id);
			},

			getmultimediaInstance : function() {
				return multimediaInstance;
			},

			play : function() {
				multimediaInstance.play();
			},

			pause : function() {
				multimediaInstance.pause();
			},

			stop : function() {
				try {
					multimediaInstance.pause();
					multimediaInstance.currentTime = 0;
				} catch (e) {
					tlib.logger.err("Unable to stop the Video!");
				}
			},

			/**
			 * Key binders method
			 * 
			 * @param elements {Object} JSON stores all available keys for which the actions can be hooked
			 */
			bind : function(elements) {
				var that = this;
				elements.play.unbind().bind({
					click : function(event) {
						event.preventDefault();
						that.play();
					}
				});
				elements.stop.unbind().bind({
					click : function(event) {
						event.preventDefault();
						that.stop();
					}
				});
				elements.pause.unbind().bind({
					click : function(event) {
						event.preventDefault();
						that.pause();
					}
				});
				elements.fullscreen.unbind().bind({
					click : function(event) {
						event.preventDefault();
						that.fullscreen(true);
					}
				});
			},
			/**
			 * Method used to turn on/off fullscreen mode for video
			 * 
			 * @param flag {Boolean} If true we turn one fullscreen mode otherwise we turn it off
			 */
			fullscreen : function(flag) {
				tlib.logger.info("Set fullscreen -> " + flag);
				var that = this;
				if (flag && options.type === types.VIDEO) {
					try {
						multimediaInstance.webkitRequestFullScreen();
						/**
						 * When we enter fullscreen mode we should handle some event to allow user to leave fullscreen mode, because browser doesn't do it automatically. We use either swipeLeft or swipeRight for this.
						 */
						$(document).bind('webkitfullscreenchange', function() {
							$('html').bind({
								swipeleft : function() {
									tlib.logger.info("In FullScreen swipe left");
									that.fullscreen(false);
								},
								swiperight : function() {
									tlib.logger.info("In FullScreen swipe right");
									that.fullscreen(false);
								}
							});
						});
					} catch (e) {
						tlib.logger.warn("Unable to start fullscreen");
					}
				} else {
					document.webkitCancelFullScreen();
					$('html').unbind();
				}
			},

			/**
			 * Method used to set callbacks
			 * 
			 * @param errorCB {Function} Callback invoked in case of playback error
			 * @param endCB {Function} Callback invoked in case of playback end
			 */
			setCallbacks : function(errorCB, endCB) {
				callbacks = {
					ended : endCB,
					error : errorCB
				};
			},

			/**
			 * Gets possible multimedia types
			 * 
			 * @returns {Object} Possible multimedia types
			 */
			getTypes : function() {
				return types;
			}
		}
	}();
else
	console.error("Unable to create tlib.multimedia module");