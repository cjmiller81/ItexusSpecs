import { createSlice } from "@reduxjs/toolkit";

export interface connectedAccount {
    accountNumber: string;
    status: string;
}

export interface userProfileState {
    connectedAccounts: connectedAccount[],
    loading: boolean
}

const initialState: userProfileState = {
    connectedAccounts: [],
    loading: false
}

export const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        fetchConnectedAccounts(state) {
            state.connectedAccounts = [{ accountNumber: "12345", status: "Connected" }, { accountNumber: "24566", status: "Connected" }
                , { accountNumber: "550383", status: "Connected" }
            ]
            state.loading = false;
        },
        resetConnectedAccounts(state) {
            state.connectedAccounts = []
            state.loading = false;
        }
    }
});

export const { fetchConnectedAccounts, resetConnectedAccounts } = userProfileSlice.actions;

export default userProfileSlice.reducer