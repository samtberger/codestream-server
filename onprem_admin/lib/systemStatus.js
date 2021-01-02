
// import { timingSafeEqual } from 'crypto';
// import Fs, { watch } from 'fs';
import Fs from 'fs';
import Hjson from 'hjson';
import { worstStatus, SystemStatuses } from '../src/store/actions/status';

const WatchInterval = 10000;
const watchers = {
	fauxStatusFile: {
		type: 'file',
		name: `${process.env.OPADM_TMP}/fauxStatusFile.json`,
		// lastCheck: Date.now(),
		// status,
		// statusMsg,
	}
}

class systemStatus {
	constructor(options={}) {
		this.logger = options.logger || console;
		this.systemStatus = SystemStatuses.pending;
		this.systemStatusMsg = 'System status monitor starting up',
		this.watchers = Object.assign({}, watchers);
	}

	rollUpStatuses() {
		// get the individual statuses from all the watchers and aggregate them into one
		// overall status for the system being the worst status of all watchers
		this.logger.debug('rollUpStatuses');
		let probWatchers = 0;
		let newSystemStatus = SystemStatuses.ok;
		const numWatchers = Object.keys(this.watchers).length;
		Object.keys(this.watchers).forEach((watcherId) => {
			const watcher = this.watchers[watcherId];
			if (!watcher.status) {
				watcher.status = SystemStatuses.pending;
				watcher.statusMsg = `${watcherId} pending first watch`;
				probWatchers += 1;
			}
			newSystemStatus = worstStatus(newSystemStatus, watcher.status);
		});
		const newSystemStatusMsg = !probWatchers ? '' : `${probWatchers} of ${numWatchers} watchers have a problem`;
		if (newSystemStatus !== this.systemStatus || newSystemStatusMsg !== this.systemStatusMsg) {
			this.logger.info(`systemStatus CHANGED: ${newSystemStatus} - ${newSystemStatusMsg}`);
		}
		this.systemStatus = newSystemStatus;
		this.systemStatusMsg = newSystemStatusMsg;
		this.logger.debug(`systemStatus: ${this.systemStatus} - ${this.systemStatusMsg}`);
	}

	watchFile(watcherId) {
		// the file watcher reads its data from a json file with the properties
		// 'status' and 'statusMsg'
		this.logger.debug(`watching ${watcherId}`);
		const watcher = this.watchers[watcherId];
		const newWatchData = { lastCheck: Date.now() };
		if (Fs.existsSync(watcher.name)) {
			const data = Hjson.parse(Fs.readFileSync(watcher.name, 'utf8'));
			newWatchData.status = data.status;
			newWatchData.statusMsg = data.statusMsg || '';
		}
		else {
			newWatchData.status = SystemStatuses.pending;
			newWatchData.statusMsg = `watch file ${watcher.name} does not exist`;
		}
		this.logger.debug(`watchingFile(${watcher.name}). status: ${newWatchData.status}. statusMsg: ${newWatchData.statusMsg}`);
		if (watcher.status !== newWatchData.status || watcher.statusMsg !== newWatchData.statusMsg) {
			this.logger.info(`watchingFile(${watcher.name}) CHANGED. time: ${newWatchData.lastCheck}. status: ${newWatchData.status}. statusMsg: ${newWatchData.statusMsg}`);
		}
		Object.assign(watcher, newWatchData);
		this.rollUpStatuses();
	}

	start() {
		this.logger.info('system status monitor is starting up...');
		this.logger.info('this.watchers -', this.watchers);
		Object.keys(this.watchers).forEach(watcherId => {
			this.logger.info(`watcher id ${watcherId}`);
			switch (this.watchers[watcherId].type) {
				case 'file':
					this.logger.info('case file');
					this.watchers[watcherId].intervalTimer = setInterval(() => {
						this.watchFile(watcherId);
					}, WatchInterval-1000);
					break;
				default:
					this.logger.error(`unknown watcher type: ${watcher[watcherId].type}`);
			}
		});
	}

	stop() {
		this.logger.info('system status monitor is shutting down...');
		Object.keys(this.watchers).forEach((watcherId) => {
			const watcher = this.watchers[watcherId];
			if (watcher.intervalTimer) {
				this.logger.info(`clearing watcher id ${watcherId}`);
				clearInterval(intervalTimer);
				delete watcher.intervalTimer;
			}
		});
	}
}

const systemStatusFactory = (options) => {
	const logger = options.logger || console;
	const statusMonitor = new systemStatus(options);
	logger.info('sysstat fact:', statusMonitor.systemStatus);
	statusMonitor.start();
	return statusMonitor;
}
export default systemStatusFactory;
