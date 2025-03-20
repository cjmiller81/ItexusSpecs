import { Action, PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState, appAxios, createAppSlice } from "components";
export interface connectedAccount {
    accountNumber: string;
    status: string;
}

export interface userProfileState {
    connectedAccounts: connectedAccount[],
    loading: boolean,
    schwabConnectUrl: string,
    error: string | null,
}

const initialState: userProfileState = {
    connectedAccounts: [],
    loading: false,
    schwabConnectUrl: "",
    error: null
}

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        resetConnectedAccounts(state) {
            state.connectedAccounts = []
            state.loading = false;
        },
        fetchSchwabConnectUrlSuccess(state, action: PayloadAction<string>) {
            state.loading = false;
            state.schwabConnectUrl = action.payload;
        },
        fetchSchwabConnectUrlRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchSchwabConnectUrlFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.schwabConnectUrl = "";
        },
        fetchSchwabAccountListSuccess(state, action: PayloadAction<connectedAccount[]>) {
            state.loading = false;
            state.connectedAccounts = action.payload;
        },
        fetchSchwabAccountListRequest(state) {
            state.loading = true;
            state.error = null;
        },
        fetchSchwabAccountListFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.connectedAccounts = [];
        }
    }
});

export const { resetConnectedAccounts, fetchSchwabConnectUrlRequest, fetchSchwabConnectUrlSuccess, fetchSchwabConnectUrlFailure, fetchSchwabAccountListSuccess, fetchSchwabAccountListRequest, fetchSchwabAccountListFailure } = userProfileSlice.actions;

export const getSchwabConnectUrl = (): AppThunk => async (dispatch) => {
    dispatch(fetchSchwabConnectUrlRequest());
    try {
        const response = await appAxios.get("/api/schwab/auth/connect", {
            withCredentials: true,
        });
        dispatch(fetchSchwabConnectUrlSuccess(response.data));
    } catch (error) {
        console.error("Failed to fetch schwab connect url", error);
        dispatch(fetchSchwabConnectUrlFailure("Failed to fetch schwab connect url"));
    }
};

export const getSchwabAccountList = (): AppThunk => async (dispatch) => {
    dispatch(fetchSchwabAccountListRequest());
    try {
        const response = await appAxios.get("/api/schwab/accountList", {
            withCredentials: true,
        });
        var accounts: connectedAccount[] = [];
        response.data.map(account => accounts.push({ accountNumber: account.securitiesAccount.accountNumber, status: "Connected" }))
        dispatch(fetchSchwabAccountListSuccess(accounts));
    } catch (error) {
        console.error("Failed to fetch schwab connected accounts", error);
        dispatch(fetchSchwabAccountListFailure("Failed to fetch schwab connected accounts"));
    }
};

export default userProfileSlice;