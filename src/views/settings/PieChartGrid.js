import React, { useRef, useEffect } from 'react';

const PieChartGrid = ({ datasets }) => {
    const canvasRefs = useRef([]);

    // Predefined color map for certain labels
    const labelColorMap = {
        User: '#ec6b56',
        Nice: '#47b39c',
        System: '#faf3eb',
        Idle: '#ffc154',
    };

    useEffect(() => {
        datasets.forEach((dataset, index) => {
            const canvas = canvasRefs.current[index];
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) / 2;
            const total = dataset.data.reduce((sum, item) => sum + item.value, 0);

            let startAngle = 0;
            const sliceColors = [];

            dataset.data.forEach((item) => {
                const sliceAngle = (item.value / total) * 2 * Math.PI;

                // Get the predefined color for the label, or default to gray if not found
                const color = labelColorMap[item.label] || '#cccccc';
                sliceColors.push({ label: item.label, color });

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                ctx.fillStyle = color;
                ctx.fill();
                startAngle += sliceAngle;
            });

            // Draw legend below the pie chart
            drawLegend(ctx, sliceColors, width, height);
        });
    }, [datasets]);

    const drawLegend = (ctx, sliceColors, chartWidth, chartHeight) => {
        const legendX = 20;
        const legendY = chartHeight + 20;
        const legendSpacing = 15;
        const squareSize = 12;

        sliceColors.forEach((slice, index) => {
            // Draw color square
            ctx.fillStyle = slice.color;
            ctx.fillRect(legendX, legendY + index * (squareSize + legendSpacing), squareSize, squareSize);

            // Draw label
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.fillText(slice.label, legendX + squareSize + 5, legendY + index * (squareSize + legendSpacing) + 10);
        });
    };

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
            <div
                style={{
                    display: 'grid',
                    gridAutoFlow: 'column', // Arrange items in a row
                    gridAutoColumns: 'minmax(300px, 1fr)', // Minimum width for each grid item
                    gap: '20px',
                }}
            >
                {datasets.map((dataset, index) => (
                    <div key={index} style={{ width: '300px', height: '450px' }}>
                        <h5 style={{ margin: '10px 0', textAlign: 'center' }}>{dataset.label}</h5>
                        <canvas
                            ref={(el) => (canvasRefs.current[index] = el)}
                            width={300}
                            height={300}
                            style={{ display: 'block', margin: '0 auto' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChartGrid;
