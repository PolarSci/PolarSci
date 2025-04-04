import Chart from 'chart.js/auto';

class DataVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.chart = null;
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  createLineChart(data, labels, options = {}) {
    this.destroy();

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: options.title || 'Data Visualization'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: options.yAxisLabel || 'Value'
          }
        },
        x: {
          title: {
            display: true,
            text: options.xAxisLabel || 'Time'
          }
        }
      }
    };

    this.chart = new Chart(this.canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: options.datasetLabel || 'Data',
          data: data,
          borderColor: options.borderColor || 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: options.fill || false
        }]
      },
      options: { ...defaultOptions, ...options }
    });

    return this.chart;
  }

  createBarChart(data, labels, options = {}) {
    this.destroy();

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: options.title || 'Data Visualization'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: options.yAxisLabel || 'Value'
          }
        },
        x: {
          title: {
            display: true,
            text: options.xAxisLabel || 'Categories'
          }
        }
      }
    };

    this.chart = new Chart(this.canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: options.datasetLabel || 'Data',
          data: data,
          backgroundColor: options.backgroundColor || 'rgba(75, 192, 192, 0.2)',
          borderColor: options.borderColor || 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      },
      options: { ...defaultOptions, ...options }
    });

    return this.chart;
  }

  createScatterPlot(data, labels, options = {}) {
    this.destroy();

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: options.title || 'Data Visualization'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: options.yAxisLabel || 'Y Value'
          }
        },
        x: {
          title: {
            display: true,
            text: options.xAxisLabel || 'X Value'
          }
        }
      }
    };

    this.chart = new Chart(this.canvas, {
      type: 'scatter',
      data: {
        datasets: [{
          label: options.datasetLabel || 'Data',
          data: data.map((point, index) => ({
            x: point.x,
            y: point.y
          })),
          backgroundColor: options.backgroundColor || 'rgb(75, 192, 192)',
          borderColor: options.borderColor || 'rgb(75, 192, 192)'
        }]
      },
      options: { ...defaultOptions, ...options }
    });

    return this.chart;
  }

  updateData(newData, newLabels = null) {
    if (!this.chart) return;

    if (newLabels) {
      this.chart.data.labels = newLabels;
    }

    if (Array.isArray(newData)) {
      this.chart.data.datasets[0].data = newData;
    } else if (typeof newData === 'object' && newData !== null) {
      this.chart.data.datasets = Object.entries(newData).map(([label, data], index) => ({
        label,
        data,
        borderColor: this.getColor(index),
        backgroundColor: this.getColor(index, 0.2),
        fill: false
      }));
    }

    this.chart.update();
  }

  getColor(index, alpha = 1) {
    const colors = [
      `rgba(75, 192, 192, ${alpha})`,
      `rgba(255, 99, 132, ${alpha})`,
      `rgba(54, 162, 235, ${alpha})`,
      `rgba(255, 206, 86, ${alpha})`,
      `rgba(153, 102, 255, ${alpha})`,
      `rgba(255, 159, 64, ${alpha})`,
      `rgba(76, 175, 80, ${alpha})`,
      `rgba(233, 30, 99, ${alpha})`
    ];
    return colors[index % colors.length];
  }
}

export default DataVisualizer; 