// VIZOM D3 Visualizations - Advanced Data Visualization
// Supports complex interactive charts and custom visualizations

export class D3Visualizations {
    constructor() {
        this.visualizations = new Map();
        this.colorSchemes = this.getColorSchemes();
        this.defaultSettings = this.getDefaultSettings();
    }

    // Default settings for D3 visualizations
    getDefaultSettings() {
        return {
            width: 800,
            height: 400,
            margin: { top: 20, right: 30, bottom: 40, left: 50 },
            transitionDuration: 750,
            colors: this.colorSchemes.default
        };
    }

    // Color schemes for D3
    getColorSchemes() {
        return {
            default: ['#0066FF', '#00C853', '#FF9500', '#FF3B30', '#AF52DE', '#5AC8FA', '#FFCC00'],
            pastel: ['#E3F2FD', '#E8F5E8', '#FFF3E0', '#FFEBEE', '#F3E5F5', '#E0F7FA', '#FFF8E1'],
            vibrant: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF', '#06FFB4', '#FF4365'],
            sequential: d3.schemeBlues[9],
            diverging: d3.schemeRdYlBu[11]
        };
    }

    // Interactive Line Chart with Zoom and Pan
    createInteractiveLineChart(containerId, data, options = {}) {
        const settings = { ...this.defaultSettings, ...options };
        const container = d3.select(`#${containerId}`);
        
        // Clear previous chart
        container.selectAll('*').remove();
        
        const svg = container.append('svg')
            .attr('width', settings.width)
            .attr('height', settings.height);

        const innerWidth = settings.width - settings.margin.left - settings.margin.right;
        const innerHeight = settings.height - settings.margin.top - settings.margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${settings.margin.left},${settings.margin.top})`);

        // Scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.value))
            .range([innerHeight, 0]);

        // Line generator
        const line = d3.line()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        // Area generator
        const area = d3.area()
            .x(d => xScale(d.date))
            .y0(innerHeight)
            .y1(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        // Gradient
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'area-gradient')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0).attr('y1', yScale.range()[0])
            .attr('x2', 0).attr('y2', yScale.range()[1]);

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', settings.colors[0])
            .attr('stop-opacity', 0.1);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', settings.colors[0])
            .attr('stop-opacity', 0.8);

        // Add area
        const areaPath = g.append('path')
            .datum(data)
            .attr('fill', 'url(#area-gradient)')
            .attr('d', area);

        // Add line
        const linePath = g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', settings.colors[0])
            .attr('stroke-width', 3)
            .attr('d', line);

        // Add dots
        const dots = g.selectAll('.dot')
            .data(data)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.date))
            .attr('cy', d => yScale(d.value))
            .attr('r', 4)
            .attr('fill', settings.colors[0])
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 6);
                
                // Tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'd3-tooltip')
                    .style('position', 'absolute')
                    .style('background', 'rgba(0, 0, 0, 0.8)')
                    .style('color', '#fff')
                    .style('padding', '8px 12px')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('pointer-events', 'none')
                    .style('opacity', 0);
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                
                tooltip.html(`Date: ${d.date.toLocaleDateString()}<br>Value: ${d.value.toFixed(2)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 4);
                
                d3.selectAll('.d3-tooltip').remove();
            });

        // Axes
        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat('%b %Y'));
        
        const yAxis = d3.axisLeft(yScale);

        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(xAxis);

        g.append('g')
            .call(yAxis);

        // Zoom and pan
        const zoom = d3.zoom()
            .scaleExtent([1, 10])
            .on('zoom', function(event) {
                const { transform } = event;
                
                const newXScale = transform.rescaleX(xScale);
                const newYScale = transform.rescaleY(yScale);
                
                linePath
                    .datum(data)
                    .attr('d', d3.line()
                        .x(d => newXScale(d.date))
                        .y(d => newYScale(d.value))
                        .curve(d3.curveMonotoneX));
                
                areaPath
                    .datum(data)
                    .attr('d', d3.area()
                        .x(d => newXScale(d.date))
                        .y0(innerHeight)
                        .y1(d => newYScale(d.value))
                        .curve(d3.curveMonotoneX));
                
                dots
                    .attr('cx', d => newXScale(d.date))
                    .attr('cy', d => newYScale(d.value));
                
                g.select('.x-axis')
                    .call(xAxis.scale(newXScale));
                
                g.select('.y-axis')
                    .call(yAxis.scale(newYScale));
            });

        svg.call(zoom);

        // Store visualization reference
        this.visualizations.set(containerId, { svg, g, data, settings });

        return { svg, g, data, settings };
    }

    // Interactive Bar Chart with Sorting
    createInteractiveBarChart(containerId, data, options = {}) {
        const settings = { ...this.defaultSettings, ...options };
        const container = d3.select(`#${containerId}`);
        
        container.selectAll('*').remove();
        
        const svg = container.append('svg')
            .attr('width', settings.width)
            .attr('height', settings.height);

        const innerWidth = settings.width - settings.margin.left - settings.margin.right;
        const innerHeight = settings.height - settings.margin.top - settings.margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${settings.margin.left},${settings.margin.top})`);

        // Scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([0, innerWidth])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([innerHeight, 0]);

        // Color scale
        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.label))
            .range(settings.colors);

        // Bars
        const bars = g.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.label))
            .attr('width', xScale.bandwidth())
            .attr('y', innerHeight)
            .attr('height', 0)
            .attr('fill', d => colorScale(d.label))
            .attr('rx', 4)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.8);
                
                // Tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'd3-tooltip')
                    .style('position', 'absolute')
                    .style('background', 'rgba(0, 0, 0, 0.8)')
                    .style('color', '#fff')
                    .style('padding', '8px 12px')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('pointer-events', 'none')
                    .style('opacity', 0);
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                
                tooltip.html(`${d.label}<br>Value: ${d.value.toFixed(2)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1);
                
                d3.selectAll('.d3-tooltip').remove();
            })
            .on('click', function(event, d) {
                // Sort bars on click
                const sortedData = [...data].sort((a, b) => b.value - a.value);
                updateBars(sortedData);
            });

        // Animate bars
        bars.transition()
            .duration(settings.transitionDuration)
            .delay((d, i) => i * 50)
            .attr('y', d => yScale(d.value))
            .attr('height', d => innerHeight - yScale(d.value));

        // Update function
        function updateBars(newData) {
            xScale.domain(newData.map(d => d.label));
            
            bars.data(newData)
                .transition()
                .duration(settings.transitionDuration)
                .attr('x', d => xScale(d.label));
        }

        // Axes
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));

        this.visualizations.set(containerId, { svg, g, data, settings, updateBars });

        return { svg, g, data, settings, updateBars };
    }

    // Force-Directed Graph
    createForceGraph(containerId, nodes, links, options = {}) {
        const settings = { ...this.defaultSettings, ...options };
        const container = d3.select(`#${containerId}`);
        
        container.selectAll('*').remove();
        
        const svg = container.append('svg')
            .attr('width', settings.width)
            .attr('height', settings.height);

        // Color scale for nodes
        const colorScale = d3.scaleOrdinal()
            .domain(nodes.map(d => d.group))
            .range(settings.colors);

        // Force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(50))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(settings.width / 2, settings.height / 2))
            .force('collision', d3.forceCollide().radius(30));

        // Links
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 2);

        // Nodes
        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', d => d.size || 10)
            .attr('fill', d => colorScale(d.group))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended))
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', (d.size || 10) + 5);
                
                // Tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'd3-tooltip')
                    .style('position', 'absolute')
                    .style('background', 'rgba(0, 0, 0, 0.8)')
                    .style('color', '#fff')
                    .style('padding', '8px 12px')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('pointer-events', 'none')
                    .style('opacity', 0);
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                
                tooltip.html(`${d.id}<br>Group: ${d.group}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', d.size || 10);
                
                d3.selectAll('.d3-tooltip').remove();
            });

        // Labels
        const label = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .text(d => d.id)
            .style('font-size', '12px')
            .style('font-family', 'Inter, system-ui, sans-serif')
            .style('text-anchor', 'middle')
            .style('dominant-baseline', 'middle')
            .style('pointer-events', 'none');

        // Update positions on tick
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            label
                .attr('x', d => d.x)
                .attr('y', d => d.y + 20);
        });

        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        this.visualizations.set(containerId, { svg, simulation, nodes, links, settings });

        return { svg, simulation, nodes, links, settings };
    }

    // TreeMap Visualization
    createTreeMap(containerId, data, options = {}) {
        const settings = { ...this.defaultSettings, ...options };
        const container = d3.select(`#${containerId}`);
        
        container.selectAll('*').remove();
        
        const svg = container.append('svg')
            .attr('width', settings.width)
            .attr('height', settings.height);

        const innerWidth = settings.width - settings.margin.left - settings.margin.right;
        const innerHeight = settings.height - settings.margin.top - settings.margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${settings.margin.left},${settings.margin.top})`);

        // Create hierarchy
        const root = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);

        // Create treemap layout
        const treemap = d3.treemap()
            .size([innerWidth, innerHeight])
            .padding(2)
            .round(true);

        treemap(root);

        // Color scale
        const colorScale = d3.scaleSequential()
            .domain([0, root.children?.length || 1])
            .interpolator(d3.interpolateBlues);

        // Cells
        const cell = g.selectAll('g')
            .data(root.leaves())
            .enter().append('g')
            .attr('transform', d => `translate(${d.x0},${d.y0})`);

        cell.append('rect')
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .attr('fill', (d, i) => colorScale(i))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .attr('rx', 4)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.8);
                
                // Tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'd3-tooltip')
                    .style('position', 'absolute')
                    .style('background', 'rgba(0, 0, 0, 0.8)')
                    .style('color', '#fff')
                    .style('padding', '8px 12px')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('pointer-events', 'none')
                    .style('opacity', 0);
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                
                tooltip.html(`${d.data.name}<br>Value: ${d.value.toFixed(2)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1);
                
                d3.selectAll('.d3-tooltip').remove();
            });

        // Labels
        cell.append('text')
            .attr('x', 4)
            .attr('y', 20)
            .text(d => d.data.name)
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#fff')
            .style('pointer-events', 'none');

        cell.append('text')
            .attr('x', 4)
            .attr('y', 35)
            .text(d => d.value.toFixed(0))
            .style('font-size', '10px')
            .style('fill', '#fff')
            .style('opacity', 0.8)
            .style('pointer-events', 'none');

        this.visualizations.set(containerId, { svg, g, data, settings });

        return { svg, g, data, settings };
    }

    // Sankey Diagram
    createSankeyDiagram(containerId, data, options = {}) {
        const settings = { ...this.defaultSettings, ...options };
        const container = d3.select(`#${containerId}`);
        
        container.selectAll('*').remove();
        
        const svg = container.append('svg')
            .attr('width', settings.width)
            .attr('height', settings.height);

        const innerWidth = settings.width - settings.margin.left - settings.margin.right;
        const innerHeight = settings.height - settings.margin.top - settings.margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${settings.margin.left},${settings.margin.top})`);

        // Create sankey generator
        const sankey = d3.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[0, 0], [innerWidth, innerHeight]]);

        // Generate the diagram
        const { nodes, links } = sankey(data);

        // Color scale
        const colorScale = d3.scaleOrdinal()
            .domain(nodes.map(d => d.name))
            .range(settings.colors);

        // Links
        g.append('g')
            .selectAll('path')
            .data(links)
            .enter().append('path')
            .attr('d', d3.sankeyLinkHorizontal())
            .attr('stroke', d => colorScale(d.source.name))
            .attr('stroke-width', d => Math.max(1, d.width))
            .attr('fill', 'none')
            .attr('stroke-opacity', 0.5)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('stroke-opacity', 0.8);
                
                // Tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'd3-tooltip')
                    .style('position', 'absolute')
                    .style('background', 'rgba(0, 0, 0, 0.8)')
                    .style('color', '#fff')
                    .style('padding', '8px 12px')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('pointer-events', 'none')
                    .style('opacity', 0);
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                
                tooltip.html(`${d.source.name} → ${d.target.name}<br>Value: ${d.value.toFixed(2)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('stroke-opacity', 0.5);
                
                d3.selectAll('.d3-tooltip').remove();
            });

        // Nodes
        g.append('g')
            .selectAll('rect')
            .data(nodes)
            .enter().append('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => d.y1 - d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('fill', d => colorScale(d.name))
            .attr('stroke', '#000')
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.8);
                
                // Tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'd3-tooltip')
                    .style('position', 'absolute')
                    .style('background', 'rgba(0, 0, 0, 0.8)')
                    .style('color', '#fff')
                    .style('padding', '8px 12px')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('pointer-events', 'none')
                    .style('opacity', 0);
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                
                tooltip.html(`${d.name}<br>Value: ${d.value.toFixed(2)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1);
                
                d3.selectAll('.d3-tooltip').remove();
            });

        // Labels
        g.append('g')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .attr('x', d => d.x0 < innerWidth / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => d.x0 < innerWidth / 2 ? 'start' : 'end')
            .text(d => d.name)
            .style('font-size', '12px')
            .style('font-family', 'Inter, system-ui, sans-serif')
            .style('fill', '#333');

        this.visualizations.set(containerId, { svg, g, data, settings });

        return { svg, g, data, settings };
    }

    // Generate sample data for testing
    generateSampleData(type) {
        switch (type) {
            case 'line':
                return Array.from({length: 50}, (_, i) => ({
                    date: new Date(2024, 0, i + 1),
                    value: Math.sin(i / 5) * 50 + Math.random() * 20 + 50
                }));
                
            case 'bar':
                return [
                    { label: 'Product A', value: Math.random() * 100 + 20 },
                    { label: 'Product B', value: Math.random() * 100 + 20 },
                    { label: 'Product C', value: Math.random() * 100 + 20 },
                    { label: 'Product D', value: Math.random() * 100 + 20 },
                    { label: 'Product E', value: Math.random() * 100 + 20 }
                ];
                
            case 'force':
                return {
                    nodes: [
                        { id: 'Node 1', group: 1, size: 15 },
                        { id: 'Node 2', group: 1, size: 12 },
                        { id: 'Node 3', group: 2, size: 18 },
                        { id: 'Node 4', group: 2, size: 10 },
                        { id: 'Node 5', group: 3, size: 14 },
                        { id: 'Node 6', group: 3, size: 16 }
                    ],
                    links: [
                        { source: 'Node 1', target: 'Node 2', value: 10 },
                        { source: 'Node 1', target: 'Node 3', value: 15 },
                        { source: 'Node 2', target: 'Node 4', value: 8 },
                        { source: 'Node 3', target: 'Node 5', value: 12 },
                        { source: 'Node 4', target: 'Node 6', value: 10 },
                        { source: 'Node 5', target: 'Node 6', value: 14 }
                    ]
                };
                
            case 'treemap':
                return {
                    name: 'Root',
                    children: [
                        { name: 'Category A', value: 100 },
                        { name: 'Category B', value: 80 },
                        { name: 'Category C', value: 60 },
                        { name: 'Category D', value: 40 },
                        { name: 'Category E', value: 30 }
                    ]
                };
                
            case 'sankey':
                return {
                    nodes: [
                        { name: 'Source A' },
                        { name: 'Source B' },
                        { name: 'Target A' },
                        { name: 'Target B' },
                        { name: 'Target C' }
                    ],
                    links: [
                        { source: 0, target: 2, value: 20 },
                        { source: 0, target: 3, value: 15 },
                        { source: 1, target: 3, value: 25 },
                        { source: 1, target: 4, value: 10 }
                    ]
                };
                
            default:
                return this.generateSampleData('line');
        }
    }

    // Destroy visualization
    destroyVisualization(containerId) {
        const container = d3.select(`#${containerId}`);
        container.selectAll('*').remove();
        this.visualizations.delete(containerId);
    }

    // Get all visualizations
    getAllVisualizations() {
        return this.visualizations;
    }

    // Export visualization as SVG
    exportSVG(containerId) {
        const viz = this.visualizations.get(containerId);
        if (viz && viz.svg) {
            return viz.svg.node().outerHTML;
        }
        return null;
    }
}

// Export singleton instance
export const d3Visualizations = new D3Visualizations();
export default d3Visualizations;
