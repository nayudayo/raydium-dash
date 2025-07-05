'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useDexData } from '../hooks/useDexData';
import { TreemapData } from '../types';

// Extended type for D3 hierarchy nodes with treemap layout properties
interface TreemapNode extends d3.HierarchyNode<TreemapData> {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface TreemapProps {
  width?: number;
  height?: number;
}

export default function Treemap({ width = 800, height = 300 }: TreemapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { data, loading, error, totalVolume } = useDexData();

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Create hierarchy
    const root = d3.hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create treemap layout
    const treemap = d3.treemap<TreemapData>()
      .size([width, height])
      .paddingTop(4)
      .paddingRight(4)
      .paddingBottom(4)
      .paddingLeft(4)
      .paddingInner(1)
      .round(true);

    const treemapRoot = treemap(root) as TreemapNode;

    // Enhanced color scale - gray for all, cream for Raydium AMM
    const getProtocolColor = (protocolName: string) => {
      if (protocolName === "Raydium AMM") {
        return "#F7F3E9"; // Cream color
      }
      return "#4A5568"; // Gray for all others
    };

    // Get border color for Raydium AMM
    const getBorderColor = (protocolName: string) => {
      if (protocolName === "Raydium AMM") {
        return "url(#raydiumGradient)"; // Gradient border
      }
      return "rgba(255, 255, 255, 0.1)"; // Default border
    };

    // Get border width for Raydium AMM
    const getBorderWidth = (protocolName: string) => {
      if (protocolName === "Raydium AMM") {
        return 3; // Thicker border for Raydium
      }
      return 1; // Default border width
    };

    // Opacity scale based on value
    const opacityScale = d3.scaleLinear()
      .domain([0, d3.max(treemapRoot.leaves(), d => d.value || 0) || 1])
      .range([0.7, 1]);

    // Create gradient definition for Raydium border
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "raydiumGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#C200FB");

    gradient.append("stop")
      .attr("offset", "48.97%")
      .attr("stop-color", "#3772FF");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#5AC4BE");

    // Create tooltip with enhanced styling
    const tooltip = d3.select("body").append("div")
      .attr("class", "dex-treemap-tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "rgba(6, 0, 16, 0.95)")
      .style("color", "white")
      .style("padding", "16px")
      .style("border-radius", "12px")
      .style("font-size", "13px")
      .style("font-weight", "500")
      .style("border", "1px solid rgba(255, 255, 255, 0.1)")
      .style("backdrop-filter", "blur(10px)")
      .style("box-shadow", "0 8px 32px rgba(0, 0, 0, 0.3)")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Draw rectangles for leaf nodes with animations
    const leaf = svg.selectAll("g.leaf")
      .data(treemapRoot.leaves() as TreemapNode[])
      .enter().append("g")
      .attr("class", "leaf")
      .attr("transform", d => `translate(${d.x0},${d.y0})`)
      .style("opacity", 0); // Start invisible for animation

    // Animate leaf groups appearance with fade-in
    leaf.transition()
      .duration(600)
      .delay((d, i) => i * 80) // Stagger animation
      .ease(d3.easeQuadOut)
      .style("opacity", 1);

    // Add rectangles with fade-in animation
    const rects = leaf.append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("x", 0)
      .attr("y", 0)
      .attr("fill", d => getProtocolColor(d.data.name))
      .attr("stroke", d => getBorderColor(d.data.name))
      .attr("stroke-width", d => getBorderWidth(d.data.name))
      .attr("opacity", 0) // Start invisible
      .style("cursor", "pointer");

    // Animate rectangles to full opacity
    rects.transition()
      .duration(500)
      .delay((d, i) => i * 60 + 200) // Start after leaf animation
      .ease(d3.easeQuadOut)
      .attr("opacity", d => opacityScale(d.value || 0));

    // Add hover interactions
    rects.on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1)
          .attr("stroke", "rgba(255, 255, 255, 0.4)")
          .attr("stroke-width", 2);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", 1);
          
        const volume = d.value || 0;
        const marketShare = ((volume / totalVolume) * 100).toFixed(2);
        const change1d = d.data.change_1d;
        const change7d = d.data.change_7d;
        
        tooltip.html(`
          <div style="font-weight: 700; margin-bottom: 8px; font-size: 14px;">${d.data.displayName || d.data.name}</div>
          <div style="color: rgba(255, 255, 255, 0.8); margin-bottom: 4px;">Category: ${d.data.category}</div>
          <div style="color: rgba(255, 255, 255, 0.8); margin-bottom: 4px;">24h Volume: $${volume.toLocaleString()}</div>
          <div style="color: rgba(255, 255, 255, 0.8); margin-bottom: 4px;">Market Share: ${marketShare}%</div>
          ${change1d !== undefined ? `<div style="color: ${change1d >= 0 ? '#4ECDC4' : '#FF6B6B'}; margin-bottom: 4px;">24h Change: ${change1d >= 0 ? '+' : ''}${change1d.toFixed(2)}%</div>` : ''}
          ${change7d !== undefined ? `<div style="color: ${change7d >= 0 ? '#4ECDC4' : '#FF6B6B'};">7d Change: ${change7d >= 0 ? '+' : ''}${change7d.toFixed(2)}%</div>` : ''}
        `);
        
        // Smart positioning to keep tooltip in viewport
        const tooltipNode = tooltip.node();
        if (tooltipNode) {
          const tooltipRect = tooltipNode.getBoundingClientRect();
          const tooltipWidth = tooltipRect.width;
          const tooltipHeight = tooltipRect.height;
          
          let left = event.pageX + 10;
          let top = event.pageY - 28;
          
          // Adjust horizontal position if tooltip goes off right edge
          if (left + tooltipWidth > window.innerWidth) {
            left = event.pageX - tooltipWidth - 10;
          }
          
          // Adjust vertical position if tooltip goes off bottom edge
          if (top + tooltipHeight > window.innerHeight) {
            top = event.pageY - tooltipHeight - 10;
          }
          
          // Adjust if tooltip goes off top edge
          if (top < 0) {
            top = event.pageY + 10;
          }
          
          // Adjust if tooltip goes off left edge
          if (left < 0) {
            left = 10;
          }
          
          tooltip
            .style("left", left + "px")
            .style("top", top + "px");
        }
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", opacityScale(d.value || 0))
          .attr("stroke", getBorderColor(d.data.name))
          .attr("stroke-width", getBorderWidth(d.data.name));
        
        tooltip.transition()
          .duration(300)
          .style("opacity", 0);
      });

    // Add protocol name labels with fade-in animation
    const nameLabels = leaf.append("text")
      .attr("x", 8)
      .attr("y", 20)
      .text(d => {
        const rectWidth = d.x1 - d.x0;
        const rectHeight = d.y1 - d.y0;
        const name = d.data.displayName || d.data.name;
        return rectWidth > 60 && rectHeight > 25 ? (name.length > 10 ? name.substring(0, 10) + '...' : name) : "";
      })
      .attr("font-size", "11px")
      .attr("fill", d => d.data.name === "Raydium AMM" ? "#000000" : "white")
      .attr("font-weight", "700")
      .attr("text-shadow", d => d.data.name === "Raydium AMM" ? "none" : "0 1px 2px rgba(0, 0, 0, 0.8)")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Animate name labels
    nameLabels.transition()
      .duration(400)
      .delay((d, i) => i * 30 + 600)
      .ease(d3.easeQuadOut)
      .style("opacity", 1);

    // Add volume labels with fade-in animation
    const volumeLabels = leaf.append("text")
      .attr("x", 8)
      .attr("y", 34)
      .text(d => {
        const rectWidth = d.x1 - d.x0;
        const rectHeight = d.y1 - d.y0;
        const volume = d.value || 0;
        if (rectWidth > 80 && rectHeight > 40) {
          return volume >= 1000000 ? `$${(volume / 1000000).toFixed(1)}M` : `$${(volume / 1000).toFixed(0)}K`;
        }
        return "";
      })
      .attr("font-size", "9px")
      .attr("fill", d => d.data.name === "Raydium AMM" ? "#333333" : "rgba(255, 255, 255, 0.8)")
      .attr("font-weight", "600")
      .attr("text-shadow", d => d.data.name === "Raydium AMM" ? "none" : "0 1px 2px rgba(0, 0, 0, 0.8)")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Animate volume labels
    volumeLabels.transition()
      .duration(400)
      .delay((d, i) => i * 30 + 700)
      .ease(d3.easeQuadOut)
      .style("opacity", 1);

    // Add change indicators with fade-in animation
    const changeLabels = leaf.append("text")
      .attr("x", 8)
      .attr("y", 46)
      .text(d => {
        const rectWidth = d.x1 - d.x0;
        const rectHeight = d.y1 - d.y0;
        const change = d.data.change_1d;
        if (rectWidth > 100 && rectHeight > 50 && change !== undefined) {
          return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
        }
        return "";
      })
      .attr("font-size", "8px")
      .attr("fill", d => {
        const change = d.data.change_1d;
        if (change === undefined) {
          return d.data.name === "Raydium AMM" ? "#666666" : "rgba(255, 255, 255, 0.6)";
        }
        // For Raydium AMM, use darker colors; for others, use the original bright colors
        if (d.data.name === "Raydium AMM") {
          return change >= 0 ? "#0D7377" : "#B91C1C"; // Dark teal for positive, dark red for negative
        }
        return change >= 0 ? "#4ECDC4" : "#FF6B6B"; // Original bright colors
      })
      .attr("font-weight", "600")
      .attr("text-shadow", d => d.data.name === "Raydium AMM" ? "none" : "0 1px 2px rgba(0, 0, 0, 0.8)")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Animate change labels
    changeLabels.transition()
      .duration(400)
      .delay((d, i) => i * 30 + 800)
      .ease(d3.easeQuadOut)
      .style("opacity", 1);

    // Add Raydium logo with fade-in animation
    const raydiumLogos = leaf.filter(d => d.data.name === "Raydium AMM")
      .append("image")
      .attr("href", "/assets/logo/raydium.svg")
      .attr("x", d => {
        const rectWidth = d.x1 - d.x0;
        const logoSize = Math.min(rectWidth * 0.6, 120);
        return (rectWidth - logoSize) / 2;
      })
      .attr("y", d => {
        const rectHeight = d.y1 - d.y0;
        const logoSize = Math.min(rectHeight * 0.6, 120);
        return (rectHeight - logoSize) / 2;
      })
      .attr("width", d => {
        const rectWidth = d.x1 - d.x0;
        const rectHeight = d.y1 - d.y0;
        return Math.min(rectWidth * 0.6, rectHeight * 0.6, 120);
      })
      .attr("height", d => {
        const rectWidth = d.x1 - d.x0;
        const rectHeight = d.y1 - d.y0;
        return Math.min(rectWidth * 0.6, rectHeight * 0.6, 120);
      })
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Animate Raydium logo with fade-in
    raydiumLogos.transition()
      .duration(600)
      .delay(800)
      .ease(d3.easeQuadOut)
      .style("opacity", 0.9);

    // Cleanup function
    return () => {
      d3.selectAll(".dex-treemap-tooltip").remove();
    };
  }, [data, width, height, totalVolume]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#060010] rounded-lg">
        <div className="text-white text-lg">Loading DEX volume data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#060010] rounded-lg">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#060010] rounded-lg">
        <div className="text-white text-lg">No data available</div>
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ 
        background: 'transparent',
        display: 'block'
      }}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
} 