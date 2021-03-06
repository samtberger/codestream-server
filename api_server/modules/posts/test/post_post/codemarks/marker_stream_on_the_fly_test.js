'use strict';

const CodemarkMarkerTest = require('./codemark_marker_test');

class MarkerStreamOnTheFlyTest extends CodemarkMarkerTest {

	constructor (options) {
		super(options);
		this.streamOptions.type = this.streamType || 'channel';
		this.streamOnTheFly = true;
		this.repoOnTheFly = true;
	}

	get description () {
		return `should return the post with marker info when creating a post and codemark in a ${this.streamType} stream with a marker where the file stream will be created on the fly`;
	}
	
	// form the data we'll use in creating the post
	makePostData (callback) {
		// specify to create a file-stream for the marker on the fly, instead of the file stream already created
		super.makePostData(() => {
			for (let i = 0; i < this.expectMarkers; i++) {
				const marker = this.data.codemark.markers[i];
				delete marker.fileStreamId;
				Object.assign(marker, {
					file: this.streamFactory.randomFile(),
					remotes: this.useRemotes || [this.repoFactory.randomUrl()],
					knownCommitHashes: this.useKnownCommitHashes
				});
			}
			if (this.streamType === 'direct') {
				this.expectedFollowerIds = [
					this.currentUser.user.id, 
					this.users[1].user.id,
					this.users[2].user.id
				];
			}
			callback();
		});
	}
}

module.exports = MarkerStreamOnTheFlyTest;
