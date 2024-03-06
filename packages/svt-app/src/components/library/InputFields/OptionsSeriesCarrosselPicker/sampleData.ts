import { Position } from "../../../../services/useACF";
import { getFutureOptionsSymbol, getFutureSymbol, getThirdFridayOfMonth } from "../../../../utils";

const service = {
	// TODO: Not sure how many weeks out for dailies, weekly, etc. This is close, but not perfect.
	/**
	 * Generate an /ES Option Chain:
	 *  Daily: (mon, tues, wed, thur) for 8 weeks, skipping any Weekly or EOM option, but still total of 8 weeks out.
	 *   -
	 *  Weekly:
	 *   - Every Friday, 3 months out (8 weeks?)
	 *   - After that, the 3rd friday of each month through the next year (2024)
	 *   - Then, the 3rd friday of the last month of the quarter through the 2nd year (2025)
	 *   - Then, the thrid friday of december for the next 2 years (2026, 2027)
	 *  End of Month:
	 *   - Last week day of month through end of next 2 quaters
	 *   - Last week day of month for last month of quarter for the next 6 quarters
	 */
	generateOptionsChains() {
		const today = new Date();
		const chain = [];

		for (let i = 1; i < 60; i++) {
			const nextDay = new Date();
			nextDay.setDate((today.getDate() + i));

			if (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
				continue;
			}

			const position = {} as Position;
			position.symbol = "/ES";
			position.expiration = nextDay.toISOString().replace(/-/g, '').split('T')[0];

			const futureSymbol = getFutureSymbol(position.symbol);
			const optionContractSymbol = getFutureOptionsSymbol(position);
			const expTypeCode = optionContractSymbol.substring(2, 3);
			const expType = (expTypeCode === "W") ? "Weekly" : "Daily";

			const option = {
				"underlying-symbol": futureSymbol.replace("23", "3").replace("24", "4").replace("25", "5"),
				"root-symbol": "/ES",
				"option-contract-symbol": optionContractSymbol,
				"expiration-date": nextDay.toISOString().split('T')[0],
				"days-to-expiration": i,
				"expiration-type": expType,
				/* // TODO
				"asset": "E1D",
				"option-root-symbol": "E1D",
				"settlement-type": "PM",
				"notional-value": "0.5",
				"display-factor": "0.01",
				"strike-factor": "1.0",
				"stops-trading-at": "2023-10-05T20:00:00.000+00:00",
				"expires-at": "2023-10-05T20:00:00.000+00:00",
				*/
			};

			chain.push(option);
		}

		for (let i = 61; i < 425; i++) {
			const nextDay = new Date();
			nextDay.setDate((today.getDate() + i));

			if ([0, 1, 2, 3, 4, 6].indexOf(nextDay.getDay()) > -1) {
				continue;
			}

			if (i > 75 && nextDay.getDate() !== getThirdFridayOfMonth(nextDay)) {
				continue;
			}

			const position = {} as Position;
			position.symbol = "/ES";
			position.expiration = nextDay.toISOString().replace(/-/g, '').split('T')[0];

			const futureSymbol = getFutureSymbol(position.symbol);
			const optionContractSymbol = getFutureOptionsSymbol(position);
			const expTypeCode = optionContractSymbol.substring(2, 3);
			const expType = (expTypeCode === "W") ? "Weekly" : "Daily";

			const option = {
				"underlying-symbol": futureSymbol.replace("23", "3").replace("24", "4").replace("25", "5"),
				"root-symbol": "/ES",
				"option-contract-symbol": optionContractSymbol,
				"expiration-date": nextDay.toISOString().split('T')[0],
				"days-to-expiration": i,
				"expiration-type": expType,
			};

			chain.push(option);
		}

		return chain;
	}
};

export default service;
