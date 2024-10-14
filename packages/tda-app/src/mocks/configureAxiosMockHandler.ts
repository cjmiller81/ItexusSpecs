import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { configureBankAccountsMock } from "mocks/configureBankAccountsMock";
import { configureCryptoAddressesMock } from "mocks/configureCryptoAddressesMock";

export const configureAxiosMockHandler = (axiosInstance: AxiosInstance) => {
  const mock = new MockAdapter(axiosInstance);

  configureCryptoAddressesMock(mock);
  configureBankAccountsMock(mock);
};
