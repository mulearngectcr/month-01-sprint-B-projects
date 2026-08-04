import { Link } from "react-router-dom";
import {
  ArrowRight,
  Upload,
  BrainCircuit,
  TrendingUp,
  Check,
  AlertTriangle,
  FileText,
  Sparkles,
} from "lucide-react";

function LandingPage() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <header className="landing-navbar">
        <Link to="/" className="brand">

          <div className="brand-text">
            <span>AI RESUME</span>
            <small>REVIEWER</small>
          </div>
        </Link>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </nav>

        <Link to="/analyze" className="nav-cta">
          Analyze My Resume
          <ArrowRight size={15} />
        </Link>
      </header>

      <main>
        {/* HERO */}
        <section className="landing-hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={14} />
              <span>AI-Powered</span>
              <i />
              <span>ATS-Inspired</span>
              <i />
              <span>Actionable Feedback</span>
            </div>

            <h1 className="hero-title">
              Make your resume
              <br />
              stand out.{" "}
              <span className="hero-accent">
                Land more
                <br />
                interviews.
              </span>
            </h1>

            <p className="hero-description">
              Get intelligent resume analysis, keyword insights, personalized
              feedback, improved bullet points, and a tailored cover letter —
              all in one place.
            </p>

            <div className="hero-actions">
              <Link to="/analyze" className="primary-button">
                Analyze My Resume
                <ArrowRight size={17} />
              </Link>

              <a href="#how-it-works" className="secondary-button">
                See How It Works
              </a>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="hero-visual">
            <div className="decorative-ring ring-one" />
            <div className="decorative-ring ring-two" />

            <div className="resume-preview-card">
              <div className="preview-heading">
                <div>
                  <span className="preview-label">RESUME ANALYSIS</span>
                  <h3>Your resume at a glance</h3>
                </div>

                <span className="preview-status">Analysis complete</span>
              </div>

              <div className="score-section">
                <div className="score-circle">
                  <div className="score-inner">
                    <strong>84</strong>
                    <span>Very Good</span>
                  </div>
                </div>

                <div className="score-details">
                  <div className="score-detail">
                    <span className="detail-icon success">
                      <Check size={14} />
                    </span>
                    <div>
                      <strong>Strong structure</strong>
                      <small>Clear and well organized</small>
                    </div>
                  </div>

                  <div className="score-detail">
                    <span className="detail-icon success">
                      <Check size={14} />
                    </span>
                    <div>
                      <strong>Relevant experience</strong>
                      <small>Good role alignment</small>
                    </div>
                  </div>

                  <div className="score-detail">
                    <span className="detail-icon warning">
                      <AlertTriangle size={13} />
                    </span>
                    <div>
                      <strong>Keywords missing</strong>
                      <small>Opportunity to improve</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="metric">
                <div className="metric-header">
                  <span>Keyword Match</span>
                  <strong>72%</strong>
                </div>
                <div className="metric-track">
                  <div className="metric-fill keyword-fill" />
                </div>
              </div>

              <div className="metric">
                <div className="metric-header">
                  <span>Resume Structure</span>
                  <strong>89%</strong>
                </div>
                <div className="metric-track">
                  <div className="metric-fill structure-fill" />
                </div>
              </div>

              <div className="tip-card">
                <div className="tip-icon">
                  <Sparkles size={18} />
                </div>
                <div>
                  <small>AI INSIGHT</small>
                  <strong>Quantify your achievements</strong>
                  <p>Add measurable results to make your impact clearer.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="feature-strip" id="features">
          <div className="feature-item">
            <div className="feature-icon terracotta">
              <Upload size={22} />
            </div>
            <div>
              <h3>Upload Resume</h3>
              <p>Upload your resume securely in PDF format.</p>
            </div>
          </div>

          <div className="feature-divider" />

          <div className="feature-item">
            <div className="feature-icon navy">
              <BrainCircuit size={22} />
            </div>
            <div>
              <h3>AI Analysis</h3>
              <p>Get ATS-inspired scoring and intelligent feedback.</p>
            </div>
          </div>

          <div className="feature-divider" />

          <div className="feature-item">
            <div className="feature-icon terracotta">
              <TrendingUp size={22} />
            </div>
            <div>
              <h3>Improve & Apply</h3>
              <p>Strengthen your resume and apply with confidence.</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <span>HOW IT WORKS</span>
            <h2>Three steps to a stronger resume.</h2>
            <p>
              From upload to actionable improvements in just a few simple
              steps.
            </p>
          </div>

          <div className="steps-container">
            <div className="step-card">
              <span className="step-number">01</span>
              <div className="step-icon">
                <Upload size={24} />
              </div>
              <h3>Upload your resume</h3>
              <p>
                Choose your PDF resume and select the role you're targeting.
              </p>
            </div>

            <div className="step-line">
              <ArrowRight size={19} />
            </div>

            <div className="step-card">
              <span className="step-number">02</span>
              <div className="step-icon">
                <BrainCircuit size={24} />
              </div>
              <h3>Let AI analyze it</h3>
              <p>
                Your resume is evaluated for structure, keywords, and areas
                that can be improved.
              </p>
            </div>

            <div className="step-line">
              <ArrowRight size={19} />
            </div>

            <div className="step-card">
              <span className="step-number">03</span>
              <div className="step-icon">
                <TrendingUp size={24} />
              </div>
              <h3>Improve & stand out</h3>
              <p>
                Use actionable suggestions, rewritten bullets, and your
                generated cover letter.
              </p>
            </div>
          </div>

          <Link to="/analyze" className="bottom-cta">
            Analyze My Resume
            <ArrowRight size={17} />
          </Link>
        </section>

        {/* ABOUT / FOOTER */}
        <section className="landing-footer" id="about">
          <Link to="/" className="footer-brand">
            <div className="brand-mark dark">
              <FileText size={20} />
            </div>
            <div className="brand-text footer-brand-text">
              <span>AI RESUME</span>
              <small>REVIEWER</small>
            </div>
          </Link>

          <p>
            AI-powered insights to help you build a stronger, more
            competitive resume.
          </p>

          <span className="footer-copy">AI Resume Reviewer</span>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;