import React, { Component } from 'react';
import axios from 'axios';
import { Input } from 'reactstrap';
import './App.css';
import * as d3 from 'd3';
import { Header, SearchInput } from './components';

interface tsData {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
  '5. volume': string;
}

interface AppState {
  timeSeries: {
    [text: string]: tsData;
  };
  metaData: {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Interval': string;
    '5. Output Size': string;
    '6. Time Zone': string;
  };
}

class App extends Component<{}, AppState> {
  public readonly state: Readonly<AppState> = {
    metaData: {
      '1. Information': '',
      '2. Symbol': '',
      '3. Last Refreshed': '',
      '4. Interval': '',
      '5. Output Size': '',
      '6. Time Zone': ''
    },
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
    var margin = { top: 30, right: 50, bottom: 30, left: 50 },
      width = 650 - margin.left - margin.right,
      height = 470 - margin.top - margin.bottom;
    // Set the dimensions of the canvas / graph
    var svg = d3
      .select('.svg-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    const { timeSeries } = this.state;

    const [date1, date2] = Object.keys(timeSeries)
      .map(ts => ts.split(' ')[0])
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(d => new Date(d));

    const dateForChart = date1.getTime() > date2.getTime() ? date1 : date2;

    let timesData: {
      [text: string]: tsData;
    } = {};

    Object.keys(timeSeries).forEach(val => {
      const valDate = new Date(val.split(' ')[0]);
      if (dateForChart.getTime() === valDate.getTime()) {
        timesData[val] = timeSeries[val];
      }
    });

    const timesDataPath = Object.keys(timesData).map(td => ({
      ...timesData[td],
      date: new Date(td)
    }));

    const xDomain = d3.extent(timesDataPath, ({ date }) => date);

    const closePrices: number[] = Object.keys(timesData).map(td =>
      Number(timesData[td]['4. close'])
    );

    const closeMax = Math.round((d3.max(closePrices) as number) / 100) * 100;
    const closeMin =
      Math.round((d3.min(closePrices) as number) / 100) * 100 - 100;

    const yScale = d3
      .scaleLinear()
      .domain([closeMin, closeMax])
      .range([height, 0]);

    const xScale = d3
      .scaleTime()
      .range([0, width])
      .domain([...(xDomain as Date[])]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const line = d3
      .line<tsData & { date: Date }>()
      .x(d => {
        return xScale(d.date.getTime());
      })
      .y(d => {
        return yScale(Number(d['4. close']));
      });

    svg
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(() => '')
      );

    const g = svg.append('g');

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
        return yScale(Number(d['4. close']));
      })
      .attr('r', 3)
      .attr('class', 'circle');
    const focus = g.append('g').style('display', 'none');
    const focusText = svg
      .append('g')
      .append('text')
      .style('opacity', 0)
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle');
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
      .attr('r', 3)
      .attr('class', 'circle focusCircle');

    const bisect = d3.bisector((d: tsData & { date: Date }) => d.date).left;

    g.append('rect')
      .attr('class', 'overlay')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', () => {
        focus.style('display', null);
        focusText
          .style('opacity', 1)
          .style('font-size', '12px')
          .style('background-size', '#fff')
          .style('z-index', '99');
      })
      .on('mouseout', () => {
        focus.style('display', 'none');
        focusText.style('opacity', 0);
      })
      .on('mousemove', () => {
        var mouse = d3.mouse(d3.event.target);
        var mouseDate: Date = xScale.invert(mouse[0]);
        const sortDate = timesDataPath.sort(function(
          a: tsData & { date: Date },
          b: tsData & { date: Date }
        ) {
          return a.date.getTime() - b.date.getTime();
        });
        var i = bisect(sortDate, mouseDate, 1); // returns the index to the current data item

        var d0 = timesDataPath[i - 1];
        var d1 = timesDataPath[i];
        // work out which date value is closest to the mouse
        var d =
          mouseDate.getTime() - d0.date.getTime() >
          d1.date.getTime() - mouseDate.getTime()
            ? d1
            : d0;

        var x = xScale(d.date);
        var y = yScale(Number(d['4. close']));

        focus
          .select('#focusCircle')
          .attr('cx', x)
          .attr('cy', y);

        focusText
          .html(d['4. close'])
          .attr('x', x - 25)
          .attr('y', 25);

        focus
          .select('#focusLineX')
          .attr('x1', x)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', height);
      });
  };

  render() {
    return (
      <div className='App'>
        <Header />
        <SearchInput />
        <div className='svg-container' />
      </div>
    );
  }
}

export default App;
