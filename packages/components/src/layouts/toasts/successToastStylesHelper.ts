export const getSuccessStyles = (backgroundColor: string) => ({
  icon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "white",
    border: "2px solid #89cb5c",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  toast: {
    backgroundColor,
    color: "black",
    width: "max-content",
    display: "flex",
    alignItems: "center",
  },
  progress: {
    backgroundColor: "white",
  },
});
