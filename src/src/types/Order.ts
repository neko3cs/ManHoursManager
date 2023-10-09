export type Order = {
  id: string,
  orderNumber: number,
  name: string
}

export const createDefaultOrder = (): Order => ({
  id: crypto.randomUUID(),
  orderNumber: 0,
  name: ''
});

export const convertOrderFromCsvRowString = (rowCsv: string) =>
  ({
    id: rowCsv.split(",")[0] == "" ? crypto.randomUUID() : rowCsv.split(",")[0],
    orderNumber: Number(rowCsv.split(",")[1]),
    name: rowCsv.split(",")[2]
  }) as Order;

export const convertOrderToCsvRowString = (order: Order) =>
  `${order.id},${order.orderNumber},${order.name}`;