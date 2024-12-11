import { useEffect, useRef, useState } from "react";
import { IconButton, Popper, Paper, List, ListItem, ListItemText, ClickAwayListener, Box } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

export default function SupportButton() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const popperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (popperRef.current) {
      popperRef.current.style.top = "45px";
      popperRef.current.style.left = "auto";
    }
  }, [open]);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ margin: "0 7px 3px 0" }}>
      <IconButton
        ref={anchorRef}
        onClick={handleToggle}
        sx={{
          backgroundColor: "#0056b3",
          color: "black",
          width: 19,
          height: 19,
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: "#034893",
          },
        }}>
        <QuestionMarkIcon sx={{ fontSize: 14 }} />
      </IconButton>
      <Popper
        ref={popperRef}
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal>
        {({ TransitionProps }) => (
          <Paper
            {...TransitionProps}
            sx={{ mt: 1 }}>
            <ClickAwayListener onClickAway={handleClose}>
              <List>
                <ListItem button>
                  <ListItemText primary="Developer Docs" />
                </ListItem>
                <ListItem button>
                  <ListItemText primary="Contact Us" />
                </ListItem>
              </List>
            </ClickAwayListener>
          </Paper>
        )}
      </Popper>
    </Box>
  );
}
