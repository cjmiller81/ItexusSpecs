import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import React, { useState, useRef, useEffect } from "react";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Box, Divider, IconButton } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { SidebarSection } from "./SidebarSection";
import { StyledDrawer } from "./StyledDrawer";
import { StyledDrawerHeader } from "./StyledDrawerHeader";
import { SidebarItems } from "./types";

interface Props {
  open: boolean;
  sidebarItems: SidebarItems[];
  //eslint-disable-next-line no-unused-vars
  toggleSide: (open: boolean) => void;
}

type SimpleBarRefType = React.ElementRef<typeof SimpleBar>;

export function Sidebar({ open, toggleSide, sidebarItems }: Props) {
  const theme = useTheme();
  const [opened, setOpened] = useState(new Map<string, boolean>());
  const simpleBarRef = useRef<SimpleBarRefType | null>(null);
  const scrollPosition = useRef(0);

  const handleSetItemOpen = (title: string, index: number, newOpen: boolean) => {
  if (simpleBarRef.current) {
    const scrollEl = simpleBarRef.current.getScrollElement();
    if (scrollEl) {
      scrollPosition.current = scrollEl.scrollTop;
    }
  }
  setOpened(prevOpened => {
    const newOpened = new Map(prevOpened);
    newOpened.set(`${index}-${title}`, newOpen);
    return newOpened;
  });
};

  useEffect(() => {
  if (simpleBarRef.current) {
    const scrollEl = simpleBarRef.current.getScrollElement();
    if (scrollEl) {
      scrollEl.scrollTop = scrollPosition.current;
    }
  }
}, [opened]);

  const SimpleBarStyled = styled(SimpleBar)(({ theme }) => ({
    maxHeight: "calc(100vh - 64px)",
    "& .simplebar-scrollbar": {
      "&:before": {
        backgroundColor: theme.palette.grey[300],
      },
    },
    "& .simplebar-track.simplebar-vertical": {
      width: "10px",
    },
    "& .simplebar-mask": {
      zIndex: "inherit",
    },
  }));

  return (
    <StyledDrawer 
      variant="permanent" 
      open={open}>
      <>
        <StyledDrawerHeader>
          <IconButton onClick={() => toggleSide(false)}>
            {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </StyledDrawerHeader>
        <SimpleBarStyled ref={simpleBarRef}>
          {sidebarItems.map((item, sidebarItemindex) => (
            <Box key={sidebarItemindex}>
              <SidebarSection
                sectionName={item.title !== "Home" ? item.title : ""}
                items={item.sidebarListItems.map(item => ({
                  ...item,
                  open: Boolean(opened.get(`${sidebarItemindex}-${item.title}`) || false),
                }))}
                onSetItemOpen={(title, open) => handleSetItemOpen(title, sidebarItemindex, open)}
                open={open}
                toggleSide={toggleSide}
              />
              {sidebarItemindex !== sidebarItems.length - 1 && <Divider />}
            </Box>
          ))}
        </SimpleBarStyled>
      </>
    </StyledDrawer>
  );
}
