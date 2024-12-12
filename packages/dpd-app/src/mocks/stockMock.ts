import { Market } from "@/models/Market";
import { initStoks } from "./initStocks";

const mockState: {
    stocks: Market[];
} = {
    stocks: initStoks,
};

export function configureStockMock(mock) {
    const getStockRangeRegExp = new RegExp(
        `${process.env.API_BASE_URL}/api/dpd/([^/]+)/range/([^/]+)/([^/]+)`
    );

    mock.onGet(getStockRangeRegExp).reply((config) => {
        const match = getStockRangeRegExp.exec(`${config.baseURL}${config.url}`);
        if (!match) return [400, { error: "Invalid URL" }];

        const [, ticker, from, to] = match;

        const startDate = new Date(from);
        const endDate = new Date(to);

        const startUTC = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
        const endUTC = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());

        const filteredData = mockState.stocks.filter((stock) => {
            const stockDateUTC = Date.UTC(
                stock.date.getUTCFullYear(),
                stock.date.getUTCMonth(),
                stock.date.getUTCDate(),
                stock.date.getUTCHours(),
                stock.date.getUTCMinutes(),
                stock.date.getUTCSeconds(),
                stock.date.getUTCMilliseconds()
            );

            return (
                stock.symbol === ticker &&
                stockDateUTC >= startUTC &&
                stockDateUTC <= endUTC
            );
        });

        return [200, filteredData];
    });

    return mock;
}
