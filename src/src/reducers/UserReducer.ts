import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "tauri-plugin-sql-api";
import { DATABASE_CONNECTION } from "../main";
import { User } from "../types/User";

export const getUser = createAsyncThunk(
  "user/getUser",
  async () => {
    const db = await Database.load(DATABASE_CONNECTION);
    const result = (await db.select<User[]>(`
        SELECT
          userId,
          password
        FROM
          'User'
      `)).pop();
    if (result === undefined) {
      return { userId: "", password: "" }
    } else {
      return result;
    }
  }
);

export const patchUser = createAsyncThunk(
  "user/patchUser",
  async (user: User) => {
    const db = await Database.load(DATABASE_CONNECTION);
    await db.execute(`
        DELETE FROM 'User'; -- 1データしか登録されないようにするため、一旦空にしてから登録する
        INSERT INTO
          'User'
        VALUES
          ('${user.userId}', '${user.password}')
      `);
  }
);

export const userSlice = createSlice({
  name: "User",
  initialState: {
    user: {
      userId: "",
      password: ""
    } as User
  },
  reducers: {
    modifyUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    });
    builder.addCase(patchUser.fulfilled, () => { /* 更新後は何もしない */ });
  }
});

export const { modifyUser } = userSlice.actions;
export default userSlice.reducer;