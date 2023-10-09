import { Alert, AlertColor, Snackbar } from "@mui/material";
import { Dispatch, createContext, useContext, useState } from "react";
import { TransitionUp } from "./TransitionUp";

type SnackBarAreaContextType = {
  setMessage: Dispatch<React.SetStateAction<string>>,
  setSeverity: Dispatch<React.SetStateAction<AlertColor>>,
  openSnackBar: () => void
};
export const SnackBarAreaContext = createContext({} as SnackBarAreaContextType);

export const SnackBarArea = (props: {
  children: JSX.Element
}) => {
  const [isOpenSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const handleSnackBarOnClose = () => {
    setOpenSnackBar(false);
  };
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const openSnackBar = () => {
    setOpenSnackBar(true);
  };

  return (
    <SnackBarAreaContext.Provider value={{ setMessage, setSeverity, openSnackBar }}>
      {props.children}

      <Snackbar
        open={isOpenSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackBarOnClose}
        TransitionComponent={TransitionUp}>
        <Alert
          onClose={handleSnackBarOnClose}
          severity={severity}
          sx={{
            width: "30vw"
          }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackBarAreaContext.Provider>
  );
};