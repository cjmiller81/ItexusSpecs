import React, { useState, useEffect } from "react";
import { CircularProgress, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { useGetCoinsQuery } from "@/features/Dashboard/CryptoCalendar/calendarApi"; // Импорт API
import { Coin } from "./eventsResponseModel";

const LazyLoadingCoins = () => {
  const { data: coinsData, isLoading } = useGetCoinsQuery({ offset: 0, limit: 100 });

  const [displayedCoins, setDisplayedCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (coinsData?.body) {
      setDisplayedCoins(coinsData.body.slice(0, 20));
    }
  }, [coinsData]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const bottom = target.scrollHeight === target.scrollTop + target.clientHeight;

    if (bottom && !loading && coinsData?.body && displayedCoins.length < coinsData.body.length) {
      setLoading(true);
      setTimeout(() => {
        setDisplayedCoins(prevCoins => [
          ...prevCoins,
          ...coinsData.body.slice(prevCoins.length, prevCoins.length + 10),
        ]);
        setLoading(false);
      }, 500);
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <FormControl
      variant="outlined"
      fullWidth>
      <InputLabel id="lazy-load-dropdown-label">Choose an option</InputLabel>
      <Select
        labelId="lazy-load-dropdown-label"
        value={selected}
        onChange={e => setSelected(e.target.value)}
        label="Choose an option"
        MenuProps={{
          PaperProps: { style: { maxHeight: 200 } },
        }}
        onScroll={handleScroll} // Событие прокрутки должно быть на контейнере меню
      >
        {displayedCoins.map(coin => (
          <MenuItem
            key={coin.id} // Используем id вместо index для уникальности ключей
            value={coin.id}>
            {coin.fullname}
          </MenuItem>
        ))}
        {loading && (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default LazyLoadingCoins;
