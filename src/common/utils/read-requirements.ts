import { existsSync } from "fs";
import { createRequire } from "module";
import { MISSING_REQUIREMENTS_FILE } from "../constants";
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

interface RequirementObject {
  moduleTitle: string;
  description: string;
  requirementId: string;
  requirement: string;
  consideration: string;
}

// ===============================
// Read and export requirements
// ===============================
export function parseRequirements(filePath: string): {
  moduleTitles: string[];
  requirements: RequirementObject[];
} {
  const fileExist = existsSync(filePath);
  if (!fileExist) {
    throw new Error(MISSING_REQUIREMENTS_FILE);
  }

  // Read the Excel file
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert the sheet rows into a 2D array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const moduleTitles: string[] = [];
  const requirements: RequirementObject[] = [];

  // Iterate from the second row (index 1)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const [module, description, requirementId, requirement, consideration] =
      row;

    // If the "Módulo" column has a value, push it to the titles array
    if (module && module !== "" && module !== null && module !== undefined) {
      moduleTitles.push(String(module).trim());
    }

    // Get the most recent module (last element)
    const currentModule = moduleTitles[moduleTitles.length - 1] || "No module";

    // Create the requirement object
    const requirementObject: RequirementObject = {
      moduleTitle: currentModule,
      description: String(description || "").trim(),
      requirementId: String(requirementId || "").trim(),
      requirement: String(requirement || "").trim(),
      consideration: String(consideration || "").trim(),
    };

    requirements.push(requirementObject);
  }

  return { moduleTitles, requirements };
}
