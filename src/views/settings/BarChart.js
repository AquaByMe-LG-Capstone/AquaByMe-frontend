import { ResponsiveBar } from '@nivo/bar'

const BarChart = ({ dataset }) => {
    return (
        <ResponsiveBar
            data={dataset}
        />
    );
}

export default BarChart;