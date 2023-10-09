import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Stack, TextField } from "@mui/material";
import { AppDispatch } from "../../../Store";
import { removeProcess, modifyProcess } from "../../../reducers/ProcessReducer";
import { Process } from "../../../types/Process";

export const ProcessItem = (props: {
  process: Process,
  setProcessChanged: Dispatch<SetStateAction<boolean>>
}) => {
  const [process, setProcess] = useState<Process>(props.process);
  const dispatch = useDispatch<AppDispatch>();

  const handleProcessNumberTextFieldOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...process, processNumber: Number(event.target.value) };
    setProcess(next);
    dispatch(modifyProcess(next));
    props.setProcessChanged(true);
  };
  const handleProcessNameTextFieldOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...process, name: event.target.value };
    setProcess(next);
    dispatch(modifyProcess(next));
    props.setProcessChanged(true);
  };
  const handleProcessDeleteButtonOnClick = () => {
    dispatch(removeProcess(process));
    props.setProcessChanged(true);
  };

  return (
    <Stack
      direction={"row"}
      spacing={2}>
      <TextField
        label={"工程番号"}
        variant={"standard"}
        inputMode={"numeric"}
        sx={{
          width: "300px"
        }}
        value={process.processNumber}
        onChange={handleProcessNumberTextFieldOnChange} />

      <TextField
        label={"工程名"}
        variant={"standard"}
        fullWidth
        autoComplete={"false"}
        value={process.name}
        onChange={handleProcessNameTextFieldOnChange} />

      <Button
        variant={"outlined"}
        color={"error"}
        onClick={handleProcessDeleteButtonOnClick}>
        削除
      </Button>
    </Stack>
  );
};