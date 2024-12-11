export interface ICryptoAddresses {
  id: string;
  walletAddress: string;
  addressTagMemo?: string;
  blockchain: string;
  status: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

export const initCryptoAddresses: ICryptoAddresses[] = [
  {
    id: "a1b2c3d4-e5f6-7g8h-9i10-111213141516",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    addressTagMemo: "Personal Wallet",
    blockchain: "Ethereum",
    status: "Verified",
    firstName: "John",
    middleName: "Jonson",
    lastName: "Smith",
  },
  {
    id: "b2c3d4e5-f6g7-h8i9-1011-121314151617",
    walletAddress: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080",
    addressTagMemo: "Business Wallet",
    blockchain: "Bitcoin",
    status: "Unverified",
    firstName: "John",
    middleName: "Jonson",
    lastName: "Smith",
  },
];
