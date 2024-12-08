/* eslint-disable */
import Button from '@enact/sandstone/Button';
import request from '../libs/request';
import useAuth from '../hooks/useAuth';

const Settings = ({ onLogout }) => {
	const sys = request('luna://com.webos.service.tv.systemproperty');
	const getProcStat = params =>
		sys({ method: 'getProcStat', ...params });
	const getUnitList = params =>
		sys({ method: 'getUnitList', ...params });

	const {
		userState,
		handleLogout,
	} = useAuth();

	return (
		<>
			<Button onClick={getProcStat}>Process Status</Button>
			<Button onClick={getUnitList}>Unit List</Button>
			<h3> Currently logged in as: {userState.username}</h3>
			<Button icon="exit" onClick={() => handleLogout(onLogout)}>Logout</Button>
		</>
	);
};

export default Settings;
