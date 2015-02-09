/* dash.js
 * Based on code from Mike Bostock's calendar view example at:
 * http://bl.ocks.org/mbostock/4063318 
 * accessed on 6 Feb 2015.
 *
 */

var width = 960,
    height = 150,
    cellSize = 12; // cell size

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    month = d3.time.format("%m"),
    percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");

var color = d3.scale.quantize()
    .domain([-.05, .05])
    .range(d3.range(11).map(function(d) { return "q" + d + "-9"; }));

var svg = d3.select("body").selectAll("svg")
    .data(d3.range(2009, 2012))
    /* 
     * For each year, make a new svg element 
     */
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "YlOrRd")
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-35," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });

var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return week(d) * cellSize; })
    .attr("y", function(d) { return day(d) * cellSize; })
    .datum(format);

rect.append("title")
    .text(function(d) { return d; });
    
svg.selectAll(".dayLabel")
    .data(function(d) { return d3.time.days(new Date(d, 0, 0, 1), new Date(d, 0, 7, 1), 1); })
  .enter().append("text")
    .text(dayName)
    .attr("x", function(d, i) { 
      return -2 * cellSize;
    })
    .attr("y", function(d, i) {
      return day(d) * cellSize + (cellSize-2); // move text toward bottom of cell
    })
    .attr("class", "dayLabel")
    .attr("d", dayName);
    

svg.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);
    
svg.selectAll(".monthLabel")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("text")
    .text(monthName)
    .attr("x", function(d, i) { 
      // TODO: Align each month label with the position of the first Sunday
      // Currently, just spacing them out assuming each month is 4.5 weeks long.
      return cellSize * 4.5 * ((month(d) - 1));
    })
    .attr("y", function(d, i) {
      return -5;
    })
    .attr("class", "monthLabel")
    .attr("d", monthName);
    
d3.csv("data/dji.csv", function(error, csv) {
  var data = d3.nest()
    .key(function(d) { return d.Date; })
    .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
    .map(csv);

  rect.filter(function(d) { return d in data; })
      .attr("class", function(d) { return "day " + color(data[d]); })
    .select("title")
      .text(function(d) { return d + ": " + percent(data[d]); });
});

function monthName(t0) {
  return t0.toLocaleString("en-us", { month: "short" });
}

function dayName(t0) {
  return t0.toLocaleString("en-us", { weekday: "short" });
}

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = +day(t0), w0 = +week(t0),
      d1 = +day(t1), w1 = +week(t1);
  var output = "M" + (w0 + 1) * cellSize 
      + "," + d0 * cellSize
      + "H" + w0 * cellSize 
      + "V" + 7 * cellSize
      + "H" + w1 * cellSize 
      + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize 
      + "V" + 0
      + "H" + (w0 + 1) * cellSize 
      + "Z";
      return output;
}

d3.select(self.frameElement).style("height", "2910px");