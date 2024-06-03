import { useMemo } from 'react';

// material-ui
import { Theme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project import
import Search from './Search';
import Profile from './Profile';
import Localization from './Localization';
import Notification from './Notification';
import MobileSection from './MobileSection';

import { MenuOrientation, ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';
import DrawerHeader from 'Layouts/DashboardLayout/Drawer/DrawerHeader';
import { ThemeToggler } from '../../../../../../components/src/components/Header/ThemeToggler';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const { menuOrientation, mode, onChangeMode } = useConfig();
  const theme = useTheme();
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const localization = useMemo(() => <Localization />, []);

  const handleThemeToggle = () => {
    onChangeMode(mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK);
  };

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      {!downLG && <Search />}
      {!downLG && localization}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      <Notification />
      {!downLG && (
        <ThemeToggler
          onToggleMode={handleThemeToggle}
          mode={mode}
          styles={{
            ml: 1,
            "&:hover": {
              backgroundColor: theme.palette.grey[200]
            }
          }}
        />
      )}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
