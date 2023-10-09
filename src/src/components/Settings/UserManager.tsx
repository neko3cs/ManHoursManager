import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { Stack, TextField, Typography } from "@mui/material";
import { AppDispatch, useSelector } from "../../Store";
import { modifyUser } from "../../reducers/UserReducer";
import { User } from "../../types/User";

export const UserManager = (props: {
  setUserChanged: Dispatch<SetStateAction<boolean>>
}) => {
  const user = useSelector<User>(state => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleUserIdTextFieldOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(modifyUser({ ...user, userId: event.target.value }));
    props.setUserChanged(true);
  };
  const handlePasswordTextFieldOnChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(modifyUser({ ...user, password: event.target.value }));
    props.setUserChanged(true);
  };

  return (
    <Stack
      spacing={2}>
      <Typography
        variant={"h5"}>
        ユーザー情報
      </Typography>

      <Stack
        direction={"row"}
        spacing={2}>
        <TextField
          label={"ユーザーID"}
          variant={"standard"}
          value={user.userId}
          onChange={handleUserIdTextFieldOnChange}>
        </TextField>

        <TextField
          label={"パスワード"}
          variant={"standard"}
          type={"password"}
          autoComplete={"current-password"}
          value={user.password}
          onChange={handlePasswordTextFieldOnChange}>
        </TextField>
      </Stack>
    </Stack>
  );
};