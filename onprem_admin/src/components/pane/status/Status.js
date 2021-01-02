'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Status extends React.Component {
	render() {
		const installTableData = [
			['Product Type:', this.props.productType === 'On-Prem Development' ? this.props.productType + ` (${this.props.runTimeEnvironment})` : this.props.productType],
			['Installation ID:', this.props.installationId],
			['API:', this.props.apiUrl],
			['Database:', this.props.mongoUrl]
		];
		if (this.props.release) {
			installTableData.push(['Release:', this.props.release]);
		}
		if (this.props.installationBranch) {
			installTableData.push(['Installation Branch:', this.props.installationBranch]);
		}

		const statusMsgTableData = [];

		const alertTableData = [];
		return (
			<div className="Status layout-pane-status container-fluid">
				<div className="row justify-content-center">
					<div className="col-10">
						<center>
							<h5>System Alerts</h5>
							<table className="table table-dark table-striped">
								<tbody>
									{alertTableData.length ? (
										alertTableData.map((row) => (
											<tr key={row[0]}>
												<td className="text-right px-2 py-1">{row[0]}</td>
												<td className="px-2 py-1">{row[1]}</td>
											</tr>
										))
									) : (
										<tr>
											<td className="text-center">No alert conditions detected. The system is operating normally.</td>
										</tr>
									)}
								</tbody>
							</table>
						</center>
					</div>
				</div>
				<div className="row justify-content-center mt-3">
					<div className="col-10">
						<center>
							<h5>Product Data</h5>
							<table className="table table-dark table-striped">
								<tbody>
									{installTableData.map((row) => (
										<tr key={row[0]}>
											<td className="text-right px-2 py-1">{row[0]}</td>
											<td className="px-2 py-1">{row[1]}</td>
										</tr>
									))}
								</tbody>
							</table>
						</center>
					</div>
				</div>
				<div className="row justify-content-center mt-3">
					<div className="col-10">
						<center>
							<h5>Status Messages</h5>
							<table className="table table-dark table-striped">
								<tbody>
									{statusMsgTableData.length ? (
										statusMsgTableData.map((row) => (
											<tr key={row[0]}>
												<td className="text-right px-2 py-1">{row[0]}</td>
												<td className="px-2 py-1">{row[1]}</td>
											</tr>
										))
									) : (
										<tr>
											<td className="text-center">No messages</td>
										</tr>
									)}
								</tbody>
							</table>
						</center>
					</div>
				</div>
			</div>
		);
	}
}

Status.propTypes = {
	installationId: PropTypes.string.isRequired,
	productType: PropTypes.string.isRequired,
	// onPremVersion: PropTypes.string.isRequired,
	apiUrl: PropTypes.string.isRequired,
	mongoUrl: PropTypes.string.isRequired,
};

// StatusComponent.defaultProps = {};

// returns data needed for this component
const mapState = (state) => ({
	installationId: state.config.sharedGeneral.installationId || '00000000-0000-0000-0000-000000000000',
	productType: state.installation.productType,
	runTimeEnvironment: state.config.sharedGeneral.runTimeEnvironment,
	release: state.installation.release,
	installationBranch: state.installation.installationBranch,
	// onPremVersion: state.installation.onPremVersion,
	apiUrl: state.config.apiServer.publicApiUrl,
	mongoUrl: state.config.storage.mongo.url,
});

// returns behavior for the component
// const mapDispatchToProps = function() {
// 	return {};
// }

export default connect(mapState)(Status);
