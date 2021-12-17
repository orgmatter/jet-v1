const fetchUrl = '/bapi/c2c/v2/friendly/c2c/adv/search';
const fetchBody = {
    asset: "USDT",
    fiat: "NGN",
    page: 1,
    payTypes: [],
    publisherType: null,
    rows: 10,
    tradeType: "BUY"
}
const fetchMethod = 'POST';

export const usdtNgnMarketJob = (interval: number) => {

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
        console.log('usdt-ngn-data: ', response);

        localStorage.setItem('usdt-ngn-market-response', JSON.stringify(response));
    })
    .catch(e => console.log('error: ', e.message))
}