import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import { configureBankAccountsMock } from "mocks/configureBankAccountsMock";

export const configureAxiosMockBankAccHandler = (axiosInstance: AxiosInstance) => {
  const mock = new MockAdapter(axiosInstance);
  configureBankAccountsMock(mock);
};
