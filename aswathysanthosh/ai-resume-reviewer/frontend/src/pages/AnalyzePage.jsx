import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  Home,
  LayoutDashboard,
  Lightbulb,
  Target,
  Search,
  Sparkles,
  PenLine,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function AnalyzePage() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("AI Engineer");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF resume.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    handleFile(droppedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // These names must match the FastAPI endpoint exactly
      formData.append("file", file);
      formData.append("role", targetRole);

      const response = await api.post("/analyze", formData);

      console.log("Analysis successful:", response.data);

      navigate("/results", {
        state: {
          analysis: response.data,
          targetRole: targetRole,
          fileName: file.name,
        },
      });
    } catch (error) {
      console.error("Resume analysis failed:", error);
      console.error("Backend response:", error.response?.data);

      alert(
        error.response?.data?.detail
          ? "Failed to analyze resume. Please check the submitted information."
          : "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="analyze-page">
      {/* SIDEBAR */}
      <aside className="analyze-sidebar">
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

        <nav className="analyze-nav">
          <button className="analyze-nav-item active" type="button">
            <LayoutDashboard size={18} />
            <span>Analyze Resume</span>
          </button>

          <button
            className="analyze-nav-item"
            onClick={() => navigate("/#how-it-works")}
            type="button"
          >
            <Lightbulb size={18} />
            <span>How It Works</span>
          </button>

          <button
            className="analyze-nav-item"
            onClick={() => navigate("/")}
            type="button"
          >
            <Home size={18} />
            <span>Home</span>
          </button>
        </nav>

        <div className="analyze-sidebar-tip">
          <div className="tip-icon">
            <Lightbulb size={17} />
          </div>

          <div>
            <span>QUICK TIP</span>
            <p>
              A clear, well-structured resume gives the AI more context for
              useful feedback.
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="analyze-main">
        <div className="analyze-content">
          <section className="analyze-workspace">
            <div className="analyze-heading">
              <span className="section-label">RESUME ANALYSIS</span>

              <h1>Let's analyze your resume.</h1>

              <p>
                Upload your resume and choose the role you're targeting.
                We'll take care of the rest.
              </p>
            </div>

            {/* UPLOAD */}
            {!file ? (
              <label
                className={`resume-dropzone ${
                  dragActive ? "drag-active" : ""
                }`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                <div className="dropzone-icon">
                  <Upload size={25} />
                </div>

                <h3>Drag & drop your resume here</h3>
                <p>or click to browse</p>

                <div className="upload-meta">
                  <span>PDF only</span>
                  <i />
                  <span>Max 5 MB</span>
                </div>
              </label>
            ) : (
              <div className="uploaded-resume-card">
                <div className="uploaded-file-icon">
                  <FileText size={24} />
                </div>

                <div className="uploaded-file-info">
                  <strong>{file.name}</strong>
                  <span>{formatFileSize(file.size)}</span>
                </div>

                <CheckCircle2
                  className="uploaded-success"
                  size={21}
                />

                <button
                  className="remove-upload"
                  onClick={() => setFile(null)}
                  aria-label="Remove uploaded resume"
                  type="button"
                >
                  <X size={19} />
                </button>
              </div>
            )}

            <div className="secure-upload-note">
              <ShieldCheck size={15} />
              <span>Your resume is used only for analysis.</span>
            </div>

            {/* ROLE */}
            <div className="role-field">
              <label htmlFor="target-role">Target Role</label>

              <div className="role-select-wrapper">
                <Target size={17} />

                <select
                  id="target-role"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option>AI Engineer</option>
                  <option>Machine Learning Engineer</option>
                  <option>Data Scientist</option>
                  <option>Data Analyst</option>
                  <option>Software Engineer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full Stack Developer</option>
                </select>
              </div>
            </div>

            <button
              className="analyze-submit-button"
              onClick={handleAnalyze}
              type="button"
              disabled={loading}
            >
              <Sparkles size={17} />

              <span>
                {loading ? "Analyzing Resume..." : "Analyze Resume"}
              </span>

              {!loading && <ArrowRight size={18} />}
            </button>
          </section>

          {/* RIGHT PANEL */}
          <aside className="analysis-benefits">
            <span className="section-label">YOUR ANALYSIS</span>

            <h2>What you'll get</h2>

            <p className="benefits-intro">
              A focused breakdown of your resume with practical ways to
              improve it.
            </p>

            <div className="benefit-list">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Target size={18} />
                </div>

                <div>
                  <h3>ATS Score</h3>
                  <p>See how well your resume performs against ATS checks.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <Search size={18} />
                </div>

                <div>
                  <h3>Keyword Insights</h3>
                  <p>Find relevant skills and missing keywords.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <Sparkles size={18} />
                </div>

                <div>
                  <h3>AI Suggestions</h3>
                  <p>Get actionable recommendations for stronger content.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <PenLine size={18} />
                </div>

                <div>
                  <h3>Improved Content</h3>
                  <p>Get rewritten bullet points with clearer impact.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <FileText size={18} />
                </div>

                <div>
                  <h3>Cover Letter</h3>
                  <p>Generate a tailored cover letter for your target role.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default AnalyzePage;