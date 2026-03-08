

/**
 * Generates html string for one display card with a given json node
 * @param {coinNode24hr} node 
 * @returns {String} html
 */
export function createCard(node) {
    let html = `
        <div class="col-lg-4 col-md-6">
            <div class="card my-2 ">
            <div class="card-header d-flex justify-content-between text-bg-warning">
                <span class="fw-bold h4">${node.name}</span>
                <span class="h5">${node.symbol}</span>
            </div>
            <div class="card-body">
                <p>24 Hour change: ${node.price_change_percentage_24h.toFixed(2)}%</p>
                <p>Total loss: $${node.market_cap_change_24h.toFixed(2)}</p>
            </div>
            </div>
        </div>
    `

    return html
}

function currencyString(rawNum) {
    let priceString;
}

function calcMoneyLost(node) {

}

/**
 * gets list of coins with marketdata
 * @returns {marketData}
 */
export function getMarketData() {
    const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-pwZfjpJz94B3BDXSbPfWauGm' } };

    fetch('https://api.coingecko.com/api/v3/coins/markets?&ids=asd&vs_currency=usd&price_change_percentage=24h', options)
        .then(res => res.json())
        .then(res => {
            for (const value of Object.values(res)) {
            }
            const btc = res[0];
            let output = ''
            for (const [key, value] of Object.entries(btc)) {
                output += `${key}: ${value}
        `
            }
            console.log('output' + output)
            console.table(btc)
        })
        .catch(err => console.error(err));

    return output
}

/**
 * @typedef {Object.<string, coinNode24hr} marketData
 */

/**
 * @typedef {Object} coinNode24hr
 * @property {String} symbol
 * @property {String} name
 * @property {String} image
 * @property {Number} current_price
 * @property {Number} market_cap
 * @property {Number} market_cap_rank
 * @property {Number} fully_diluted_valuation
 * @property {Number} total_volume
 * @property {Number} high_24h
 * @property {Number} low_24h
 * @property {Number} price_change_24h
 * @property {Number} price_change_percentage_24h
 * @property {Number} market_cap_change_24h
 * @property {Number} market_cap_change_percentage_24h
 * @property {Number} circulating_supply
 * @property {Number} total_supply
 * @property {Number} max_supply
 * @property {Number} ath
 * @property {Number} ath_change_percentage
 * @property {String} ath_date
 * @property {Number} atl
 * @property {Number} atl_change_percentage
 * @property {String} atl_date
 * @property {{times: Number, currency: String, percentage: Number}} roi
 * @property {String} last_updated
 * @property {Number} price_change_percentage_24h_in_currency
 */