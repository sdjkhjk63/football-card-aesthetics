import { Workbook } from "file:///C:/Users/lenovo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const workbook = Workbook.create();
console.log(workbook.help("worksheet row insert table rows add resize", { include: "index,examples,notes", maxChars: 8000 }).ndjson);
