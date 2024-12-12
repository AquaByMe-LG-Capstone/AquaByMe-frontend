import React, { useRef, useEffect } from 'react';

const BarChart = ({ dataset }) => {
    const canvasRef = useRef(null);

    const labelColorMap = {
        usable_memory: '#47b39c',
        swapUsed: '#ffc154',
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const barWidth = width / dataset.length;
        const maxVal = Math.max(...dataset.map((data) => data.value));

        // Clear previous drawing
        ctx.clearRect(0, 0, width, height);

        // Draw bars
        dataset.forEach((data, index) => {
            const barHeight = (data.value / maxVal) * height;
            const x = index * barWidth;
            const y = height - barHeight;

            ctx.fillStyle = labelColorMap[data.label];
            ctx.fillRect(x, y, barWidth - 10, barHeight);
        });

        // Draw Legends
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';

        Object.entries(labelColorMap).forEach(([label, color], index) => {
            // Get current value for this label from data
            const currentValue = dataset.find(item => item.label === label)?.value || 0;

            // Draw color box
            ctx.fillStyle = color;
            ctx.fillRect(width - 150, 20 + (index * 25), 15, 15);

            // Draw label text and value
            ctx.fillStyle = 'black';
            ctx.fillText(`${label}: ${currentValue}`, width - 130, 32 + (index * 25));
        });
    }, [dataset]);

    return (
        <div style={{ position: 'relative' }}>
            <canvas
                ref={canvasRef}
                width={500}
                height={300}
                style={{ border: '1px solid #ddd' }}
            />
        </div>
    );
};

export default BarChart;