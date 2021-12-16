const fetchUrl = 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search';
const fetchBody = {
    asset: "BTC",
    fiat: "NGN",
    page: 1,
    payTypes: [],
    publisherType: null,
    rows: 10,
    tradeType: "BUY"
}
const fetchMethod = 'POST';

export const btcNgnMarketJob = (interval: number) => {

    return schedule(interval, httpCall);
}

const schedule = (interval: number, cb: any) => ({

    start: () => {
        setInterval(() => {
            cb()
        }, interval)
    },
    stop: () => {
        clearInterval(cb)
    }
})

const httpCall = async () => {

    return await fetch(fetchUrl, {
        method: fetchMethod,
        body: JSON.stringify(fetchBody),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(result => result.json())
    .then(response => {
        console.log('btc-ngn-data: ', response);

        localStorage.setItem('btc-ngn-market-response', JSON.stringify(response));
    })
    .catch(e => console.log('error: ', e.message))
}