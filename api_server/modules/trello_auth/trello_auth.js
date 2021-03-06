// provide service to handle trello credential authorization

'use strict';

const OAuthModule = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/lib/oauth/oauth_module.js');

const OAUTH_CONFIG = {
	provider: 'trello',
	host: 'trello.com',
	apiHost: 'api.trello.com/1',
	authPath: '1/authorize',
	scopes: 'read,write',
	additionalAuthCodeParameters: {
		expiration: 'never',
		name: 'CodeStream',
		response_type: 'token',
		callback_method: 'fragment'
	},
	noExchange: true,
	tokenFromFragment: 'token',
	additionalTokenValues: ['apiKey'],
	hasIssues: true,
	noClientIdOk: true
};

class TrelloAuth extends OAuthModule {

	constructor (config) {
		super(config);
		this.oauthConfig = OAUTH_CONFIG;
	}

	// get redirect parameters and url to use in the redirect response
	// here we override the usual method to deal with some trello peculiarities
	getRedirectData (options) {
		const data = super.getRedirectData(options);
		const { state, redirectUri } = options;
		data.parameters.return_url = `${redirectUri}?state=${state}`;
		delete data.parameters.redirect_uri;
		const { apiKey } = this.api.config.integrations.trello;
		data.parameters.key = apiKey;
		delete data.parameters.client_id;
		delete data.parameters.state;
		return data;
	}
}

module.exports = TrelloAuth;
