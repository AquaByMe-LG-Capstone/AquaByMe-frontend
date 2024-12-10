const ChartCustomTheme = {
    axis: {
        domain: {
            line: {
                stroke: '#444',
                strokeWidth: 1,
            },
        },
        ticks: {
            line: {
                stroke: '#444', // Color of tick marks
                strokeWidth: 1, // Thickness of tick marks
            },
            text: {
                fill: '#888', // Color of tick labels
                fontSize: 12, // Font size of tick labels
            },
        },
        legend: {
            text: {
                fill: '#999', // Color of axis legend text
            },
        },
    },
    labels: {
        text: {
            fill: '#000', // Color of bar labels
        },
    },
    tooltip: {
        container: {
            background: '#fff', // Tooltip background
            color: '#333', // Tooltip text color
            fontSize: 12,
            borderRadius: 4,
            boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)',
        },
    },
};

export default ChartCustomTheme;