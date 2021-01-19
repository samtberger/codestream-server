
const removeAssetEnvironment = (cfg) => {
	if ('assetEnvironment' in cfg.apiServer) {
		delete cfg.apiServer.assetEnvironment;
	}
	if ('codestreamBroadcaster' in cfg.broadcastEngine && 'assetEnvironment' in cfg.broadcastEngine.codestreamBroadcaster) {
		delete cfg.broadcastEngine.codestreamBroadcaster.assetEnvironment;
	}
	if ('outboundEmailServer' in cfg && 'assetEnvironment' in cfg.outboundEmailServer) {
		delete cfg.outboundEmailServer.assetEnvironment;
	}
	if ('inboundEmailServer' in cfg && 'assetEnvironment' in cfg.inboundEmailServer) {
		delete cfg.inboundEmailServer.assetEnvironment;
	}
}

const from15To16 = (nativeCfg, from, to, logger) => {
	removeAssetEnvironment(nativeCfg);
	// modify the config in some way
	// return X; // return a new object if you want to replace nativeCfg
};

const from18To19 = (nativeCfg) => {
	// modify the config in some way
	// return X; // return a new object if you want to replace nativeCfg
};

// sequence matters!
export default MigrationMatrix([
	// [from-schema, to-schema, migrationFunc]
	[15, 16, from15To16],
	[18, 19, from18To19],
]);
