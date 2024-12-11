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

        dataset.forEach((data, index) => {
            const barHeight = (data.value / maxVal) * height;
            const x = index * barWidth;
            const y = height - barHeight;

            ctx.fillStyle = labelColorMap[data.label]
            ctx.fillRect(x, y, barWidth - 10, barHeight); // draw bar
        });
    }, [dataset]);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return <canvas ref={canvasRef} width={500} height={300}></canvas>;
};

export default BarChart;
