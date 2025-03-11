import { AccordionDetails, AccordionProps, Box, Checkbox, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, TooltipProps, Typography, styled, tooltipClasses, useTheme } from "@mui/material";
import { PageTitle, StatePersistedAccordion, StyledAccordionSummary } from "components";
import { useEffect, useState } from "react";
import Web3, { EIP6963ProviderDetail } from 'web3'
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import React from "react";
import { useAppSelector } from "@/libs/redux/Store";
import { useTranslation } from "react-i18next";
import { type MetaMaskInpageProvider } from '@metamask/providers';

export interface chainModel {
    chainId: number;
    chainName: string;
    symbol: string;
}

declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider;
    }
}

export interface holding {
    id: number;
    symbol: string;
    chain: string;
    quantity: string;
    selected: boolean;
}
type Props = Omit<AccordionProps, "children"> & {
    persisKey: string;
};

export function DexSection({ persisKey, ...props }: Props) {
    const [selectedDEX, setSelectedDEX] = useState<string>('');
    const [userAccounts, setUserAccounts] = useState<string[]>()
    const [userAccount, setUserAccount] = useState<string>('')
    const [selectedPositions, setSelectedPositions] = useState<holding[]>([]);
    const [currentPositions, setCurrentPositions] = useState<holding[]>([]);
    const [web3Enabled, setWeb3Enabled] = useState(false);
    const [isSelectAll, setSelectAll] = useState(false);
    const [providers, setProviders] = useState<EIP6963ProviderDetail[]>([]);
    const theme = useTheme();
    const { sidebarOpened } = useAppSelector(store => store.ui);
    const { t } = useTranslation(["LiquidityPoolsPage", "Common"]);

    const metamaskChainIds: chainModel[] = [
        { chainId: 1, chainName: "Ethereum", symbol: "ETH" },
        { chainId: 59144, chainName: "Linea", symbol: "ETH" },
        { chainId: 56, chainName: "BNB", symbol: "BNB" },
        { chainId: 137, chainName: "POLYGON", symbol: "POL" },
        { chainId: 42161, chainName: "ARBITRUM", symbol: "ETH" },
        { chainId: 43114, chainName: "Avalanche", symbol: "AVAX" },
        { chainId: 8453, chainName: "Base Mainnet", symbol: "ETH" },
        { chainId: 10, chainName: "OP Mainnet", symbol: "ETH" },
        { chainId: 324, chainName: "zkSync Era Mainnet", symbol: "ETH" }]

    let web3: Web3 = new Web3()

    const ethEnabled = async () => {
        if (typeof window.ethereum !== 'undefined') {
            // Instance web3 with the provided information from the MetaMask provider information
            web3 = new Web3(window.ethereum);
            try {
                // Request account access
                await window.ethereum.enable();

                return true
            } catch (e) {
                // User denied access
                return false
            }
        }
    }

    useEffect(() => {
        const web3Connect = async () => {
            // Following will subscribe to event that will be triggered when providers map is updated.

            // Call the function and wait for the promise to resolve
            let listOfProviders = await Web3.requestEIP6963Providers();
            let providersArray: EIP6963ProviderDetail[] = [];
            listOfProviders.forEach((provider, key) => {
                providersArray.push(provider);
                setProviders(providersArray);
            })
        }
        web3Connect().catch(console.error);
    }, [])

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            currentPositions.map(c => c.selected = true)
            setSelectedPositions(currentPositions);
            setSelectAll(true);
            return;
        }

        currentPositions.map(c => c.selected = false)
        setSelectedPositions([]);
        setSelectAll(false);
    };

    const handleSelectClick = (position: holding) => {
        if (!position.selected) {
            setSelectedPositions(cs => [...cs, position]);
            position.selected = true;
        } else {
            setSelectedPositions(cs => cs.filter(p => p.id != position.id))
            position.selected = false;
        }
    }

    useEffect(() => {
        if (currentPositions.length == selectedPositions.length && currentPositions.length != 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedPositions])

    useEffect(() => {
        if (userAccount !== '') {
            setWeb3Enabled(true)
            const getAcc = async () => {
                if (await !ethEnabled()) {
                    alert("Please install MetaMask to use this dApp!");
                }
                await web3.currentProvider?.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: web3.utils.toHex(1) }]
                }).catch(console.error)

                for (let index = 0; index < metamaskChainIds.length; index++) {
                    let chain = metamaskChainIds[index];
                    await web3.currentProvider?.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: web3.utils.toHex(chain.chainId) }]
                    }).catch(console.error)
                    const nativeBalance = await web3.eth.getBalance(userAccount);
                    const nativeBalanceNumber = web3.utils.fromWei(nativeBalance, 'ether')
                    if (Number.parseFloat(nativeBalanceNumber) !== 0) {
                        let hld: holding = { chain: chain.chainName, id: index, symbol: chain.symbol, quantity: nativeBalanceNumber, selected: false };
                        setCurrentPositions(curArray => [...curArray, hld])
                    }
                }
            }
            getAcc().catch(console.error);
        }
    }, [userAccount])

    const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
        const accounts: string[] | undefined =
            await (
                providerWithInfo.provider
                    .request({ method: 'eth_requestAccounts' })
                    .catch(console.error)
            ) as string[] | undefined;
        if (accounts?.length != 0) {
            setUserAccounts(accounts)
        }
    }

    const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip
            {...props}
            arrow
            classes={{ popper: className }}
        />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.mode === "dark" ? "#7CB9E8" : "#00308F",
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.mode === "dark" ? "#7CB9E8" : "#00308F",
            color: "white",
        },
    }));

    const darkThemeStyles = {
        cursor: "default !important",
        mt: 2,
        pointerEvents: "none",
        position: "inherit",
        borderRadius: "2px",
        boxShadow: "8px 2px 10px rgba(0, 0, 0, 0.2), -8px 2px 10px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#363640",
        border: "1.6px solid #25252AFF",
        outline: "1.9px solid #363640",
        "& .MuiAccordionSummary-root": {
            background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(54, 54, 64, 0.7) 24px, #363640 100%)`,
        },
    };

    const lightThemeStyles = {
        cursor: "default !important",
        mt: 2,
        pointerEvents: "none",
        position: "inherit",
        borderRadius: "2px",
        boxShadow: `
        0px 0px 2px 1.5px rgba(15, 15, 16, 1),
        -6.5px 0px 8px rgba(0, 0, 0, 0.9),
         6.5px 0px 8px rgba(0, 0, 0, 0.9),
         0px 0.05px 0.05px rgba(0, 0, 0, 0.1),
         0px -0.05px 0.05px rgba(0, 0, 0, 0.1) 
      `,
        backgroundColor: "#9e9e9e",
        border: "1.6px solid #5e5e5e",
        outline: "1.9px solid #4a4a4a",
        "& .MuiAccordionSummary-root": {
            background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, rgba(200, 200, 200, 0.3) 24px, rgba(170, 170, 170, 1) 80%)`,
        },
    };

    return (
        <StatePersistedAccordion
            className="index-modeling-section-container"
            persistKey={persisKey}
            defaultExpanded
            sx={theme.palette.mode === "dark" ? darkThemeStyles : lightThemeStyles}
            {...props}>
            <StyledAccordionSummary
                expandIcon={
                    <CustomTooltip
                        title={t("ToggleView", { ns: "Common" })}
                        arrow>
                        <IconButton sx={{ cursor: "pointer", pointerEvents: "auto", transform: "rotate(-90deg)" }}>
                            <ArrowBackIosNewOutlinedIcon
                                sx={{
                                    "& path": {
                                        stroke: "currentColor",
                                        strokeWidth: 2,
                                        fill: "currentColor",
                                    },
                                }}
                            />
                        </IconButton>
                    </CustomTooltip>
                }
                sx={{
                    "&.MuiAccordionSummary-root:hover": {},
                }}>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        pointerEvents: "auto !important",
                        cursor: "default",
                    }}>
                    <PageTitle
                        sx={{ width: "100%" }}
                        onClick={e => e.stopPropagation()}>
                        {t("TradeAggregatorDEX")}
                    </PageTitle>
                </Box>
            </StyledAccordionSummary>
            <AccordionDetails
                sx={{
                    bgcolor: theme.palette.mode === "dark" ? "#363640" : "#aaaaaa",
                    width: `${sidebarOpened ? "calc(100vw - 283px)" : "calc(100vw - 105px)"}`,
                    transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
                    pointerEvents: "auto",
                }}>
                <Box>

                    <Box display="flex" justifyContent="space-between" gap={2}>
                        <Box>
                            <Typography variant="h6" sx={{ color: 'white', marginBottom: 2 }}>
                                {t("DEX")}: {selectedDEX ? selectedDEX : ''}
                            </Typography>
                            <Box>
                                <Box sx={{ minWidth: 200 }}>
                                    <Select
                                        value={selectedDEX}
                                        onChange={(e) => setSelectedDEX(e.target.value)}
                                        displayEmpty
                                        renderValue={(selected) => (selected ? selected : "Connect Wallet Service")}
                                        sx={{
                                            backgroundColor: "#109EEF",
                                            fontSize: "11px",
                                            color: "white",
                                            width: "98%",
                                            maxHeight: "40px",
                                            marginBottom: "12px",
                                            "& .MuiSelect-icon": { color: "white" },
                                        }}
                                    >{
                                            providers?.length > 0 ? providers.map((provider: EIP6963ProviderDetail) => (
                                                <MenuItem key={provider.info.uuid} value={provider.info.name} onClick={() => handleConnect(provider)}>{provider.info.name}</MenuItem>
                                            )) :
                                                <div>
                                                    No Announced Wallet Providers
                                                </div>
                                        }
                                    </Select>
                                </Box>
                                <Box sx={{ minWidth: 200 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: 'white',
                                            marginBottom: 2,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {t("Connected Wallet")}
                                    </Typography>
                                    <Select
                                        value={userAccount}
                                        onChange={(e) => setUserAccount(e.target.value)}
                                        displayEmpty
                                        renderValue={(selected) => (selected ? selected : "")}
                                        sx={{
                                            backgroundColor: "#FFFFFF",
                                            fontSize: "11px",
                                            color: "black",
                                            width: "98%",
                                            maxHeight: "40px",
                                            marginBottom: "12px",
                                            "& .MuiSelect-icon": { color: "black" },
                                        }}
                                    >{userAccounts?.map((account) => (
                                        <MenuItem key={account} value={account}>
                                            {account}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </Box>
                            </Box></Box>
                        <Box flex="1">
                            <Typography variant="h6" sx={{ color: 'white', marginBottom: 2 }}>
                                {t("TradeAggregatorCurrentPosition")}
                            </Typography>
                            <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', color: 'white', width: '100%', boxShadow: 3 }}>
                                <Table sx={{ tableLayout: 'fixed' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '10%' }}>
                                                <Checkbox
                                                    sx={{
                                                        color: 'rgba(255, 255, 255, 0.7)',
                                                        '&.Mui-checked': {
                                                            color: 'white',
                                                        },
                                                    }}
                                                    checked={isSelectAll || false}
                                                    onClick={handleSelectAllClick}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '30%' }}>{t("Symbol")}</TableCell>
                                            <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '30%' }}>{t("Chain")}</TableCell>
                                            <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '30%' }}>{t("Qty")}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentPositions.map((position) => (
                                            <TableRow
                                                key={position.id}
                                                sx={{
                                                    backgroundColor: selectedPositions.includes(position) ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                                }}
                                            >
                                                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                    <Checkbox
                                                        sx={{
                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                            '&.Mui-checked': {
                                                                color: 'white',
                                                            },
                                                        }}
                                                        checked={position.selected || false}
                                                        onClick={() => handleSelectClick(position)}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                    {position.symbol}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                    {position.chain}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                                    {position.quantity}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Box>
            </AccordionDetails>
        </StatePersistedAccordion>
    )
}