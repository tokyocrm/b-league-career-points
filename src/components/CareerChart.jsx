import { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js modules
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export default function CareerChart({ playerInfo }) {
    const { name, seasons, cumulative_points } = playerInfo;

    const data = useMemo(() => {
        return {
            labels: seasons,
            datasets: [
                {
                    label: 'Cumulative Points',
                    data: cumulative_points,
                    borderColor: '#58a6ff',
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#58a6ff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#58a6ff',
                    pointHoverBorderColor: '#fff',
                    tension: 0.2, // Smooth organic curve
                },
            ],
        };
    }, [seasons, cumulative_points]);

    const options = useMemo(() => {
        const textColor = '#8b949e';
        const gridColor = 'rgba(48, 54, 61, 0.4)';

        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500,
                easing: 'easeOutQuart',
            },
            layout: {
                padding: {
                    top: 30,
                    right: 20,
                    bottom: 10,
                    left: 10,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: `${name} 選手の得点推移`,
                    color: '#f0f6fc',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 18,
                        weight: 'bold',
                    },
                    padding: { top: 10, bottom: 20 },
                },
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(13, 17, 23, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(88, 166, 255, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        title: (ctx) => `シーズン: ${ctx[0].label}`,
                        label: (ctx) => `通算得点: ${ctx.parsed.y} pts`,
                    },
                },
                datalabels: {
                    anchor: 'end',
                    align: 'bottom',
                    offset: 10,
                    font: {
                        weight: 'bold',
                        size: 14,
                        family: "'Inter', sans-serif",
                    },
                    color: '#c9d1d9',
                    formatter: (value) => value,
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'シーズン',
                        color: textColor,
                        font: { family: "'Inter', sans-serif", weight: '600' },
                    },
                    grid: {
                        color: 'transparent',
                        drawBorder: true,
                        borderColor: gridColor,
                    },
                    ticks: {
                        color: textColor,
                        font: { size: 12, family: "'Inter', sans-serif" },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: '得点',
                        color: textColor,
                        font: { family: "'Inter', sans-serif", weight: '600' },
                    },
                    beginAtZero: true,
                    grid: {
                        color: gridColor,
                        drawBorder: false,
                    },
                    ticks: {
                        color: textColor,
                        font: { size: 12, family: "'Inter', sans-serif" },
                        padding: 10,
                    },
                },
            },
        };
    }, [name]);

    return (
        <div className="chart-wrapper animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Line data={data} options={options} />
        </div>
    );
}
