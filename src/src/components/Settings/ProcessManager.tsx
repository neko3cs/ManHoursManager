import { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { open, save } from "@tauri-apps/api/dialog";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { AppDispatch, useSelector } from "../../Store";
import { Button, Divider, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { ProcessItem } from "./ProcessManager/ProcessItem";
import { Process, convertProcessFromCsvRowString, convertProcessToCsvRowString } from "../../types/Process";
import { addProcess, removeProcess } from "../../reducers/ProcessReducer";
import { AddProcess } from "./ProcessManager/AddProcess";

export const ProcessManager = (props: {
  setProcessChanged: Dispatch<SetStateAction<boolean>>
}) => {
  const processes = useSelector<Process[]>(state => state.process.processes);
  const dispatch = useDispatch<AppDispatch>();

  const handleProcessImportButtonOnClick = async () => {
    const file = await open({
      multiple: false, filters: [{ name: "CSV", extensions: ["csv"] }]
    });
    if (file) {
      const forDelete = JSON.parse(JSON.stringify(processes)) as Process[];
      forDelete.forEach(x => dispatch(removeProcess(x)));
      const rawCsv = await readTextFile(String(file), { dir: BaseDirectory.AppConfig });
      rawCsv
        .split(/\r?\n/)
        .map(x => convertProcessFromCsvRowString(x))
        .forEach(x => dispatch(addProcess(x)));
      props.setProcessChanged(true);
    }
  };
  const handleProcessExportButtonOnClick = async () => {
    const csv = processes.map(process => convertProcessToCsvRowString(process)).join("\n");
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
          工程管理
        </Typography>

        <Button
          variant={"outlined"}
          onClick={handleProcessImportButtonOnClick}>
          一括取込
        </Button>

        <Button
          variant={"outlined"}
          onClick={handleProcessExportButtonOnClick}>
          CSV出力
        </Button>
      </Stack>

      <AddProcess
        setProcessChanged={props.setProcessChanged} />

      <Divider />

      <Stack
        spacing={2}
        maxHeight={"210px"}
        sx={{
          overflowY: "auto"
        }}>
        {
          processes.length === 0 ?
            <Typography
              variant={"h6"}>
              工程は登録されていません。
            </Typography> :
            processes.map(x =>
              <ProcessItem
                key={x.id}
                process={x}
                setProcessChanged={props.setProcessChanged} />
            )
        }
      </Stack>
    </Stack>
  );
};