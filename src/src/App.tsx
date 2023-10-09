import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { NavBar } from "./components/NavBar";
import { WorkList } from "./components/WorkList";
import { Settings } from "./components/Settings";
import { AppDispatch } from "./Store";
import { getUser } from "./reducers/UserReducer";
import { getOrders } from "./reducers/OrderReducer";
import { getProcesses } from "./reducers/ProcessReducer";
import { getWorks } from "./reducers/WorkReducer";
import { AppBarOffset } from "./components/utils/AppBarOffset";
import { SnackBarArea } from "./components/utils/SnackBarArea";

export const App = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isLoading) {
      initialize();
    }
  }, []);

  const initialize = () => {
    dispatch(getUser());
    dispatch(getOrders());
    dispatch(getProcesses());
    dispatch(getWorks(new Date()));
    setIsLoading(false);
  };

  return (
    isLoading ?
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        minHeight={"100vh"}>
        <Typography
          variant={"h4"}>
          Loading
        </Typography>
      </Box> :
      <BrowserRouter>
        <SnackBarArea>
          <Stack
            direction={"column"}
            spacing={2}>
            <AppBar
              position={"fixed"}>
              <Toolbar>
                <Typography
                  variant={"h6"}
                  component={"div"}
                  flexGrow="1"
                  display={{
                    sx: "none",
                    sm: "block"
                  }}>
                  ManHours Manager
                </Typography>
                <NavBar />
              </Toolbar>
            </AppBar>

            <AppBarOffset />

            <Routes>
              <Route
                path={"/"}
                element={<WorkList />} />
              <Route
                path={"/settings"}
                element={<Settings />} />
            </Routes>
          </Stack>
        </SnackBarArea>
      </BrowserRouter>
  );
};