import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Button, Container, Divider, Snackbar, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
import { isSameDay } from "date-fns";
import { AppDispatch, useSelector } from "../Store";
import { Work } from "../types/Work";
import { WorkItem } from "./WorkList/WorkItem";
import { AddWork } from "./WorkList/AddWork";
import { getWorks, patchWorks } from "../reducers/WorkReducer";
import { SnackBarAreaContext } from "./utils/SnackBarArea";

export const WorkList = () => {
  const [date, setDate] = useState<Date>(new Date());
  const works = useSelector<Work[]>(state => state.work.works);
  const { setMessage, setSeverity, openSnackBar } = useContext(SnackBarAreaContext);
  const dispatch = useDispatch<AppDispatch>();

  const handleDatePickerOnChange = (newDate: Date | null) => {
    if (newDate) {
      setDate(newDate);
      dispatch(getWorks(newDate));
    }
  };
  const handleWorkSaveButtonOnClick = () => {
    dispatch(patchWorks({ works, date }));
    setMessage("保存しました。");
    setSeverity("success");
    openSnackBar();
  };

  return (
    <Container>
      <Stack
        spacing={2}>
        <Typography
          variant="h4">
          工数入力
        </Typography>

        <Stack
          spacing={2}
          direction="row">
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ja}>
            <DatePicker
              label="入力対象日"
              format="yyyy年MM月dd日"
              value={date}
              sx={{
                width: 200
              }}
              onChange={handleDatePickerOnChange} />
          </LocalizationProvider>

          <Button
            variant="outlined"
            onClick={handleWorkSaveButtonOnClick}>
            保存
          </Button>
        </Stack>

        <AddWork
          date={date} />

        <Divider />

        <Stack
          spacing={2}
          maxHeight="500px"
          sx={{
            overflowY: "auto",
            paddingY: 1
          }}>
          {
            works.filter(x => isSameDay(x.date, date)).length === 0 ?
              <Typography
                variant="h6">
                作業は登録されていません。
              </Typography> :
              works
                .filter(x => isSameDay(x.date, date))
                .map(x =>
                  <WorkItem
                    key={x.id}
                    work={x} />
                )
          }
        </Stack>
      </Stack>
    </Container >
  );
};