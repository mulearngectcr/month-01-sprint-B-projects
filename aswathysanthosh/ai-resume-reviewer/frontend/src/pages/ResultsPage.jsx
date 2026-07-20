import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DownloadReportButton from "../components/DownloadReportButton";

import {
  FileText,
  LayoutDashboard,
  Search,
  Lightbulb,
  PenLine,
  FileCheck,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Home,
  Sparkles,
} from "lucide-react";

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Controls sidebar sections
  const [activeSection, setActiveSection] = useState("overview");

  // Data passed from AnalyzePage
  const result = location.state?.analysis;
  const targetRole = location.state?.targetRole;

  // If user directly opens /results without analyzing a resume
  if (!result) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>No analysis data found.</h2>

        <p>
          Please analyze a resume first to view your results.
        </p>

        <button
          type="button"
          onClick={() => navigate("/analyze")}
        >
          Analyze a Resume
        </button>
      </div>
    );
  }

  // =========================================================
  // BACKEND DATA
  // =========================================================

  const analysis = result.analysis || {};
  const aiAnalysis = result.ai_analysis || {};

  const atsScore = analysis.ats_score ?? 0;
  const breakdown = analysis.breakdown || {};

  const matchedKeywords =
    analysis.matched_keywords || [];

  const missingKeywords =
    analysis.missing_keywords || [];

  const suggestions =
    analysis.suggestions || [];

  const strengths =
    aiAnalysis.strengths || [];

  const weaknesses =
    aiAnalysis.weaknesses || [];

  const rewrittenBullets =
    aiAnalysis.rewritten_bullets || [];

  const coverLetter =
    aiAnalysis.cover_letter || "";

  const role =
    result.role ||
    targetRole ||
    "Target Role";

  // ATS score label
  const scoreLabel =
    atsScore >= 80
      ? "Excellent"
      : atsScore >= 60
      ? "Good"
      : atsScore >= 40
      ? "Needs Improvement"
      : "Needs Work";

  // =========================================================
  // OVERVIEW
  // =========================================================

  const renderOverview = () => (
    <>
      <section className="results-heading">
        <div>
          <span className="section-label">
            RESUME ANALYSIS
          </span>

          <h1>Your Resume Analysis</h1>

          <p>
            Here's how your resume performs for the{" "}
            <strong>{role}</strong> role and where you can
            improve it.
          </p>
        </div>

        <div className="results-header-actions">
          <DownloadReportButton result={result} />

          <button
            className="analyze-another-button"
            type="button"
            onClick={() => navigate("/analyze")}
          >
            Analyze Another
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* TOP SUMMARY */}

      <section className="results-summary-grid">

        {/* ATS SCORE */}

        <article className="result-score-card">
          <div
            className="result-score-ring"
            style={{
              "--score": `${
                Math.min(
                  Math.max(
                    Number(atsScore) || 0,
                    0
                  ),
                  100
                ) * 3.6
              }deg`,
            }}
          >
            <div className="result-score-inner">
              <strong>{atsScore}</strong>
              <span>/100</span>
            </div>
          </div>

          <div>
            <span className="result-card-label">
              ATS SCORE
            </span>

            <h2>{scoreLabel}</h2>

            <p>
              Your overall ATS compatibility score.
            </p>
          </div>
        </article>

        {/* MATCHED KEYWORDS */}

        <article className="result-stat-card">
          <div className="result-stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <span>Matched Keywords</span>

          <strong>
            {matchedKeywords.length}
          </strong>

          <p>
            Relevant keywords already found in your
            resume.
          </p>
        </article>

        {/* MISSING KEYWORDS */}

        <article className="result-stat-card">
          <div className="result-stat-icon warning">
            <AlertCircle size={20} />
          </div>

          <span>Missing Keywords</span>

          <strong>
            {missingKeywords.length}
          </strong>

          <p>
            Important role-specific keywords worth
            considering.
          </p>
        </article>
      </section>

      {/* MAIN DASHBOARD */}

      <section className="results-content-grid">

        {/* SCORE BREAKDOWN */}

        <article className="results-panel score-breakdown-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">
                ATS BREAKDOWN
              </span>

              <h2>Score breakdown</h2>
            </div>

            <Target size={21} />
          </div>

          <ScoreRow
            label="Contact Information"
            value={breakdown.contact ?? 0}
            max={10}
          />

          <ScoreRow
            label="Resume Sections"
            value={breakdown.sections ?? 0}
            max={30}
          />

          <ScoreRow
            label="Keywords"
            value={breakdown.keywords ?? 0}
            max={20}
          />

          <ScoreRow
            label="Formatting"
            value={breakdown.formatting ?? 0}
            max={20}
          />
        </article>

        {/* STRENGTHS */}

        <article className="results-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">
                AI REVIEW
              </span>

              <h2>Your strengths</h2>
            </div>

            <Sparkles size={21} />
          </div>

          <div className="insight-list">
            {strengths.length > 0 ? (
              strengths.map(
                (strength, index) => (
                  <div
                    className="insight-item positive"
                    key={index}
                  >
                    <CheckCircle2 size={18} />

                    <p>{strength}</p>
                  </div>
                )
              )
            ) : (
              <p className="empty-result-message">
                No strengths were returned for this
                analysis.
              </p>
            )}
          </div>
        </article>

        {/* WEAKNESSES */}

        <article className="results-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">
                OPPORTUNITIES
              </span>

              <h2>Areas to improve</h2>
            </div>

            <Lightbulb size={21} />
          </div>

          <div className="insight-list">
            {weaknesses.length > 0 ? (
              weaknesses.map(
                (weakness, index) => (
                  <div
                    className="insight-item warning"
                    key={index}
                  >
                    <AlertCircle size={18} />

                    <p>{weakness}</p>
                  </div>
                )
              )
            ) : (
              <p className="empty-result-message">
                No improvement areas were returned.
              </p>
            )}
          </div>
        </article>

        {/* KEYWORD PREVIEW */}

        <article className="results-panel keyword-preview-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label">
                KEYWORDS
              </span>

              <h2>Keyword snapshot</h2>
            </div>

            <button
              className="panel-link"
              type="button"
              onClick={() =>
                setActiveSection("keywords")
              }
            >
              View all
              <ArrowRight size={15} />
            </button>
          </div>

          <p className="keyword-group-label">
            Matched
          </p>

          <div className="keyword-tags">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map(
                (keyword, index) => (
                  <span
                    className="keyword-tag matched"
                    key={`${keyword}-${index}`}
                  >
                    {keyword}
                  </span>
                )
              )
            ) : (
              <span className="empty-result-message">
                No matched keywords.
              </span>
            )}
          </div>

          <p className="keyword-group-label missing-label">
            Recommended
          </p>

          <div className="keyword-tags">
            {missingKeywords.length > 0 ? (
              missingKeywords
                .slice(0, 6)
                .map((keyword, index) => (
                  <span
                    className="keyword-tag missing"
                    key={`${keyword}-${index}`}
                  >
                    {keyword}
                  </span>
                ))
            ) : (
              <span className="empty-result-message">
                No missing keywords.
              </span>
            )}
          </div>
        </article>
      </section>
    </>
  );

  // =========================================================
  // KEYWORDS
  // =========================================================

  const renderKeywords = () => (
    <section className="results-section-page">
      <span className="section-label">
        KEYWORD ANALYSIS
      </span>

      <h1>Keywords for {role}</h1>

      <p className="results-section-intro">
        Review the role-relevant keywords detected in your
        resume and the ones that may strengthen your ATS
        alignment.
      </p>

      <div className="keyword-detail-grid">

        {/* MATCHED */}

        <article className="results-panel">
          <div className="panel-heading">
            <div>
              <h2>Matched Keywords</h2>

              <p>
                Already present in your resume.
              </p>
            </div>

            <CheckCircle2 size={22} />
          </div>

          <div className="keyword-tags large">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map(
                (keyword, index) => (
                  <span
                    className="keyword-tag matched"
                    key={`${keyword}-${index}`}
                  >
                    {keyword}
                  </span>
                )
              )
            ) : (
              <p className="empty-result-message">
                No matched keywords were detected.
              </p>
            )}
          </div>
        </article>

        {/* MISSING */}

        <article className="results-panel">
          <div className="panel-heading">
            <div>
              <h2>
                Missing / Recommended
              </h2>

              <p>
                Consider adding these only where they
                truthfully apply.
              </p>
            </div>

            <Search size={22} />
          </div>

          <div className="keyword-tags large">
            {missingKeywords.length > 0 ? (
              missingKeywords.map(
                (keyword, index) => (
                  <span
                    className="keyword-tag missing"
                    key={`${keyword}-${index}`}
                  >
                    {keyword}
                  </span>
                )
              )
            ) : (
              <p className="empty-result-message">
                No additional keywords were recommended.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );

  // =========================================================
  // SUGGESTIONS
  // =========================================================

  const renderSuggestions = () => (
    <section className="results-section-page">
      <span className="section-label">
        RECOMMENDATIONS
      </span>

      <h1>Priority Suggestions</h1>

      <p className="results-section-intro">
        Actionable improvements based on your ATS analysis.
      </p>

      <div className="suggestion-list">
        {suggestions.length > 0 ? (
          suggestions.map(
            (suggestion, index) => (
              <article
                className="suggestion-result-card"
                key={index}
              >
                <div className="suggestion-number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div>
                  <span>
                    RECOMMENDATION
                  </span>

                  <p>{suggestion}</p>
                </div>
              </article>
            )
          )
        ) : (
          <article className="results-panel">
            <p className="empty-result-message">
              No additional suggestions were returned.
            </p>
          </article>
        )}
      </div>
    </section>
  );

  // =========================================================
  // AI REWRITE
  // =========================================================

  const renderRewrite = () => (
    <section className="results-section-page">
      <span className="section-label">
        AI REWRITE
      </span>

      <h1>Improved Resume Content</h1>

      <p className="results-section-intro">
        AI-generated rewrites designed to make your
        experience clearer and more impactful.
      </p>

      <div className="rewrite-list">
        {rewrittenBullets.length > 0 ? (
          rewrittenBullets.map(
            (bullet, index) => (
              <article
                className="rewrite-card"
                key={index}
              >
                <div className="rewrite-number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <p>{bullet}</p>
              </article>
            )
          )
        ) : (
          <article className="results-panel">
            <p className="empty-result-message">
              No rewritten bullet points were generated.
            </p>
          </article>
        )}
      </div>
    </section>
  );

  // =========================================================
  // COVER LETTER
  // =========================================================

  const renderCoverLetter = () => (
    <section className="results-section-page">
      <span className="section-label">
        COVER LETTER
      </span>

      <h1>Your Tailored Cover Letter</h1>

      <p className="results-section-intro">
        Generated specifically for your {role} application
        using your resume analysis.
      </p>

      <article className="cover-letter-card">
        <div className="cover-letter-header">
          <div className="cover-letter-icon">
            <FileText size={22} />
          </div>

          <div>
            <strong>
              {role} Cover Letter
            </strong>

            <span>
              AI-generated draft
            </span>
          </div>
        </div>

        <div className="cover-letter-content">
          {coverLetter ||
            "No cover letter was generated for this analysis."}
        </div>
      </article>
    </section>
  );

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="results-page">

      {/* SIDEBAR */}

      <aside className="results-sidebar">

        {/* BRAND */}

        <button
          className="analyze-brand"
          onClick={() => navigate("/")}
          type="button"
        >
          <div className="analyze-brand-icon">
            <FileText size={21} />
          </div>

          <div>
            <strong>AI RESUME</strong>
            <span>REVIEWER</span>
          </div>
        </button>

        {/* NAVIGATION */}

        <nav className="results-nav">

          <ResultsNavItem
            active={
              activeSection === "overview"
            }
            icon={
              <LayoutDashboard size={18} />
            }
            label="Overview"
            onClick={() =>
              setActiveSection("overview")
            }
          />

          <ResultsNavItem
            active={
              activeSection === "keywords"
            }
            icon={
              <Search size={18} />
            }
            label="Keywords"
            onClick={() =>
              setActiveSection("keywords")
            }
          />

          <ResultsNavItem
            active={
              activeSection === "suggestions"
            }
            icon={
              <Lightbulb size={18} />
            }
            label="Suggestions"
            onClick={() =>
              setActiveSection("suggestions")
            }
          />

          <ResultsNavItem
            active={
              activeSection === "rewrite"
            }
            icon={
              <PenLine size={18} />
            }
            label="AI Rewrite"
            onClick={() =>
              setActiveSection("rewrite")
            }
          />

          <ResultsNavItem
            active={
              activeSection === "cover-letter"
            }
            icon={
              <FileCheck size={18} />
            }
            label="Cover Letter"
            onClick={() =>
              setActiveSection("cover-letter")
            }
          />
        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="results-sidebar-bottom">

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            <Home size={17} />
            Home
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/analyze")
            }
          >
            <FileText size={17} />
            New Analysis
          </button>

        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="results-main">

        {activeSection === "overview" &&
          renderOverview()}

        {activeSection === "keywords" &&
          renderKeywords()}

        {activeSection === "suggestions" &&
          renderSuggestions()}

        {activeSection === "rewrite" &&
          renderRewrite()}

        {activeSection === "cover-letter" &&
          renderCoverLetter()}

      </main>
    </div>
  );
}

// =========================================================
// SIDEBAR NAV ITEM
// =========================================================

function ResultsNavItem({
  active,
  icon,
  label,
  onClick,
}) {
  return (
    <button
      className={`results-nav-item ${
        active ? "active" : ""
      }`}
      type="button"
      onClick={onClick}
    >
      {icon}

      <span>{label}</span>
    </button>
  );
}

// =========================================================
// SCORE BREAKDOWN ROW
// =========================================================

function ScoreRow({
  label,
  value,
  max,
}) {
  const safeValue =
    Number(value) || 0;

  const safeMax =
    Number(max) || 1;

  const percentage = Math.min(
    Math.max(
      (safeValue / safeMax) * 100,
      0
    ),
    100
  );

  return (
    <div className="score-breakdown-row">

      <div className="score-breakdown-info">

        <span>{label}</span>

        <strong>
          {safeValue}/{safeMax}
        </strong>

      </div>

      <div className="score-progress">
        <div
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

    </div>
  );
}

export default ResultsPage;