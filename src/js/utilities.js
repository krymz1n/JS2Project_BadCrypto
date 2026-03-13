/**
 * @author {String} BoRyan Crum
 */

/**
 * formats large numbers for readability
 * @example 1201231.12345 => '1,201,231.12'
 * @param {Number} num 
 * @returns {String}
 */
export function formatCurrency(num) {
    // take absolute value
    // truncate to 2 decimal places
    // typecast to String
    const string = String(Math.abs(num.toFixed(2)));
    // get whole numbers
    let wholeNums = string.slice(0, -3)
    // get decimals
    const decimalNums = string.slice(-2)

    // initialize output string
    let outputString = ''
    // while remaining wholeNums more than 3 digits
    while (wholeNums.length > 3) {
        // take last three digits as slice
        const slice = wholeNums.slice(-3)
        // delete them from wholeNums
        wholeNums = wholeNums.slice(0, -3)
        // if outputstring is empty
        if (outputString.length == 0) {
            // add slice
            outputString = slice
        }
        else {
            // add slice in front of outputString
            outputString = `${slice},${outputString}`
        }
    }
    // add remaining wholeNums in front of output
    outputString = `${wholeNums},${outputString}`
    // add a decimal
    outputString += '.'
    // add decimal nums
    outputString += decimalNums

    return outputString
}


formatCurrency(1234567890.123185817)

/**
 * Renders a historical price chart with a given array of coin nodes
 * @param {Array<import("./app").coinNode24hr>} nodeArray 
 * @param {String} targetDiv 
 * @returns {Plotly}
 */
export async function renderChart(nodeArray, targetDiv) {

    // initialize data array
    let data = []
    // for each coin node in given array
    for (const node of nodeArray) {
        // wait for api call
        const result = await getChartData(node)
        // add historical price data to array
        data.push(result)
    }

    // plotly layout 
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',   // fully transparent outer background
        plot_bgcolor: 'rgba(0,0,0,0)',
        autosize: true,
        legend: {
            x: 1,
            y: 1,
            xanchor: 'right',
            yanchor: 'top',
            bgcolor: 'rgba(255,255,255,.5)',
            bordercolor: 'black',
            borderwidth: 1,
        }
    };

    // plotly config
    const config = {
        responsive: true
    }

    return Plotly.newPlot(targetDiv, data, layout, config);
}


/**
 * fetches historical data for coin, returns as plotly chart data
 * @param {Object} node 
 * @returns {Object} plotly graph data
 */
async function getChartData(node) {
    // make api call
    const options = { method: 'GET', headers: { 'x-cg-demo-api-key': process.env.GK_API } };
    const res = await fetch(`${process.env.GK_DETAIL_URL}${node.id}${process.env.GK_DETAIL_APPEND}`, options)
    const data = await res.json();

    // initialize date and price arrays
    let datesArray = new Array()
    let pricesArray = new Array()

    // parse data into arrays
    data.prices.forEach(element => {
        datesArray.push(element[0]);
        pricesArray.push(element[1])
    });

    // return as object formatted for plotly
    return {
        x: datesArray,
        y: pricesArray,
        type: 'scatter',
        name: node.name
        
    }
}

/**
 * removes a chart in a div with given id
 * @param {String} targetDiv 
 * @returns {Void}
 */
export function cleanUpChart(targetDiv) {
    Plotly.purge(targetDiv);
}