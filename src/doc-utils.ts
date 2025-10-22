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
import * as fs from "fs";
import * as path from "path";
import PizZip from "pizzip";
import { data } from "./data/data";

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
async function generateNewTestCasesDoc(titles: string[]): Promise<Buffer> {
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
    // Read original document
    const originalContent = fs.readFileSync(originalPath);
    const originalZip = new PizZip(originalContent);

    // Read new content document
    const newZip = new PizZip(newContentBuffer);

    // Extract document.xml from both files
    const originalDocXml = originalZip.file("word/document.xml")?.asText();
    const newDocXml = newZip.file("word/document.xml")?.asText();

    if (!originalDocXml || !newDocXml) {
      throw new Error("Could not extract document.xml from one of the files");
    }

    // Find the closing body tag in original document
    const bodyEndTag = "</w:body>";
    const bodyEndIndex = originalDocXml.lastIndexOf(bodyEndTag);

    if (bodyEndIndex === -1) {
      throw new Error("Could not find closing body tag in original document");
    }

    // Extract content from new document (everything between <w:body> and </w:body>)
    const newBodyStart = newDocXml.indexOf("<w:body>") + "<w:body>".length;
    const newBodyEnd = newDocXml.lastIndexOf("</w:body>");
    const newContent = newDocXml.substring(newBodyStart, newBodyEnd);

    // Add page break before new content
    // eslint-disable-next-line quotes
    const pageBreak = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';

    // Merge: original content + page break + new content + closing tags
    const mergedDocXml =
      originalDocXml.substring(0, bodyEndIndex) +
      pageBreak +
      newContent +
      originalDocXml.substring(bodyEndIndex);

    // Update the document.xml in the original zip
    originalZip.file("word/document.xml", mergedDocXml);

    // Copy media files from new document if they exist
    const newMediaFiles = Object.keys(newZip.files).filter((filename) =>
      filename.startsWith("word/media/"),
    );

    for (const mediaFile of newMediaFiles) {
      const file = newZip.file(mediaFile);
      if (file) {
        originalZip.file(mediaFile, file.asNodeBuffer());
      }
    }

    // Generate the final merged document
    const mergedBuffer = originalZip.generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // Write to output file
    fs.writeFileSync(outputPath, mergedBuffer);
    console.log(`✅ Documents merged successfully: ${outputPath}`);
  } catch (error) {
    throw new Error(`❌ Error merging documents: ${error}`);
  }
}

// ===============================
// Create final_document.docx
// ===============================
export default async function generateDocWithAppend(titles: string[]) {
  const originalDocPath = "./original.docx";
  const outputPath = "./final_document.docx";

  try {
    // Step 1: Generate new test cases document
    console.log("📝 Generating new test cases...");
    const newContentBuffer = await generateNewTestCasesDoc(titles);

    // Step 2: Check if original document exists
    if (!fs.existsSync(originalDocPath)) {
      // If no original exists, just save the new content
      fs.writeFileSync(outputPath, newContentBuffer);
      console.log("✅ New document created (no original to merge)");
      return;
    }

    // Step 3: Merge with original document
    console.log("🔗 Merging with original document...");
    await mergeDocxFiles(originalDocPath, newContentBuffer, outputPath);
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}
