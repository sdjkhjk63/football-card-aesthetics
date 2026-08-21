import { FileBlob, SpreadsheetFile } from "file:///C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const workbookPath = "C:/Users/lenovo/Desktop/Topps男足发售跟进表_已删地区版.xlsx";
const fallbackWorkbookPath = "C:/Users/lenovo/Desktop/Topps男足发售跟进表_已删地区版_补Finest英超.xlsx";
const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem("Topps 发售表");
const table = sheet.tables.getItemAt(0);

const productName = "Topps Finest Premier League 2026";
const existing = await workbook.inspect({
  kind: "match",
  sheetId: "Topps 发售表",
  searchTerm: productName,
  maxChars: 2000,
});

if (!existing.ndjson.includes(productName)) {
  table.rows.add(null, [[
    "☐",
    "未完成",
    "2026-04-23",
    productName,
    "英超 Finest",
    "英超 Chrome 高端",
    "补 Finest 英超；先按 Base Common/Uncommon/Rare 与插卡体系拆卡种",
    "https://www.collectosk.com/2025-26-topps-finest-premier-league-soccer-cards/",
  ]]);
}

sheet.getRange("B4").formulas = [["=COUNTA(C7:C29)"]];
sheet.getRange("D4").formulas = [["=COUNTIF(A7:A29,\"☑\")"]];
sheet.getRange("F4").formulas = [["=B4-D4"]];

for (let row = 7; row <= 29; row += 1) {
  sheet.getRange(`B${row}`).formulas = [[`=IF(A${row}="☑","已完成","未完成")`]];
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "Topps 发售表",
  range: "A1:H30",
  scale: 1,
  format: "png",
});
await import("node:fs/promises").then(async (fs) => {
  await fs.writeFile("test-results/release-table-after-finest.png", new Uint8Array(await preview.arrayBuffer()));
});

const output = await SpreadsheetFile.exportXlsx(workbook);
try {
  await output.save(workbookPath);
  console.log(`saved=${workbookPath}`);
} catch (error) {
  if (error?.code !== "EBUSY") throw error;
  await output.save(fallbackWorkbookPath);
  console.log(`saved=${fallbackWorkbookPath}`);
}

const updated = await workbook.inspect({
  kind: "table",
  sheetId: "Topps 发售表",
  range: "A1:H30",
  tableMaxRows: 30,
  tableMaxCols: 8,
  maxChars: 12000,
});
console.log(updated.ndjson);
