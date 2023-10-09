import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Process } from "../types/Process";
import Database from "tauri-plugin-sql-api";
import { DATABASE_CONNECTION } from "../main";

export const getProcesses = createAsyncThunk(
  "process/getProcesses",
  async () => {
    const db = await Database.load(DATABASE_CONNECTION);
    const result = (await db.select<Process[]>(`
        SELECT
          id,
          processNumber,
          name
        FROM
          'Process'
      `));
    if (result === undefined) {
      return [] as Process[]
    } else {
      return result;
    }
  }
);

export const patchProcesses = createAsyncThunk(
  "process/patchProcesses",
  async (processes: Process[]) => {
    const db = await Database.load(DATABASE_CONNECTION);
    const upsert_sql = processes.map(x => `
      INSERT INTO
        'Process' (id, processNumber, name)
      VALUES
        ('${x.id}', ${x.processNumber}, '${x.name}')
      ON CONFLICT (id)
      DO
        UPDATE
        SET
          processNumber = ${x.processNumber},
          name          = '${x.name}'
    `).join(";\r\n");
    const delete_sql = `
      DELETE FROM
        'Process'
      WHERE
        id NOT IN (${processes.map(x => `'${x.id}'`).join(",")})
    `;
    await db.execute(
      [upsert_sql, delete_sql].join(";\r\n")
    );
  }
);

export const processSlice = createSlice({
  name: "process",
  initialState: {
    processes: [] as Process[]
  },
  reducers: {
    addProcess: (state, action: PayloadAction<Process>) => {
      state.processes.push(action.payload);
    },
    modifyProcess: (state, action: PayloadAction<Process>) => {
      state.processes = state.processes.map(x => x.id === action.payload.id ? action.payload : x);
    },
    removeProcess: (state, action: PayloadAction<Process>) => {
      state.processes = state.processes.filter(x => x.id != action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getProcesses.fulfilled, (state, action: PayloadAction<Process[]>) => {
      state.processes = action.payload;
    });
    builder.addCase(patchProcesses.fulfilled, () => { /* 更新時は何もしない */ });
  }
});

export const { addProcess, modifyProcess, removeProcess } = processSlice.actions;
export default processSlice.reducer;