export const btcNgnMarketStorageJob = (interval: number) => {

    return schedule(interval, getBtcLocalStorage);
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

let btcNgnMarketStorage: any;

export const getBtcLocalStorage = (): any => {

    if(localStorage.getItem('btc-ngn-market-response')) {

        btcNgnMarketStorage = localStorage.getItem('btc-ngn-market-response');
        btcNgnMarketStorage = JSON.parse(btcNgnMarketStorage);
        console.log('btcNgnMarketStorage: ', btcNgnMarketStorage);

        return btcNgnMarketStorage;
    }
    return {};
}