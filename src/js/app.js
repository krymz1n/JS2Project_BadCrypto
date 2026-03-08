export class App {
    /** @type {marketData} */
    #marketData;
    /** @type {Array<String>} */
    #sortedIds;

    /** @type {Element} */
    #$cardArea;
    constructor() {
        // 
        this.#$cardArea = document.querySelector('#card-area');
        console.log(this.#$cardArea)

        // initialize #sortedIds as an array
        this.#sortedIds = new Array()
        // fetch market data from coinGecko api
        this.#marketData = this.#getMarketData();

        // subscribe to dataLoaded event
        document.addEventListener('dataLoaded', () => this.#onDataLoaded())
    }


    /**
     * gets list of coins with marketdata
     */
    #getMarketData() {
        let output;
        const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-pwZfjpJz94B3BDXSbPfWauGm' } };

        fetch('https://api.coingecko.com/api/v3/coins/markets?&ids=&vs_currency=usd&price_change_percentage=24h', options)
            .then(res => res.json())
            .then(res => {
                /** @type {coinNode24hr} */
                for (const value of Object.values(res)) {
                    this.#sortedIds.push(value.symbol)
                }
                this.#marketData = res
                // console.log('output' + output)
                // console.table(btc)
                document.dispatchEvent(new CustomEvent('dataLoaded'));
            })
            .catch(err => console.error(err));
    }

    #onDataLoaded() {
        this.#sortIds();
        this.#populateCards(this.#marketData);

    }

    #sortIds() {
        console.log(this.#marketData)
        this.#marketData.sort((a, b) => {
            return a.price_change_percentage_24h - b.price_change_percentage_24h;
        })
        console.log(this.#marketData)

    }

    /**
     * generates html for all cards
     */
    #populateCards() {
        // clear all cards 
        this.#$cardArea.replaceChildren();
        // generate card elements by sortedID
        this.#marketData.forEach(node => {
            try {
                const card = this.#createCard(node);
                this.#$cardArea.append(card);
            } catch (error) {
                console.error('error loading coin: ' + node.id)
            }
        })


    }

    /**
     * Generates frontend Element for one display card with a given json node
     * @param {coinNode24hr} node 
     * @returns {String} html
     */
    #createCard(node) {
        let element = document.createElement('div');
        element.classList.add('col-lg-4', 'col-md-6');
        element.id = node.symbol;

        /** @type {String} */
        let color;
        /** @type {String} */
        let changeMessage;
        // set card color info if %change positive
        if (node.price_change_percentage_24h > 0) {
            color = 'text-bg-info';
            changeMessage = 'gain';
        }
        // set card color warning if %change negative
        if (node.price_change_percentage_24h < 0) {
            color = 'text-bg-warning';
            changeMessage = 'loss';
        }
        // set card color danger if %change below -1%
        if (node.price_change_percentage_24h < -1) {
            color = 'text-bg-danger'
            changeMessage = 'loss';
        }

        // string literal html for card 
        let html = `
            <div class="card my-2 ">
            <div class="card-header d-flex justify-content-between ${color}">
                <span class="fw-bold h4">${node.name}</span>
                <span class="h5">${node.symbol}</span>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-8">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <p class="mb-1"><b>24 Hour change: </b></p>
                                <p>${node.price_change_percentage_24h.toFixed(2)}%</p>
                            </li>
                            <li class="list-group-item">
                                <p class="mb-1 text-bold"><b>Total ${changeMessage}:</b></p>
                                <p>$${node.market_cap_change_24h.toFixed(2)}</p>
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
     * 
     * @param {coinNode24hr} node 
     */
    #onCardClick(node) {

        console.log(node.symbol)
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