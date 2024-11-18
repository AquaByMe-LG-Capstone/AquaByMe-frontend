import TabLayout, {Tab} from '@enact/sandstone/TabLayout';
import {Header, Panel} from '@enact/sandstone/Panels';
import $L from '@enact/i18n/$L';
import Home from './Home';
import Sketch from './Sketch';
import Account from './Account';

const Main = props => {
	return (
		<Panel {...props}>
			<Header title={$L('Enact Template')} />
			<TabLayout>
				<Tab title={$L('Home')}>
					<Home />
				</Tab>
				<Tab title={$L('Sketch')}>
					<Sketch />
				</Tab>
				<Tab title={$L('Account')}>
					<Account />
				</Tab>
			</TabLayout>
		</Panel>
	);
};
export default Main;
