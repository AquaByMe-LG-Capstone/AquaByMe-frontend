/* eslint-disable */
import Button from '@enact/sandstone/Button';
import request from '../libs/request';

const Settings = () => {
	const sys = request('luna://com.webos.service.tv.systemproperty');
	const getProcStat = params =>
		sys({ method: 'getProcStat', ...params });
	const getUnitList = params =>
		sys({ method: 'getUnitList', ...params });

	const getUserID = () => "username";
	return (
		<>
			<Button onClick={getProcStat}>Process Status</Button>
			<Button onClick={getUnitList}>Unit List</Button>
			<h3> Currently logged in as: {getUserID()}</h3>
			<Button icon="exit">Logout</Button>
		</>
	);
};

export default Settings;
