import React, { useState } from 'react';
import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import { Panel } from '@enact/sandstone/Panels';
import $L from '@enact/i18n/$L';
import Home from './Home';
import Sketch from './Sketch';
import Settings from './settings/Settings';
import Gallery from './Gallery/Gallery';
import MyStickers from './myArt/MyStickers';
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

	// if (!isLoggedIn) {
	// 	// Show the login page if not logged in
	// 	return <Login onLogin={handleLogin} onLogout={handleLogout} />;
	// }

	return (
		<div className={styles.surfaceContainer}>
			<TabLayout className={styles.fixedTabBar}>
				<Tab
					icon="picture"
					title={$L('Home')}>
					<Home />
				</Tab>
				<Tab
					icon="pen"
					title={$L('Sketch')}>
					<Sketch />
				</Tab>
				<Tab
					icon="star"
					title={$L('My Stickers')}>
					<MyStickers />
				</Tab>
				<Tab
					icon="stargroup"
					title={$L('Gallery')}>
					<Gallery />
				</Tab>
				<Tab
					icon="gear"
					title={$L('Settings')}>
					<Settings onLogout={handleLogout} />
				</Tab>
			</TabLayout>
			<Panel {...props} className={styles.customPanelPadding}>
				{/* 메인 컨텐츠 */}
			</Panel>
		</div>
	);
};
export default Main;
