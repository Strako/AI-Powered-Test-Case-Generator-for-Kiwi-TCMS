import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  ShadingType,
} from "docx";
import * as fs from "node:fs";
import PizZip from "pizzip";
import { TestCaseDoc } from "../types";

// ===============================
// Data types
// ===============================
interface TestCase {
  title: string;
  description: string;
  test_case: string;
  test_type: string;
  isFirst: boolean;
}

// ===============================
// Create test case table
// ===============================
function createTestCaseTable(testId: number, tc: TestCase): Table {
  const headerCell = new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: `ID – ${testId}`,
            bold: true,
            color: "FFFFFF",
          }),
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
    shading: {
      fill: "0E4CB2",
      type: ShadingType.CLEAR,
      color: "auto",
    },
    columnSpan: 2,
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [headerCell] }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Título")] }),
          new TableCell({ children: [new Paragraph(tc.title)] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Descripción")] }),
          new TableCell({ children: [new Paragraph(tc.description)] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Caso de prueba")] }),
          new TableCell({ children: [new Paragraph(tc.test_case)] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Tipo de test")] }),
          new TableCell({ children: [new Paragraph(tc.test_type)] }),
        ],
      }),
    ],
  });
}

// ===============================
// Generate new test cases document
// ===============================
async function generateNewTestCasesDoc(
  titles: string[],
  data: TestCaseDoc[],
): Promise<Buffer> {
  const testCasesData: TestCase[] = data;
  const titlesData: string[] = titles;
  let TEST_ID = 1228;
  let TITLE_IDX = 0;

  const newParagraphs: (Paragraph | Table)[] = [];

  for (const tc of testCasesData) {
    if (tc.isFirst) {
      newParagraphs.push(
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
        new Paragraph({
          text: titlesData[TITLE_IDX],
          heading: HeadingLevel.HEADING_1,
        }),
      );
      TITLE_IDX++;
    }

    const table = createTestCaseTable(TEST_ID, tc);
    newParagraphs.push(
      new Paragraph({ text: "" }),
      table,
      new Paragraph({ text: "" }),
    );

    TEST_ID++;
  }

  const doc = new Document({
    sections: [
      {
        children: newParagraphs,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// ===============================
// Merge two DOCX files
// ===============================
async function mergeDocxFiles(
  originalPath: string,
  newContentBuffer: Buffer,
  outputPath: string,
): Promise<void> {
  try {
    const originalContent = fs.readFileSync(originalPath);
    const originalZip = new PizZip(originalContent);

    const newZip = new PizZip(newContentBuffer);

    const originalDocXml = originalZip.file("word/document.xml")?.asText();
    const newDocXml = newZip.file("word/document.xml")?.asText();

    if (!originalDocXml || !newDocXml) {
      throw new Error("Could not extract document.xml from one of the files");
    }

    const bodyEndTag = "</w:body>";
    const bodyEndIndex = originalDocXml.lastIndexOf(bodyEndTag);

    if (bodyEndIndex === -1) {
      throw new Error("Could not find closing body tag in original document");
    }

    const newBodyStart = newDocXml.indexOf("<w:body>") + "<w:body>".length;
    const newBodyEnd = newDocXml.lastIndexOf("</w:body>");
    const newContent = newDocXml.substring(newBodyStart, newBodyEnd);

    // eslint-disable-next-line quotes
    const pageBreak = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';

    const mergedDocXml =
      originalDocXml.substring(0, bodyEndIndex) +
      pageBreak +
      newContent +
      originalDocXml.substring(bodyEndIndex);

    originalZip.file("word/document.xml", mergedDocXml);

    const newMediaFiles = Object.keys(newZip.files).filter((filename) =>
      filename.startsWith("word/media/"),
    );

    for (const mediaFile of newMediaFiles) {
      const file = newZip.file(mediaFile);
      if (file) {
        originalZip.file(mediaFile, file.asNodeBuffer());
      }
    }

    const mergedBuffer = originalZip.generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    fs.writeFileSync(outputPath, mergedBuffer);
    console.log(`✅ Documents merged successfully: ${outputPath}`);
  } catch (error) {
    throw new Error(`❌ Error merging documents: ${error}`);
  }
}

// ===============================
// Create final_document.docx
// ===============================
export default async function generateDocWithAppend(
  titles: string[],
  data: TestCaseDoc[],
) {
  const originalDocPath = "./original.docx";
  const outputPath = "./final_document.docx";

  try {
    console.log("📝 Generating new test cases...");
    const newContentBuffer = await generateNewTestCasesDoc(titles, data);

    if (!fs.existsSync(originalDocPath)) {
      fs.writeFileSync(outputPath, newContentBuffer);
      console.log("✅ New document created (no original to merge)");
      return;
    }

    console.log("🔗 Merging with original document...");
    await mergeDocxFiles(originalDocPath, newContentBuffer, outputPath);
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}
