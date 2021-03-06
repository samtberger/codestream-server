// handle updating or retrieving session data for a particular user

'use strict';

class SessionManager {

	constructor (options) {
		Object.assign(this, options);
	}

	// set status for a particular client session
	async setSessionStatus (sessions) {
		this.sessionsToUpdate = sessions;
		this.currentSessions = this.user.get('sessions') || {};
		this.op = {};
		await this.updateSessions();		// update the sessions data by adding the presence data for this request
		await this.removeStaleSessions();	// remove any stale sessions we find, sessions older than the away timeout
		await this.saveSessions();			// save the sessions data to the server
	}

	// remove any stale sessions we see in the user's session data ... this is any
	// session data with an updatedAt attribute older than the away timeout, as configured
	async removeStaleSessions () {
		const now = Date.now();
		const awayTimeout = this.sessionAwayTimeout || this.request.api.config.apiServer.sessionAwayTimeout;
		Object.keys(this.currentSessions).forEach(sessionId => {
			const session = this.currentSessions[sessionId];
			if (session.updatedAt < now - awayTimeout) {
				// set the op to use in the database update, and delete the session
				// info from our current sessions structure
				this.op.$unset = this.op.$unset || {};
				this.op.$unset[`sessions.${sessionId}`] = true;
				delete this.currentSessions[sessionId];
			}
		});
	}

	// update sessions data with the session info passed in
	// also update the user's lastActivityAt attribute, which indicates the last
	// known activity 
	async updateSessions () {
		const now = Date.now();
		const currentLastActivityAt = this.user.get('lastActivityAt') || 0;
		let lastActivityAt = 0;
		const awayTimeout = this.sessionAwayTimeout || this.request.api.config.apiServer.sessionAwayTimeout;
		const activityAt = now - awayTimeout;

		Object.keys(this.sessionsToUpdate).forEach(sessionId => {
			this.op.$set = this.op.$set || {};
			this.op.$set[`sessions.${sessionId}`] = Object.assign(
				this.currentSessions[sessionId] || {},
				this.sessionsToUpdate[sessionId],
				{ updatedAt: now }
			);

			// update user's lastActivityAt
			// if the user is going online, it is now ...
			// if the user is going away, it is now minus the away timeout, 
			// as long as it is more recent than the last known activity
			const status = this.sessionsToUpdate[sessionId];
			if (status === 'online') {
				lastActivityAt = now;
				// also clear lastEmailsSent, since user is now assumed to be caught up
				this.op.$unset.lastEmailsSent = true;
			}
			else if (
				status === 'away' &&
				activityAt > currentLastActivityAt &&
				activityAt > lastActivityAt
			) {
				lastActivityAt = activityAt;
			}
		});

		// update user's lastActivityAt, as needed
		if (lastActivityAt) {
			this.op.$set.lastActivityAt = lastActivityAt;
		}
	}

	// save the modified sessions data to the database
	async saveSessions () {
		await this.request.data.users.updateDirect(
			{ id: this.request.data.users.objectIdSafe(this.user.id) },
			this.op
		);
	}

	// determine if the given user has an active session, which means a session
	// with status online, and updated since the awayTimeout
	hasActiveSession () {
		const sessions = this.user.get('sessions');
		if (typeof sessions !== 'object') {
			// until we start collection session status, we assume they are online
			// this continues existing email notification behavior if the user has
			// not updated their plugin to the version that tracks presence
			return true;
		}
		return Object.values(sessions).find(session => {
			const now = Date.now();
			const awayTimeout = this.sessionAwayTimeout || this.request.api.config.apiServer.sessionAwayTimeout;
			return (
				session.status === 'online' &&
				session.updatedAt > now - awayTimeout
			);
		});
	}
}

module.exports = SessionManager;
