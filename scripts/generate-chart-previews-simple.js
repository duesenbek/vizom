/**
 * Simple Chart Preview Generator
 * Generates basic PNG previews using Canvas API without heavy library dependencies
 */

import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { getAllChartTypes } from '../src/charts/chart-types.js';

// Project color palette - Indigo/Royal Blue Theme
const PALETTE = {
  primary: '#1872D9',
  secondary: '#2196F3',
  accent: '#41C3FF',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  gray: ['#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0'],
  gradient: ['#1872D9', '#2196F3', '#41C3FF'],
  dark: '#003466',
  medium: '#123472'
};

class SimpleChartPreviewGenerator {
  constructor() {
    this.outputDir = path.join(process.cwd(), 'assets', 'chart-previews');
    this.chartTypes = getAllChartTypes();
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }
  
  async generateAllPreviews() {
    console.log(`🎨 Generating ${this.chartTypes.length} chart previews...`);
    
    const results = [];
    
    for (const chartType of this.chartTypes) {
      try {
        const success = await this.generatePreview(chartType);
        results.push({ type: chartType.id, success });
        
        if (success) {
          console.log(`✅ Generated ${chartType.id}.png`);
        } else {
          console.log(`❌ Failed to generate ${chartType.id}.png`);
        }
      } catch (error) {
        console.error(`❌ Error generating ${chartType.id}:`, error.message);
        results.push({ type: chartType.id, success: false, error: error.message });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`\n📊 Generation complete: ${successCount}/${results.length} previews created`);
    
    return results;
  }
  
  async generatePreview(chartType) {
    const canvas = createCanvas(300, 200);
    const ctx = canvas.getContext('2d');
    
    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 200);
    
    try {
      switch (chartType.category) {
        case 'basic':
          this.drawBasicChart(ctx, chartType);
          break;
        case 'composition':
          this.drawCompositionChart(ctx, chartType);
          break;
        case 'comparison':
          this.drawComparisonChart(ctx, chartType);
          break;
        case 'distribution':
          this.drawDistributionChart(ctx, chartType);
          break;
        case 'advanced':
          this.drawAdvancedChart(ctx, chartType);
          break;
        case 'financial':
          this.drawFinancialChart(ctx, chartType);
          break;
        case 'spatial':
          this.drawSpatialChart(ctx, chartType);
          break;
        case 'temporal':
          this.drawTemporalChart(ctx, chartType);
          break;
        case 'specialised':
          this.drawSpecialisedChart(ctx, chartType);
          break;
        default:
          this.drawPlaceholder(ctx, chartType);
      }
      
      // Save file
      const buffer = canvas.toBuffer('image/png');
      const filePath = path.join(this.outputDir, `${chartType.id}.png`);
      fs.writeFileSync(filePath, buffer);
      
      return true;
    } catch (error) {
      console.error(`Error generating ${chartType.id}:`, error);
      return this.generatePlaceholder(chartType);
    }
  }
  
  drawBasicChart(ctx, chartType) {
    switch (chartType.id) {
      case 'line':
      case 'spline':
        this.drawLineChart(ctx, chartType.id === 'spline');
        break;
      case 'bar':
      case 'column':
        this.drawBarChart(ctx, false);
        break;
      case 'grouped-bar':
        this.drawBarChart(ctx, true);
        break;
      case 'stacked-bar':
        this.drawStackedBarChart(ctx);
        break;
      case 'scatter':
        this.drawScatterChart(ctx);
        break;
      case 'bubble':
        this.drawBubbleChart(ctx);
        break;
      case 'area':
      case 'stepped-area':
        this.drawAreaChart(ctx, chartType.id === 'stepped-area');
        break;
      case 'pie':
      case 'doughnut':
        this.drawPieChart(ctx, chartType.id === 'doughnut');
        break;
      case 'polar-area':
        this.drawPolarAreaChart(ctx);
        break;
      default:
        this.drawPlaceholder(ctx, chartType);
    }
  }
  
  drawLineChart(ctx, smooth = false) {
    const data = [30, 45, 35, 50, 40, 60];
    const width = 250;
    const height = 150;
    const startX = 25;
    const startY = 25;
    
    ctx.strokeStyle = PALETTE.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = startX + (index / (data.length - 1)) * width;
      const y = startY + height - (value / 70) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else if (smooth) {
        const prevX = startX + ((index - 1) / (data.length - 1)) * width;
        const prevY = startY + height - (data[index - 1] / 70) * height;
        const cp1x = prevX + (x - prevX) / 2;
        const cp1y = prevY;
        const cp2x = prevX + (x - prevX) / 2;
        const cp2y = y;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = PALETTE.primary;
    data.forEach((value, index) => {
      const x = startX + (index / (data.length - 1)) * width;
      const y = startY + height - (value / 70) * height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  
  drawBarChart(ctx, grouped = false) {
    const data = grouped ? [[45, 30], [60, 35], [40, 50], [55, 40]] : [45, 30, 60, 35, 50];
    const width = 250;
    const height = 150;
    const startX = 25;
    const startY = 25;
    const barWidth = grouped ? width / (data.length * 2 + 1) : width / (data.length * 1.5);
    
    data.forEach((values, index) => {
      const bars = Array.isArray(values) ? values : [values];
      bars.forEach((value, barIndex) => {
        const x = startX + (index * (grouped ? 2 : 1.5) + barIndex) * barWidth;
        const barHeight = (value / 70) * height;
        const y = startY + height - barHeight;
        
        ctx.fillStyle = barIndex === 0 ? PALETTE.primary : PALETTE.secondary;
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
      });
    });
  }
  
  drawStackedBarChart(ctx) {
    const data = [
      [20, 15, 10],
      [25, 20, 15],
      [30, 25, 10],
      [20, 20, 10]
    ];
    const width = 250;
    const height = 150;
    const startX = 25;
    const startY = 25;
    const barWidth = width / (data.length * 1.5);
    
    data.forEach((stack, index) => {
      let currentHeight = 0;
      stack.forEach((value, stackIndex) => {
        const x = startX + index * barWidth * 1.5;
        const barHeight = (value / 70) * height;
        const y = startY + height - currentHeight - barHeight;
        
        ctx.fillStyle = [PALETTE.primary, PALETTE.secondary, PALETTE.accent][stackIndex];
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
        currentHeight += barHeight;
      });
    });
  }
  
  drawScatterChart(ctx) {
    const data = Array.from({ length: 20 }, () => ({
      x: Math.random() * 250 + 25,
      y: Math.random() * 150 + 25
    }));
    
    ctx.fillStyle = PALETTE.primary;
    data.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  
  drawBubbleChart(ctx) {
    const data = Array.from({ length: 8 }, () => ({
      x: Math.random() * 200 + 50,
      y: Math.random() * 100 + 50,
      r: Math.random() * 15 + 5
    }));
    
    ctx.fillStyle = PALETTE.primary + '80'; // Add transparency
    data.forEach(bubble => {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  
  drawAreaChart(ctx, stepped = false) {
    const data = [30, 45, 35, 50, 40, 60];
    const width = 250;
    const height = 150;
    const startX = 25;
    const startY = 25;
    
    // Draw filled area
    ctx.fillStyle = PALETTE.primary + '40'; // Light transparent fill
    ctx.beginPath();
    ctx.moveTo(startX, startY + height);
    
    data.forEach((value, index) => {
      const x = startX + (index / (data.length - 1)) * width;
      const y = startY + height - (value / 70) * height;
      
      if (stepped) {
        if (index > 0) {
          const prevX = startX + ((index - 1) / (data.length - 1)) * width;
          ctx.lineTo(x, startY + height - (data[index - 1] / 70) * height);
        }
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.lineTo(startX + width, startY + height);
    ctx.closePath();
    ctx.fill();
    
    // Draw line on top
    this.drawLineChart(ctx, false);
  }
  
  drawPieChart(ctx, doughnut = false) {
    const data = [30, 25, 20, 25];
    const centerX = 150;
    const centerY = 100;
    const radius = 60;
    const innerRadius = doughnut ? radius * 0.5 : 0;
    
    const colors = [PALETTE.primary, PALETTE.secondary, PALETTE.accent, PALETTE.success];
    const total = data.reduce((sum, value) => sum + value, 0);
    let currentAngle = -Math.PI / 2;
    
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * Math.PI * 2;
      
      ctx.fillStyle = colors[index];
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      if (doughnut) {
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      } else {
        ctx.lineTo(centerX, centerY);
      }
      ctx.closePath();
      ctx.fill();
      
      currentAngle += sliceAngle;
    });
  }
  
  drawPolarAreaChart(ctx) {
    const data = [30, 25, 20, 25, 15];
    const centerX = 150;
    const centerY = 100;
    const maxRadius = 60;
    
    const colors = [PALETTE.primary, PALETTE.secondary, PALETTE.accent, PALETTE.success, PALETTE.warning];
    const maxValue = Math.max(...data);
    const angleStep = (Math.PI * 2) / data.length;
    
    data.forEach((value, index) => {
      const radius = (value / maxValue) * maxRadius;
      const startAngle = index * angleStep - Math.PI / 2;
      const endAngle = (index + 1) * angleStep - Math.PI / 2;
      
      ctx.fillStyle = colors[index];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();
    });
  }
  
  drawCompositionChart(ctx, chartType) {
    // Simplified composition charts
    switch (chartType.id) {
      case 'radar':
        this.drawRadarChart(ctx);
        break;
      case 'treemap':
        this.drawTreemap(ctx);
        break;
      case 'funnel':
        this.drawFunnel(ctx);
        break;
      case 'sunburst':
        this.drawSunburst(ctx);
        break;
      default:
        this.drawPlaceholder(ctx, chartType);
    }
  }
  
  drawRadarChart(ctx) {
    const centerX = 150;
    const centerY = 100;
    const radius = 60;
    const points = 5;
    const data = [80, 65, 75, 85, 70];
    const angleStep = (Math.PI * 2) / points;
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      for (let j = 0; j <= points; j++) {
        const angle = j * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius * i / 5);
        const y = centerY + Math.sin(angle) * (radius * i / 5);
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw data
    ctx.fillStyle = PALETTE.primary + '40';
    ctx.strokeStyle = PALETTE.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((value, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * (radius * value / 100);
      const y = centerY + Math.sin(angle) * (radius * value / 100);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  
  drawTreemap(ctx) {
    const data = [
      { x: 25, y: 25, w: 100, h: 60 },
      { x: 125, y: 25, w: 75, h: 60 },
      { x: 200, y: 25, w: 75, h: 60 },
      { x: 25, y: 85, w: 125, h: 40 },
      { x: 150, y: 85, w: 125, h: 40 }
    ];
    
    const colors = [PALETTE.primary, PALETTE.secondary, PALETTE.accent, PALETTE.success, PALETTE.warning];
    
    data.forEach((rect, index) => {
      ctx.fillStyle = colors[index] + '80';
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.strokeStyle = colors[index];
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    });
  }
  
  drawFunnel(ctx) {
    const segments = [
      { top: 25, bottom: 45, width: 200 },
      { top: 45, bottom: 65, width: 160 },
      { top: 65, bottom: 85, width: 120 },
      { top: 85, bottom: 105, width: 80 }
    ];
    
    const colors = [PALETTE.primary, PALETTE.secondary, PALETTE.accent, PALETTE.success];
    
    segments.forEach((segment, index) => {
      const centerX = 150;
      ctx.fillStyle = colors[index] + '80';
      ctx.beginPath();
      ctx.moveTo(centerX - segment.width / 2, segment.top);
      ctx.lineTo(centerX + segment.width / 2, segment.top);
      ctx.lineTo(centerX + segment.width / 2 - 20, segment.bottom);
      ctx.lineTo(centerX - segment.width / 2 + 20, segment.bottom);
      ctx.closePath();
      ctx.fill();
    });
  }
  
  drawSunburst(ctx) {
    const centerX = 150;
    const centerY = 100;
    const rings = [
      { inner: 0, outer: 20, segments: 1 },
      { inner: 20, outer: 40, segments: 2 },
      { inner: 40, outer: 60, segments: 4 }
    ];
    
    const colors = [PALETTE.primary, PALETTE.secondary, PALETTE.accent, PALETTE.success];
    
    rings.forEach(ring => {
      const angleStep = (Math.PI * 2) / ring.segments;
      for (let i = 0; i < ring.segments; i++) {
        ctx.fillStyle = colors[i % colors.length] + '80';
        ctx.beginPath();
        ctx.arc(centerX, centerY, ring.outer, i * angleStep, (i + 1) * angleStep);
        ctx.arc(centerX, centerY, ring.inner, (i + 1) * angleStep, i * angleStep, true);
        ctx.closePath();
        ctx.fill();
      }
    });
  }
  
  drawComparisonChart(ctx, chartType) {
    // Simplified comparison charts
    switch (chartType.id) {
      case 'bullet':
        this.drawBulletChart(ctx);
        break;
      case 'gauge':
        this.drawGaugeChart(ctx);
        break;
      case 'progress':
        this.drawProgressChart(ctx);
        break;
      default:
        this.drawPlaceholder(ctx, chartType);
    }
  }
  
  drawBulletChart(ctx) {
    const x = 50;
    const y = 90;
    const width = 200;
    const height = 20;
    
    // Background ranges
    ctx.fillStyle = '#ef444440';
    ctx.fillRect(x, y, width * 0.6, height);
    ctx.fillStyle = '#f59e0b40';
    ctx.fillRect(x + width * 0.6, y, width * 0.3, height);
    ctx.fillStyle = '#10b98140';
    ctx.fillRect(x + width * 0.9, y, width * 0.1, height);
    
    // Actual value
    ctx.fillStyle = PALETTE.primary;
    ctx.fillRect(x, y - 5, width * 0.65, height + 10);
    
    // Target marker
    ctx.strokeStyle = PALETTE.danger;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + width * 0.8, y - 10);
    ctx.lineTo(x + width * 0.8, y + height + 10);
    ctx.stroke();
  }
  
  drawGaugeChart(ctx) {
    const centerX = 150;
    const centerY = 120;
    const radius = 60;
    const value = 0.75; // 75%
    
    // Background arc
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0);
    ctx.stroke();
    
    // Value arc
    ctx.strokeStyle = PALETTE.primary;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + (Math.PI * value));
    ctx.stroke();
  }
  
  drawProgressChart(ctx) {
    const centerX = 150;
    const centerY = 100;
    const radius = 50;
    const value = 0.65; // 65%
    
    // Background circle
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Progress arc
    ctx.strokeStyle = PALETTE.primary;
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * value));
    ctx.stroke();
  }
  
  drawDistributionChart(ctx, chartType) {
    // Simplified distribution charts
    switch (chartType.id) {
      case 'histogram':
        this.drawHistogram(ctx);
        break;
      case 'boxplot':
        this.drawBoxplot(ctx);
        break;
      default:
        this.drawPlaceholder(ctx, chartType);
    }
  }
  
  drawHistogram(ctx) {
    const data = [5, 8, 12, 15, 18, 14, 10, 6, 3, 1];
    const width = 250;
    const height = 150;
    const startX = 25;
    const startY = 25;
    const barWidth = width / data.length;
    
    ctx.fillStyle = PALETTE.primary + '80';
    data.forEach((value, index) => {
      const x = startX + index * barWidth;
      const barHeight = (value / 20) * height;
      const y = startY + height - barHeight;
      ctx.fillRect(x, y, barWidth * 0.8, barHeight);
    });
  }
  
  drawBoxplot(ctx) {
    const boxes = [
      { x: 60, min: 20, q1: 35, median: 45, q3: 60, max: 75 },
      { x: 150, min: 25, q1: 40, median: 50, q3: 65, max: 80 },
      { x: 240, min: 15, q1: 30, median: 40, q3: 55, max: 70 }
    ];
    
    ctx.strokeStyle = PALETTE.primary;
    ctx.fillStyle = PALETTE.primary + '40';
    ctx.lineWidth = 2;
    
    boxes.forEach(box => {
      // Whiskers
      ctx.beginPath();
      ctx.moveTo(box.x, box.max);
      ctx.lineTo(box.x, box.min);
      ctx.stroke();
      
      // Box
      ctx.fillRect(box.x - 15, box.q3, 30, box.q1 - box.q3);
      ctx.strokeRect(box.x - 15, box.q3, 30, box.q1 - box.q3);
      
      // Median
      ctx.beginPath();
      ctx.moveTo(box.x - 15, box.median);
      ctx.lineTo(box.x + 15, box.median);
      ctx.stroke();
    });
  }
  
  drawAdvancedChart(ctx, chartType) {
    // Simplified advanced charts
    switch (chartType.id) {
      case 'heatmap':
        this.drawHeatmap(ctx);
        break;
      case 'sankey':
        this.drawSankey(ctx);
        break;
      default:
        this.drawPlaceholder(ctx, chartType);
    }
  }
  
  drawHeatmap(ctx) {
    const rows = 5;
    const cols = 6;
    const cellWidth = 40;
    const cellHeight = 25;
    const startX = 30;
    const startY = 25;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const value = Math.random();
        const intensity = Math.floor(value * 255);
        ctx.fillStyle = `rgba(59, 130, 246, ${value})`;
        ctx.fillRect(startX + j * cellWidth, startY + i * cellHeight, cellWidth - 2, cellHeight - 2);
      }
    }
  }
  
  drawSankey(ctx) {
    const nodes = [
      { x: 50, y: 50, width: 20, height: 100 },
      { x: 130, y: 30, width: 20, height: 60 },
      { x: 130, y: 110, width: 20, height: 40 },
      { x: 210, y: 70, width: 20, height: 80 }
    ];
    
    const links = [
      { from: 0, to: 1, y1: 60, y2: 40, height: 30 },
      { from: 0, to: 2, y1: 90, y2: 120, height: 20 },
      { from: 1, to: 3, y1: 50, y2: 80, height: 25 },
      { from: 2, to: 3, y1: 120, y2: 105, height: 15 }
    ];
    
    // Draw links
    ctx.fillStyle = PALETTE.primary + '40';
    links.forEach(link => {
      ctx.beginPath();
      ctx.moveTo(nodes[link.from].x + nodes[link.from].width, link.y1);
      ctx.bezierCurveTo(
        nodes[link.from].x + 60, link.y1,
        nodes[link.to].x - 40, link.y2,
        nodes[link.to].x, link.y2
      );
      ctx.lineTo(nodes[link.to].x, link.y2 + link.height);
      ctx.bezierCurveTo(
        nodes[link.to].x - 40, link.y2 + link.height,
        nodes[link.from].x + 60, link.y1 + link.height,
        nodes[link.from].x + nodes[link.from].width, link.y1 + link.height
      );
      ctx.closePath();
      ctx.fill();
    });
    
    // Draw nodes
    ctx.fillStyle = PALETTE.primary;
    nodes.forEach(node => {
      ctx.fillRect(node.x, node.y, node.width, node.height);
    });
  }
  
  drawFinancialChart(ctx, chartType) {
    // Simplified financial charts
    switch (chartType.id) {
      case 'candlestick':
        this.drawCandlestick(ctx);
        break;
      default:
        this.drawPlaceholder(ctx, chartType);
    }
  }
  
  drawCandlestick(ctx) {
    const candles = Array.from({ length: 8 }, (_, i) => ({
      x: 40 + i * 30,
      open: 80 + Math.random() * 20,
      close: 85 + Math.random() * 20,
      high: 90 + Math.random() * 15,
      low: 75 + Math.random() * 15
    }));
    
    ctx.strokeStyle = PALETTE.primary;
    ctx.lineWidth = 1;
    
    candles.forEach(candle => {
      // Wick
      ctx.beginPath();
      ctx.moveTo(candle.x, candle.low);
      ctx.lineTo(candle.x, candle.high);
      ctx.stroke();
      
      // Body
      const isGreen = candle.close > candle.open;
      ctx.fillStyle = isGreen ? PALETTE.success : PALETTE.danger;
      const bodyTop = Math.min(candle.open, candle.close);
      const bodyHeight = Math.abs(candle.close - candle.open);
      ctx.fillRect(candle.x - 5, bodyTop, 10, bodyHeight || 1);
    });
  }
  
  drawSpatialChart(ctx, chartType) {
    // Simplified spatial charts
    this.drawPlaceholder(ctx, chartType);
  }
  
  drawTemporalChart(ctx, chartType) {
    // Simplified temporal charts
    this.drawPlaceholder(ctx, chartType);
  }
  
  drawSpecialisedChart(ctx, chartType) {
    // Simplified specialised charts
    this.drawPlaceholder(ctx, chartType);
  }
  
  drawPlaceholder(ctx, chartType) {
    // Draw a styled placeholder with chart type info
    const gradient = ctx.createLinearGradient(50, 50, 250, 150);
    gradient.addColorStop(0, PALETTE.primary + '20');
    gradient.addColorStop(1, PALETTE.secondary + '20');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(50, 50, 200, 100);
    
    ctx.strokeStyle = PALETTE.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, 200, 100);
    
    ctx.fillStyle = PALETTE.primary;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(chartType.icon || '📊', 150, 90);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(chartType.name, 150, 115);
    
    ctx.font = '10px Arial';
    ctx.fillText(`(${chartType.id})`, 150, 130);
  }
  
  async generatePlaceholder(chartType) {
    const canvas = createCanvas(300, 200);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 300, 200);
    
    this.drawPlaceholder(ctx, chartType);
    
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(this.outputDir, `${chartType.id}.png`);
    fs.writeFileSync(filePath, buffer);
    
    return true;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new SimpleChartPreviewGenerator();
  generator.generateAllPreviews().then(results => {
    process.exit(0);
  }).catch(error => {
    console.error('Generation failed:', error);
    process.exit(1);
  });
}

export { SimpleChartPreviewGenerator };
