import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { AppDispatch, useSelector } from "../../Store";
import { Order } from "../../types/Order";
import { Process } from "../../types/Process";
import { Work, createDefaultWork } from "../../types/Work";
import { addWork } from "../../reducers/WorkReducer";

export const AddWork = (props: {
  date: Date
}) => {
  const orders = useSelector<Order[]>(state => state.order.orders);
  const processes = useSelector<Process[]>(state => state.process.processes);
  const [work, setWork] = useState<Work>(createDefaultWork(props.date));
  const dispatch = useDispatch<AppDispatch>();

  const handleOrderSelectOnChange = (event: SelectChangeEvent<Number>) => {
    const next = { ...work, order: orders.find(x => x.orderNumber === Number(event.target.value))! };
    setWork(next);
  };
  const handleProcessSelectOnChange = (event: SelectChangeEvent<Number>) => {
    const next = { ...work, process: processes.find(x => x.processNumber === Number(event.target.value))! };
    setWork(next);
  };
  const handleManHoursTextFieldOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...work, manHours: Number(event.target.value) };
    setWork(next);
  };
  const handleRemarksTextFieldOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...work, remarks: event.target.value };
    setWork(next);
  };
  const handleWorkAddButtonOnClick = () => {
    dispatch(addWork({ ...work, date: props.date })); // カレンダー切り替わった時のために日付を更新して追加する
    setWork(createDefaultWork(props.date));
  };

  return (
    <Stack
      direction={"row"}
      spacing={2}>
      <FormControl
        fullWidth>
        <InputLabel
          id={"order-label"}>
          オーダー
        </InputLabel>
        <Select
          labelId={"order-label"}
          label={"オーダー"}
          value={work.order.orderNumber}
          variant={"standard"}
          onChange={handleOrderSelectOnChange}>
          {
            orders.map(x =>
              <MenuItem
                key={x.id}
                value={x.orderNumber}>
                {x.name}
              </MenuItem>
            )
          }
        </Select>
      </FormControl>

      <FormControl
        fullWidth>
        <InputLabel
          id={"process-label"}>
          工程
        </InputLabel>
        <Select
          labelId={"process-label"}
          label={"工程"}
          variant={"standard"}
          value={work.process.processNumber}
          onChange={handleProcessSelectOnChange}>
          {
            processes.map(x =>
              <MenuItem
                key={x.id}
                value={x.processNumber}>
                {x.name}
              </MenuItem>
            )
          }
        </Select>
      </FormControl>

      <TextField
        label={"工数"}
        variant={"standard"}
        type={"number"}
        autoComplete={"false"}
        sx={{
          width: "350px"
        }}
        inputProps={{
          max: 7.5,
          min: 0.0,
          step: 0.25
        }}
        value={work.manHours}
        onChange={handleManHoursTextFieldOnChange} />

      <TextField
        label={"備考"}
        variant={"standard"}
        fullWidth
        value={work.remarks}
        onChange={handleRemarksTextFieldOnChange} />

      <Button
        variant={"outlined"}
        onClick={handleWorkAddButtonOnClick}>
        追加
      </Button>
    </Stack >);
};