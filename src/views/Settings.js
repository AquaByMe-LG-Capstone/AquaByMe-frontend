import React, { useState, useEffect, useRef } from 'react';
import Button from '@enact/sandstone/Button';
import { getProcStat, getUnitList } from '../libs/services';
import debugLog from '../libs/log';
import useAuth from '../hooks/useAuth';

const Settings = ({ onLogout }) => {
	const {
		userState,
		handleLogout,
	} = useAuth();

	const cpuRef = useRef(null);
	const memRef = useRef(null);
	const [cpuUsage, setCpuUsage] = useState(0); // Percentage of CPU usage
	const [memoryUsage, setMemoryUsage] = useState({
		used: 0, // Used memory in GB
		total: 8, // Total memory in GB
	});

	useEffect(() => {
		if (!cpuRef.current) {
			cpuRef.current = getProcStat({
				parameters: {
					subscribe: true
				},
				onSuccess: res => {
					debugLog('GET_CONFIGS[S]', res);
					res.stat.slice(0, 5).map((element, index) => {
						element.split(/\s+/).slice(1, 5);
						setCpuUsage(element);
					});

				},
				onFailure: err => {
					debugLog('GET_CONFIGS[F]', err);
				}
			});
		}

		if (!memRef.current) {
			memRef.current = getUnitList({
				parameters: {
					subscribe: true
				},
				onSuccess: res => {
					debugLog('GET_CONFIGS[S]', res);
					setMemoryUsage([res.usable_memory, res.swapUsed]);
					setMemoryUsage(res);
				},
				onFailure: err => {
					debugLog('GET_CONFIGS[F]', err);
				}
			});
		}

		const interval = setInterval(() => {
			setCpuUsage(Math.floor(Math.random() * 100)); // Simulated CPU usage
			setMemoryUsage({
				used: (Math.random() * 8).toFixed(2), // Simulated memory usage
				total: 8, // Total memory in GB
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
				{/* CPU Usage */}
				<div style={{ textAlign: 'center' }}>
					<h2>CPU Usage</h2>
					<div
						style={{
							width: '150px',
							height: '150px',
							borderRadius: '50%',
							background: `conic-gradient(
                            #4caf50 ${cpuUsage * 3.6}deg,
                            #ddd ${cpuUsage * 3.6}deg
                        )`,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							fontSize: '24px',
							color: '#333',
						}}
					>
						{cpuUsage}%
					</div>
				</div>

				{/* Memory Usage */}
				<div style={{ textAlign: 'center', width: '80%' }}>
					<h2>Memory Usage</h2>
					<div
						style={{
							width: '100%',
							height: '30px',
							background: '#ddd',
							borderRadius: '15px',
							overflow: 'hidden',
							position: 'relative',
						}}
					>
						<div
							style={{
								width: `${(memoryUsage.used / memoryUsage.total) * 100}%`,
								height: '100%',
								background: '#4caf50',
								transition: 'width 0.5s ease',
							}}
						></div>
					</div>
					<div style={{ marginTop: '10px', fontSize: '16px' }}>
						{memoryUsage.used} GB / {memoryUsage.total} GB
					</div>
				</div>
			</div>
			<h3> Currently logged in as: {userState.username}</h3>
			<Button icon="exit" onClick={() => handleLogout(onLogout)}>Logout</Button>

		</>
	);
};

export default Settings;
