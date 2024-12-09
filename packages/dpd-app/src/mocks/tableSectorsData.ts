export const tableSectorsData = [
    { id: 1, date: '11/22/2024', symbol: 'XLC', bought: 581990, sold: 211559, avg: 11, buyRatio: 2.75, dpIndex: 73, total: 793549 },
    { id: 2, date: '11/22/2024', symbol: 'XLE', bought: 2107562, sold: 1022774, avg: 41, buyRatio: 2.06, dpIndex: 67, total: 3130336 },
    { id: 3, date: '11/22/2024', symbol: 'XLRE', bought: 698501, sold: 342070, avg: 13, buyRatio: 2.04, dpIndex: 67, total: 1040571 },
    { id: 4, date: '11/22/2024', symbol: 'XLY', bought: 418428, sold: 207406, avg: 8, buyRatio: 2.02, dpIndex: 67, total: 625834 },
    { id: 5, date: '11/22/2024', symbol: 'XLP', bought: 1475371, sold: 769063, avg: 28, buyRatio: 1.92, dpIndex: 66, total: 2244434 },
    { id: 6, date: '11/22/2024', symbol: 'XLI', bought: 1512174, sold: 843011, avg: 29, buyRatio: 1.79, dpIndex: 64, total: 2355185 },
    { id: 7, date: '11/22/2024', symbol: 'XLF', bought: 9326065, sold: 5839808, avg: 180, buyRatio: 1.60, dpIndex: 61, total: 15165873 },
    { id: 8, date: '11/22/2024', symbol: 'XLB', bought: 324527, sold: 252691, avg: 8, buyRatio: 1.28, dpIndex: 56, total: 577218 },
    { id: 9, date: '11/22/2024', symbol: 'XLV', bought: 813088, sold: 1026979, avg: 31, buyRatio: 0.79, dpIndex: 44, total: 1840067 },
    { id: 10, date: '11/22/2024', symbol: 'XLK', bought: 375676, sold: 643717, avg: 20, buyRatio: 0.58, dpIndex: 37, total: 1019393 },
    { id: 11, date: '11/22/2024', symbol: 'XLU', bought: 750497, sold: 1353902, avg: 41, buyRatio: 0.55, dpIndex: 36, total: 2104399 },
].map(item => ({
    ...item,
    date: new Date(item.date),
}));;