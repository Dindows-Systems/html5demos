/****************************************************************************************************************************************************
 * Using this module you can: create & resolve file (or only resolve, if created), write/append to the file, read from the file.
 * To use methods from this module, you must declare the necessary features in the config.xml file: http://tizen.org/api/filesystem and http://tizen.org/api/tizen
 * 
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
/**
 * @param options {Object} Information about the file 
 * @param options.filename {String} Name of the file
 * @param options.virtualRoot {String} Name of the virtual root we want to access
 * @param options.success {Function} Called when the directory location and the file have been resolved
 * @param options.error {Function} Called if an error or exception occurred
 */
"use strict";
tlib.file = function(options) {

	var file; // file handle for resolved file
	var gDocumentsDir;//  file handle for resolved directory location  
	
	if (typeof options !== undefined && options.filename && options.virtualRoot && options.success && options.error){
		tlib.logger.info("All parameters of options Object are defined");
	} else {
		tlib.logger.err("Define all parameters of options Object !");
	}		
		
	var filename = options.filename; // name of the file
	
	try {
		tizen.filesystem.resolve(options.virtualRoot, function(dir) {
			gDocumentsDir = dir;
			tlib.logger.info(options.virtualRoot + " resolved");
			if (resolve()) options.success();
		}, function(e) {
			tlib.logger.err("tizen.filesystem.resolve() error: " + e.message);
			options.error();
		}, "rw");
	} catch (exc) {
		tlib.logger.err("tizen.filesystem.resolve() exception: " + exc.message);
		options.error();
	}

	/**
	 * Creates file 
	 * 
	 * @return {Boolean} Indicates if file was created
	 */
	var create = function() {
		try {
			gDocumentsDir.createFile(filename);
			tlib.logger.info("File created");
			return true;
		} catch (exc) {
			if (exc.name === "IOError") {
				tlib.logger.warn("Create file failed, because file already exists.");
				return true;
			} else {
				tlib.logger.err("Create file exception: " + exc.message);
				return false;
			}
		}
	}
	
	/**
	 * Resolves an existing file to file handle 
	 * 
	 * @return {Boolean} Indicates if file was resolved
	 */
	var resolve = function() {
		tlib.logger.info("this.resolve function");
		try {
			file = gDocumentsDir.resolve(filename);
			tlib.logger.info("File resolved");
			return true; 
		} catch (exc) {
			tlib.logger.info(exc.name);
			if (exc.name === "NotFoundError" || "IOError") {
				tlib.logger.warn('File not found, so it will be created (exc message: ' + exc.message + ')');
				if (create()) 
					if (resolve())
						return true;
			} else {
				tlib.logger.err('Resolve file exception: ' + exc.message);
				return false;
			}
		}
	}
	
	/**
	 * Opens the file in write mode and writes specified string to this file
	 * 
	 * @param text {String} Text to be written in the file
	 * @param callback {Object} Contains success and error callback functions 
	 * @param callback.success {Function} Called when the file has been opened in write mode
	 * @param callback.error {Function} Called if an error or exception occurred
	 */
	this.write = function(text, callback) {
			try {
				file.openStream('w', function(fileStream) {
					try {
						fileStream.write(text);
						fileStream.close();
						callback.success();
					} catch (exc) {
						tlib.logger.err(exc.message);
						callback.error();
					}
				}, function(e) {
					tlib.logger.err("openStream error: " + e.message);
					callback.error();
				});
			} catch (exc) {
				tlib.logger.err('Write function exception: ' + exc.message);
				callback.error();
			}
	}

	/**
	 * Opens the file in append mode and appends specified string to this file
	 * 
	 * @param text {String} - Text to be append to the file
	 * @param callback {Object} Contains success and error callback functions 
	 * @param callback.success {Function} Called when the file has been opened in append mode
	 * @param callback.error {Function} Called if an error or exception occurred
	 */
	this.append = function(text, callback) {
		tlib.logger.info("Appending to file");
			try {
				file.openStream('a', function(fileStream) {
					try {
						fileStream.write(text);
						fileStream.close();
						callback.success();
					} catch (exc) {
						tlib.logger.err(exc.message);
					}
				}, function(e) {
					tlib.logger.info("openStream error: " + e.message);
					callback.error();
				});
			} catch (exc) {
				tlib.logger.err('Append function exception: ' + exc.message);
				callback.error();
			}
	}

	/**
	 * Opens the file in read mode and reads content of the file
	 * 
	 * @param callback {Object} Contains success and error callback functions 
	 * @param callback.success {Function} Called when the file has been opened in read mode, takes one parameter: text read from the file
	 * @param callback.error {Function} Called if an error or exception occurred
	 */
	this.read = function(callback) {
		var textFromFile = '';
		
			try {
				// Opens the file in the given mode supporting the given encoding
				file.openStream('r', function(fileStream) {
					try {
						textFromFile = fileStream.read(fileStream.bytesAvailable);
						fileStream.close();
						callback.success(textFromFile);
					} catch (exc) {
						tlib.logger.err('Read function exception: ' + exc.message);
						callback.error();
					}
				}, function(e) {
					tlib.logger.err("openStream error: " + e.message);
					callback.error();
				});
			} catch (exc) {
				tlib.logger.err('file.openStream() exception: ' + exc.message);
				callback.error();
			}
	}
	
	/**
	 * Method to get name of the file
	 */
	this.getFilename = function() {
		return filename;
	}
	
	this.getVirtualRoot = function() {
		return options.virtualRoot;
	}
}