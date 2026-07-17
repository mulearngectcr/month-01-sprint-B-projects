import { Download } from "lucide-react";
import { generatePDF } from "../utils/pdfGenerator";

export default function DownloadReportButton({ result }) {
  return (
    <div className="flex justify-center">
      <button
        onClick={() => generatePDF(result)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition"
      >
        <Download size={20} />
        Download Analysis Report
      </button>
    </div>
  );
}