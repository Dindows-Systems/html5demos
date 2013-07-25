/****************************************************************************************************************************************************
 * Using this module you can: register to receive deviceorientation events & get the alpha, beta, gamma angles of deviceorientation
 * 
 * @author Zaneta Szymanska <<ahref='mailto:z.szymanska@samsung.com'>z.szymanska@samsung.com</a>>
 * 
 * 
 * ************************************************************************************************
 * 
 * Copyright (c) 2012 Samsung Electronics All Rights Reserved.
 * 
 *****************************************************************************************************************************************************/
/**
 * @version 0.0.2
 */
"use strict";
tlib.gyroscope = function() {
	var alpha = 0;
	var beta = 0;
	var gamma = 0;

	return {
		/**
		 * Initializes the tizen.gyroscope module
		 * 
		 * @returns
		 */
		init : function() {
			if (window.addEventListener) {
				window.addEventListener('deviceorientation', function(e) {
					alpha = e.alpha;
					beta = e.beta;
					gamma = e.gamma;
				});

				return true;
				
			} else
				return false;
		},
		
		/**
		 * @returns alpha {Number} alfa angle
		 */
		getAlpha : function() {
			return alpha; 
		},
		
		/**
		 * @returns beta {Number} beta angle
		 */
		getBeta : function() {
			return beta; 
		},
		
		/**
		 * @returns gamma {Number} gamma angle 
		 */
		getGamma : function() {
			return gamma; 
		}
	};
}();