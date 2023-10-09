import { Dispatch, SetStateAction } from "react";
import { open, save } from "@tauri-apps/api/dialog";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { useDispatch } from "react-redux";
import { AppDispatch, useSelector } from "../../Store";
import { Button, Divider, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Order, convertOrderFromCsvRowString, convertOrderToCsvRowString } from "../../types/Order";
import { OrderItem } from "./OrderManager/OrderItem";
import { addOrder, removeOrder } from "../../reducers/OrderReducer";
import { AddOrder } from "./OrderManager/AddOrder";

export const OrderManager = (props: {
  setOrderChanged: Dispatch<SetStateAction<boolean>>
}) => {
  const orders = useSelector<Order[]>(state => state.order.orders);
  const dispatch = useDispatch<AppDispatch>();

  const handleOrderImportButtonOnClick = async () => {
    const file = await open({
      multiple: false, filters: [{ name: "CSV", extensions: ["csv"] }]
    });
    if (file) {
      const forDelete = JSON.parse(JSON.stringify(orders)) as Order[];
      forDelete.forEach(x => dispatch(removeOrder(x)));
      const rawCsv = await readTextFile(String(file), { dir: BaseDirectory.AppConfig });
      rawCsv
        .split(/\r?\n/)
        .map(x => convertOrderFromCsvRowString(x))
        .forEach(x => dispatch(addOrder(x)));
      props.setOrderChanged(true);
    }
  };
  const handleOrderExportButtonOnClick = async () => {
    const csv = orders.map(order => convertOrderToCsvRowString(order)).join("\n");
    const path = await save({ filters: [{ name: "CSV", extensions: ["csv"] }] });
    if (path) {
      await writeTextFile(path, csv);
    }
  };

  return (
    <Stack
      spacing={2}>
      <Stack
        direction={"row"}
        spacing={2}>
        <Typography
          variant={"h5"}>
          オーダー管理
        </Typography>

        <Button
          variant={"outlined"}
          onClick={handleOrderImportButtonOnClick}>
          一括取込
        </Button>

        <Button
          variant={"outlined"}
          onClick={handleOrderExportButtonOnClick}>
          CSV出力
        </Button>
      </Stack>

      <AddOrder
        setOrderChanged={props.setOrderChanged} />

      <Divider />

      <Stack
        spacing={2}
        maxHeight={"210px"}
        sx={{
          overflowY: "auto"
        }}>
        {
          orders.length === 0 ?
            <Typography
              variant={"h6"}>
              オーダーは登録されていません。
            </Typography> :
            orders.map(x =>
              <OrderItem
                key={x.id}
                order={x}
                setOrderChanged={props.setOrderChanged} />
            )
        }
      </Stack>
    </Stack >
  );
};