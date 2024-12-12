export interface IBankAccount {
  id: string;
  country: string;
  currency: string;
  routingNumber?: string;
  bicSwiftCode?: string;
  customName: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  status: "Verified" | "Unverified";
  files?: File[];
}

export const initBankAccounts: IBankAccount[] = [
  {
    id: "a1b2c3d4-e5f6-7g8h-9i10-111213141516",
    country: "USA",
    currency: "USD",
    customName: "Personal Checking",
    bankName: "Bank of America",
    accountType: "Domestic Bank",
    accountNumber: "123456789",
    status: "Verified",
  },
  {
    id: "b2c3d4e5-f6g7-h8i9-1011-121314151617",
    country: "Brazil",
    currency: "BRL",
    customName: "Business Account",
    bankName: "Banco do Brasil",
    accountType: "International Bank",
    accountNumber: "987654321",
    status: "Unverified",
  },
  {
    id: "c3d4e5f6-g7h8-i9j10-1112-131415161718",
    country: "Germany",
    currency: "EUR",
    customName: "Savings Account",
    bankName: "Deutsche Bank",
    accountType: "International Bank",
    accountNumber: "456789123",
    status: "Verified",
  },
];
