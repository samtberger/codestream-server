// handle unit tests for the "GET /sessions" request

'use strict';

var GetSessionsTest = require('./get_sessions_test');

class GetSessionsRequestTester {

	test () {
		new GetSessionsTest().test();
	}
}

module.exports = new GetSessionsRequestTester();
