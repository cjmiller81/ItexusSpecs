import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Alert,
  Snackbar,
  Grid,
} from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';

// Weekly option symbols (static data)
const WEEKLY_SYMBOLS = [
  'CAN', 'NAK', 'BLNK', 'QSI', 'TLRY', 'MVIS', 'CGC', 'BITF', 'OMEX', 'TSLZ', 'WOLF', 'PLUG', 'GEVO', 'INO', 'LAZR',
  'LCID', 'PSQH', 'SAVA', 'IQ', 'NFE', 'HIVE', 'BYND', 'FFAI', 'CLOV', 'LAES', 'IOVA', 'ANVS', 'BTBT', 'RIG', 'AMC',
  'SPCE', 'VERU', 'IRBT', 'FUBO', 'VFS', 'ALT', 'OPEN', 'BB', 'MNKD', 'FCEL', 'WEAT', 'NOK', 'MPW', 'PLCE', 'SPXS',
  'MSOS', 'FAZ', 'LUMN', 'APT', 'TMC', 'POET', 'KULR', 'GRAB', 'NIO', 'RXRX', 'HTZ', 'SFIX', 'MSTZ', 'JBLU', 'MSTU',
  'BBAI', 'UWMC', 'CIFR', 'LABD', 'AUR', 'EOSE', 'RILY', 'BMBL', 'ASPN', 'SOXS', 'SNAP', 'TDOC', 'FSLY', 'HL', 'JMIA',
  'RUM', 'BHC', 'PTON', 'QS', 'MLGO', 'AG', 'UUUU', 'LUNR', 'WULF', 'MLCO', 'RCAT', 'EBS', 'ACHR', 'BYON', 'CLSK',
  'NVAX', 'HLF', 'AGNC', 'SERV', 'UEC', 'VALE', 'STLA', 'ENVX', 'TIGR', 'TZA', 'CLF', 'SKYT', 'PATH', 'TAL', 'PARA',
  'WB', 'GOOS', 'HE', 'ABR', 'WBD', 'F', 'VOD', 'PBR', 'RIOT', 'CHPT', 'TSLL', 'WBA', 'UNG', 'PCT', 'RIVN', 'VG',
  'CSIQ', 'AEO', 'BTDR', 'NMAX', 'M', 'VFC', 'NU', 'AAL', 'CLMT', 'AES', 'SOUN', 'UVXY', 'KSS', 'ASAN', 'MBLY',
  'UVIX', 'ICLN', 'CORZ', 'USAR', 'JOBY', 'QUBT', 'BULL', 'STNE', 'CC', 'RGTI', 'MARA', 'QBTS', 'APLD', 'SPXU', 'RUN',
  'ZIM', 'VIX', 'LYFT', 'PONY', 'PCG', 'XP', 'SILJ', 'BTU', 'MSTY', 'OSCR', 'S', 'TRIP', 'EH', 'ET', 'AI', 'DJT',
  'NVDX', 'PAA', 'TEVA', 'MANU', 'SQQQ', 'BEKE', 'GRRR', 'KEY', 'RKT', 'PENN', 'SVIX', 'KGC', 'IREN', 'ZETA', 'CAG',
  'ACI', 'CPRI', 'SRPT', 'APA', 'BITO', 'GAP', 'NLY', 'XPEV', 'HAL', 'HPE', 'KVUE', 'GEO', 'HUT', 'UCO', 'DQ', 'SOFI',
  'AAOI', 'GME', 'SIRI', 'CTRA', 'DOW', 'LI', 'B', 'ARKG', 'BAX', 'VKTX', 'NCLH', 'BILI', 'MSTX', 'CZR', 'INTC', 'PFE',
  'SMMT', 'JETS', 'FL', 'SOXL', 'WRBY', 'KMI', 'HPQ', 'YANG', 'EWZ', 'SCHD', 'KHC', 'GRPN', 'MRNA', 'TGTX', 'HOG',
  'BOIL', 'SONY', 'DBX', 'HRL', 'CPNG', 'T', 'CNQ', 'NNE', 'CNC', 'SMST', 'CCL', 'ASHR', 'BBWI', 'AA', 'AR', 'RNG',
  'PAAS', 'JD', 'ETHA', 'TECK', 'EPD', 'LUV', 'SEDG', 'MOS', 'SMR', 'CPB', 'IOT', 'SLB', 'DVN', 'BP', 'SLV', 'CMCSA',
  'MT', 'PINS', 'ENPH', 'CSX', 'MGM', 'IONQ', 'URA', 'KWEB', 'TMF', 'U', 'TNA', 'MTCH', 'FXI', 'KOLD', 'ALLY', 'SU',
  'VXX', 'GSK', 'RKLB', 'CHWY', 'TAN', 'BILL', 'FCX', 'TOST', 'HIMS', 'BE', 'SMCI', 'CMG', 'OXY', 'TFC', 'GTLB', 'YINN',
  'VZ', 'ASTS', 'DKNG', 'ONON', 'EXAS', 'USB', 'CART', 'SYM', 'SVXY', 'IP', 'BAC', 'BMY', 'SNV', 'AGQ', 'ON', 'EEM',
  'EQT', 'TTD', 'XLF', 'ASO', 'LVS', 'CRSP', 'NVO', 'AAP', 'WMB', 'GDX', 'NTR', 'BITX', 'GM', 'LMND', 'FOXA', 'MAGS',
  'ADM', 'CELH', 'DAL', 'FEZ', 'EWW', 'UPST', 'KRE', 'BUD', 'TSCO', 'IAU', 'MDLZ', 'ETSY', 'BROS', 'HSBC', 'MNST',
  'IBIT', 'GLW', 'MCHP', 'OKLO', 'AMBA', 'MO', 'CSCO', 'NBIS', 'LABU', 'NEM', 'CAVA', 'PYPL', 'MP', 'FIS', 'KO', 'KR',
  'DOCU', 'CVS', 'GDXJ', 'SHEL', 'MRVL', 'ZM', 'USO', 'TEM', 'DD', 'CCJ', 'AFRM', 'GEHC', 'ARKK', 'BBY', 'XYZ', 'URBN',
  'WDC', 'AKAM', 'NEE', 'NKE', 'WFC', 'FTNT', 'W', 'AZN', 'HYG', 'ALB', 'DXCM', 'SIG', 'AIG', 'XLP', 'CROX', 'Z', 'CF',
  'XRT', 'MRK', 'NVDL', 'XLE', 'CL', 'XLU', 'NUGT', 'TLT', 'COHR', 'UPS', 'XBI', 'ROKU', 'BIDU', 'TQQQ', 'EL', 'MDT',
  'XLB', 'VNQ', 'SBUX', 'WPM', 'OKTA', 'IRM', 'EFA', 'CRWV', 'C', 'COP', 'EMB', 'SO', 'DPST', 'ANF', 'UBER', 'IEF',
  'SCHW', 'IYR', 'JNK', 'TPR', 'FBTC', 'UPRO', 'EBAY', 'LRCX', 'BK', 'WMT', 'ILMN', 'UAL', 'TWLO', 'BSX', 'SSO', 'SHAK',
  'TGT', 'DECK', 'IGV', 'AFL', 'XOM', 'HOOD', 'NTAP', 'LQD', 'XLC', 'ITB', 'CRH', 'DLTR', 'DG', 'WYNN', 'PPG', 'XHB',
  'DIS', 'EOG', 'GILD', 'RBLX', 'PDD', 'ELF', 'BABA', 'WGS', 'MU', 'PSX', 'XOP', 'ABNB', 'DDOG', 'VRT', 'AEM', 'PHM',
  'ABT', 'EMR', 'TOL', 'ANET', 'KMB', 'ARM', 'LEN', 'TJX', 'DELL', 'XLV', 'APO', 'VLO', 'BIIB', 'KKR', 'FANG', 'ETHU',
  'FI', 'SHOP', 'FTAI', 'ALGN', 'MS', 'GDDY', 'NUE', 'ROST', 'NRG', 'HES', 'CAH', 'XLI', 'CVX', 'PEP', 'RTX', 'MMM',
  'QCOM', 'CAR', 'PLTR', 'STX', 'PG', 'AMAT', 'MPC', 'STZ', 'TEAM', 'AMD', 'DLR', 'FAS', 'BX', 'DHI', 'FUTU', 'PM',
  'EA', 'ALAB', 'HWM', 'NVDA', 'TXRH', 'JNJ', 'SE', 'HSY', 'PANW', 'CLS', 'RSP', 'SPXL', 'SNOW', 'PNC', 'VST', 'TXN',
  'NET', 'LULU', 'GOOGL', 'GOOG', 'ABBV', 'EXPE', 'FSLR', 'DHR', 'COF', 'CTAS', 'HON', 'MDB', 'UNP', 'BA', 'IWM',
  'DKS', 'AMZN', 'RDDT', 'TTWO', 'NXPI', 'WDAY', 'XLY', 'ADI', 'AAPL', 'RH', 'TSM', 'FDX', 'ORCL', 'IBM', 'CRM',
  'CBOE', 'DASH', 'PGR', 'ACN', 'LOW', 'TMUS', 'XLK', 'GE', 'MAR', 'CHTR', 'HLT', 'ZS', 'BURL', 'NSC', 'HUM', 'ADSK',
  'JPM', 'SMH', 'AVGO', 'AMGN', 'COIN', 'CI', 'UNH', 'GLD', 'ADP', 'AXP', 'MCD', 'VTI', 'GD', 'CEG', 'TSLA', 'RCL',
  'MSTR', 'V', 'CVNA', 'ETN', 'ADBE', 'TLN', 'VRTX', 'HD', 'APP', 'CAT', 'CRWD', 'LMT', 'DIA', 'ISRG', 'BRK/B', 'DE',
  'TMO', 'MSFT', 'ULTA', 'SPGI', 'QQQ', 'REGN', 'MA', 'VOO', 'GEV', 'SPY', 'XSP', 'IVV', 'MCK', 'INTU', 'LLY', 'SPOT',
  'GS', 'ASML', 'META', 'NOW', 'URI', 'COST', 'BLK', 'NFLX', 'RUT', 'MELI', 'BKNG', 'SPX', 'NDX'
];

interface MatchData {
  symbol: string;
  probability: number;
}

export default function WeeklyMatchesPage() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row and process data
        const importedMatches: MatchData[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row && row.length >= 2) {
            const symbol = String(row[0]).trim().toUpperCase();
            const probability = parseFloat(row[1]);
            
            // Check if symbol exists in weekly symbols
            if (WEEKLY_SYMBOLS.includes(symbol) && !isNaN(probability)) {
              importedMatches.push({ symbol, probability });
            }
          }
        }

        setMatches(importedMatches);
                 setSnackbar({
           open: true,
           message: `Successfully imported ${importedMatches.length} matches`,
           severity: 'success',
         });
             } catch (error) {
         setSnackbar({
           open: true,
           message: 'Error reading Excel file. Please check the file format.',
           severity: 'error',
         });
       }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
         if (matches.length === 0) {
       setSnackbar({
         open: true,
         message: 'No data to export',
         severity: 'info',
       });
       return;
     }

    try {
      const worksheet = XLSX.utils.json_to_sheet(matches);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Weekly Matches');
      XLSX.writeFile(workbook, 'weekly_matches.xlsx');
      
             setSnackbar({
         open: true,
         message: 'Data exported successfully',
         severity: 'success',
       });
         } catch (error) {
       setSnackbar({
         open: true,
         message: 'Error exporting data',
         severity: 'error',
       });
     }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Weekly Matches
      </Typography>

      <Grid container spacing={3}>
        {/* Weeklys Card - Left */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weeklys
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {WEEKLY_SYMBOLS.map((symbol) => (
                      <TableRow key={symbol}>
                        <TableCell>{symbol}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Matches Card - Right */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Matches
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Import
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleExport}
                    disabled={matches.length === 0}
                  >
                    Export
                  </Button>
                </Stack>
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImport}
                style={{ display: 'none' }}
              />

              {matches.length > 0 ? (
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Symbol</TableCell>
                        <TableCell align="right">Probability</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {matches.map((match) => (
                        <TableRow key={match.symbol}>
                          <TableCell>{match.symbol}</TableCell>
                                                   <TableCell align="right">
                           {match.probability}
                         </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                                   <Typography variant="body2" color="text.secondary">
                   No matches found. Import an Excel file to see results.
                 </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
