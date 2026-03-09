import { render } from 'sass';
import * as Utils from './utilities'
import * as bootstrap from 'bootstrap'

export class App {
    /** @type {marketData} */
    #marketData;
    /** @type {Element} */
    #$cardArea;
    /** @type {Element} */
    #$detailModalDiv
    /** @type {Element} */
    #$detailTitle
    /** @type {Element} */
    #$detailBody
    /** @type {Element} */
    #$detailFooter
    /** @type {bootstrap.Modal} */
    #$detailModalBs

    /** @type {Element} */
    #$worstTodayBtn
    /** @type {Element} */
    #$bigDropBtn
    /** @type {Element} */
    #$overviewBadge


    constructor() {
        // get references to dom elements
        this.#$cardArea = document.querySelector('#card-area');
        this.#$detailModalDiv = document.querySelector('#detail-modal')
        this.#$detailTitle = document.querySelector('#detail-title');
        this.#$detailBody = document.querySelector('#detail-body');
        this.#$detailFooter = document.querySelector('#detail-footer');
        this.#$bigDropBtn = document.querySelector('#big-drop');
        this.#$worstTodayBtn = document.querySelector('#worst-today')
        this.#$overviewBadge = document.querySelector('#accolade')

        // create bs modal 
        this.#$detailModalBs = new bootstrap.Modal(this.#$detailModalDiv);
        // attach cleanup method to modal hidden event
        this.#$detailModalDiv.addEventListener('hidden.bs.modal', () => this.#cleanupDetails);

        console.log(this.#$cardArea)

        // fetch market data from coinGecko api
        this.#marketData = this.#getMarketData();

        // subscribe to dataLoaded event
        document.addEventListener('dataLoaded', () => this.#onDataLoaded())

        // add change listeners to the sort method radio buttons
        this.#$worstTodayBtn.addEventListener('change', () => this.#displayWorst())
        this.#$bigDropBtn.addEventListener('change', () => this.#displayDrop())
    }

    /**
     * returns the worst 5 coins
     * @returns {Void}
     */
    getWorstCoins () {
        // return the first five coins in marketData
        // since we are sorting by worst, this will return
        // the five worst coins in this sorting method
        let output = this.#marketData.slice(0,5);
        console.log(output)
        return output
    }

    /**
     * gets list of coins with marketdata
     * @returns {Void}
     */
    #getMarketData() {
        let output;
        const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-pwZfjpJz94B3BDXSbPfWauGm' } };

        fetch('https://api.coingecko.com/api/v3/coins/markets?&ids=&vs_currency=usd&price_change_percentage=24h', options)
            .then(res => res.json())
            .then(res => {
                /** @type {coinNode24hr} */
                this.#marketData = res
                // console.log('output' + output)
                // console.table(btc)
                document.dispatchEvent(new CustomEvent('dataLoaded'));
            })
            .catch(err => console.error(err));
    }

    /**
     * triggered when initial api call returns data
     * sorts coins, populates card, renders overview chart
     */
    #onDataLoaded() {
        // sort by default method
        this.#sortCoinsWorst();
        // generate cards
        this.#populateCards(this.#marketData);

        // generate worst coins overview chart
        this.#displayWorst();


    }

    /**
     * sorts marketData by worst performing coin
     * @returns {Void}
     */
    #sortCoinsWorst() {
        this.#marketData.sort((a, b) => {
            return a.price_change_percentage_24h - b.price_change_percentage_24h;
        })

    }

    /**
     * sorts marketData by biggest drop since all time high
     * @returns {Void}
     */
    #sortCoinsAthDrop() {
        this.#marketData.sort((a, b) => {
            return (a.atl - a.ath ) - (b.atl - b.ath);
        })

    }

    /**
     * generates html for all cards
     * @returns {Void}
     */
    #populateCards() {
        // clear all cards 
        this.#$cardArea.replaceChildren();
        // generate card elements by sortedID
        this.#marketData.forEach(node => {
            try {
                // create the card
                const card = this.#createCard(node);
                // add it to the dom
                this.#$cardArea.append(card);
            } catch (error) {
                // log an error if the data for this card is messed up
                console.error('error loading coin: ' + node.id + error.message)
            }
        })


    }

    /**
     * Generates frontend Element for one display card with a given json node
     * @param {coinNode24hr} node 
     * @returns {String} html
     */
    #createCard(node) {
        // create a new div for this card
        let element = document.createElement('div');
        element.classList.add('col-lg-4', 'col-md-6');
        element.id = node.symbol;

        // initialize some variables for color coding
        /** @type {String} */
        let headerColor;
        /** @type {String} */
        let changeMessage;
        /** @type {String} */
        let changeColor
        // set card headerColor info if %change positive
        if (node.price_change_percentage_24h > 0) {
            headerColor = 'text-bg-info';
            changeMessage = 'gain';
            changeColor = 'text-bg-success'
        }
        // set card headerColor warning if %change negative
        if (node.price_change_percentage_24h < 0) {
            headerColor = 'text-bg-warning';
            changeMessage = 'loss';
            changeColor = 'text-bg-warning'
        }
        // set card headerColor danger if %change below -1%
        if (node.price_change_percentage_24h < -1) {
            headerColor = 'text-bg-danger'
            changeMessage = 'loss';
            changeColor = 'text-bg-danger'
        }

        // string literal html for card 
        let html = `
            <div class="card my-2 ">
            <div class="card-header d-flex justify-content-between ${headerColor}">
                <span class="fw-bold h4">${node.name}</span>
                <span class="h5">${node.symbol}</span>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-8">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <p class="mb-1"><b>24 Hour change: </b></p>
                                <p class="${changeColor} badge rounded-pill">${node.price_change_percentage_24h.toFixed(2)}%</p>
                            </li>
                            <li class="list-group-item">
                                <p class="mb-1 text-bold"><b>Total ${changeMessage}:</b></p>
                                <p class="${changeColor} badge rounded-pill">$ ${Utils.formatCurrency(node.market_cap_change_24h)}</p>
                            </li>
                        </ul>
                    </div>
                    <div class="col-4 d-flex align-items-center">
                        <img src='${node.image}' class="img-fluid" width="100%">
                    </div>
                </div>
            </div>
            </div>
        `;

        // add to created element
        element.innerHTML = html;
        // bind card click event
        element.addEventListener('click', (event) => this.#onCardClick(node));

        return element;
    }

    /**
     * shows details modal with a one year historical graph
     * @param {coinNode24hr} node 
     */
    #onCardClick(node) {
        // show modal
        this.#$detailModalBs.show()
        // render chart
        this.#setupDetails(node);

        // set modal text
        // set inner html with node name
        this.#$detailTitle.classList.add('d-flex', 'justify-items-between')
        this.#$detailTitle.innerHTML = `
            <p class="h2">
                <span class="text-bold"> ${node.name} </span>
                <span class="text-secondary"> details </span>
            </p>
        `;
        this.#$detailFooter.innerHTML = 'Price change over last year';

        

    }

    /**
     * renders a chart in details modal with given coin node
     * @param {coinNode24hr} node 
     * @returns {Void}
     */
    #setupDetails(node) {
        // create chart for this node in #detail-body
        Utils.renderChart([node], 'detail-body');
    }

    /**
     * removes chart from details modal
     * @returns {Void}
     */
    #cleanupDetails() {
        // delete chart from #detail-body
        Utils.cleanUpChart('detail-body');
    }

    /**
     * Sorts coins by worst performing today
     * updates overview graph and re-orders cards
     * @returns {Void}
     */
    #displayWorst() {
        // erase old chart
        Utils.cleanUpChart('chart-div');
        // sort coins
        this.#sortCoinsWorst();
        // generate new chart
        Utils.renderChart(this.getWorstCoins(), 'chart-div');
        // re-generate cards
        this.#populateCards()

        // set overview badge to worst coins percent loss today
        const worstCoin = this.getWorstCoins()[0]
        this.#$overviewBadge.innerHTML = `${worstCoin.name} lost ${Math.abs(worstCoin.price_change_percentage_24h.toFixed(2))}% today`;

    }

    /**
     * Sorts coins by largest drop since their peak
     * updates overview graph and re-orders cards
     * @returns {Void}
     */
    #displayDrop() {
        // erase old chart
        Utils.cleanUpChart('chart-div');
        // sort coins
        this.#sortCoinsAthDrop();
        // generate new chart
        Utils.renderChart(this.getWorstCoins(), 'chart-div');
        // re-generate cards
        this.#populateCards()

        // set overview badge to largest percent drop of a coin since its peak
        const worstCoin = this.getWorstCoins()[0]
        let biggestDrop = worstCoin.ath_change_percentage.toFixed(2);
        this.#$overviewBadge.innerHTML = `${worstCoin.name} has lost ${biggestDrop}% of it's value since its peak`


    }
}


/**
 * @typedef {Object.<string, coinNode24hr} marketData
 */

/**
 * @typedef {Object} coinNode24hr
 * @property {String} symbol
 * @property {String} name
 * @property {URL} image
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