import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Database from "tauri-plugin-sql-api";
import { DATABASE_CONNECTION } from "../main";
import { Order } from "../types/Order"

export const getOrders = createAsyncThunk(
  "order/getOrders",
  async () => {
    const db = await Database.load(DATABASE_CONNECTION);
    const result = (await db.select<Order[]>(`
        SELECT
          id,
          orderNumber,
          name
        FROM
          'Order'
      `));
    if (result === undefined) {
      return [] as Order[]
    } else {
      return result;
    }
  }
);

export const patchOrders = createAsyncThunk(
  "order/patchOrders",
  async (orders: Order[]) => {
    const db = await Database.load(DATABASE_CONNECTION);
    const upsert_sql = orders.map(x => `
      INSERT INTO
        'Order' (id, orderNumber, name)
      VALUES
        ('${x.id}', ${x.orderNumber}, '${x.name}')
      ON CONFLICT (id)
      DO
        UPDATE
        SET
          orderNumber = ${x.orderNumber},
          name        = '${x.name}'
    `).join(";\r\n");
    const delete_sql = `
      DELETE FROM
        'Order'
      WHERE
        id NOT IN (${orders.map(x => `'${x.id}'`).join(",")})
    `;
    await db.execute(
      [upsert_sql, delete_sql].join(";\r\n")
    );
  }
);

export const orderSlice = createSlice({
  name: "Order",
  initialState: {
    orders: [] as Order[]
  },
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    modifyOrder: (state, action: PayloadAction<Order>) => {
      state.orders = state.orders.map(x => x.id === action.payload.id ? action.payload : x);
    },
    removeOrder: (state, action: PayloadAction<Order>) => {
      state.orders = state.orders.filter(x => x.id != action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    });
    builder.addCase(patchOrders.fulfilled, () => { /* 更新時は何もしない */ });
  }
});

export const { addOrder, modifyOrder, removeOrder } = orderSlice.actions;
export default orderSlice.reducer;