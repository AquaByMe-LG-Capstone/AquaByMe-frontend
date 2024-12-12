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

            // Clear previous drawing
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) / 2 - 20; // Reduced radius to make room for labels
            const total = dataset.data.reduce((sum, item) => sum + item.value, 0);

            let startAngle = 0;
            const sliceColors = [];

            dataset.data.forEach((item) => {
                const sliceAngle = (item.value / total) * 2 * Math.PI;

                // Get the predefined color for the label, or default to gray if not found
                const color = labelColorMap[item.label] || '#cccccc';
                sliceColors.push({
                    label: item.label,
                    color,
                    value: item.value,
                    percentage: ((item.value / total) * 100).toFixed(1)
                });

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                ctx.fillStyle = color;
                ctx.fill();

                startAngle += sliceAngle;
            });

            // Draw legend
            drawLegend(ctx, sliceColors, width, height);
        });
    }, [datasets]);

    const drawLegend = (ctx, sliceColors, chartWidth, chartHeight) => {
        const legendX = 10;
        const legendY = chartHeight - 10; // Position legend at the bottom
        const legendSpacing = 20;
        const squareSize = 12;

        // Sort slices by value in descending order
        const sortedSlices = [...sliceColors].sort((a, b) => b.value - a.value);

        // Set font and text style for legend
        ctx.font = '12px Arial';
        ctx.textBaseline = 'middle';

        sortedSlices.forEach((slice, index) => {
            // Draw color square
            ctx.fillStyle = slice.color;
            ctx.fillRect(legendX, legendY - index * legendSpacing, squareSize, squareSize);

            // Draw label and percentage
            ctx.fillStyle = '#000';
            ctx.fillText(
                `${slice.label} (${slice.percentage}%)`,
                legendX + squareSize + 5,
                legendY - index * legendSpacing + squareSize / 2
            );
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
                            height={350} // Increased height to accommodate legend
                            style={{ display: 'block', margin: '0 auto' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChartGrid;