import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import * as d3 from 'd3';
import Header from './components/Header';

class App extends Component {
  state = {
    metaData: {},
    timeSeries: {}
  };
  componentDidMount = async () => {
    const { data } = await axios.get('/api/stock-info?stock=goog');
    this.setState(
      {
        metaData: data['Meta Data'],
        timeSeries: data['Time Series (5min)']
      },
      this.createChart
    );
  };
  createChart = () => {
    const width = 900,
      height = 600;
    const { timeSeries } = this.state;
    // const parseDate = d3.timeParse('%H:%M %p');
    // const parseTime = d3.timeFormat('%H:%M %p');
    const [date1, date2] = Object.keys(timeSeries)
      .map(ts => ts.split(' ')[0])
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(d => new Date(d));
    const dateForChart = date1.getTime() > date2.getTime() ? date1 : date2;
    const times = Object.keys(timeSeries).reduce((acc: Date[], val) => {
      const valDate = new Date(val.split(' ')[0]);
      if (dateForChart.getTime() === valDate.getTime()) acc.push(new Date(val));
      return acc;
    }, []);
    console.log('times ', times);
    const svg = d3
      .select('.svg-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const xMaxDate = d3.max(times);
    const xMinDate = d3.min(times);
    // set the ranges
    const x = d3.scaleTime().range([0, width]);
    const timeTicks = [
      '10:00 am',
      '12:00 pm',
      '1:00 pm',
      '2:00 pm',
      '3:00 pm',
      '4:00 pm'
    ];
    const formatAMPM = (date: Date) => {
      let hours = date.getHours();
      let minutes = `${date.getMinutes()}`;
      let ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = date.getMinutes() < 10 ? '0' + minutes : minutes;
      let strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    };
    console.log(
      'timefilter',
      times.map(t => {
        return formatAMPM(t);
      })
    );
    x.domain([xMinDate as Date, xMaxDate as Date]);
    const xAxis = d3
      .axisBottom(x)
      .tickFormat(time => {
        const timeFormat = formatAMPM(time as Date);
        if (timeTicks.includes(timeFormat)) return timeFormat;
        else return '';
      })
      .tickValues(times);
    svg
      .append('g')
      .call(xAxis)
      .attr('transform', 'translate(0,300)');
  };
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
