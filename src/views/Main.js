import React, { useState } from 'react';
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import { Panel } from '@enact/sandstone/Panels';
import $L from '@enact/i18n/$L';
import Home from './Home';
import Sketch from './Sketch';
import Settings from './Settings';
import Gallery from './Gallery';
import MyStickers from './MyStickers';
import Login from './login/Login';
import styles from "./Main.module.less";

const Main = props => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogin = () => {
		setIsLoggedIn(true); // Update the login state
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
	};

	if (!isLoggedIn) {
		// Show the login page if not logged in
		return <Login onLogin={handleLogin} onLogout={handleLogout} />;
	}

	return (
		<Panel {...props} className={styles.customPanelPadding} >
			{/* <Header title={$L('Aqua By Me')} /> */}
			<TabLayout>
				<Tab
					icon="home"
					title={$L('Home')}>
					<Home />
				</Tab>
				<Tab
					icon="create"
					title={$L('Sketch')}>
					<Sketch />
				</Tab>
				<Tab
					icon="samples"
					title={$L('My Stickers')}>
					<MyStickers />
				</Tab>
				<Tab
					icon="network"
					title={$L('Gallery')}>
					<Gallery />
				</Tab>
				<Tab
					icon="gear"
					title={$L('Settings')}>
					<Settings onLogout={handleLogout} />
				</Tab>
			</TabLayout>
		</Panel>
	);
};
export default Main;
