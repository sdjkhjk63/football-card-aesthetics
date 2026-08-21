import { FileBlob, SpreadsheetFile } from "file:///C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const workbookPath = "C:/Users/lenovo/Desktop/Topps男足发售跟进表_已删地区版.xlsx";
const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);

for (const inspect of [
  await workbook.inspect({ kind: "region", sheetId: "Topps 发售表", range: "A1:H32", maxChars: 8000 }),
  await workbook.inspect({ kind: "formula", sheetId: "Topps 发售表", range: "A1:H32", maxChars: 4000, options: { maxResults: 80 } }),
  await workbook.inspect({ kind: "computedStyle", sheetId: "Topps 发售表", range: "A24:H28", maxChars: 6000 }),
]) {
  console.log(inspect.ndjson);
}
