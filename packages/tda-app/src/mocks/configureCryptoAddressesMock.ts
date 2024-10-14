import { initCryptoAddresses } from "./initCryptoAddresses";
import MockAdapter from "axios-mock-adapter";

const mockState = {
  cryptoAddresses: initCryptoAddresses,
};

export function configureCryptoAddressesMock(mock: MockAdapter) {
  const baseURL = process.env.API_BASE_URL || "";

  const getAllCryptoAddressesRegex = new RegExp(`${baseURL}/api/cryptoAddress`);

  mock.onGet(getAllCryptoAddressesRegex).reply(() => {
    return [200, mockState.cryptoAddresses];
  });

  const deleteCryptoAddressesRegex = new RegExp(`${baseURL}/api/cryptoAddress/([^/]+)`);
  mock.onDelete(deleteCryptoAddressesRegex).reply(config => {
    const accountIdMatch = config.url?.match(/\/api\/cryptoAddress\/([^/]+)/);
    const accountId = accountIdMatch ? accountIdMatch[1] : null;

    if (!accountId) {
      return [400, { message: "Invalid account ID" }];
    }

    const initialLength = mockState.cryptoAddresses.length;
    mockState.cryptoAddresses = mockState.cryptoAddresses.filter(account => account.id !== accountId);

    const isDeleted = initialLength > mockState.cryptoAddresses.length;
    if (isDeleted) {
      return [200];
    } else {
      return [404, { message: "Account not found" }];
    }
  });

  mock.onPost(`${baseURL}/api/cryptoAddress`).reply(config => {
    try {
      const newAccount = JSON.parse(config.data);

      if (!newAccount.id || !newAccount.walletAddress) {
        return [400, { message: "Invalid account data" }];
      }
      mockState.cryptoAddresses.push(newAccount);
      return [201, newAccount];
    } catch (error) {
      return [500, { message: "Error processing request" }];
    }
  });

  return mock;
}
