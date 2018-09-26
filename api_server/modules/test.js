// master unit test runner for all modules

'use strict';

// make eslint happy
/* globals describe */

describe ('modules', () => {
/*
	require('./authenticator/test/test.js');
	require('./versioner/test/test.js');
	require('./messager/test/test.js');
*/
	require('./users/test/test.js');
/*
	require('./repos/test/test.js');
	require('./companies/test/test.js');
	require('./teams/test/test.js');
	require('./streams/test/test.js');
	require('./teams/test/test.js');
	require('./posts/test/test.js');
	require('./markers/test/test.js');
	require('./inbound_emails/test/test.js');
	require('./slack_integration/test/test.js');
	require('./teams_integration/test/test.js');
	require('./marker_locations/test/test.js');
*/
});
