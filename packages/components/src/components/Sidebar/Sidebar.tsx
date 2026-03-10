import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Box, Divider, IconButton, Typography } from "@mui/material";
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
  const [hasScroll, setHasScroll] = useState(false);
  const simpleBarRef = useRef<SimpleBarRefType | null>(null);
  const scrollPosition = useRef(0);

  const checkScroll = useCallback(() => {
    if (simpleBarRef.current) {
      const scrollEl = simpleBarRef.current.getScrollElement();
      if (scrollEl) {
        const hasScrollbar = scrollEl.scrollHeight > scrollEl.clientHeight;
        setHasScroll(hasScrollbar);
      }
    }
  }, []);

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
  
  setTimeout(checkScroll, 0);
};

  useEffect(() => {
  if (simpleBarRef.current) {
    const scrollEl = simpleBarRef.current.getScrollElement();
    if (scrollEl) {
      scrollEl.scrollTop = scrollPosition.current;
    }
  }
}, [opened]);

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScroll]);

  const SimpleBarStyled = styled(SimpleBar)(({ theme }) => ({
    maxHeight: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
    "& .simplebar-content": {
      display: "flex",
      flexDirection: "column",
      minHeight: "100%",
    },
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
        <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>
          <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <SimpleBarStyled ref={simpleBarRef} sx={{ height: "100%", paddingTop: "16px" }}>
              {sidebarItems.filter(item => !item.isDisclaimer).map((item, sidebarItemindex) => (
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
                    isDisclaimer={item.isDisclaimer}
                    isLastInGroup={true}
                  />
                </Box>
              ))}
              
              {sidebarItems.find(item => item.isDisclaimer) && hasScroll && open && (
                <Box>
                  <Divider sx={{color: "lighgray"}}/>
                  <SidebarSection
                    sectionName=""
                    items={sidebarItems.find(item => item.isDisclaimer)?.sidebarListItems || []}
                    onSetItemOpen={() => {}}
                    open={open}
                    toggleSide={toggleSide}
                    isDisclaimer={true}
                  />
                </Box>
              )}
            </SimpleBarStyled>
          </Box>
          
          {sidebarItems.find(item => item.isDisclaimer) && !hasScroll && open && (
            <Box sx={{ flexShrink: 0 }}>
              <SidebarSection
                sectionName=""
                items={sidebarItems.find(item => item.isDisclaimer)?.sidebarListItems || []}
                onSetItemOpen={() => {}}
                open={open}
                toggleSide={toggleSide}
                isDisclaimer={true}
              />
            </Box>
          )}
        </Box>
      </>
    </StyledDrawer>
  );
}
