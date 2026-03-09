// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'
import * as Plotly from 'plotly.js-dist'

// import app.js
import { App } from './app.js'
import { render } from 'sass'

window.onload = () => {
    const app = new App();

}


const chartDiv = document.querySelector('#chart-div');


