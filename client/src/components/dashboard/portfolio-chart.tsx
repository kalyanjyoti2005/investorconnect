import { useEffect, useRef } from "react";
import { useTheme } from "@/context/theme-context";
import { Chart, ChartData, ChartOptions, registerables } from "chart.js";
import { Card } from "@/components/ui/card";

// Register Chart.js components
Chart.register(...registerables);

export default function PortfolioChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const { theme } = useTheme();

  // Sample data for the portfolio performance chart
  const portfolioData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [4200000, 4300000, 4250000, 4400000, 4800000, 5100000, 5300000, 5450000, 5600000, 5900000, 6200000, 6389400],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        pointBackgroundColor: '#4F46E5',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Benchmark',
        data: [4200000, 4250000, 4300000, 4350000, 4500000, 4600000, 4750000, 4900000, 5050000, 5200000, 5350000, 5500000],
        borderColor: '#9CA3AF',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        pointBackgroundColor: '#9CA3AF',
        borderDash: [5, 5],
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Chart configuration
  const chartConfig: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          color: theme === 'dark' ? '#F9FAFB' : '#1F2937',
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
        }
      },
      y: {
        grid: {
          color: theme === 'dark' ? 'rgba(107, 114, 128, 0.2)' : 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
          callback: function(value) {
            return '$' + (Number(value) / 1000000).toFixed(1) + 'M';
          }
        }
      }
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: portfolioData,
          options: chartConfig
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [theme]); // Recreate chart when theme changes

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <canvas ref={chartRef} className="w-full h-full"></canvas>
    </div>
  );
}
