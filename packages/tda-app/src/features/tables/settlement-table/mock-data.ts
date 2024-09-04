import { v4 as uuidv4 } from 'uuid';

export type SettlementTableRow = {
  type: string;
  settlementId: string;
  time: Date;
  date: Date;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  destination: string;
};

const mockData: SettlementTableRow[] = [];

const types = ['Withdrawal', 'Deposit', 'Transfer'];
const currencies = ['USD', 'EUR', 'GBP', 'JPY'];
const statuses = ['Completed', 'Pending', 'Failed'];
const destinations = ['Bank Account', 'Credit Card', 'PayPal', 'Crypto Wallet'];

for (let i = 0; i < 20; i++) {
  const settlement: SettlementTableRow = {
    type: types[Math.floor(Math.random() * types.length)],
    settlementId: uuidv4(),
    time: new Date(),
    date: new Date(),
    amount: +(Math.random() * 10000).toFixed(2),
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    reference: `REF${Math.floor(Math.random() * 1000000)}`,
    destination: destinations[Math.floor(Math.random() * destinations.length)],
  };

  mockData.push(settlement);
}

export default mockData;