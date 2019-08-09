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
        timeSeries: data['Time Series (60min)']
      },
      this.createChart
    );
  };
  createChart = () => {
    const width = 900,
      height = 600;
    const { timeSeries } = this.state;
    const times = Object.keys(timeSeries).map(tk => new Date(tk));
    console.log('times ', times);
    const svg = d3
      .select('.svg-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
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
