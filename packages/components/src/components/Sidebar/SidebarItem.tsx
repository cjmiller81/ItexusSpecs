"use client";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Chip, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { styled, useTheme, keyframes } from "@mui/material/styles";
import { AppLink } from "../common/AppLink";
import { SidebarListItem } from "./types";
import { useRouter } from "next/router";

interface Props {
  item: SidebarListItem & { open: boolean };
  isSidebarOpened: boolean;
  open: boolean;
  //eslint-disable-next-line no-unused-vars
  setOpen: (open: boolean) => void;
}

const StyledListItemButton = styled(ListItemButton)({
  "& > .MuiBox-root": {
    display: "none",
  },
});

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const shimmer = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export function SidebarItem({ item, isSidebarOpened, open, setOpen }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const isSelected = item.href === router.asPath;

  return (
    <ListItem
      disablePadding
      sx={{ display: "block", padding: 0 }}>
      <StyledListItemButton
        selected={isSelected}
        sx={{
          height: isSidebarOpened ? "40px" : "42px",
          minHeight: isSidebarOpened ? "40px" : "42px",
          paddingTop: isSidebarOpened ? "12px" : "0px",
          paddingBottom: isSidebarOpened ? "12px" : "0px",
          paddingLeft: isSidebarOpened ? "17px" : "0px",
          paddingRight: isSidebarOpened ? "20px" : "0px",
          borderLeft: "3px solid transparent",
          borderRadius: "8px",
          transition: "background-color 0.2s ease, height 0.2s, padding 0.2s",
          justifyContent: isSidebarOpened ? "flex-start" : "center",
          "&.Mui-selected": {
            borderLeft: `3px solid ${theme.palette.primary.main}`,
            backgroundColor: "rgba(33, 154, 131, 0.08)",
            color: theme.palette.primary.main,
            fontWeight: 600,
            "& .MuiListItemIcon-root": {
              color: theme.palette.primary.main,
            },
            "&:hover": {
              backgroundColor: "rgba(33, 154, 131, 0.12)",
            },
          },
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        }}
        onClick={() => setOpen(!open)}>
        {item.icon && (
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isSidebarOpened ? 1.5 : 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: isSidebarOpened ? 17 : 24,
              height: isSidebarOpened ? 17 : 24,
              color: "#ffffff",
              transition: 'all 0.2s',
              '& svg': {
                fontSize: isSidebarOpened ? 17 : 24,
                transition: 'font-size 0.2s',
              },
            }}>
            {item.icon}
          </ListItemIcon>
        )}
        {isSidebarOpened && (
          <ListItemText
            primary={item.title}
            sx={{
              opacity: 1,
              textAlign: "left",
              flex: 1,
              "& .MuiListItemText-primary": {
                color: "#ffffff",
              }
            }}
            primaryTypographyProps={{
              variant: "body1",
              sx: {
                fontSize: "15px ",
                fontWeight: 550,
              }
            }}
          />
        )}
        {item.children && isSidebarOpened && (
          <ExpandMore
            sx={{
              fontSize: "16px",
              marginLeft: "auto",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease, font-size 0.2s",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          />
        )}
      </StyledListItemButton>

      {item.children && (
        <Collapse in={!isSidebarOpened ? false : open}>
          <List component="div" sx={{ position: 'relative' }}>
            {/* "Coming Soon" badge for Open Source and Updates */}
            {(item.title === "Open Source" || item.title === "Updates") && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '16px',
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                }}
              >
                <Chip
                  icon={
                    <Box
                      component="svg"
                      viewBox="0 0 16 16"
                      sx={{
                        animation: `${rotate} 4s linear infinite`,
                        width: '12px',
                        height: '12px',
                        fill: '#60a5fa'
                      }}
                    >
                      <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0z"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
                    </Box>
                  }
                  label="Coming Soon"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.2) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '20px',
                    color: '#60a5fa',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontSize: '11px',
                    animation: `${pulseGlow} 3s ease-in-out infinite`,
                    backdropFilter: 'blur(8px)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                      animation: `${shimmer} 2s infinite`,
                      zIndex: 0,
                    },
                    '& .MuiChip-label': {
                      position: 'relative',
                      zIndex: 1,
                    },
                    '& .MuiChip-icon': {
                      position: 'relative',
                      zIndex: 1,
                    }
                  }}
                />
              </Box>
            )}
            {item.children.map(child => {
              // 🚨 FIX: More flexible path matching to handle trailing slashes
              const isChildSelected =
                router.asPath === child.href ||
                router.asPath + '/' === child.href ||
                router.asPath === child.href + '/';

              if (child.disabled) {
                return (
                  <ListItemButton
                    key={child.title}
                    disabled
                    sx={{
                      height: "40px",
                      minHeight: "40px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      pl: 4,
                      justifyContent: "flex-start",
                      opacity: 0.5,
                      cursor: "not-allowed",
                      borderLeft: "3px solid transparent",
                    }}
                  >
                    <ListItemText
                      primary={child.title}
                      sx={{ textAlign: "left" }}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: {
                          fontSize: "13px",
                          fontWeight: 400,
                          letterSpacing: '0.01em',
                        }
                      }}
                    />
                  </ListItemButton>
                );
              }
              return (
                <AppLink
                  key={child.title}
                  passHref
                  href={child.href}
                  shallow
                >
                  <ListItemButton
                    selected={isChildSelected}
                    onClick={() => {
                      // 🚨 FIX: Explicit navigation handler
                      console.log('Child item clicked:', child.title, child.href);
                      if (child.href) {
                        router.push(child.href);
                      }
                    }}
                    sx={{
                      height: "40px",
                      minHeight: "40px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      pl: 4,
                      justifyContent: "flex-start",
                      borderLeft: "3px solid transparent",
                      borderRadius: "8px",
                      transition: "background-color 0.2s ease",
                      "&.Mui-selected": {
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                        backgroundColor: "rgba(33, 154, 131, 0.08)",
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        "& .MuiListItemIcon-root": {
                          color: theme.palette.primary.main,
                        },
                        "& .MuiListItemText-primary": {
                          color: theme.palette.primary.main,
                        },
                        "&:hover": {
                          backgroundColor: "rgba(33, 154, 131, 0.12)",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={child.title}
                      sx={{
                        textAlign: "left",
                        '& .MuiListItemText-primary': {
                          color: '#ffffff',
                        }
                      }}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: {
                          fontSize: "13px",
                          fontWeight: 400,
                          letterSpacing: '0.01em',
                          opacity: 0.90,
                          color: "lightgray",
                        }
                      }}
                    />

                    {/* Derivatives "Coming Soon" badge removed - see ARCHIVED_FEATURES.md */}
                    {/* {child.title == "Derivatives" && (
                      <Box
                        sx={{
                          ml: 2,
                          px: 1,
                          py: 0.2,
                          backgroundColor: "#424242",
                          color: "lightgray",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: 500,
                          textTransform: "uppercase",
                        }}
                      >
                        Coming Soon
                      </Box>
                    )} */}
                  </ListItemButton>
                </AppLink>
              );
            })}
          </List>
        </Collapse>
      )}
    </ListItem>
  );
}
