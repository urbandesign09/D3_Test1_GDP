import "./styles.css";
import * as d3 from "d3";

//two operations
//1. get data from API
//2. create D3 chart
//3. add details like tooltip, hover

//data API
const urlData =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

//get data
//global variable
//load and then bind data
var dataset;

const w = 900;
const h = 500;
const padding = 60;

d3.json(urlData).then((data) => {
  //correct iterable year data
  //1947-01-01
  //[[1947, 1], 243.1]
  //1947.0, 1947.25, 1947.5, 1947.75
  //const testNumber = "1970-04-01"; //convert to 1970.01 //replace the section after the first -
  //const revisedNum = testNumber.replace(/(?<=\d{4}).+/, i=> chars[i]);

  //negative look-behind
  //everthing after the first four letters .+
  //need to edit the data into 0, 0.25, 0.5, 0.75

  dataset = data.data;

  //.map((item) => {
  //  item[0] = item[0].replace(/(?<=\d{4}).+/, (i) => chars[i]);
  //  return item;
  //}); //this is the mock dataset
  //find min and max of data x,y
  const maxYear = d3.max(dataset, (d) => new Date(d[0]));
  const minYear = d3.min(dataset, (d) => new Date(d[0]));

  const maxGDP = d3.max(dataset, (d) => d[1]);

  //conver this to scale "time"
  //construct chart scales
  const xScale = d3
    .scaleTime()
    .domain([minYear, maxYear])
    .range([padding, w - padding]);
  //JS time starts in 1970
  //transform years 1947 to 2015 to JS time

  const yScale = d3
    .scaleLinear()
    .domain([0, maxGDP])
    .range([h - padding, padding])
    .nice();

  //construct svg
  const svg = d3
    .select("#container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("x", 0)
    .attr("y", 0);

  //add output to svg
  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d, i) => {
      return xScale(new Date(d[0]));
    })
    .attr("y", (d, i) => {
      return yScale(d[1]);
    })
    .attr("width", (d, i) => {
      return 2.5;
    })
    .attr("height", (d, i) => {
      return h - yScale(d[1]) - padding;
    })
    .attr("fill", "steelblue")
    .on("mouseover", (event, d) => {
      //.map((item) => {
      //  item[0] = item[0].replace(/(?<=\d{4}).+/, (i) => chars[i]);
      //  return item;
      const chars = {
        "-01-01": " Q1",
        "-04-01": " Q2",
        "-07-01": " Q3",
        "-10-01": " Q4"
      };
      const quarter = d[0].replace(/(?<=\d{4}).+/, (i) => chars[i]);

      return tooltip
        .html(`${quarter}, $${d[1]} Billion`)
        .attr("data-date", d[0])
        .style("visibility", "visible");
    })
    .on("mousemove", function (event) {
      return tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });

  var tooltip = d3
    .select("#container")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .attr("class", "tooltip")
    .attr("id", "tooltip");

  //g
  //.append("title")
  //.data(dataset)
  //.attr("id", "tooltip")
  //.attr("data-date", (d) => d[0])
  //.text((d) => {
  //  return `$${d[1]} Billion, ${d[0]}`;
  //});

  //add graph axes
  const xAxis = d3.axisBottom(xScale).ticks(d3.timeYear.every(5));
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (h - padding) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);

  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis.tickSize(-(w - padding - padding), 0, 0).tickFormat(""));
});

//the data is in quarters
//the data.data set has two values, "date" and "gdp"
//18064.7 is equal to 18,064.7 billion
//convert quarterly information to years
//use regex to get year data
//create x-Scale
//create y-Scale
