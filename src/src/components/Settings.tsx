import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Container, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { AppDispatch, useSelector } from "../Store";
import { User } from "../types/User";
import { Order } from "../types/Order";
import { Process } from "../types/Process";
import { patchUser } from "../reducers/UserReducer";
import { patchOrders } from "../reducers/OrderReducer";
import { patchProcesses } from "../reducers/ProcessReducer";
import { UserManager } from "../components/Settings/UserManager";
import { OrderManager } from "../components/Settings/OrderManager";
import { ProcessManager } from "../components/Settings/ProcessManager";
import { SnackBarAreaContext } from "./utils/SnackBarArea";

export const Settings = () => {
  const user = useSelector<User>(state => state.user.user);
  const orders = useSelector<Order[]>(state => state.order.orders);
  const processes = useSelector<Process[]>(state => state.process.processes);
  const [userChanged, setUserChanged] = useState<boolean>(false);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);
  const [processChanged, setProcessChanged] = useState<boolean>(false);
  const { setMessage, setSeverity, openSnackBar } = useContext(SnackBarAreaContext);
  const dispatch = useDispatch<AppDispatch>();

  const handleSaveButtonClick = () => {
    if (userChanged) {
      dispatch(patchUser(user));
      setUserChanged(false);
    }
    if (orderChanged) {
      dispatch(patchOrders(orders));
      setOrderChanged(false);
    }
    if (processChanged) {
      dispatch(patchProcesses(processes));
      setProcessChanged(false);
    }
    setMessage("保存しました。");
    setSeverity("success");
    openSnackBar();
  };

  return (
    <Container>
      <Stack
        spacing={2}>
        <Stack
          spacing={2}
          direction={"row"}>
          <Typography
            variant={"h4"}>
            設定
          </Typography>

          <Button
            variant={"outlined"}
            onClick={handleSaveButtonClick}>
            保存
          </Button>
        </Stack>

        <UserManager
          setUserChanged={setUserChanged} />

        <Stack
          spacing={2}>
          <OrderManager
            setOrderChanged={setOrderChanged} />
        </Stack>

        <Stack
          spacing={2}>
          <ProcessManager
            setProcessChanged={setProcessChanged} />
        </Stack>
      </Stack>
    </Container >
  );
};