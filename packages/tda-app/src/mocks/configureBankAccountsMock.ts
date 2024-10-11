import { initBankAccounts } from "./initBankAccounts";
import MockAdapter from "axios-mock-adapter";

const mockState = {
  bankAccounts: initBankAccounts,
};

export function configureBankAccountsMock(mock: MockAdapter) {
  const baseURL = process.env.API_BASE_URL || "";

  const getAllBankAccountsRegex = new RegExp(`${baseURL}/api/bank/accounts`);

  mock.onGet(getAllBankAccountsRegex).reply(() => {
    return [200, mockState.bankAccounts];
  });

  const deleteBankAccountRegex = new RegExp(`${baseURL}/api/bank/accounts/([^/]+)`);
  mock.onDelete(deleteBankAccountRegex).reply(config => {
    const accountIdMatch = config.url?.match(/\/api\/bank\/accounts\/([^/]+)/);
    const accountId = accountIdMatch ? accountIdMatch[1] : null;

    if (!accountId) {
      return [400, { message: "Invalid account ID" }];
    }

    const initialLength = mockState.bankAccounts.length;
    mockState.bankAccounts = mockState.bankAccounts.filter(account => account.id !== accountId);

    const isDeleted = initialLength > mockState.bankAccounts.length;
    if (isDeleted) {
      return [200];
    } else {
      return [404, { message: "Account not found" }];
    }
  });

  mock.onPost(`${baseURL}/api/bank/accounts`).reply(config => {
    const newAccount = JSON.parse(config.data);

    if (!newAccount.id || !newAccount.bankName) {
      return [400, { message: "Invalid account data" }];
    }

    mockState.bankAccounts.push(newAccount);
    return [201, newAccount];
  });

  return mock;
}
