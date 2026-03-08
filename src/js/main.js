// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'
import * as Plotly from 'plotly.js-dist'

// import app.js
import { App } from './app.js'

window.onload = () => {
    new App();
}


const chartDiv = document.querySelector('#chart-div');


const data = [
  {
    x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
    y: [1, 3, 100],
    type: 'scatter'
  }
];

const layout = {
  paper_bgcolor: 'rgba(0,0,0,0)',   // fully transparent outer background
  plot_bgcolor: 'rgba(0,0,0,0)',
  autosize: true,
};

const config = {
    responsive: true
}

Plotly.newPlot('chart-div', data, layout, config);
