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


// const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-BycXtXB8pGv8wRCAgNn6vWrA' } };

// fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily&precision=2', options)
//     .then(res => res.json())
//     .then(res => console.log(res))
//     .catch(err => console.error(err));

// const output = {
//     "prices": [
//         1711843200000,
//         69702.3087473573
//     ]
// }