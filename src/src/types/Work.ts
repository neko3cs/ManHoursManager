import { createDefaultOrder, Order } from "./Order"
import { createDefaultProcess, Process } from "./Process"

export type Work = {
  id: string,
  date: Date,
  order: Order,
  process: Process,
  manHours: number,
  remarks: string
}

export const createDefaultWork = (date: Date): Work => ({
  id: crypto.randomUUID(),
  date: date,
  order: createDefaultOrder(),
  process: createDefaultProcess(),
  manHours: 0.0,
  remarks: ''
});

export const convertWorkToCsvRowString = (work: Work) =>
  `${work.date.toLocaleDateString()},${work.order.orderNumber},${work.process.processNumber},${work.manHours},${work.remarks}`;