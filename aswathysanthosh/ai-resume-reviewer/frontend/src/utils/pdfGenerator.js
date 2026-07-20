import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePDF(result) {
  if (!result) {
    throw new Error("No analysis result was provided.");
  }

  const analysis = result.analysis || {};
  const aiAnalysis = result.ai_analysis || {};
  const breakdown = analysis.breakdown || {};

  const matchedKeywords = Array.isArray(analysis.matched_keywords)
    ? analysis.matched_keywords
    : [];

  const missingKeywords = Array.isArray(analysis.missing_keywords)
    ? analysis.missing_keywords
    : [];

  const suggestions = Array.isArray(analysis.suggestions)
    ? analysis.suggestions
    : [];

  const strengths = Array.isArray(aiAnalysis.strengths)
    ? aiAnalysis.strengths
    : [];

  const weaknesses = Array.isArray(aiAnalysis.weaknesses)
    ? aiAnalysis.weaknesses
    : [];

  const rewrittenBullets = Array.isArray(aiAnalysis.rewritten_bullets)
    ? aiAnalysis.rewritten_bullets
    : [];

  const coverLetter =
    typeof aiAnalysis.cover_letter === "string"
      ? aiAnalysis.cover_letter
      : "No cover letter was generated.";

  const score = Number(analysis.ats_score) || 0;

  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Match the redesigned website palette
  const navy = [20, 45, 78];
  const coral = [207, 92, 61];
  const dark = [25, 39, 60];
  const gray = [107, 114, 128];
  const lightCoral = [252, 238, 233];

  // =========================
  // HEADER
  // =========================

  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.text("AI Resume Reviewer", 15, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Resume Analysis Report", 15, 27);

  if (result.role) {
    doc.setFontSize(9);
    doc.text(`Target Role: ${result.role}`, 15, 34);
  }

  // =========================
  // DATE
  // =========================

  doc.setTextColor(...gray);
  doc.setFontSize(9);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    15,
    49
  );

  // =========================
  // ATS SCORE
  // =========================

  let status = "Needs Improvement";

  if (score >= 75) {
    status = "Excellent";
  } else if (score >= 50) {
    status = "Good";
  }

  doc.setDrawColor(...coral);
  doc.setLineWidth(0.5);

  doc.roundedRect(15, 57, 180, 35, 4, 4);

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("ATS SCORE", 22, 70);

  doc.setTextColor(...coral);
  doc.setFontSize(25);
  doc.text(`${score}/100`, 135, 72);

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(status, 135, 82);

  // =========================
  // ATS BREAKDOWN
  // =========================

  autoTable(doc, {
    startY: 102,

    head: [["Category", "Score"]],

    body: [
      ["Contact Information", `${breakdown.contact ?? 0}/10`],
      ["Resume Sections", `${breakdown.sections ?? 0}/30`],
      ["Keywords", `${breakdown.keywords ?? 0}/20`],
      ["Formatting", `${breakdown.formatting ?? 0}/20`],
    ],

    headStyles: {
      fillColor: navy,
      textColor: [255, 255, 255],
    },

    alternateRowStyles: {
      fillColor: lightCoral,
    },

    styles: {
      fontSize: 10,
      cellPadding: 4,
    },

    margin: {
      left: 15,
      right: 15,
    },
  });

  let y = doc.lastAutoTable
    ? doc.lastAutoTable.finalY + 13
    : 155;

  // =========================
  // PAGE CHECK
  // =========================

  const checkPage = (neededSpace = 25) => {
    if (y + neededSpace > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // =========================
  // SECTION HELPER
  // =========================

  const section = (title, items) => {
    if (!items || items.length === 0) {
      return;
    }

    checkPage(25);

    doc.setTextColor(...coral);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(title, 15, y);

    y += 9;

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    items.forEach((item) => {
      const safeItem =
        typeof item === "string"
          ? item
          : JSON.stringify(item);

      const lines = doc.splitTextToSize(
        `• ${safeItem}`,
        170
      );

      const requiredHeight = lines.length * 5.5 + 4;

      checkPage(requiredHeight);

      doc.text(lines, 20, y);

      y += lines.length * 5.5 + 3;
    });

    y += 5;
  };

  // =========================
  // KEYWORDS
  // =========================

  section(
    "Matched Keywords",
    matchedKeywords
  );

  section(
    "Recommended / Missing Keywords",
    missingKeywords
  );

  // =========================
  // SUGGESTIONS
  // =========================

  section(
    "Resume Suggestions",
    suggestions
  );

  // =========================
  // AI REVIEW
  // =========================

  section(
    "Your Strengths",
    strengths
  );

  section(
    "Areas to Improve",
    weaknesses
  );

  // =========================
  // REWRITTEN BULLETS
  // =========================

  section(
    "AI-Rewritten Resume Bullet Points",
    rewrittenBullets
  );

  // =========================
  // COVER LETTER
  // =========================

  doc.addPage();

  y = 22;

  doc.setTextColor(...coral);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);

  doc.text(
    "Generated Cover Letter",
    15,
    y
  );

  y += 12;

  doc.setTextColor(...dark);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const coverLines = doc.splitTextToSize(
    coverLetter,
    180
  );

  // Render cover letter safely across pages
  coverLines.forEach((line) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }

    doc.text(line, 15, y);
    y += 5.5;
  });

  // =========================
  // FOOTERS
  // =========================

  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setDrawColor(220, 220, 220);

    doc.line(
      15,
      pageHeight - 12,
      pageWidth - 15,
      pageHeight - 12
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...gray);

    doc.text(
      "Generated by AI Resume Reviewer",
      15,
      pageHeight - 6
    );

    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - 32,
      pageHeight - 6
    );
  }

  // =========================
  // DOWNLOAD
  // =========================

  doc.save("AI_Resume_Analysis_Report.pdf");
}