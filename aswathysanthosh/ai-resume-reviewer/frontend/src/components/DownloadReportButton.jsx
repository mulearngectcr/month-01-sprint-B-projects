import { Download } from "lucide-react";
import { generatePDF } from "../utils/pdfGenerator";

export default function DownloadReportButton({ result }) {
  const handleDownload = () => {
    if (!result) {
      alert("No analysis data available to download.");
      return;
    }

    generatePDF(result);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="download-report-button"
    >
      <Download size={17} />
      <span>Download Report</span>
    </button>
  );
}