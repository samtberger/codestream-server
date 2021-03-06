'use strict';

const GetReviewsWithMarkersTest = require('./get_reviews_with_markers_test');

class GetReviewsBeforeInclusiveTest extends GetReviewsWithMarkersTest {

	get description () {
		return 'should return the correct reviews when requesting reviews in a stream before a timestamp, inclusive';
	}

	// set the path to use for the request
	setPath (callback) {
		// pick a pivot point, then filter our expected reviews based on that pivot,
		// and specify the before parameter to fetch based on the pivot
		const pivot = this.reviews[5].createdAt;
		this.expectedReviews = this.reviews.filter(review => review.createdAt <= pivot);
		this.expectedReviews.reverse();
		this.path = `/reviews?teamId=${this.team.id}&before=${pivot}&inclusive`;
		callback();
	}
}

module.exports = GetReviewsBeforeInclusiveTest;
