// import { useState, useEffect, useRef } from 'react';
// import Button from '@enact/sandstone/Button';
// import { getProcStat, getUnitList } from '../../libs/services';
// import debugLog from '../../libs/log';
// import useAuth from '../../hooks/useAuth';
// import PieChartGrid from './PieChartGrid';
// import BarChart from './BarChart';

// const Settings = ({ onLogout }) => {
// 	const {
// 		userState,
// 		handleLogout,
// 	} = useAuth();

// 	const cpuRef = useRef(null);
// 	const memRef = useRef(null);
// 	const [cpuUsage, setCpuUsage] = useState([]);
// 	const [memoryUsage, setMemoryUsage] = useState([]);

// 	useEffect(() => {
// 		if (!cpuRef.current) {
// 			cpuRef.current = getProcStat({
// 				parameters: {
// 					subscribe: true
// 				},
// 				onSuccess: res => {
// 					debugLog('GET_CONFIGS[S]', res);
// 					const cpuStats = [];
// 					res.stat.slice(0, 5).map((element) => {
// 						const parts = element.split(/\s+/); // Split each stat line into parts
// 						const parsedLine = {
// 							label: parts[0], // e.g., 'cpu', 'cpu0'
// 							data: [
// 								{ id: 'user', label: 'User', value: parseInt(parts[1]) },
// 								{ id: 'nice', label: 'Nice', value: parseInt(parts[2]) },
// 								{ id: 'system', label: 'System', value: parseInt(parts[3]) },
// 								{ id: 'idle', label: 'Idle', value: parseInt(parts[4]) },
// 							],
// 						};

// 						cpuStats.push(parsedLine);
// 					});
// 					console.log(cpuStats);
// 					setCpuUsage(cpuStats);

// 				},
// 				onFailure: err => {
// 					debugLog('GET_CONFIGS[F]', err);
// 				}
// 			});
// 		}

// 		if (!memRef.current) {
// 			memRef.current = getUnitList({
// 				parameters: {
// 					subscribe: true
// 				},
// 				onSuccess: res => {
// 					debugLog('GET_CONFIGS[S]', res);
// 					const memStats = [{ label: 'usable_memory', value: res.usable_memory }, { label: 'swapUsed', value: res.swapUsed }];
// 					console.log(memStats);
// 					setMemoryUsage(memStats);
// 				},
// 				onFailure: err => {
// 					debugLog('GET_CONFIGS[F]', err);
// 				}
// 			});
// 		}

// 		return () => {
// 			if (cpuRef.current) {
// 				cpuRef.current.cancel();
// 				cpuRef.current = null;
// 			}

// 			if (memRef.current) {
// 				memRef.current.cancel();
// 				memRef.current = null;
// 			}
// 		};
// 	}, []);

// 	return (
// 		<>
// 			<div
// 				style={{
// 					display: 'flex',
// 					flexDirection: 'column',
// 					gap: '20px',
// 					overflowY: 'auto',
// 					maxHeight: '80vh',
// 					padding: '10px',
// 				}}
// 			>
// 				{/* CPU Status */}
// 				<div>
// 					<h3>Current CPU Status</h3>
// 					<PieChartGrid datasets={cpuUsage} />
// 				</div>

// 				{/* Memory Status */}
// 				<div>
// 					<h3>Current Memory Status</h3>
// 					<BarChart dataset={memoryUsage} />
// 				</div>

// 				{/* User Info and Logout */}
// 				<div style={{ textAlign: 'center' }}>
// 					<h3>Currently logged in as: {userState.username}</h3>
// 					<Button icon="exit" onClick={() => handleLogout(onLogout)}>Logout</Button>
// 				</div>
// 			</div>

// 		</>
// 	);
// };

// export default Settings;
