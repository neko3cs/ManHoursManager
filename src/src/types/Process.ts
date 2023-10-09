export type Process = {
  id: string,
  processNumber: number,
  name: string
}

export const createDefaultProcess = (): Process => ({
  id: crypto.randomUUID(),
  processNumber: 0,
  name: ''
});

export const convertProcessFromCsvRowString = (rowCsv: string) =>
  ({
    id: rowCsv.split(",")[0] == "" ? crypto.randomUUID() : rowCsv.split(",")[0],
    processNumber: Number(rowCsv.split(",")[1]),
    name: rowCsv.split(",")[2]
  }) as Process;

export const convertProcessToCsvRowString = (process: Process) =>
  `${process.id},${process.processNumber},${process.name}`;