import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Cloud,
  Code2,
  Columns3,
  Database,
  FileCheck2,
  FileClock,
  FileText,
  GitBranch,
  GitCommitHorizontal,
  Link2,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  PackageCheck,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  TestTube2,
  UserRoundCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import "./styles.css";
import { BaselinesWorkspace } from "./baselines/BaselinesWorkspace";
import { HelpWorkspace } from "./help/HelpWorkspace";
import { IntegrationWorkspace } from "./integrations/IntegrationWorkspace";
import { RequirementsWorkspace } from "./requirements/RequirementsWorkspace";
import { ReviewsWorkspace } from "./reviews/ReviewsWorkspace";
import { TraceabilityWorkspace } from "./traceability/TraceabilityWorkspace";
import { VerificationWorkspace } from "./verification/VerificationWorkspace";

type PageHeaderProps = {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: Columns3 },
  { id: "requirements", label: "Requirements", icon: FileText, count: "Live" },
  { id: "traceability", label: "Traceability", icon: Link2, count: "Live" },
  { id: "baselines", label: "Baselines", icon: GitBranch },
  { id: "reviews", label: "Reviews", icon: ClipboardCheck, count: "Live" },
  { id: "verification", label: "Verification", icon: TestTube2 },
];

const DELIVERY_ITEMS = [
  { id: "development", label: "Development", icon: Activity, count: "Now" },
];

const PLATFORM_ITEMS = [
  { id: "help", label: "Help", icon: BookOpen, count: "New" },
  { id: "storage", label: "Object storage", icon: Cloud },
  { id: "api", label: "API & SDK", icon: Code2, count: "v1" },
  { id: "integrations", label: "Integrations", icon: Zap, count: "1" },
  { id: "architecture", label: "Architecture", icon: Boxes },
];

const DEVELOPMENT_PHASES = [
  {
    id: "phase-0",
    number: "00",
    name: "Prototype",
    window: "Complete",
    status: "complete",
    outcome: "Product concept and secure preview path",
  },
  {
    id: "phase-1",
    number: "01",
    name: "Foundation",
    window: "Complete",
    status: "complete",
    outcome: "Hosted CI green; protected main enforced",
  },
  {
    id: "phase-2",
    number: "02",
    name: "Requirements",
    window: "Complete",
    status: "complete",
    outcome: "Live authoring and isolation gate passed",
  },
  {
    id: "phase-3",
    number: "03",
    name: "Change control",
    window: "Complete",
    status: "complete",
    outcome: "Protected impact-to-signed-baseline gate passed",
  },
  {
    id: "phase-4",
    number: "04",
    name: "Evidence",
    window: "Complete",
    status: "complete",
    outcome: "Protected review-to-verification gate passed",
  },
  {
    id: "phase-5",
    number: "05",
    name: "Pilot beta",
    window: "Complete",
    status: "complete",
    outcome: "Connector, operations, recovery, and hardening gates passed",
  },
  {
    id: "phase-6",
    number: "06",
    name: "Documentation",
    window: "Active",
    status: "active",
    outcome: "In-product manual live; contextual Help and maintainer SDD next",
  },
];

const DEVELOPMENT_WORKSTREAMS = [
  {
    name: "Product experience",
    icon: Columns3,
    progress: 92,
    status: "In-product Help active",
    tone: "amber",
    now: "Review the manual and add contextual workspace links",
  },
  {
    name: "Platform & API",
    icon: ServerCog,
    progress: 100,
    status: "Phase 5 operational API implemented",
    tone: "blue",
    now: "Preserve the public contract through pilot operations",
  },
  {
    name: "Data & versioning",
    icon: Database,
    progress: 100,
    status: "Recovery and upgrade rehearsed",
    tone: "mint",
    now: "Monitor backup age and recovery objectives",
  },
  {
    name: "Security & identity",
    icon: ShieldCheck,
    progress: 100,
    status: "Pilot security matrix green",
    tone: "purple",
    now: "Complete external assurance before broader regulated production",
  },
  {
    name: "Quality & delivery",
    icon: TestTube2,
    progress: 98,
    status: "Help checks protected",
    tone: "mint",
    now: "Add external-link and documentation-freshness validation",
  },
  {
    name: "Operations",
    icon: Cloud,
    progress: 100,
    status: "Telemetry and runbooks ready",
    tone: "blue",
    now: "Operate the bounded pilot against agreed SLOs",
  },
];

const DEVELOPMENT_BACKLOG = [
  { id: "FND-001", horizon: "now", priority: "P0", title: "Ratify domain boundaries and ADR set", stream: "Architecture", effort: "3d", status: "Complete" },
  { id: "FND-002", horizon: "now", priority: "P0", title: "Establish workspace and local bootstrap", stream: "Developer experience", effort: "2d", status: "Complete" },
  { id: "API-001", horizon: "now", priority: "P0", title: "Publish OpenAPI skeleton and error model", stream: "API", effort: "2d", status: "Complete" },
  { id: "API-002", horizon: "now", priority: "P0", title: "Create Rust health and readiness service", stream: "API", effort: "3d", status: "Complete" },
  { id: "DAT-001", horizon: "now", priority: "P0", title: "Add PostgreSQL migration workflow", stream: "Data", effort: "2d", status: "Complete" },
  { id: "QLT-001", horizon: "now", priority: "P0", title: "Add CI quality and security gates", stream: "Quality", effort: "2d", status: "Complete" },
  { id: "SEC-001", horizon: "now", priority: "P0", title: "Prove OIDC identity and policy harness", stream: "Security", effort: "3d", status: "Complete" },
  { id: "WEB-001", horizon: "now", priority: "P1", title: "Migrate client to TypeScript API client", stream: "Web", effort: "3d", status: "Complete" },
  { id: "QLT-002", horizon: "now", priority: "P0", title: "Run hosted CI and protect the main branch", stream: "Quality", effort: "1d", status: "Complete" },
  { id: "REQ-000", horizon: "now", priority: "P1", title: "Decompose the requirements vertical slice", stream: "Product", effort: "2d", status: "Complete" },
  { id: "REQ-101", horizon: "now", priority: "P0", title: "Persist requirements and immutable revisions", stream: "Data", effort: "3d", status: "Complete" },
  { id: "REQ-102", horizon: "now", priority: "P0", title: "Create, search, read, revise, and inspect history", stream: "API", effort: "4d", status: "Complete" },
  { id: "REQ-103", horizon: "now", priority: "P0", title: "Enforce concurrency, idempotency, tenancy, and audit", stream: "Security", effort: "3d", status: "Complete" },
  { id: "REQ-104", horizon: "now", priority: "P0", title: "Connect the authoring UI to the API", stream: "Web", effort: "4d", status: "Complete" },
  { id: "REQ-105", horizon: "now", priority: "P1", title: "Add folders, tags, attributes, and saved views", stream: "Product", effort: "5d", status: "Complete" },
  { id: "REQ-106", horizon: "now", priority: "P1", title: "Add import, export, comparison, accessibility, and E2E", stream: "Quality", effort: "4d", status: "Complete" },
  { id: "REQ-001", horizon: "now", priority: "P0", title: "Complete requirements vertical slice", stream: "Product", effort: "4w", status: "Complete" },
  { id: "TRC-001", horizon: "next", priority: "P0", title: "Deliver traceability and baselines", stream: "Product", effort: "4w", status: "Complete" },
  { id: "REV-101", horizon: "next", priority: "P0", title: "Deliver controlled reviews and signed approvals", stream: "Product", effort: "2w", status: "Complete" },
  { id: "VER-101", horizon: "next", priority: "P0", title: "Deliver verification execution and gate readiness", stream: "Product", effort: "2w", status: "Complete" },
  { id: "INT-101", horizon: "next", priority: "P0", title: "Deliver governed Jira connector and replay", stream: "Integration", effort: "1w", status: "Complete" },
  { id: "OPS-101", horizon: "next", priority: "P0", title: "Add telemetry, SLO dashboards, and alerts", stream: "Operations", effort: "1w", status: "Complete" },
  { id: "OPS-102", horizon: "next", priority: "P0", title: "Rehearse backup, restore, and upgrades", stream: "Operations", effort: "3d", status: "Complete" },
  { id: "QLT-201", horizon: "next", priority: "P0", title: "Complete security, load, browser, and accessibility gates", stream: "Quality", effort: "1w", status: "Complete" },
  { id: "PIL-101", horizon: "next", priority: "P1", title: "Publish administration, operations, and pilot guides", stream: "Product", effort: "3d", status: "Complete" },
  { id: "DOC-201", horizon: "now", priority: "P0", title: "Define manual structure, metadata, and linked contents", stream: "Documentation", effort: "1d", status: "Complete" },
  { id: "DOC-202", horizon: "now", priority: "P0", title: "Review and complete the comprehensive user manual", stream: "Documentation", effort: "3d", status: "In progress" },
  { id: "WEB-201", horizon: "now", priority: "P0", title: "Add Help navigation, rendering, anchors, and contextual links", stream: "Web", effort: "3d", status: "In progress" },
  { id: "QLT-301", horizon: "now", priority: "P0", title: "Protect manual structure, routing, browser, and WCAG checks", stream: "Quality", effort: "2d", status: "In progress" },
  { id: "ARC-201", horizon: "next", priority: "P0", title: "Generate the code-aligned maintainer SDD", stream: "Architecture", effort: "4d", status: "Ready" },
  { id: "ARC-202", horizon: "next", priority: "P1", title: "Validate the SDD through a maintainer walkthrough", stream: "Architecture", effort: "2d", status: "Ready" },
  { id: "GOV-201", horizon: "next", priority: "P1", title: "Add documentation ownership and freshness controls", stream: "Governance", effort: "2d", status: "Ready" },
];

const COMMITS = [
  {
    id: "c8a71f2",
    title: "Clarify failover tolerance and verification method",
    author: "Maya Chen",
    time: "12 min ago",
    files: 4,
    color: "mint",
  },
  {
    id: "89d4b10",
    title: "Resolve SRR review comments",
    author: "Arun Patel",
    time: "2h ago",
    files: 11,
    color: "amber",
  },
  {
    id: "17ec2aa",
    title: "Import supplier interface requirements",
    author: "Renee Okafor",
    time: "Yesterday",
    files: 38,
    color: "blue",
  },
];

const TOUR_STEPS = [
  {
    eyebrow: "01 / Executive control",
    title: "Know whether the design is ready to move.",
    body: "A single readiness view rolls requirements, coverage, reviews, and verification into an evidence-backed gate decision.",
    icon: Activity,
    target: "overview",
  },
  {
    eyebrow: "02 / Digital thread",
    title: "Follow intent from need to test result.",
    body: "Typed relationships expose gaps and automatically flag downstream links when an upstream requirement changes.",
    icon: Link2,
    target: "traceability",
  },
  {
    eyebrow: "03 / Controlled change",
    title: "Every decision lands in an immutable changeset.",
    body: "Git-inspired commits, protected baselines, and exact diffs make change history understandable without exposing engineering teams to Git mechanics.",
    icon: GitCommitHorizontal,
    target: "baselines",
  },
  {
    eyebrow: "04 / Open foundation",
    title: "Own the platform—and the data.",
    body: "Rust services, a versioned REST/OpenAPI contract, PostgreSQL, portable S3-compatible storage, and a connector plane—starting with Jira—provide a secure, self-hostable foundation.",
    icon: Boxes,
    target: "architecture",
  },
];

function App() {
  const [page, setPage] = useState("overview");
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");

  const currentLabel = useMemo(
    () => [...DELIVERY_ITEMS, ...NAV_ITEMS, ...PLATFORM_ITEMS].find((item) => item.id === page)?.label || "Overview",
    [page],
  );

  const navigate = (target) => {
    setPage(target);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const pageProps = {
    navigate,
    notify,
  };

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={navigate}
      />

      <main className="main-shell">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={19} />
          </button>
          <div className="breadcrumb">
            <span>{page === "development" ? "OpenRM program" : page === "help" ? "OpenRM" : "Aurora Flight Computer"}</span>
            <ChevronRight size={14} />
            <strong>{currentLabel}</strong>
          </div>
          <div className="topbar-actions">
            <span className="illustrative-chip"><CircleDot size={12} /> {page === "development" ? "Repository evidence" : page === "help" ? "Product guide" : "Illustrative data"}</span>
            <button className="ghost-button project-button">
              {page === "development" ? "PROGRAM" : "AURORA-2"} <ChevronDown size={14} />
            </button>
            <button className="help-button" onClick={() => navigate("help")} aria-current={page === "help" ? "page" : undefined}>
              <BookOpen size={15} /> Help
            </button>
            <button className="tour-button" onClick={() => { setTourStep(0); setTourOpen(true); }}>
              <Sparkles size={15} /> Guided demo
            </button>
            <button className="avatar" aria-label="User profile">GJ</button>
          </div>
        </header>

        <section className="page-stage" key={page}>
          {page === "development" && <DevelopmentDashboard {...pageProps} />}
          {page === "overview" && <Overview {...pageProps} />}
          {page === "requirements" && <RequirementsWorkspace notify={notify} />}
          {page === "traceability" && <TraceabilityWorkspace notify={notify} />}
          {page === "baselines" && <BaselinesWorkspace notify={notify} />}
          {page === "reviews" && <ReviewsWorkspace notify={notify} />}
          {page === "verification" && <VerificationWorkspace notify={notify} />}
          {page === "storage" && <Storage {...pageProps} />}
          {page === "api" && <RestApi {...pageProps} />}
          {page === "integrations" && <IntegrationWorkspace notify={notify} />}
          {page === "architecture" && <Architecture />}
          {page === "help" && <HelpWorkspace />}
        </section>
      </main>

      {tourOpen && (
        <TourModal
          step={tourStep}
          onClose={() => setTourOpen(false)}
          onNext={() => setTourStep((value) => Math.min(value + 1, TOUR_STEPS.length - 1))}
          onBack={() => setTourStep((value) => Math.max(value - 1, 0))}
          onExplore={(target) => { setTourOpen(false); navigate(target); }}
        />
      )}

      {toast && <div className="toast"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  );
}

function Sidebar({ page, open, onClose, onNavigate }) {
  const renderItem = (item) => {
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        className={`nav-item ${page === item.id ? "active" : ""}`}
        onClick={() => onNavigate(item.id)}
      >
        <Icon size={18} strokeWidth={1.8} />
        <span>{item.label}</span>
        {item.count && <small>{item.count}</small>}
      </button>
    );
  };

  return (
    <>
      {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Close menu" />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><GitBranch size={20} /></div>
          <div>
            <div className="brand-name">Open<span>RM</span></div>
            <div className="brand-subtitle">Funding preview</div>
          </div>
          <button className="sidebar-close icon-button" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>

        <div className="project-card">
          <div className="project-icon">{page === "development" ? "CM" : "A2"}</div>
          <div>
            <strong>{page === "development" ? "OpenRM delivery program" : "Aurora Flight Computer"}</strong>
            <span>{page === "development" ? "Foundation planning baseline" : "Design gate • SRR"}</span>
          </div>
          <MoreHorizontal size={18} />
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Delivery</div>
          {DELIVERY_ITEMS.map(renderItem)}
          <div className="nav-label platform-label">Workspace</div>
          {NAV_ITEMS.map(renderItem)}
          <div className="nav-label platform-label">Platform</div>
          {PLATFORM_ITEMS.map(renderItem)}
        </nav>

        <div className="sidebar-footer">
          <div className="health-dot" />
          <div>
            <strong>{page === "development" ? "Preview build operational" : "All systems operational"}</strong>
            <span>{page === "development" ? "Production services not connected" : "PostgreSQL + S3 connected"}</span>
          </div>
          <ChevronRight size={15} />
        </div>
      </aside>
    </>
  );
}

function PageHeader({ eyebrow, title, description, actions = null }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

function DevelopmentDashboard({ notify }) {
  const [horizon, setHorizon] = useState("now");
  const visibleWork = DEVELOPMENT_BACKLOG.filter((item) => item.horizon === horizon);
  const horizonLabel = { now: "Current sprint", next: "Next up", later: "Later phases" }[horizon];

  const copySprintBrief = async () => {
    const brief = DEVELOPMENT_BACKLOG
      .filter((item) => item.horizon === "now")
      .map((item) => `${item.id} — ${item.title} (${item.effort})`)
      .join("\n");

    try {
      await navigator.clipboard.writeText(`OpenRM Phase 6 active — in-product Help review and maintainer SDD next\n${brief}`);
      notify("Current sprint brief copied");
    } catch {
      notify("Sprint brief is listed in IMPLEMENTATION_PLAN.md");
    }
  };

  const focusRoadmap = () => {
    document.querySelector(".delivery-roadmap")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Delivery control • Repository baseline • 8 Nov 2026"
        title={<>From convincing prototype to <em>working platform.</em></>}
        description="A delivery view grounded in the current repository. Prototype coverage and production capability stay separate so every gate is backed by executable evidence."
        actions={
          <>
            <button className="secondary-button" onClick={focusRoadmap}>
              <FileText size={16} /> Implementation plan
            </button>
            <button className="primary-button" onClick={copySprintBrief}>
              Copy sprint brief <ArrowRight size={16} />
            </button>
          </>
        }
      />

      <section className="development-command panel">
        <div className="development-command-copy">
          <div className="phase-status-row">
            <span className="phase-chip"><span /> Phase 6 active</span>
            <span className="baseline-date">Documentation and maintainability</span>
          </div>
          <p className="panel-kicker">Current delivery objective</p>
          <h2>Make OpenRM understandable inside the product and maintainable from the repository.</h2>
          <p>
            The first in-product Help increment publishes the authoritative manual through persistent dashboard
            navigation, searchable contents, stable anchors, responsive rendering, and three-browser WCAG checks.
            Contextual workspace links, documentation governance, and the maintainer SDD remain in progress.
          </p>
          <div className="command-meta">
            <span><GitBranch size={14} /> Stage: Phase 6 active</span>
            <span><BadgeCheck size={14} /> Next: contextual Help and maintainer SDD</span>
          </div>
        </div>
        <div className="gate-card">
          <div className="gate-card-head">
            <div>
              <span>First Help increment</span>
              <strong>4 / 7 work items started</strong>
            </div>
            <div className="gate-score active">Active</div>
          </div>
          <div className="gate-checks">
            <span className="complete"><CheckCircle2 size={13} /> Authoritative manual with linked contents</span>
            <span className="complete"><CheckCircle2 size={13} /> Persistent topbar and sidebar Help access</span>
            <span className="complete"><CheckCircle2 size={13} /> Search, stable anchors, and responsive layout</span>
            <span className="complete"><CheckCircle2 size={13} /> Three-browser workflows and WCAG A/AA</span>
            <span><CircleDot size={13} /> Contextual workspace links</span>
            <span><CircleDot size={13} /> Maintainer SDD and walkthrough</span>
            <span><CircleDot size={13} /> Ownership and freshness controls</span>
          </div>
        </div>
      </section>

      <div className="development-metrics">
        <DeliveryMetric icon={Columns3} value="11 / 11" label="Product surfaces" detail="Core workspaces plus in-product Help" tone="mint" />
        <DeliveryMetric icon={ServerCog} value="24" label="Controlled capabilities" detail="Authoring through signed gate evidence" tone="blue" />
        <DeliveryMetric icon={TestTube2} value="36 + 42" label="Automated tests" detail="Rust and browser/WCAG matrix" tone="mint" />
        <DeliveryMetric icon={AlertTriangle} value="4" label="Program risks" detail="Decisions accepted; controls remain" tone="red" />
      </div>

      <section className="delivery-roadmap panel">
        <div className="panel-heading development-heading">
          <div>
            <span className="panel-kicker">Release path</span>
            <h2>Seven evidence gates through maintainability</h2>
          </div>
          <span className="repository-badge"><GitCommitHorizontal size={14} /> Versioned with the plan</span>
        </div>
        <div className="phase-rail">
          {DEVELOPMENT_PHASES.map((phase) => (
            <article className={`delivery-phase ${phase.status}`} key={phase.id}>
              <div className="delivery-phase-marker">
                {phase.status === "complete" ? <Check size={15} /> : phase.number}
              </div>
              <div className="delivery-phase-copy">
                <div><span>{phase.window}</span><strong>{phase.name}</strong></div>
                <p>{phase.outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="workstream-section">
        <div className="section-title-row">
          <div>
            <span className="panel-kicker">Workstream health</span>
            <h2>Where the implementation really stands</h2>
          </div>
          <p>Progress estimates measure evidence in this repository, not feature-screen coverage.</p>
        </div>
        <div className="workstream-grid">
          {DEVELOPMENT_WORKSTREAMS.map((stream) => {
            const Icon = stream.icon;
            return (
              <article className="workstream-card panel" key={stream.name}>
                <div className="workstream-top">
                  <span className={`workstream-icon ${stream.tone}`}><Icon size={18} /></span>
                  <strong>{stream.progress}%</strong>
                </div>
                <h3>{stream.name}</h3>
                <span className={`workstream-status ${stream.tone}`}>{stream.status}</span>
                <div className="workstream-progress"><span className={stream.tone} style={{ width: `${stream.progress}%` }} /></div>
                <p><b>Now:</b> {stream.now}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="development-lower-grid">
        <section className="delivery-backlog panel">
          <div className="backlog-header">
            <div>
              <span className="panel-kicker">Execution backlog</span>
              <h2>{horizonLabel}</h2>
            </div>
            <div className="horizon-tabs" aria-label="Backlog horizon">
              {["now", "next", "later"].map((value) => (
                <button
                  key={value}
                  className={horizon === value ? "active" : ""}
                  aria-pressed={horizon === value}
                  onClick={() => setHorizon(value)}
                >
                  {value === "now" ? "Now" : value === "next" ? "Next" : "Later"}
                </button>
              ))}
            </div>
          </div>
          <div className="backlog-table" aria-live="polite">
            <div className="backlog-row backlog-labels">
              <span>Item</span><span>Work</span><span>Stream</span><span>Effort</span><span>Status</span>
            </div>
            {visibleWork.map((item) => (
              <div className="backlog-row" key={item.id}>
                <span><code>{item.id}</code><small className={item.priority === "P0" ? "p0" : "p1"}>{item.priority}</small></span>
                <strong>{item.title}</strong>
                <span>{item.stream}</span>
                <span>{item.effort}</span>
                <span className={`backlog-status ${item.status.toLowerCase().replaceAll(" ", "-")}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="delivery-risks panel">
          <div className="panel-heading compact">
            <div>
              <span className="panel-kicker">Accepted foundations</span>
              <h2>Decisions now enforced</h2>
            </div>
            <CheckCircle2 size={19} />
          </div>
          <div className="risk-list">
            <div className="risk-item resolved"><span>01</span><div><strong>Revision semantics</strong><p>Append-only history with materialized current state.</p></div><small>ADR</small></div>
            <div className="risk-item resolved"><span>02</span><div><strong>Authorization boundary</strong><p>Organization-scoped, deny-by-default policy.</p></div><small>ADR</small></div>
            <div className="risk-item resolved"><span>03</span><div><strong>Search consistency</strong><p>PostgreSQL source of truth with visible freshness.</p></div><small>ADR</small></div>
            <div className="risk-item resolved"><span>04</span><div><strong>Connector guarantees</strong><p>Transactional outbox and idempotent replay.</p></div><small>ADR</small></div>
          </div>
          <div className="risk-note"><LockKeyhole size={15} /> No production data belongs in the static preview stack.</div>
        </aside>
      </div>

      <div className="dashboard-source-note">
        <FileCheck2 size={16} />
        <p><strong>Source of truth:</strong> Phase 6 Help structure, routing, search, stable anchors, responsive rendering, and WCAG A/AA checks pass locally and in protected OpenRM CI run 42545427886, including the complete 42-test browser matrix and production artifact.</p>
      </div>
    </>
  );
}

function DeliveryMetric({ icon: Icon, value, label, detail, tone }) {
  return (
    <article className="delivery-metric panel">
      <span className={`delivery-metric-icon ${tone}`}><Icon size={18} /></span>
      <div><strong>{value}</strong><span>{label}</span><small>{detail}</small></div>
    </article>
  );
}

function Overview({ navigate, notify }) {
  return (
    <>
      <PageHeader
        eyebrow="System requirements review • Gate 2 of 5"
        title={<>Release decision, <em>at a glance.</em></>}
        description="A live, evidence-backed view of design maturity across requirements, reviews, traceability, and verification."
        actions={
          <>
            <button className="secondary-button" onClick={() => navigate("traceability")}><Link2 size={16} /> Open trace view</button>
            <button className="primary-button" onClick={() => notify("Demo baseline BL-007 created")}>Create baseline <ArrowRight size={16} /></button>
          </>
        }
      />

      <div className="metric-grid">
        <MetricCard icon={FileText} label="Controlled artifacts" value="1,248" delta="+38 this sprint" tone="ink" />
        <MetricCard icon={Link2} label="Trace coverage" value="93%" delta="+4% since Gate 1" tone="mint" />
        <MetricCard icon={AlertTriangle} label="Suspect links" value="7" delta="3 require owners" tone="amber" />
        <MetricCard icon={UserRoundCheck} label="Approvals due" value="2" delta="Due by Friday" tone="blue" />
      </div>

      <div className="overview-grid">
        <section className="panel readiness-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Gate readiness</span>
              <h2>System requirements review</h2>
            </div>
            <span className="status-pill on-track"><CircleDot size={11} /> On track</span>
          </div>
          <div className="readiness-body">
            <div className="readiness-gauge" style={{ "--progress": "84deg" } as React.CSSProperties}>
              <div><strong>84</strong><span>% ready</span></div>
            </div>
            <div className="readiness-list">
              <ProgressRow label="Requirements approved" value={88} count="1,098 / 1,248" />
              <ProgressRow label="Bidirectional coverage" value={93} count="1,161 / 1,248" />
              <ProgressRow label="Verification allocated" value={78} count="974 / 1,248" />
              <ProgressRow label="Review participation" value={75} count="9 / 12" />
            </div>
          </div>
          <div className="panel-footer-note">
            <ShieldCheck size={16} /> Gate criteria are configurable and every metric links to source evidence.
          </div>
        </section>

        <section className="panel attention-panel">
          <div className="panel-heading compact">
            <div><span className="panel-kicker">Needs attention</span><h2>Before the gate closes</h2></div>
            <button className="icon-button"><MoreHorizontal size={18} /></button>
          </div>
          <AttentionItem tone="amber" icon={AlertTriangle} title="7 suspect relationships" body="Upstream changes need impact review" action="Inspect" onClick={() => navigate("traceability")} />
          <AttentionItem tone="blue" icon={ClipboardCheck} title="2 approvals outstanding" body="Safety and verification leads" action="Review" onClick={() => navigate("reviews")} />
          <AttentionItem tone="mint" icon={TestTube2} title="14 tests ready to execute" body="HIL cycle AUR-24.11" action="Open" onClick={() => navigate("verification")} />
        </section>

        <section className="panel changes-panel">
          <div className="panel-heading compact">
            <div><span className="panel-kicker">Controlled change</span><h2>Recent changesets</h2></div>
            <button className="text-button" onClick={() => navigate("baselines")}>View history <ArrowRight size={14} /></button>
          </div>
          <div className="commit-list">
            {COMMITS.map((commit, index) => (
              <div className="commit-row" key={commit.id}>
                <div className={`commit-node ${commit.color}`}><GitCommitHorizontal size={15} /></div>
                {index < COMMITS.length - 1 && <div className="commit-line" />}
                <div className="commit-copy">
                  <strong>{commit.title}</strong>
                  <span>{commit.author} • {commit.time}</span>
                </div>
                <div className="commit-meta"><code>{commit.id}</code><span>{commit.files} changes</span></div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel review-mini-panel">
          <div className="review-ribbon">ACTIVE REVIEW</div>
          <div className="review-mini-header"><div className="stacked-avatars"><span>MC</span><span>AP</span><span>+7</span></div><span>9 of 12 complete</span></div>
          <h2>SRR-04 • Flight control requirements</h2>
          <p>Three unresolved comments remain across two requirements.</p>
          <div className="review-progress"><span style={{ width: "75%" }} /></div>
          <button className="secondary-button full-width" onClick={() => navigate("reviews")}>Open review room <ArrowRight size={15} /></button>
        </section>
      </div>

      <section className="foundation-strip">
        <div><span className="panel-kicker">Open foundation</span><strong>Built for ownership, auditability, and deployment choice.</strong></div>
        <TechPill icon={Code2} label="Rust services" detail="Memory-safe core" />
        <TechPill icon={Database} label="PostgreSQL" detail="Immutable revisions" />
        <TechPill icon={Cloud} label="S3 compatible" detail="Portable objects" />
        <TechPill icon={Code2} label="REST / OpenAPI" detail="Versioned contract" />
        <button className="text-button light" onClick={() => navigate("architecture")}>See architecture <ArrowRight size={14} /></button>
      </section>
    </>
  );
}

function MetricCard({ icon: Icon, label, value, delta, tone }) {
  return (
    <div className={`metric-card ${tone}`}>
      <div className="metric-top"><span className="metric-icon"><Icon size={17} /></span><MoreHorizontal size={17} /></div>
      <strong>{value}</strong>
      <span className="metric-label">{label}</span>
      <small>{delta}</small>
    </div>
  );
}

function ProgressRow({ label, value, count }) {
  return (
    <div className="progress-row">
      <div><span>{label}</span><small>{count}</small></div>
      <div className="progress-track"><span style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function AttentionItem({ tone, icon: Icon, title, body, action, onClick }) {
  return (
    <button className="attention-item" onClick={onClick}>
      <span className={`attention-icon ${tone}`}><Icon size={17} /></span>
      <span><strong>{title}</strong><small>{body}</small></span>
      <span className="attention-action">{action} <ArrowRight size={13} /></span>
    </button>
  );
}

function TechPill({ icon: Icon, label, detail }) {
  return <div className="tech-pill"><Icon size={18} /><span><strong>{label}</strong><small>{detail}</small></span></div>;
}

function Storage({ notify }) {
  return (
    <>
      <PageHeader
        eyebrow="Portable object layer • S3 API"
        title="S3-compatible storage"
        description="Keep controlled binaries portable across AWS S3, MinIO, Ceph, R2, and compatible providers."
        actions={<button className="secondary-button" onClick={() => notify("Connection test passed in demo")}><Zap size={15} /> Test connection</button>}
      />
      <div className="storage-grid">
        <section className="panel storage-status">
          <div className="storage-hero-icon"><Cloud size={27} /></div>
          <div><span className="status-pill connected"><CircleDot size={11} /> Connected</span><h2>MinIO pilot cluster</h2><p>Path-style addressing • TLS enabled • us-central-1</p></div>
          <button className="icon-button"><MoreHorizontal size={17} /></button>
          <div className="storage-stats"><div><strong>28.4 GB</strong><span>Objects stored</span></div><div><strong>4,891</strong><span>Immutable objects</span></div><div><strong>100%</strong><span>Checksum verified</span></div></div>
        </section>
        <section className="panel config-panel">
          <div className="panel-heading compact"><div><span className="panel-kicker">Connection profile</span><h2>Portable configuration</h2></div><LockKeyhole size={17} /></div>
          <ConfigRow label="Endpoint" value="https://objects.pilot.internal" />
          <ConfigRow label="Bucket" value="openrm-controlled-objects" />
          <ConfigRow label="Addressing" value="Path style" />
          <ConfigRow label="Encryption" value="SSE-S3" />
          <ConfigRow label="Object lock" value="Optional • disabled" />
        </section>
      </div>
      <section className="panel object-table">
        <div className="panel-heading compact"><div><span className="panel-kicker">Recent objects</span><h2>Controlled files</h2></div><div className="search-box compact"><Search size={15} /><input placeholder="Search objects…" /></div></div>
        <div className="object-head"><span>Object</span><span>Linked artifact</span><span>Integrity</span><span>Size</span><span>Created</span></div>
        <ObjectRow icon={FileCheck2} name="AUR-SRR-04-evidence.pdf" type="application/pdf" linked="BL-006" size="8.2 MB" date="12 min ago" />
        <ObjectRow icon={Archive} name="supplier-interface.reqifz" type="application/reqif+zip" linked="IMPORT-029" size="14.7 MB" date="Yesterday" />
        <ObjectRow icon={FileClock} name="hil-run-109-results.json" type="application/json" linked="RUN-109" size="842 KB" date="Yesterday" />
      </section>
    </>
  );
}

function ConfigRow({ label, value }) {
  return <div className="config-row"><span>{label}</span><code>{value}</code><Check size={14} /></div>;
}

function ObjectRow({ icon: Icon, name, type, linked, size, date }) {
  return <div className="object-row"><span className="object-name"><i><Icon size={17} /></i><span><strong>{name}</strong><small>{type}</small></span></span><code>{linked}</code><span className="integrity-ok"><ShieldCheck size={14} /> SHA-256 verified</span><span>{size}</span><span>{date}</span></div>;
}

function RestApi({ notify }) {
  const endpoints = [
    ["GET", "/v1/projects/{project_id}/requirements", "List controlled requirements", "Read"],
    ["POST", "/v1/projects/{project_id}/requirements", "Create a draft requirement", "Write"],
    ["GET", "/v1/requirements/{requirement_id}/revisions", "Read immutable revision history", "Read"],
    ["POST", "/v1/changesets", "Commit an atomic controlled change", "Write"],
    ["POST", "/v1/baselines", "Create a protected project snapshot", "Governed"],
    ["GET", "/v1/trace/paths", "Traverse typed relationships", "Read"],
  ];

  return (
    <>
      <PageHeader
        eyebrow="Developer platform • REST + OpenAPI 3.1"
        title={<>Automation through an <em>open contract.</em></>}
        description="A resource-oriented JSON API exposes controlled content, revisions, traceability, reviews, baselines, and evidence without coupling clients to the Rust implementation."
        actions={<button className="secondary-button" onClick={() => notify("Illustrative OpenAPI 3.1 contract prepared")}><FileText size={15} /> Export OpenAPI</button>}
      />

      <div className="api-hero-grid">
        <section className="panel api-contract-card">
          <div className="api-contract-heading">
            <span className="api-version">v1</span>
            <div><span className="status-pill connected"><CircleDot size={11} /> CONTRACT READY</span><h2>OpenRM REST API</h2><p>Stable resources, explicit revisions, and consistent HTTP semantics.</p></div>
          </div>
          <div className="api-base-url"><span>Base URL</span><code>https://api.openrm.example/v1</code><button className="icon-button" onClick={() => notify("API base URL copied in demo")}><ClipboardCheck size={15} /></button></div>
          <div className="api-badges"><span>JSON</span><span>OpenAPI 3.1</span><span>OAuth 2.0 / OIDC</span><span>Cursor pagination</span><span>Idempotency keys</span></div>
        </section>

        <section className="panel api-policy-card">
          <div className="panel-heading compact"><div><span className="panel-kicker">Contract guarantees</span><h2>Predictable by design</h2></div><ShieldCheck size={18} /></div>
          <PolicyRow label="Versioning" value="URI major version" />
          <PolicyRow label="Concurrency" value="ETag + If-Match" />
          <PolicyRow label="Errors" value="RFC 9457 problems" />
          <PolicyRow label="Tracing" value="Request + audit IDs" />
          <PolicyRow label="Compatibility" value="Additive within v1" />
        </section>
      </div>

      <section className="panel endpoint-panel">
        <div className="panel-heading compact"><div><span className="panel-kicker">Representative resources</span><h2>REST endpoint catalog</h2></div><span className="roadmap-chip">Illustrative contract</span></div>
        <div className="endpoint-head"><span>Method</span><span>Resource</span><span>Purpose</span><span>Policy</span></div>
        {endpoints.map(([method, path, purpose, policy]) => <EndpointRow key={`${method}-${path}`} method={method} path={path} purpose={purpose} policy={policy} />)}
      </section>

      <div className="api-detail-grid">
        <section className="panel api-example-card">
          <div className="panel-heading compact"><div><span className="panel-kicker">Atomic change example</span><h2>Create a changeset</h2></div><code>application/json</code></div>
          <pre><code>{`POST /v1/changesets
Authorization: Bearer <token>
Idempotency-Key: 782fb6d5-...
If-Match: "project-r42"

{
  "project_id": "AURORA-2",
  "message": "Clarify failover tolerance",
  "operations": [
    { "op": "replace", "artifact": "SYS-184",
      "field": "tolerance", "value": "±2°" }
  ]
}`}</code></pre>
        </section>

        <section className="panel api-principles-card">
          <div className="panel-heading compact"><div><span className="panel-kicker">Interface model</span><h2>REST plus events</h2></div><Activity size={18} /></div>
          <ApiPrinciple icon={Boxes} title="Resource oriented" body="Projects, artifacts, revisions, changesets, baselines, reviews, and evidence have stable URLs." />
          <ApiPrinciple icon={GitCommitHorizontal} title="Revision aware" body="Every mutation creates history; exact states are addressable and never overwritten in place." />
          <ApiPrinciple icon={Zap} title="Webhook complemented" body="Signed, replayable events notify Jira and other consumers after committed state changes." />
          <ApiPrinciple icon={Code2} title="SDK generated" body="OpenAPI drives TypeScript and Rust clients while curl remains a first-class option." />
        </section>
      </div>

      <section className="integration-callout api-callout">
        <div><span className="panel-kicker">Architecture commitment</span><h2>The UI and connectors consume the same public API.</h2><p>No privileged backdoor contract: browser, Jira adapter, CLI, and customer automation share the governed `/v1` surface.</p></div>
        <button className="primary-button" onClick={() => notify("REST API included in the 90-day vertical slice")}>Include API in vertical slice <ArrowRight size={15} /></button>
      </section>
    </>
  );
}

function EndpointRow({ method, path, purpose, policy }) {
  return <div className="endpoint-row"><span className={`method-badge ${method.toLowerCase()}`}>{method}</span><code>{path}</code><span>{purpose}</span><small>{policy}</small></div>;
}

function ApiPrinciple({ icon: Icon, title, body }) {
  return <div className="api-principle"><i><Icon size={16} /></i><span><strong>{title}</strong><small>{body}</small></span></div>;
}

function PolicyRow({ label, value }) {
  return <div className="policy-row"><span>{label}</span><strong>{value}</strong><Check size={14} /></div>;
}

function Architecture() {
  return (
    <>
      <PageHeader
        eyebrow="Open architecture • Self-hostable by design"
        title="A foundation we can own"
        description="A focused modular architecture that favors auditability, portability, and incremental delivery."
      />
      <section className="architecture-map panel">
        <div className="architecture-label">USER EXPERIENCE</div>
        <div className="architecture-layer frontend-layer">
          <ArchitectureBox icon={Code2} label="React + TypeScript" detail="Responsive web workspace" />
          <ArchitectureBox icon={Users} label="OIDC identity" detail="Enterprise SSO ready" />
          <ArchitectureBox icon={Activity} label="API consumers" detail="Web • SDK • CLI • integrations" />
        </div>
        <div className="architecture-arrow"><ArrowRight size={18} /></div>
        <div className="architecture-label">CONTROL PLANE</div>
        <div className="architecture-layer rust-layer">
          <ArchitectureBox icon={ServerCog} label="Rust services" detail="Axum • Tokio • SQLx" feature />
          <ArchitectureBox icon={Code2} label="REST API" detail="/v1 • OpenAPI 3.1 • JSON" feature />
          <ArchitectureBox icon={GitCommitHorizontal} label="Revision engine" detail="Git-style changesets" feature />
          <ArchitectureBox icon={ShieldCheck} label="Policy & audit" detail="RBAC • immutable events" feature />
          <ArchitectureBox icon={PackageCheck} label="Async workers" detail="Imports • reports • webhooks" feature />
        </div>
        <div className="architecture-arrow"><ArrowRight size={18} /></div>
        <div className="architecture-label">VERSIONED INTEGRATION PLANE • JIRA FIRST</div>
        <div className="architecture-layer integration-layer">
          <ArchitectureBox icon={Code2} label="Connector SDK" detail="Rust traits • versioned contracts" />
          <ArchitectureBox icon={ClipboardCheck} label="Jira connector" detail="Planned • issues • status • links" />
          <ArchitectureBox icon={Zap} label="Webhook gateway" detail="Signed events • retry queue" />
        </div>
        <div className="architecture-arrow"><ArrowRight size={18} /></div>
        <div className="architecture-label">PORTABLE DATA PLANE</div>
        <div className="architecture-layer data-layer">
          <ArchitectureBox icon={Database} label="PostgreSQL" detail="Artifacts • revisions • graph" />
          <ArchitectureBox icon={Cloud} label="S3-compatible objects" detail="Attachments • evidence • exports" />
          <ArchitectureBox icon={Archive} label="Open interchange" detail="ReqIF • CSV • JSON" />
        </div>
      </section>
      <div className="architecture-benefits">
        <Benefit number="01" title="Lower switching cost" body="Open formats and portable infrastructure keep product data under organizational control." />
        <Benefit number="02" title="Auditable by construction" body="Immutable revisions and content hashes preserve the exact state behind every decision." />
        <Benefit number="03" title="Fund in stages" body="A modular monolith delivers an MVP quickly without committing to premature distributed complexity." />
      </div>
      <section className="investment-callout">
        <div><span className="panel-kicker">Proposed first investment</span><h2>Fund the 90-day vertical slice.</h2><p>Requirements → relationships → changeset → baseline → evidence-backed management view.</p></div>
        <div className="investment-metrics"><span><strong>3</strong> design partners</span><span><strong>6–8</strong> core team</span><span><strong>90</strong> days to pilot</span></div>
      </section>
    </>
  );
}

function ArchitectureBox({ icon: Icon, label, detail, feature = false }) {
  return <div className={`architecture-box ${feature ? "feature" : ""}`}><Icon size={22} /><span><strong>{label}</strong><small>{detail}</small></span></div>;
}

function Benefit({ number, title, body }) {
  return <div className="benefit-card panel"><span>{number}</span><h3>{title}</h3><p>{body}</p></div>;
}

function TourModal({ step, onClose, onNext, onBack, onExplore }) {
  const item = TOUR_STEPS[step];
  const Icon = item.icon;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Guided product demo">
      <div className="tour-modal">
        <button className="modal-close icon-button" onClick={onClose} aria-label="Close guided demo"><X size={19} /></button>
        <div className="tour-visual">
          <div className="tour-orbit orbit-one" />
          <div className="tour-orbit orbit-two" />
          <div className="tour-icon"><Icon size={38} /></div>
          <span>openRM</span>
        </div>
        <div className="tour-content">
          <div className="eyebrow">{item.eyebrow}</div>
          <h2>{item.title}</h2>
          <p>{item.body}</p>
          <div className="tour-dots">{TOUR_STEPS.map((_, index) => <span key={index} className={index === step ? "active" : ""} />)}</div>
          <div className="tour-actions">
            <button className="secondary-button" disabled={step === 0} onClick={onBack}><ArrowLeft size={15} /> Back</button>
            {step < TOUR_STEPS.length - 1 ? <button className="primary-button" onClick={onNext}>Next <ArrowRight size={15} /></button> : <button className="primary-button" onClick={() => onExplore(item.target)}>Explore architecture <ArrowRight size={15} /></button>}
          </div>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
