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

console.log(process.env.GK_API)


