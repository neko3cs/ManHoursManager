import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Stack, TextField } from "@mui/material";
import { AppDispatch } from "../../../Store";
import { Process, createDefaultProcess } from "../../../types/Process";
import { addProcess } from "../../../reducers/ProcessReducer";

export const AddProcess = (props: {
  setProcessChanged: Dispatch<SetStateAction<boolean>>
}) => {
  const [process, setProcess] = useState<Process>(createDefaultProcess());
  const dispatch = useDispatch<AppDispatch>();

  const handleProcessNumberTextFieldOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...process, processNumber: Number(event.target.value) };
    setProcess(next);
  };
  const handleProcessNameTextFieldOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...process, name: event.target.value };
    setProcess(next);
  };
  const handleProcessAddButtonOnClick = () => {
    dispatch(addProcess(process));
    props.setProcessChanged(true);
    setProcess(createDefaultProcess());
  };

  return (
    <Stack
      direction={"row"}
      spacing={2}>
      <TextField
        label={"工程番号"}
        variant={"standard"}
        type={"number"}
        autoComplete={"false"}
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
        onClick={handleProcessAddButtonOnClick}>
        追加
      </Button>
    </Stack>
  );
};