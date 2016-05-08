import React from "react";
var d3 = require("d3");

// Add mouse over so that you find the date on the x-axis, closest to your mouse position.
// Create tooltip at mousepos that shows all data for that date.
// Draw vertical line on x pos of mouse.

class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.createChart = this.createChart.bind(this);
    }

    componentDidMount() {
        if (this.props.data.length > 0) {
            this.createChart();
        }
    }

    componentWillUpdate() {
        d3.select("svg").remove();
        if (this.props.data.length > 0) {
            this.createChart();
        }
    }

    createChart() {
        var margin = {top: 20, right: 80, bottom: 30, left: 50};
        var width = Math.min(1000, document.getElementById("content").clientWidth) - margin.left - margin.right;
        var height = Math.min(300, document.getElementById("content").clientHeight) - margin.top - margin.bottom;

        var stock_data = this.props.data;
        var data = [];
        for (var i = 0; i < stock_data.length; i++) {
            data.push([stock_data[i].stock_code, stock_data[i].stock_data]);
        }

        var format = d3.time.format("%Y-%m-%d");

        var minDate = d3.min(data[0][1], d => {return d[0];});
        var maxDate = d3.max(data[0][1], d => {return d[0];});

        var x = d3.time.scale()
            // This should be date a month ago, until date now.
            .domain([format. parse(minDate), format.parse(maxDate)])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([0, 1000])
            .range([height, 0]);

        var color = ["#00FF00", "#FFFF00", "#FF0000", "#0000FF", "#FF00FF", "#DD7711", "#00FFFF", "#FFFFBB"];

        var xAxis = d3.svg.axis()
          .scale(x)
          .ticks(8)
          .tickFormat(d3.time.format("%d %B"))
          .orient("bottom")

        var yAxis = d3.svg.axis()
          .scale(y)
          .ticks(9)
          .orient("left");

        var line = d3.svg.line()
             .interpolate("basis")
             .x(function(d) { return x(format.parse(d[0])); })
             .y(function(d) { return y(d[1]); });

        var svg = d3.select("#chart").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        svg.append("g")
          .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

        var color_index = 0;
        data.forEach(function(d) {
                svg.append("path")
                    .attr("class", "line")
                    .attr("d", line(d[1]))
                    .attr("stroke", color[color_index])

                if (color_index < color.length) {
                    color_index++;
                }
                else {
                    color_index = 0;
                }
        });

        var legend = svg.selectAll(".legend")
          .data(data)
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("circle")
          .attr("cx", width + 20)
          .attr("cy", 0)
          .attr("r", 3.5)
          .style("stroke", function(d, i) {return color[i%color.length];})
          .style("fill", function(d, i) {return color[i%color.length];});

         legend.append("text")
          .attr("x", width + 30)
          .attr("y", 0)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .style("fill", "white")
          .text(function(d) { return d[0]})

      }
    render() {
        return (
            <div id="line-chart">
                <div id="chart" className="text-center"></div>
            </div>
        );
    }
}

module.exports = LineChart;
