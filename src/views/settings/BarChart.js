import { ResponsiveBar } from '@nivo/bar';
import ChartCustomTheme from './ChartTheme';

const BarChart = ({ dataset }) => {
    return (
        <div
            style={{
                maxWidth: '100vw',
                height: '450px',
                overflowX: 'auto',
                whiteSpace: 'nowrap', // Prevent wrapping
                padding: '10px',
                border: '1px solid #333',
                borderRadius: '8px',
            }}
        >
            <ResponsiveBar
                data={dataset}
                keys={['value']}
                indexBy="label"
                layout="horizontal"
                margin={{ top: 0, right: 20, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'nivo' }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Memory (MB)',
                    legendPosition: 'middle',
                    legendOffset: 32,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: -40,
                }}
                theme={ChartCustomTheme} // Apply the custom theme
            />
        </div>
    );
};

export default BarChart;