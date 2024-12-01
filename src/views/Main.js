import TabLayout, { Tab } from '@enact/sandstone/TabLayout';
import { Header, Panel } from '@enact/sandstone/Panels';
import $L from '@enact/i18n/$L';
import Home from './Home';
import Sketch from './Sketch';
import Settings from './Settings';
import Gallery from './Gallery';

const Main = props => {
	return (
		<Panel {...props} >
			<Header title={$L('Aqua By Me')} />
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
					title={$L('Gallery')}>
					<Gallery />
				</Tab>
				<Tab
					icon="gear"
					title={$L('Settings')}>
					<Settings />
				</Tab>
			</TabLayout>
		</Panel>
	);
};
export default Main;
