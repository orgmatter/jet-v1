export const usdtNgnMarketStorageJob = (interval: number) => {

    return schedule(interval, getUsdtLocalStorage);
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

let usdtNgnMarketStorage: any;

export const getUsdtLocalStorage = (): any => {

    if(localStorage.getItem('usdt-ngn-market-response')) {

        usdtNgnMarketStorage = localStorage.getItem('usdt-ngn-market-response');
        usdtNgnMarketStorage = JSON.parse(usdtNgnMarketStorage);
        console.log('usdtNgnMarketStorage: ', usdtNgnMarketStorage);

        return usdtNgnMarketStorage;
    }
    return {};
}