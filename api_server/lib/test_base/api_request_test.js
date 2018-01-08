// Base class for unit tests conforming to an API request/response cycle

'use strict';

var GenericTest = require('./generic_test');
var HTTPSBot = require(process.env.CS_API_TOP + '/lib/util/https_bot');
var TestAPIConfig = require(process.env.CS_API_TOP + '/config/api_test');
var Assert = require('assert');

class APIRequestTest extends GenericTest {

	get method () {
		return this._method || 'get';
	}

	set method (method) {
		this._method = method;
	}

	get path () {
		return this._path || '/';
	}

	set path (path) {
		this._path = path;
	}

	// the guts of making an API server request
	doApiRequest (options = {}, callback = null) {
		let requestOptions = Object.assign({}, options.requestOptions || {});
		requestOptions.rejectUnauthorized = false;	// avoid complaints about security
		this.makeHeaderOptions(options, requestOptions);

		const method = options.method || 'get';
		const path = options.path || '/';
		const data = options.data || null;
		HTTPSBot[method](
			TestAPIConfig.api.host,
			TestAPIConfig.api.port,
			path,
			data,
			callback,
			requestOptions
		);
	}

	// make header options to go out with the API request
	makeHeaderOptions (options, requestOptions) {
		requestOptions.headers = Object.assign({}, requestOptions.headers || {});
		if (options.token) {
			// use this token in the request
			requestOptions.headers.Authorization = 'Bearer ' + options.token;
		}
		if (!options.reallySendEmails) {
			// since we're just doing testing, block actual emails from going out
			requestOptions.headers['X-CS-Block-Email-Sends'] = true;
		}
		if (!options.reallySendMessages && !this.reallySendMessages) {
			// since we're just doing testing, block actual messages from going out over the messager
			requestOptions.headers['X-CS-Block-Message-Sends'] = true;
		}
		if (options.testEmails) {
			// we're doing email testing, block them from being sent but divert contents
			// to a pubnub channel that we'll listen on
			requestOptions.headers['X-CS-Test-Email-Sends'] = true;
		}
	}

	// make an API requet, and check the response for validity
	apiRequest (callback, options = {}) {
		this.doApiRequest(
			Object.assign({}, options, {
				method: this.method,
				path: this.path,
				data: this.data,
				requestOptions: this.apiRequestOptions || {},
				token: this.token
			}),
			(error, response) => {
				this.checkResponse(error, response, callback);
			}
		);
	}

	// run the test by initiating the request/response cycle
	run (callback, options = {}) {
		this.apiRequest(callback, options);
	}

	// check that the object we got back matches expectation, assuming ID
	validateMatchingObject (id, object, name) {
		Assert(id.toString() === object._id.toString(), `${name} doesn't match`);
	}

	// check that the objects we got back match expections, by ID
	validateMatchingObjects (objects1, objects2, name) {
		let objectIds_1 = objects1.map(object => object._id).sort();
		let objectIds_2 = objects2.map(object => object._id).sort();
		Assert.deepEqual(objectIds_2, objectIds_1, `${name} returned don't match`);
	}

	// check that the objects we got back exactly match expectations
	validateSortedMatchingObjects(objects1, objects2, name) {
		Assert.deepEqual(objects2, objects1, `${name} returned don't match`);
	}
}

module.exports = APIRequestTest;
