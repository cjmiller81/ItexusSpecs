import { useSyncProviders } from "@/hooks/useSyncProviders";
import { TokenHolding, getAccountHoldings } from "@/utils/metamask";
import { Box, Checkbox, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { t } from "i18next";
import { useEffect, useState } from "react";

export function DexSection() {
    const [selectedDEX, setSelectedDEX] = useState<string>('');
    const savedDEXOptions = ['Metamask'];
    const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>()
    const [userAccounts, setUserAccounts] = useState<string[]>()
    const [userAccount, setUserAccount] = useState<string>('')
    const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
    const [currentPositions, setCurrentPositions] = useState<TokenHolding[]>([]);
    const providers = useSyncProviders()

    useEffect(() => {
        if (userAccount !== '') {
            const fetchHoldings = async () => {
                const holdings = await getAccountHoldings(userAccount);
                for (let i = 0; i < holdings.length; i++) {
                    const element = holdings[i];
                    element.id = i;
                }
                setCurrentPositions(holdings)
            }

            fetchHoldings().catch(console.error);
        }
    }, [userAccount])

    const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
        console.log(providerWithInfo)
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

    return (
        <Box>
            <Typography variant="h4" sx={{ color: 'white', marginBottom: 2 }}>
                {t("DEX")}: {selectedDEX ? selectedDEX : ''}
            </Typography>
            <Box display="flex" justifyContent="space-between" gap={2}>
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
                                providers.length > 0 ? providers?.map((provider: EIP6963ProviderDetail) => (
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
                </Box>
                <Box flex="1">
                    <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', color: 'white', width: '100%', boxShadow: 3 }}>
                        <Table sx={{ tableLayout: 'fixed' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', width: '10%' }}>
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
                                            backgroundColor: selectedPositions.includes(position.id) ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
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
                                                checked={selectedPositions.includes(position.id)}
                                                disabled={true}
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

    )
}