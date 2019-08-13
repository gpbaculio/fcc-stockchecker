import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import { bisector } from 'd3-array';
import './App.css';
import * as d3 from 'd3';
import Header from './components/Header';

class App extends Component {
  state = {
    metaData: {},
    timeSeries: {}
  };
  componentDidMount = async () => {
    const { data } = await axios.get('/api/stock-info?stock=DJI');
    this.setState(
      {
        metaData: data['Meta Data'],
        timeSeries: data['Time Series (5min)']
      },
      this.createChart
    );
  };
  createChart = () => {
    var margin = { top: 30, right: 20, bottom: 30, left: 50 },
      width = 600 - margin.left - margin.right,
      height = 370 - margin.top - margin.bottom;
    // Set the dimensions of the canvas / graph
    var svg = d3
      .select('.svg-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    const { timeSeries }: any = this.state;

    const [date1, date2] = Object.keys(timeSeries)
      .map(ts => ts.split(' ')[0])
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(d => new Date(d));
    const dateForChart = date1.getTime() > date2.getTime() ? date1 : date2;
    let timesData: any = {};
    const times = Object.keys(timeSeries).reduce((acc: Date[], val) => {
      const valDate = new Date(val.split(' ')[0]);
      if (dateForChart.getTime() === valDate.getTime()) {
        acc.push(new Date(val));
        timesData[val] = timeSeries[val];
      }
      return acc;
    }, []);
    const timesDataPath = Object.keys(timesData).map(td => ({
      ...timesData[td],
      date: new Date(td)
    }));
    var xDomain = d3.extent(timesDataPath, function(d) {
      return d.date;
    });
    var yDomain = d3.extent(timesDataPath, function(d) {
      return d['4. close'];
    });
    const closePrices = Object.keys(timesData).map(
      td => timesData[td]['4. close']
    );
    const closeMax = Math.round(d3.max(closePrices) / 100) * 100;
    const closeMin = Math.round(d3.min(closePrices) / 100) * 100 - 100;
    const yScale = d3
      .scaleLinear()
      .domain([closeMin, closeMax])
      .range([height, 0]);
    var xScale = d3
      .scaleTime()
      .range([0, width])
      .domain([...xDomain]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    var line = d3
      .line()
      .x(function(d: any) {
        return xScale(d.date);
      })
      .y(function(d: any) {
        return yScale(d['4. close']);
      });
    var g = svg.append('g');
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxis);

    g.append('g')
      .attr('class', 'y axis')
      .call(yAxis);
    g.append('path')
      .datum(timesDataPath)
      .attr('class', 'line')
      .attr('d', line);
    g.selectAll('circle')
      .data(timesDataPath)
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return xScale(d.date);
      })
      .attr('cy', function(d) {
        return yScale(d['4. close']);
      })
      .attr('r', 5)
      .attr('class', 'circle');
    var focus = g.append('g').style('display', 'none');

    focus
      .append('line')
      .attr('id', 'focusLineX')
      .attr('class', 'focusLine');
    focus
      .append('line')
      .attr('id', 'focusLineY')
      .attr('class', 'focusLine');
    focus
      .append('circle')
      .attr('id', 'focusCircle')
      .attr('r', 5)
      .attr('class', 'circle focusCircle');

    var bisect = d3.bisector(function(d: any) {
      return d.date;
    }).left;

    g.append('rect')
      .attr('class', 'overlay')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', function() {
        focus.style('display', null);
      })
      .on('mouseout', function() {
        focus.style('display', 'none');
      })
      .on('mousemove', function() {
        var mouse = d3.mouse(this);
        var mouseDate: any = xScale.invert(mouse[0]);
        const sortDate = timesDataPath.sort(function(a: any, b: any) {
          return a.date - b.date;
        });
        var i = bisect(sortDate, mouseDate, 1); // returns the index to the current data item

        var d0 = timesDataPath[i - 1];
        var d1 = timesDataPath[i];
        // work out which date value is closest to the mouse
        var d = mouseDate - d0.date > d1.date - mouseDate ? d1 : d0;

        var x = xScale(d.date);
        var y = yScale(d['4. close']);

        focus
          .select('#focusCircle')
          .attr('cx', x)
          .attr('cy', y);
        focus
          .select('#focusLineX')
          .attr('x1', x)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', height);
      });
  };
  // createChart = () => {
  //   // Set the dimensions of the canvas / graph
  //   const { timeSeries }: any = this.state;

  //   const [date1, date2] = Object.keys(timeSeries)
  //     .map(ts => ts.split(' ')[0])
  //     .filter((value, index, self) => self.indexOf(value) === index)
  //     .map(d => new Date(d));
  //   const dateForChart = date1.getTime() > date2.getTime() ? date1 : date2;
  //   let timesData: any = {};
  //   const maxDate = new Date(new Date(dateForChart).setHours(16));
  //   var margin = { top: 30, right: 20, bottom: 30, left: 50 },
  //     width = 600 - margin.left - margin.right,
  //     height = 270 - margin.top - margin.bottom;
  //   const timeTicks = [
  //     '10:00 am',
  //     '12:00 pm',
  //     '1:00 pm',
  //     '2:00 pm',
  //     '3:00 pm',
  //     '4:00 pm'
  //   ];
  //   const times = Object.keys(timeSeries).reduce((acc: Date[], val) => {
  //     const valDate = new Date(val.split(' ')[0]);
  //     if (dateForChart.getTime() === valDate.getTime()) {
  //       acc.push(new Date(val));
  //       timesData[val] = timeSeries[val];
  //     }
  //     return acc;
  //   }, []);

  //   const formatAMPM = (date: Date) => {
  //     let hours = date.getHours();
  //     let minutes = `${date.getMinutes()}`;
  //     let ampm = hours >= 12 ? 'pm' : 'am';
  //     hours = hours % 12;
  //     hours = hours ? hours : 12; // the hour '0' should be '12'
  //     minutes = date.getMinutes() < 10 ? '0' + minutes : minutes;
  //     let strTime = hours + ':' + minutes + ' ' + ampm;
  //     return strTime;
  //   };
  //   // Parse the date / time
  //   var parseDate = d3.timeFormat('%d-%b-%y'),
  //     formatDate = d3.timeFormat('%d-%b');
  //   // Set the ranges
  //   var xScale = d3.scaleTime().range([0, width]);
  //   const xMaxDate = d3.max(times);
  //   const xMinDate = d3.min(times);
  //   xScale.domain([xMinDate as Date, xMaxDate as Date]);
  //   const xAxis = d3
  //     .axisBottom(xScale)
  //     .tickFormat(time => {
  //       const timeFormat = formatAMPM(time as Date);
  //       if (timeTicks.includes(timeFormat)) return timeFormat;
  //       else return '';
  //     })
  //     .tickPadding(4)
  //     .tickValues(times);
  //   const closePrices = Object.keys(timesData).map(
  //     td => timesData[td]['4. close']
  //   );
  //   const closeMax = Math.round(d3.max(closePrices) / 100) * 100;
  //   const closeMin = Math.round(d3.min(closePrices) / 100) * 100 - 100;
  //   const yScale = d3
  //     .scaleLinear()
  //     .domain([closeMin, closeMax])
  //     .range([height, 0]);
  //   const yAxis = d3.axisLeft(yScale);
  //   var svg = d3
  //     .select('.svg-container')
  //     .append('svg')
  //     .attr('width', width + margin.left + margin.right)
  //     .attr('height', height + margin.top + margin.bottom)
  //     .append('g')
  //     .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  //   var lineSvg = svg.append('g');

  //   var valueline = d3
  //     .line()
  //     .x(function(d: any) {
  //       return xScale(d.date);
  //     })
  //     .y(function(d: any) {
  //       return yScale(d['4. close']);
  //     });

  //   var lineSvg = svg.append('g');
  //   const timesDataPath = Object.keys(timesData).map(td => ({
  //     ...timesData[td],
  //     date: new Date(td)
  //   }));
  //   console.log('timesDataPath ', timesDataPath);
  //   lineSvg
  //     .append('path')
  //     .datum(timesDataPath)
  //     .attr('class', 'line')
  //     .attr('d', valueline);
  //   svg
  //     .append('g')
  //     .attr('class', 'x axis')
  //     .attr('transform', 'translate(0,' + height + ')')
  //     .call(xAxis); // Add the Y Axis
  //   // Add the Y Axis
  //   svg
  //     .append('g')
  //     .attr('class', 'y axis')
  //     .call(yAxis);
  //   svg
  //     .selectAll('circle')
  //     .data(timesDataPath)
  //     .enter()
  //     .append('circle')
  //     .attr('cx', function(d) {
  //       return xScale(d.date);
  //     })
  //     .attr('cy', function(d) {
  //       return yScale(d['4. close']);
  //     })
  //     .attr('r', 2.5)
  //     .attr('class', 'circle');
  //   // append the x line
  //   var line = d3
  //     .line()
  //     .x(function(d: any) {
  //       return xScale(d.date);
  //     })
  //     .y(function(d: any) {
  //       return yScale(d['4. close']);
  //     });
  //   // focus tracking

  //   var focus = svg.append('g').style('display', 'none');
  //   focus
  //     .append('line')
  //     .attr('id', 'focusLineX')
  //     .attr('class', 'focusLine');
  //   focus
  //     .append('line')
  //     .attr('id', 'focusLineY')
  //     .attr('class', 'focusLine');
  //   focus
  //     .append('circle')
  //     .attr('id', 'focusCircle')
  //     .attr('r', 2)
  //     .attr('class', 'circle focusCircle');
  //   var bisectDate = d3.bisector(function(t: any, b) {
  //     return t;
  //   }).left;
  //   svg
  //     .append('rect')
  //     .attr('class', 'overlay')
  //     .attr('width', width)
  //     .attr('height', height)
  //     .on('mouseover', function() {
  //       focus.style('display', null);
  //     })
  //     .on('mouseout', function() {
  //       focus.style('display', 'none');
  //     })
  //     .on('mousemove', function() {
  //       var mouse = d3.mouse(this);
  //       var mouseDate = xScale.invert(mouse[0]);
  //       var i = bisectDate(times, mouseDate); // returns the index to the current data item

  //       var d0 = timesDataPath[i - 1];
  //       // var d1 = data[i];
  //       // // work out which date value is closest to the mouse
  //       // var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;

  //       // var x = xScale(d[0]);
  //       // var y = yScale(d[1]);

  //       // focus.select('#focusCircle')
  //       //     .attr('cx', x)
  //       //     .attr('cy', y);
  //       // focus.select('#focusLineX')
  //       //     .attr('x1', x).attr('y1', yScale(yDomain[0]))
  //       //     .attr('x2', x).attr('y2', yScale(yDomain[1]));
  //       // focus.select('#focusLineY')
  //       //     .attr('x1', xScale(xDomain[0])).attr('y1', y)
  //       //     .attr('x2', xScale(xDomain[1])).attr('y2', y);
  //     });
  // };

  render() {
    return (
      <div className='App'>
        <Header />
        <div className='svg-container' />
      </div>
    );
  }
}

export default App;
