import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function BarChart({ data }) {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove(); // Clear previous chart

        const xScale = d3.scaleBand()
            .domain(data.map((d) => d.name))
            .range([0, 500])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.quantity)])
            .range([500, 0]);

        svg.append('g')
            .attr('transform', 'translate(0, 500)')
            .call(d3.axisBottom(xScale));

        svg.append('g')
            .call(d3.axisLeft(yScale));

        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => xScale(d.name))
            .attr('y', (d) => yScale(d.quantity))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => 500 - yScale(d.quantity));
    }, [data]);

    return (
        <svg ref={ref} width={600} height={600} />
    );
}