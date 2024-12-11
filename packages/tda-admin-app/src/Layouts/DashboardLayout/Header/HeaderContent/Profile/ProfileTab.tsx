import React, { useState } from "react";

// next
import { useRouter } from "next/navigation";

// material-ui
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// assets
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import UserOutlined from "@ant-design/icons/UserOutlined";
import WalletOutlined from "@ant-design/icons/WalletOutlined";

interface Props {
  handleLogout: () => void;
}

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab({ handleLogout }: Props) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement>, index: number, route: string = "") => {
    setSelectedIndex(index);

    if (route && route !== "") {
      router.push(route);
    }
  };

  return (
    <List
      component="nav"
      sx={{ p: 0, "& .MuiListItemIcon-root": { minWidth: 32 } }}>
      <ListItemButton
        selected={selectedIndex === 1}
        onClick={(event: React.MouseEvent<HTMLDivElement>) => handleListItemClick(event, 1, "/profile/details")}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
      <ListItemButton
        selected={selectedIndex === 2}
        onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}
