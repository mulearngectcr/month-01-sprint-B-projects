import { useState } from "react";

import api from "./api/api";

import UploadForm from "./components/UploadForm";
import LoadingSpinner from "./components/LoadingSpinner";
import SummaryCard from "./components/SummaryCard";
import ScoreCard from "./components/ScoreCard";
import KeywordCard from "./components/KeywordCard";
import SuggestionCard from "./components/SuggestionCard";
import AIReviewCard from "./components/AIReviewCard";
import RewrittenBulletsCard from "./components/RewrittenBulletsCard";
import CoverLetterCard from "./components/CoverLetterCard";
import DownloadReportButton from "./components/DownloadReportButton";

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (file, role) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("role", role);

      const response = await api.post("/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Upload Section */}

        <UploadForm
          onAnalyze={handleAnalyze}
          loading={loading}
        />

        {/* Loading */}

        {loading && <LoadingSpinner />}

        {/* Results */}

        {result && (

          <div className="mt-16 space-y-8">

            {/* Executive Summary */}

            <SummaryCard
              analysis={result.analysis}
              ai={result.ai_analysis}
            />

            {/* ATS + Keywords */}

            <div className="grid lg:grid-cols-2 gap-6">

              <ScoreCard
                analysis={result.analysis}
              />

              <KeywordCard
                analysis={result.analysis}
              />

            </div>

            {/* Suggestions */}

            <SuggestionCard
              analysis={result.analysis}
            />

            {/* Strengths & Weaknesses */}

            <AIReviewCard
              ai={result.ai_analysis}
            />

            {/* Resume Bullet Improvements */}

            <RewrittenBulletsCard
              bullets={result.ai_analysis.rewritten_bullets}
            />

            {/* Cover Letter */}

            <CoverLetterCard
              coverLetter={result.ai_analysis.cover_letter}
            />

            {/* Download Report */}

            <DownloadReportButton result={result} />

          </div>

        )}

      </div>

    </div>
  );
}

export default App;