# VIZOM Prompt Guide

## How to Write Effective Prompts

### General Tips
1. **Be specific** about data values and labels
2. **Include context** (what the chart represents)
3. **Mention colors** if you have preferences
4. **Specify interactivity** needs (tooltips, legends, etc.)

---

## Chart Type Examples

### 📊 Bar Charts

**Basic Bar Chart:**
```
Create a bar chart showing monthly sales:
January: $12,000
February: $15,000
March: $18,000
April: $14,000
May: $19,000
June: $22,000
```

**Grouped Bar Chart:**
```
Generate a grouped bar chart comparing Product A vs Product B sales by quarter:
Q1: A=$50k, B=$45k
Q2: A=$65k, B=$58k
Q3: A=$72k, B=$68k
Q4: A=$80k, B=$75k
```

**Horizontal Bar Chart:**
```
Create a horizontal bar chart of top 5 countries by population:
China: 1.4B, India: 1.3B, USA: 330M, Indonesia: 270M, Pakistan: 220M
```

---

### 📈 Line Charts

**Single Line:**
```
Generate a line chart showing website traffic over 6 months:
Jan: 1,200 visitors
Feb: 1,500 visitors
Mar: 1,800 visitors
Apr: 2,100 visitors
May: 2,400 visitors
Jun: 2,800 visitors
```

**Multi-Line Comparison:**
```
Create a line chart comparing revenue vs expenses:
Jan: Revenue $50k, Expenses $35k
Feb: Revenue $55k, Expenses $38k
Mar: Revenue $62k, Expenses $40k
Apr: Revenue $68k, Expenses $42k
```

**Line with Area Fill:**
```
Generate a line chart with gradient fill showing stock price:
Mon: $150, Tue: $155, Wed: $152, Thu: $158, Fri: $162
Use blue gradient fill and smooth curves
```

---

### 🥧 Pie & Doughnut Charts

**Pie Chart:**
```
Create a pie chart of market share:
Company A: 35%
Company B: 28%
Company C: 22%
Company D: 15%
Use vibrant colors
```

**Doughnut Chart:**
```
Generate a doughnut chart showing budget allocation:
Marketing: $50k
Development: $80k
Operations: $40k
Sales: $30k
```

---

### 📋 Tables

**Basic Table:**
```
Create a table of employee data:
John Doe, Software Engineer, $95,000
Jane Smith, Product Manager, $105,000
Bob Johnson, Designer, $85,000
Alice Williams, Data Analyst, $90,000
Include striped rows and hover effects
```

**Table with Status:**
```
Generate a table of project status:
Project Alpha | In Progress | 75% | Due: Dec 15
Project Beta | Completed | 100% | Due: Nov 30
Project Gamma | Planning | 10% | Due: Jan 20
Use color-coded status badges
```

**Data Table with Sorting:**
```
Create a sortable table of sales data:
Product | Units | Revenue | Growth
Widget A | 150 | $4,500 | +12%
Widget B | 120 | $3,600 | -5%
Widget C | 200 | $6,000 | +25%
```

---

### 📊 Dashboards

**Sales Dashboard:**
```
Build a sales dashboard with:
- Total Revenue: $250,000 (card with green trend +15%)
- New Customers: 145 (card with blue icon)
- Conversion Rate: 3.2% (card with percentage)
- Monthly revenue bar chart (last 6 months)
- Top products table (top 5)
Use a grid layout with cards
```

**Analytics Dashboard:**
```
Create an analytics dashboard showing:
- Page Views: 45.2K (large number card)
- Bounce Rate: 42% (with red indicator)
- Avg Session: 3m 24s
- Line chart of daily visitors (last 30 days)
- Pie chart of traffic sources (Organic, Direct, Social, Referral)
Modern design with shadows and rounded corners
```

**Financial Dashboard:**
```
Generate a financial dashboard with:
- Revenue vs Expenses line chart (dual axis)
- Profit margin gauge/progress bar
- Top expenses table
- Monthly comparison bar chart
- KPI cards: Revenue, Profit, Expenses, Margin
Use professional blue/green color scheme
```

---

## Advanced Techniques

### Custom Styling
```
Create a bar chart of quarterly sales with:
- Gradient colors from blue to purple
- Rounded bar corners
- Animated on load
- Dark mode styling
- Custom font: Inter
Data: Q1: $50k, Q2: $65k, Q3: $72k, Q4: $80k
```

### Interactive Features
```
Generate a line chart with:
- Clickable data points
- Zoom functionality
- Crosshair cursor
- Data labels on hover
- Export button
Data: Monthly revenue for 2024
```

### Responsive Design
```
Create a mobile-friendly dashboard that:
- Stacks vertically on small screens
- Uses 2 columns on tablets
- Uses 3 columns on desktop
- Has touch-friendly buttons
Include: 3 KPI cards and 2 charts
```

---

## Data Format Tips

### Numbers
- Use commas: `1,234` or `$1,234`
- Use K/M for thousands/millions: `$50K`, `1.2M`
- Include units: `$`, `%`, `units`, `kg`, etc.

### Dates
- Be consistent: `Jan 2024` or `2024-01` or `January 2024`
- For time series, specify range: `Last 6 months`, `Q1-Q4 2024`

### Categories
- Keep labels short and clear
- Use consistent naming
- Group related items

---

## Common Mistakes to Avoid

❌ **Too vague:**
```
Create a chart with some data
```

✅ **Specific:**
```
Create a bar chart showing monthly sales from Jan to Jun 2024:
Jan: $12k, Feb: $15k, Mar: $18k, Apr: $14k, May: $19k, Jun: $22k
```

---

❌ **Missing context:**
```
10, 20, 30, 40, 50
```

✅ **With context:**
```
Create a line chart of customer satisfaction scores over 5 weeks:
Week 1: 10, Week 2: 20, Week 3: 30, Week 4: 40, Week 5: 50
```

---

❌ **Inconsistent formatting:**
```
Jan: $50k, February: 65000, Mar: $72K
```

✅ **Consistent:**
```
Jan: $50k, Feb: $65k, Mar: $72k
```

---

## Pro Tips

1. **Mention Chart.js** if you want specific Chart.js features
2. **Request Tailwind classes** for consistent styling
3. **Ask for CDN links** to ensure all dependencies are included
4. **Specify dimensions** if you need a specific size
5. **Request animations** for more engaging visuals
6. **Include legends and tooltips** for better UX

---

## Example Workflow

1. **Start simple:**
   ```
   Create a bar chart of monthly sales: Jan $10k, Feb $12k, Mar $15k
   ```

2. **Review the output**

3. **Refine with details:**
   ```
   Create a bar chart of monthly sales with:
   - Data: Jan $10k, Feb $12k, Mar $15k
   - Blue gradient colors
   - Rounded corners
   - Animated bars
   - Show values on top of bars
   ```

4. **Generate and download**

---

## Need Help?

- Check the examples folder for sample outputs
- Review generated HTML to understand the structure
- Experiment with different prompts
- Combine multiple chart types in dashboards

Happy visualizing! 🎨📊
