import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, useSelector } from "../../Store";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { removeWork, modifyWork } from "../../reducers/WorkReducer";
import { Work } from "../../types/Work";
import { Order } from "../../types/Order";
import { Process } from "../../types/Process";

export const WorkItem = (props: {
  work: Work
}) => {
  const orders = useSelector<Order[]>(state => state.order.orders);
  const processes = useSelector<Process[]>(state => state.process.processes);
  const [work, setWork] = useState<Work>(props.work);
  const dispatch = useDispatch<AppDispatch>();

  const handleOrderSelectOnChange = (event: SelectChangeEvent<Number>) => {
    const next = { ...work, order: orders.find(x => x.orderNumber === Number(event.target.value))! };
    setWork(next);
    dispatch(modifyWork(next));
  };
  const handleProcessSelectOnChange = (event: SelectChangeEvent<Number>) => {
    const next = { ...work, process: processes.find(x => x.processNumber === Number(event.target.value))! };
    setWork(next);
    dispatch(modifyWork(next));
  };
  const handleManHoursTextFieldOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...work, manHours: Number(event.target.value) };
    setWork(next);
    dispatch(modifyWork(next));
  };
  const handleRemarksTextFieldOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...work, remarks: event.target.value };
    setWork(next);
    dispatch(modifyWork(next));
  };
  const handleWorkDeleteButtonOnClick = () => {
    dispatch(removeWork(work))
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
        color={"error"}
        onClick={handleWorkDeleteButtonOnClick}>
        削除
      </Button>
    </Stack >
  );
};