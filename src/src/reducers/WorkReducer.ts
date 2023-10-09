import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "tauri-plugin-sql-api";
import { Work } from "../types/Work";
import { DATABASE_CONNECTION } from "../main";
import { Order } from "../types/Order";
import { Process } from "../types/Process";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd";
export const getWorks = createAsyncThunk(
  "work/getWorks",
  async (date: Date) => {
    try {
      const db = await Database.load(DATABASE_CONNECTION);
      const result = (await db.select<any[]>(`
        SELECT
          'Work'.id,
          'Work'.date,
          'Order'.id as 'orderId',
          'Order'.orderNumber,
          'Order'.name as 'orderName',
          'Process'.id as 'processId',
          'Process'.processNumber,
          'Process'.name as 'processName',
          'Work'.manHours,
          'Work'.remarks
        FROM
          'Work'
          INNER JOIN 'Order'
            on 'Order'.id = 'Work'.orderId
          INNER JOIN 'Process'
            on  'Process'.id = 'Work'.processId
        WHERE
          'Work'.date = '${format(date, dateFormat)}'
      `)).map(x => ({
        id: x.id,
        date: parse(x.date, dateFormat, new Date()),
        order: { id: x.orderId, orderNumber: x.orderNumber, name: x.orderName } as Order,
        process: { id: x.processId, processNumber: x.processNumber, name: x.processName } as Process,
        manHours: x.manHours,
        remarks: x.remarks
      } as Work));
      if (result === undefined) {
        return [] as Work[]
      } else {
        return result;
      }
    } catch (error) {
      return [] as Work[]
    }
  }
);

export type patchWorksArgs = {
  works: Work[],
  date: Date
};
export const patchWorks = createAsyncThunk(
  "work/patchWorks",
  async (args: patchWorksArgs) => {
    const { works, date } = args;
    const db = await Database.load(DATABASE_CONNECTION);

    if (works.length > 0) {
      await db.execute(works.map(x => `
        INSERT INTO
          'Work'
        VALUES
          ('${x.id}', '${format(x.date, dateFormat)}', '${x.order.id}', '${x.process.id}', ${x.manHours}, '${x.remarks}')
        ON CONFLICT(id)
        DO
          UPDATE
          SET
            date      = '${format(x.date, dateFormat)}',
            orderId   = '${x.order.id}',
            processId = '${x.process.id}',
            manHours  = ${x.manHours},
            remarks   = '${x.remarks}'
      `).join(";\r\n"));
    }
    await db.execute(`
      DELETE FROM
        'Work'
      WHERE
        date = '${format(date, dateFormat)}'
        AND
        id NOT IN (${works.map(x => `'${x.id}'`).join(",")})
    `);
  }
);

export const workSlice = createSlice({
  name: "work",
  initialState: {
    works: [] as Work[],
  },
  reducers: {
    addWork: (state, action: PayloadAction<Work>) => {
      state.works.push(action.payload);
    },
    modifyWork: (state, action: PayloadAction<Work>) => {
      state.works = state.works.map(x => x.id === action.payload.id ? action.payload : x);
    },
    removeWork: (state, action: PayloadAction<Work>) => {
      state.works = state.works.filter(x => x.id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getWorks.fulfilled, (state, action: PayloadAction<Work[]>) => {
      state.works = action.payload;
    });
    builder.addCase(patchWorks.fulfilled, () => { /* 更新時は何もしない */ });
  }
});

export const { addWork, modifyWork, removeWork } = workSlice.actions;
export default workSlice.reducer;