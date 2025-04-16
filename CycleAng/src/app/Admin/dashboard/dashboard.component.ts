import { Component, ViewEncapsulation } from '@angular/core';

import { ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';




@Component({
  selector: 'app-dashboard',
  imports: [NgChartsModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
 // Line Chart Data
 lineChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      data: [65, 59, 80, 81, 56, 55, 40],
      label: 'Sales',
      borderColor: '#42A5F5',
      fill: false, // Ensures the area below the line isn't filled
      tension: 0.4 // Makes the line a little smoother
    }
  ]
};

// Line Chart Options
lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        color: 'rgba(0,0,0,0.1)',
        drawTicks: false
      },
      ticks: {
        color: '#555',
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(0,0,0,0.1)',
      },
      ticks: {
        color: '#555',
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false // Optional: hide legend
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: '#00bcd4',
      borderWidth: 2
    }
  }
};

  
    // ❌ REMOVE THIS (No need separate ChartType variable anymore)
  
    // ✅ Pie Chart Setup
    pieChartData: ChartData<'doughnut'> = {
      labels: ['Pending Orders', 'Completed Orders', 'Cancelled Orders'],
      datasets: [
        {
          data: [40, 45, 15],
          backgroundColor: [
            '#6C63FF', // violet
            '#00C49F', // green
            '#FF6B6B'  // red
          ],
          hoverBackgroundColor: [
            '#5a54d1', 
            '#00b18b', 
            '#e95c5c'
          ],
          borderWidth: 3,
          borderColor: '#ffffff',
          hoverBorderColor: '#000000', // Black border on hover
          hoverBorderWidth: 2
        }
      ]
    };
    
    // ✅ Updated Pie Chart Options
    pieChartOptions: ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false, // ✅ This makes the chart fill the card nicely
      cutout: '65%', // ✅ Makes doughnut a little thicker
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#444', // darker for better readability
            font: {
              size: 13,
              weight: '600'
            },
            padding: 20
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#333',
          titleColor: '#fff',
          bodyColor: '#eee',
          borderColor: '#fff',
          borderWidth: 1,
          padding: 12
        }
      }
    };
}
