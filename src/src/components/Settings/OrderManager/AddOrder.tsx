import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Stack, TextField } from "@mui/material";
import { AppDispatch } from "../../../Store";
import { Order, createDefaultOrder } from "../../../types/Order";
import { addOrder } from "../../../reducers/OrderReducer";

export const AddOrder = (props: {
  setOrderChanged: Dispatch<SetStateAction<boolean>>
}) => {
  const [order, setOrder] = useState<Order>(createDefaultOrder());
  const dispatch = useDispatch<AppDispatch>();

  const handleOrderNumberTextFieldOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...order, orderNumber: Number(event.target.value) };
    setOrder(next);
  };
  const handleOrderNameTextFieldOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...order, name: event.target.value };
    setOrder(next);
  };
  const handleOrderAddButtonOnClick = () => {
    dispatch(addOrder(order));
    props.setOrderChanged(true);
    setOrder(createDefaultOrder());
  };

  return (
    <Stack
      direction={"row"}
      spacing={2}>
      <TextField
        label={"オーダー番号"}
        variant={"standard"}
        type={"number"}
        autoComplete={"false"}
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
        onClick={handleOrderAddButtonOnClick}>
        追加
      </Button>
    </Stack>
  );
};