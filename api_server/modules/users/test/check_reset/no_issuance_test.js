'use strict';

const CheckResetTest = require('./check_reset_test');
const TokenHandler = require(process.env.CSSVC_BACKEND_ROOT + '/shared/server_utils/token_handler');

class NoIssuanceTest extends CheckResetTest {

	constructor (options) {
		super(options);
		this.userOptions.numRegistered = 2;
	}

	get description () {
		return 'should return an error when sending a check reset request with a token for a user that was not actually issued a reset token';
	}

	getExpectedError () {
		return {
			code: 'AUTH-1002'
		};
	}

	// make the query data for the path part of the test request
	makeQueryData () {
		// replace the token with a reset token that has the other user's email in it
		const queryData = super.makeQueryData();
		queryData.token = new TokenHandler(this.apiConfig.sharedSecrets.auth).generate({ email: this.users[1].email }, 'rst');
		return queryData;
	}
}

module.exports = NoIssuanceTest;
