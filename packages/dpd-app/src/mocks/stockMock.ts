import { Market } from "@/models/Market";
import { initStoks } from "./initStocks";

const mockState: {
    stocks: Market[];
} = {
    stocks: initStoks,
};

export function configureStockMock(mock) {
    const getStockRangeRegExp = new RegExp(
        `${process.env.API_BASE_URL}/api/dpd/([^/]+)/range/(\d{4}-\d{2}-\d{2})/(\d{4}-\d{2}-\d{2})`
    );

    mock.onGet(getStockRangeRegExp).reply((config) => {
        const match = getStockRangeRegExp.exec(`${config.baseURL}${config.url}`);
        if (!match) return [400, { error: "Invalid URL" }];

        const [, ticker, from, to] = match;

        const startDate = new Date(from);
        const endDate = new Date(to);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const filteredData = mockState.stocks.filter((stock) => {
            const stockDate = new Date(stock.date);
            stockDate.setHours(0, 0, 0, 0);

            return (
                stock.symbol === ticker &&
                stockDate >= startDate &&
                stockDate <= endDate
            );
        });

        return [200, filteredData];
    });

    return mock;
}
