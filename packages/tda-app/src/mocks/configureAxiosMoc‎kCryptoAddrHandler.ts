import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { configureCryptoAddressesMock } from "mocks/configureCryptoAddressesMock";

export const configureAxiosMockCryptoAddrHandler = (axiosInstance: AxiosInstance) => {
  const mock = new MockAdapter(axiosInstance);
  configureCryptoAddressesMock(mock);
};
