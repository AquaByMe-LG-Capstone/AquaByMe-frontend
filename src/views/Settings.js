/* eslint-disable */
import React, { useState } from 'react';
import Button from '@enact/sandstone/Button';
import { getProcStat, getUnitList } from '../libs/services';
import debugLog from '../libs/log';
import useAuth from '../hooks/useAuth';
import Alert from '@enact/sandstone/Alert';

const Settings = ({ onLogout }) => {
	const {
		userState,
		handleLogout,
	} = useAuth();

	const [cpuStatus, setCpuStatus] = useState();

	const test = () => {
		getProcStat({
			parameters: {
				subscribe: true
			},
			onSuccess: res => {
				debugLog('GET_CONFIGS[S]', res);
				//cpuStat.current = res;
				setCpuStatus(res);
				console.log(cpuStatus);
			},
			onFailure: err => {
				debugLog('GET_CONFIGS[F]', err);
			}
		});
	}

	return (
		<>
			<Button onClick={test}>Show CPU Status</Button>
			<Button onClick={getUnitList}>Show Memory Status</Button>
			<h3> Currently logged in as: {userState.username}</h3>
			<Button icon="exit" onClick={() => handleLogout(onLogout)}>Logout</Button>

		</>
	);
};

export default Settings;
