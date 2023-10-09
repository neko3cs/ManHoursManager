import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../Store";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { removeOrder, modifyOrder } from "../../../reducers/OrderReducer";
import { Order } from "../../../types/Order";

export const OrderItem = (props: {
  order: Order,
  setOrderChanged: Dispatch<SetStateAction<boolean>>
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<Order>(props.order);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    initializeComponent();
  }, []);

  const initializeComponent = async () => {
    setIsLoading(false);
  };
  const handleOrderNumberTextFieldOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...order, orderNumber: Number(event.target.value) };
    setOrder(next);
    dispatch(modifyOrder(next));
    props.setOrderChanged(true);
  };
  const handleOrderNameTextFieldOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...order, name: event.target.value };
    dispatch(modifyOrder(next));
    setOrder(next);
    props.setOrderChanged(true);
  };
  const handleOrderDeleteButtonOnClick = () => {
    dispatch(removeOrder(order));
    props.setOrderChanged(true);
  };

  return (
    isLoading ?
      <Typography
        variant={"h6"}>
        Loading
      </Typography> :
      <Stack
        direction={"row"}
        spacing={2}>
        <TextField
          label={"オーダー番号"}
          variant={"standard"}
          inputMode={"numeric"}
          sx={{
            width: "300px"
          }}
          value={order.orderNumber}
          onChange={handleOrderNumberTextFieldOnChange} />

        <TextField
          label={"オーダー名"}
          variant={"standard"}
          fullWidth
          autoComplete={"false"}
          value={order.name}
          onChange={handleOrderNameTextFieldOnChange} />

        <Button
          variant={"outlined"}
          color={"error"}
          onClick={handleOrderDeleteButtonOnClick}>
          削除
        </Button>
      </Stack>
  );
};