import type DataGrid from "devextreme/ui/data_grid";
import type DataSource from "devextreme/data/data_source";
import * as XLSX from "xlsx";

type VisibleColumn = ReturnType<DataGrid["getVisibleColumns"]>[number];

interface ExportDataGridOptions {
  dataGrid: DataGrid | undefined;
  fileBaseName: string;
  worksheetName?: string;
  date?: Date;
  batchSize?: number;
}

const DEFAULT_BATCH_SIZE = 1000;
const MAX_SHEET_NAME_LENGTH = 31;

const INVALID_FILENAME_CHARS = /[<>:"/\\|?*\u0000-\u001F]+/g;
const INVALID_SHEET_CHARS = /[\\/*?:[\]]+/g;

const sanitizeFileName = (value: string): string => {
  const normalized = value.replace(INVALID_FILENAME_CHARS, " ").replace(/\s+/g, " ").trim();
  return normalized.length > 0 ? normalized : "export";
};

const sanitizeSheetName = (value: string): string => {
  const cleaned = value.replace(INVALID_SHEET_CHARS, " ").trim() || "Data";
  return cleaned.length <= MAX_SHEET_NAME_LENGTH ? cleaned : cleaned.slice(0, MAX_SHEET_NAME_LENGTH);
};

const formatDateForFileName = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

const getNestedValue = (item: any, path?: string | null) => {
  if (!path) {
    return undefined;
  }

  return path.split(".").reduce((acc, part) => (acc === undefined || acc === null ? acc : acc[part]), item);
};

const formatCellValue = (column: VisibleColumn, rawValue: unknown): unknown => {
  if (column.customizeText && column.customizeText instanceof Function) {
    try {
      const valueText =
        rawValue === undefined || rawValue === null
          ? ""
          : typeof rawValue === "string"
            ? rawValue
            : Array.isArray(rawValue)
              ? rawValue.join(", ")
              : typeof rawValue === "object"
                ? JSON.stringify(rawValue)
                : String(rawValue);

      const customizedValue = column.customizeText({
        value: rawValue,
        valueText,
        target: "row",
      });

      if (customizedValue !== undefined) {
        return customizedValue;
      }
    } catch (error) {
      console.error("Failed to apply customizeText during export:", error);
    }
  }

  if (Array.isArray(rawValue)) {
    return rawValue.join(", ");
  }

  if (rawValue === null || rawValue === undefined) {
    return "";
  }

  if (rawValue instanceof Date) {
    return rawValue;
  }

  if (typeof rawValue === "number") {
    if (!Number.isFinite(rawValue)) {
      return rawValue.toString();
    }
    return rawValue;
  }

  if (typeof rawValue === "boolean") {
    return rawValue ? "Yes" : "No";
  }

  return rawValue;
};

const getColumnValue = (column: VisibleColumn, row: any): unknown => {
  if (column.calculateCellValue && column.calculateCellValue instanceof Function) {
    try {
      return column.calculateCellValue(row);
    } catch (error) {
      console.error("Failed to calculate cell value during export:", error);
    }
  }

  if (column.calculateDisplayValue && column.calculateDisplayValue instanceof Function) {
    try {
      return column.calculateDisplayValue(row);
    } catch (error) {
      console.error("Failed to calculate display value during export:", error);
    }
  }

  if (column.dataField) {
    return getNestedValue(row, column.dataField);
  }

  if (column.name) {
    return getNestedValue(row, column.name);
  }

  return undefined;
};

const isSkippableColumn = (column: VisibleColumn): boolean => {
  if (!column) {
    return true;
  }

  if ((column as any).command) {
    return true;
  }

  const disallowedTypes = ["groupExpand", "group", "selection", "adaptive"];
  return !!column.type && disallowedTypes.includes(column.type);
};

const computeColumnWidths = (table: unknown[][]): XLSX.ColInfo[] => {
  if (!table.length) {
    return [];
  }

  const columnCount = table[0].length;
  const widths: XLSX.ColInfo[] = [];

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    let max = 12;

    for (let rowIndex = 0; rowIndex < table.length; rowIndex += 1) {
      const cellValue = table[rowIndex][columnIndex];
      const text = cellValue === null || cellValue === undefined ? "" : String(cellValue);
      max = Math.max(max, text.length + 2);
    }

    widths.push({ wch: Math.min(max, 60) });
  }

  return widths;
};

const extractDataSource = (dataGrid: DataGrid): DataSource | undefined => {
  if (!dataGrid) {
    return undefined;
  }

  const ds = dataGrid.getDataSource();
  if (!ds) {
    return undefined;
  }

  return ds;
};

const loadAllRows = async (dataGrid: DataGrid, batchSize: number): Promise<any[]> => {
  const dataSource = extractDataSource(dataGrid);
  if (!dataSource) {
    return [];
  }

  const store: any = dataSource.store?.();
  if (!store || typeof store.load !== "function") {
    const items = (dataSource as any).items?.();
    return Array.isArray(items) ? items : [];
  }

  const filter = dataSource.filter?.();
  const sort = dataSource.sort?.();
  const select = dataSource.select?.();
  const group = dataSource.group?.();

  const rows: any[] = [];
  let skip = 0;
  let total = typeof dataSource.totalCount === "function" ? dataSource.totalCount() : undefined;
  let more = true;

  while (more) {
    const loadOptions: any = {
      skip,
      take: batchSize,
      filter,
      sort,
      select,
    };

    if (group) {
      loadOptions.group = group;
    }

    if (total === undefined && skip === 0) {
      loadOptions.requireTotalCount = true;
    }

    const result = await store.load(loadOptions);
    const pageData = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];

    if (total === undefined && typeof result?.totalCount === "number") {
      total = result.totalCount;
    }

    rows.push(...pageData);
    skip += pageData.length;

    if (pageData.length < batchSize) {
      more = false;
    } else if (typeof total === "number" && skip >= total) {
      more = false;
    }
  }

  return rows;
};

export const exportDataGridToXlsx = async ({
  dataGrid,
  fileBaseName,
  worksheetName,
  date = new Date(),
  batchSize = DEFAULT_BATCH_SIZE,
}: ExportDataGridOptions): Promise<void> => {
  if (!dataGrid) {
    throw new Error("DataGrid instance is not available for export.");
  }

  const visibleColumns = dataGrid
    .getVisibleColumns()
    .filter(column => !isSkippableColumn(column));

  if (!visibleColumns.length) {
    throw new Error("Нет доступных столбцов для экспорта.");
  }

  const rows = await loadAllRows(dataGrid, batchSize);

  const headers = visibleColumns.map(column => column.caption || column.dataField || column.name || "");
  const body = rows.map(row =>
    visibleColumns.map(column => {
      const rawValue = getColumnValue(column, row);
      return formatCellValue(column, rawValue);
    }),
  );

  const table = [headers, ...body];
  const worksheet = XLSX.utils.aoa_to_sheet(table);
  worksheet["!cols"] = computeColumnWidths(table);

  const workbook = XLSX.utils.book_new();
  const sanitizedSheetName = sanitizeSheetName(worksheetName || fileBaseName);
  XLSX.utils.book_append_sheet(workbook, worksheet, sanitizedSheetName);

  const sanitizedFileBase = sanitizeFileName(fileBaseName);
  const formattedDate = formatDateForFileName(date);
  const fileName = `${sanitizedFileBase} ${formattedDate}.xlsx`;

  XLSX.writeFile(workbook, fileName, { compression: true });
};

