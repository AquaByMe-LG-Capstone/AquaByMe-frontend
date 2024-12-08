import request from '../libs/request';

const sys = request('luna://com.webos.service.tv.systemproperty');
export const getSystemInfo = params =>
	sys({ method: 'getSystemInfo', ...params });

const m = request('luna://com.webos.memorymanager')
export const getProcStat = params => {
	m({ method: 'getProcStat', ...params });
}
export const getUnitList = params =>
	m({ method: 'getUnitList', ...params });

const sam = request('luna://com.webos.applicationManager');
export const launch = parameters => sam({ method: 'launch', parameters });
