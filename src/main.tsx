import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
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
  Filter,
  GitBranch,
  GitCommitHorizontal,
  GitCompareArrows,
  Link2,
  LockKeyhole,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  PackageCheck,
  PanelLeftClose,
  Play,
  Plus,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  TestTube2,
  UserRoundCheck,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import "./styles.css";

type PageHeaderProps = {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};

type TreeRowProps = {
  label: string;
  count: string;
  depth: number;
  open?: boolean;
  active?: boolean;
  strong?: boolean;
  icon?: LucideIcon;
  tone?: string;
};

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: Columns3 },
  { id: "requirements", label: "Requirements", icon: FileText, count: "1,248" },
  { id: "traceability", label: "Traceability", icon: Link2, count: "7" },
  { id: "baselines", label: "Baselines", icon: GitBranch },
  { id: "reviews", label: "Reviews", icon: ClipboardCheck, count: "2" },
  { id: "verification", label: "Verification", icon: TestTube2 },
];

const DELIVERY_ITEMS = [
  { id: "development", label: "Development", icon: Activity, count: "Now" },
];

const PLATFORM_ITEMS = [
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
    window: "Weeks 3–6",
    status: "queued",
    outcome: "Durable authoring and revision history",
  },
  {
    id: "phase-3",
    number: "03",
    name: "Change control",
    window: "Weeks 7–10",
    status: "queued",
    outcome: "Traceability, suspect links, baselines",
  },
  {
    id: "phase-4",
    number: "04",
    name: "Evidence",
    window: "Weeks 11–14",
    status: "queued",
    outcome: "Reviews, approvals, and verification",
  },
  {
    id: "phase-5",
    number: "05",
    name: "Pilot beta",
    window: "Weeks 15–17",
    status: "queued",
    outcome: "Integration, operations, and hardening",
  },
];

const DEVELOPMENT_WORKSTREAMS = [
  {
    name: "Product experience",
    icon: Columns3,
    progress: 78,
    status: "Prototype complete",
    tone: "mint",
    now: "Validate workflows with target users",
  },
  {
    name: "Platform & API",
    icon: ServerCog,
    progress: 40,
    status: "Hosted foundation verified",
    tone: "blue",
    now: "Extend the contract through the Phase 2 requirements slice",
  },
  {
    name: "Data & versioning",
    icon: Database,
    progress: 28,
    status: "Migrations verified",
    tone: "mint",
    now: "Extend the accepted revision model in the Phase 2 vertical slice",
  },
  {
    name: "Security & identity",
    icon: ShieldCheck,
    progress: 48,
    status: "OIDC + policy harness",
    tone: "purple",
    now: "Connect the first deployment identity provider and add key refresh",
  },
  {
    name: "Quality & delivery",
    icon: TestTube2,
    progress: 100,
    status: "Foundation gate green",
    tone: "mint",
    now: "Keep all required checks green on protected main",
  },
  {
    name: "Operations",
    icon: Cloud,
    progress: 40,
    status: "Protected CI active",
    tone: "blue",
    now: "Define the first API environment and secret delivery path",
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
  { id: "REQ-000", horizon: "now", priority: "P1", title: "Decompose the requirements vertical slice", stream: "Product", effort: "2d", status: "Ready" },
  { id: "REQ-001", horizon: "later", priority: "P0", title: "Deliver requirements vertical slice", stream: "Product", effort: "4w", status: "Phase 2" },
  { id: "TRC-001", horizon: "later", priority: "P0", title: "Deliver traceability and baselines", stream: "Product", effort: "4w", status: "Phase 3" },
];

const REQUIREMENTS = [
  {
    id: "SYS-184",
    title: "The controller shall maintain attitude during failover",
    type: "System requirement",
    status: "Approved",
    owner: "M. Chen",
    coverage: 100,
    revision: "r12",
    changed: "2h ago",
    statement:
      "The flight controller shall maintain commanded vehicle attitude within ±2° during a primary compute failover event.",
    rationale:
      "Preserves controlled flight while the redundant compute lane assumes command authority.",
  },
  {
    id: "SYS-203",
    title: "The system shall record all command transitions",
    type: "System requirement",
    status: "In review",
    owner: "A. Patel",
    coverage: 75,
    revision: "r8",
    changed: "4h ago",
    statement:
      "The system shall record command source transitions with a monotonic timestamp and actor identity.",
    rationale: "Enables deterministic reconstruction of operational events and audit evidence.",
  },
  {
    id: "SFT-041",
    title: "Failover shall complete within 150 milliseconds",
    type: "Software requirement",
    status: "Suspect",
    owner: "R. Okafor",
    coverage: 50,
    revision: "r6",
    changed: "Yesterday",
    statement:
      "Software command authority shall transition to the secondary lane within 150 ms of fault confirmation.",
    rationale: "Limits the open-loop interval during compute-lane failover.",
  },
  {
    id: "SFT-052",
    title: "Audit records shall be integrity protected",
    type: "Software requirement",
    status: "Approved",
    owner: "J. Rivera",
    coverage: 100,
    revision: "r4",
    changed: "Oct 31",
    statement:
      "Each audit record shall include an integrity hash chained to the preceding record.",
    rationale: "Makes modification or deletion of controlled evidence detectable.",
  },
  {
    id: "VER-019",
    title: "Verify compute-lane failover timing",
    type: "Verification",
    status: "Planned",
    owner: "S. Brooks",
    coverage: 80,
    revision: "r3",
    changed: "Oct 30",
    statement:
      "Inject a primary compute fault and measure elapsed time until the secondary lane asserts command authority.",
    rationale: "Directly verifies the 150 ms failover performance requirement.",
  },
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

const TRACE_NODES = [
  {
    id: "NEED-07",
    label: "Maintain controlled flight",
    type: "Stakeholder need",
    x: 7,
    y: 38,
    tone: "purple",
    status: "covered",
  },
  {
    id: "SYS-184",
    label: "Maintain attitude during failover",
    type: "System requirement",
    x: 29,
    y: 17,
    tone: "blue",
    status: "covered",
  },
  {
    id: "SFT-041",
    label: "Failover within 150 ms",
    type: "Software requirement",
    x: 51,
    y: 38,
    tone: "amber",
    status: "suspect",
  },
  {
    id: "VER-019",
    label: "Verify failover timing",
    type: "Verification",
    x: 73,
    y: 17,
    tone: "mint",
    status: "covered",
  },
  {
    id: "RUN-109",
    label: "HIL failover test run",
    type: "Test run",
    x: 73,
    y: 63,
    tone: "green",
    status: "passed",
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
  const [selectedRequirement, setSelectedRequirement] = useState(REQUIREMENTS[0]);
  const [selectedTrace, setSelectedTrace] = useState(TRACE_NODES[2]);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [reviewApproved, setReviewApproved] = useState(false);

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
    selectedRequirement,
    setSelectedRequirement,
    selectedTrace,
    setSelectedTrace,
    reviewApproved,
    setReviewApproved,
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
            <span>{page === "development" ? "OpenRM program" : "Aurora Flight Computer"}</span>
            <ChevronRight size={14} />
            <strong>{currentLabel}</strong>
          </div>
          <div className="topbar-actions">
            <span className="illustrative-chip"><CircleDot size={12} /> {page === "development" ? "Planning baseline" : "Illustrative data"}</span>
            <button className="ghost-button project-button">
              {page === "development" ? "PROGRAM" : "AURORA-2"} <ChevronDown size={14} />
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
          {page === "requirements" && <Requirements {...pageProps} />}
          {page === "traceability" && <Traceability {...pageProps} />}
          {page === "baselines" && <Baselines {...pageProps} />}
          {page === "reviews" && <Reviews {...pageProps} />}
          {page === "verification" && <Verification {...pageProps} />}
          {page === "storage" && <Storage {...pageProps} />}
          {page === "api" && <RestApi {...pageProps} />}
          {page === "integrations" && <Integrations {...pageProps} />}
          {page === "architecture" && <Architecture />}
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
            <div className="brand-name">open<span>CM</span></div>
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
      await navigator.clipboard.writeText(`OpenRM Phase 2 — current sprint\n${brief}`);
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
            <span className="phase-chip complete"><span /> Phase 1 complete</span>
            <span className="baseline-date">17-week beta path</span>
          </div>
          <p className="panel-kicker">Current delivery objective</p>
          <h2>Build the requirements vertical slice on a protected foundation.</h2>
          <p>
            The TypeScript client, Rust service, PostgreSQL migrations, generated contract, authentication policy,
            and dependency audits pass in hosted CI. Main is protected by the web, API, and database checks, closing
            Phase 1 and making the durable requirements workflow the next delivery gate.
          </p>
          <div className="command-meta">
            <span><GitBranch size={14} /> Stage: Foundation complete</span>
            <span><BadgeCheck size={14} /> Next gate: requirements vertical slice</span>
          </div>
        </div>
        <div className="gate-card">
          <div className="gate-card-head">
            <div>
              <span>Phase 1 foundation gate</span>
              <strong>7 / 7 evidence checks</strong>
            </div>
            <div className="gate-score complete">100%</div>
          </div>
          <div className="gate-checks">
            <span className="complete"><CheckCircle2 size={13} /> Clean workspace bootstraps</span>
            <span className="complete"><CheckCircle2 size={13} /> Migrations and seed verified</span>
            <span className="complete"><CheckCircle2 size={13} /> Authenticated API reaches data</span>
            <span className="complete"><CheckCircle2 size={13} /> Contract generates web client</span>
            <span className="complete"><CheckCircle2 size={13} /> Local quality and audits pass</span>
            <span className="complete"><CheckCircle2 size={13} /> Hosted CI passes all jobs</span>
            <span className="complete"><CheckCircle2 size={13} /> Main requires green checks</span>
          </div>
        </div>
      </section>

      <div className="development-metrics">
        <DeliveryMetric icon={Columns3} value="10 / 10" label="Prototype surfaces" detail="Interaction model represented" tone="mint" />
        <DeliveryMetric icon={ServerCog} value="1 / 6" label="Production services" detail="API foundation verified in hosted CI" tone="blue" />
        <DeliveryMetric icon={TestTube2} value="3 / 3" label="Required CI jobs" detail="Web, API, and database-path" tone="mint" />
        <DeliveryMetric icon={AlertTriangle} value="4" label="Program risks" detail="Decisions accepted; controls remain" tone="red" />
      </div>

      <section className="delivery-roadmap panel">
        <div className="panel-heading development-heading">
          <div>
            <span className="panel-kicker">Release path</span>
            <h2>Six evidence gates to pilot beta</h2>
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
        <p><strong>Source of truth:</strong> Phase 1 closed on 8 November 2026 with green hosted CI and protected-main enforcement. Phase 2 is ready for decomposition; replace static constants with delivery APIs as implementation proceeds.</p>
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

function Requirements({ selectedRequirement, setSelectedRequirement, notify }) {
  return (
    <>
      <PageHeader
        eyebrow="Controlled content • 1,248 artifacts"
        title="Requirements workspace"
        description="Author, relate, review, and version every requirement from one controlled workspace."
        actions={<button className="primary-button" onClick={() => notify("New requirement draft opened")}><Plus size={16} /> New requirement</button>}
      />
      <div className="workspace-toolbar">
        <div className="search-box"><Search size={16} /><input aria-label="Search requirements" placeholder="Search ID, title, or text…" /></div>
        <button className="filter-button"><Filter size={15} /> Type: All <ChevronDown size={13} /></button>
        <button className="filter-button">Status: Active <ChevronDown size={13} /></button>
        <button className="filter-button">Owner: Anyone <ChevronDown size={13} /></button>
        <span className="toolbar-spacer" />
        <button className="icon-button"><Columns3 size={17} /></button>
        <button className="icon-button"><MoreHorizontal size={17} /></button>
      </div>

      <div className="requirements-shell">
        <aside className="requirements-tree panel">
          <div className="tree-header"><span>Project structure</span><Plus size={15} /></div>
          <TreeRow label="Aurora Flight Computer" count="1,248" depth={0} open strong />
          <TreeRow label="01 • Stakeholder needs" count="48" depth={1} />
          <TreeRow label="02 • System requirements" count="312" depth={1} open active />
          <TreeRow label="Flight controls" count="86" depth={2} />
          <TreeRow label="Navigation" count="74" depth={2} />
          <TreeRow label="Telemetry" count="56" depth={2} />
          <TreeRow label="03 • Software requirements" count="624" depth={1} />
          <TreeRow label="04 • Verification" count="264" depth={1} />
          <div className="saved-view-label">SAVED VIEWS</div>
          <TreeRow label="My assigned items" count="18" depth={0} icon={UserRoundCheck} />
          <TreeRow label="Suspect relationships" count="7" depth={0} icon={AlertTriangle} tone="amber" />
        </aside>

        <section className="requirements-table panel">
          <div className="table-head"><span>ID</span><span>Requirement</span><span>Status</span><span>Coverage</span><span>Owner</span></div>
          {REQUIREMENTS.map((req) => (
            <button
              key={req.id}
              className={`requirement-row ${selectedRequirement.id === req.id ? "selected" : ""}`}
              onClick={() => setSelectedRequirement(req)}
            >
              <code>{req.id}</code>
              <span className="requirement-title"><strong>{req.title}</strong><small>{req.type} • {req.revision} • {req.changed}</small></span>
              <StatusPill status={req.status} />
              <span className="coverage-cell"><span><i style={{ width: `${req.coverage}%` }} /></span><small>{req.coverage}%</small></span>
              <span className="owner-cell"><i>{req.owner.split(" ").map((n) => n[0]).join("")}</i>{req.owner}</span>
            </button>
          ))}
        </section>

        <aside className="requirement-inspector panel">
          <div className="inspector-header"><div><code>{selectedRequirement.id}</code><StatusPill status={selectedRequirement.status} /></div><button className="icon-button"><MoreHorizontal size={17} /></button></div>
          <h2>{selectedRequirement.title}</h2>
          <div className="inspector-section"><label>Statement</label><p>{selectedRequirement.statement}</p></div>
          <div className="inspector-section"><label>Rationale</label><p>{selectedRequirement.rationale}</p></div>
          <div className="inspector-grid">
            <div><label>Owner</label><strong>{selectedRequirement.owner}</strong></div>
            <div><label>Revision</label><strong>{selectedRequirement.revision}</strong></div>
            <div><label>Verification</label><strong>{selectedRequirement.coverage}%</strong></div>
            <div><label>Priority</label><strong>Critical</strong></div>
          </div>
          <div className="relationship-summary">
            <div><Link2 size={15} /><span><strong>3</strong> upstream</span></div>
            <div><ArrowRight size={15} /><span><strong>5</strong> downstream</span></div>
          </div>
          <div className="revision-note"><GitCommitHorizontal size={15} /><span><strong>Last change</strong> in <code>c8a71f2</code><small>Clarified tolerance • Maya Chen</small></span></div>
          <button className="secondary-button full-width" onClick={() => notify(`${selectedRequirement.id} opened in editor`)}>Open controlled editor <ArrowRight size={15} /></button>
        </aside>
      </div>
    </>
  );
}

function TreeRow({ label, count, depth, open = false, active = false, strong = false, icon: CustomIcon, tone = "" }: TreeRowProps) {
  const Icon = CustomIcon || (open ? ChevronDown : ChevronRight);
  return (
    <button className={`tree-row ${active ? "active" : ""} ${strong ? "strong" : ""} ${tone || ""}`} style={{ paddingLeft: `${14 + depth * 16}px` }}>
      <Icon size={14} /><span>{label}</span><small>{count}</small>
    </button>
  );
}

function StatusPill({ status }) {
  const slug = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-pill ${slug}`}>{status === "Approved" && <Check size={11} />}{status === "Suspect" && <AlertTriangle size={11} />}{status}</span>;
}

function Traceability({ selectedTrace, setSelectedTrace, notify }) {
  return (
    <>
      <PageHeader
        eyebrow="Digital thread • Live impact analysis"
        title="Traceability"
        description="Navigate design intent from stakeholder need to objective verification evidence."
        actions={
          <>
            <button className="secondary-button"><Filter size={15} /> Configure view</button>
            <button className="primary-button" onClick={() => notify("Trace report queued for export")}>Export trace report <ArrowRight size={15} /></button>
          </>
        }
      />
      <div className="trace-toolbar panel">
        <div className="search-box"><Search size={16} /><input value="SYS-184" readOnly aria-label="Trace root" /></div>
        <div className="trace-direction"><button className="active">Both directions</button><button>Upstream</button><button>Downstream</button></div>
        <span className="toolbar-spacer" />
        <span className="legend-dot covered">Covered</span>
        <span className="legend-dot suspect">Suspect</span>
        <span className="legend-dot gap">Gap</span>
      </div>
      <div className="trace-layout">
        <section className="trace-canvas panel">
          <div className="canvas-label">TRACE VIEW • 5 OF 23 RELATED ARTIFACTS</div>
          <svg className="trace-lines" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
            <path d="M160 250 C245 250 250 145 340 145" />
            <path d="M425 145 C485 145 485 250 555 250" />
            <path className="suspect-line" d="M640 250 C705 250 705 145 775 145" />
            <path d="M640 270 C705 270 705 375 775 375" />
            <path d="M820 185 L820 335" />
          </svg>
          {TRACE_NODES.map((node) => (
            <button
              key={node.id}
              className={`trace-node ${node.tone} ${selectedTrace.id === node.id ? "selected" : ""}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => setSelectedTrace(node)}
            >
              <span className="trace-node-top"><code>{node.id}</code><i className={node.status} /></span>
              <strong>{node.label}</strong>
              <small>{node.type}</small>
            </button>
          ))}
          <div className="canvas-controls"><button><Plus size={15} /></button><button>−</button><button><PanelLeftClose size={14} /></button></div>
        </section>

        <aside className="trace-inspector panel">
          <div className="panel-kicker">Selected artifact</div>
          <div className="trace-selected-id"><code>{selectedTrace.id}</code><span className={`status-pill ${selectedTrace.status}`}>{selectedTrace.status}</span></div>
          <h2>{selectedTrace.label}</h2>
          <p>This artifact participates in the controlled digital thread for compute-lane failover.</p>
          <div className="impact-card">
            <AlertTriangle size={17} />
            <div><strong>Impact review required</strong><span>Upstream requirement changed in <code>c8a71f2</code></span></div>
          </div>
          <div className="trace-stats"><div><strong>2</strong><span>Upstream</span></div><div><strong>3</strong><span>Downstream</span></div><div><strong>1</strong><span>Open impact</span></div></div>
          <div className="inspector-section"><label>Relationship path</label><div className="path-list"><span>System requirement</span><ArrowRight size={13} /><span>Software requirement</span><ArrowRight size={13} /><span>Verification</span></div></div>
          <button className="primary-button full-width" onClick={() => notify("Impact marked reviewed in demo")}>Resolve impact <Check size={15} /></button>
        </aside>
      </div>
      <div className="trace-summary-grid">
        <MiniStat icon={BadgeCheck} value="93%" label="Bidirectional coverage" />
        <MiniStat icon={Link2} value="4,862" label="Controlled relationships" />
        <MiniStat icon={AlertTriangle} value="7" label="Suspect links" warning />
        <MiniStat icon={Archive} value="0" label="Orphan artifacts" />
      </div>
    </>
  );
}

function MiniStat({ icon: Icon, value, label, warning = false }) {
  return <div className={`mini-stat panel ${warning ? "warning" : ""}`}><Icon size={18} /><strong>{value}</strong><span>{label}</span></div>;
}

function Baselines({ notify }) {
  const [selected, setSelected] = useState("BL-006");
  const baselines = [
    { id: "BL-006", name: "SRR candidate", date: "Nov 5, 2026", commit: "c8a71f2", artifacts: "1,248", locked: true },
    { id: "BL-005", name: "Requirements freeze", date: "Oct 18, 2026", commit: "6bd11ae", artifacts: "1,210", locked: true },
    { id: "BL-004", name: "Architecture review", date: "Sep 26, 2026", commit: "48fd120", artifacts: "1,083", locked: true },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Controlled history • Immutable snapshots"
        title="Baselines & changesets"
        description="Freeze decision points, compare exact states, and reconstruct every controlled change."
        actions={<button className="primary-button" onClick={() => notify("Baseline creation wizard opened")}><Plus size={16} /> Create baseline</button>}
      />
      <div className="baseline-grid">
        <section className="panel baseline-list">
          <div className="panel-heading compact"><div><span className="panel-kicker">Protected baselines</span><h2>Project history</h2></div><button className="icon-button"><Filter size={16} /></button></div>
          {baselines.map((baseline) => (
            <button key={baseline.id} className={`baseline-card ${selected === baseline.id ? "selected" : ""}`} onClick={() => setSelected(baseline.id)}>
              <span className="baseline-icon"><LockKeyhole size={17} /></span>
              <span><code>{baseline.id}</code><strong>{baseline.name}</strong><small>{baseline.date} • {baseline.artifacts} artifacts</small></span>
              <span className="baseline-commit"><GitCommitHorizontal size={13} /> {baseline.commit}</span>
              <ChevronRight size={16} />
            </button>
          ))}
        </section>

        <section className="panel compare-panel">
          <div className="compare-header">
            <div><span className="panel-kicker">Baseline comparison</span><h2>BL-005 <GitCompareArrows size={18} /> BL-006</h2></div>
            <button className="secondary-button" onClick={() => notify("Comparison report exported")}>Export comparison</button>
          </div>
          <div className="diff-summary">
            <div className="added"><strong>+38</strong><span>Added</span></div>
            <div className="modified"><strong>24</strong><span>Modified</span></div>
            <div className="removed"><strong>−0</strong><span>Removed</span></div>
            <div><strong>6</strong><span>Relationship changes</span></div>
          </div>
          <div className="diff-list">
            <DiffRow id="SYS-184" title="Maintain attitude during failover" change="Tolerance clarified from ±3° to ±2°" type="modified" />
            <DiffRow id="SYS-203" title="Record all command transitions" change="New audit requirement added" type="added" />
            <DiffRow id="SFT-041" title="Failover within 150 milliseconds" change="Verification method changed" type="modified" />
            <DiffRow id="VER-019" title="Verify compute-lane failover timing" change="HIL procedure allocated" type="added" />
          </div>
        </section>

        <section className="panel branch-panel">
          <div className="panel-heading compact"><div><span className="panel-kicker">Changeset graph</span><h2>Protected main line</h2></div><span className="branch-chip"><GitBranch size={13} /> main</span></div>
          <div className="branch-timeline">
            {[
              ["c8a71f2", "SRR candidate baseline", "Today", "baseline"],
              ["89d4b10", "Resolve review comments", "Today", "commit"],
              ["17ec2aa", "Import supplier requirements", "Yesterday", "commit"],
              ["6bd11ae", "Requirements freeze", "Oct 18", "baseline"],
            ].map(([id, title, date, type], index) => (
              <div className="branch-event" key={id}><span className={`branch-node ${type}`} />{index < 3 && <span className="branch-line" />}<code>{id}</code><strong>{title}</strong><small>{date}</small>{type === "baseline" && <span className="baseline-tag"><LockKeyhole size={11} /> baseline</span>}</div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function DiffRow({ id, title, change, type }) {
  return <div className="diff-row"><span className={`diff-mark ${type}`}>{type === "added" ? "+" : "~"}</span><code>{id}</code><span><strong>{title}</strong><small>{change}</small></span><ChevronRight size={16} /></div>;
}

function Reviews({ notify, reviewApproved, setReviewApproved }) {
  const participants = [
    ["Maya Chen", "Systems engineering", "Approved", "MC"],
    ["Arun Patel", "Software lead", "Approved", "AP"],
    ["Renee Okafor", "Safety engineering", reviewApproved ? "Approved" : "Pending", "RO"],
    ["Sam Brooks", "Verification lead", "In progress", "SB"],
  ];
  const complete = reviewApproved ? 10 : 9;
  return (
    <>
      <PageHeader
        eyebrow="Decision workflow • Commit c8a71f2"
        title="Review room"
        description="Collect structured feedback and approvals against an exact, immutable content state."
        actions={<button className="secondary-button"><MessageSquareText size={15} /> 3 open comments</button>}
      />
      <div className="review-layout">
        <section className="panel review-main">
          <div className="review-title-row">
            <div><span className="status-pill in-review">IN REVIEW</span><h2>SRR-04 • Flight control requirements</h2><p>System requirements review for the Aurora-2 flight control baseline.</p></div>
            <div className="due-card"><span>Due</span><strong>Nov 13</strong><small>7 days remaining</small></div>
          </div>
          <div className="review-stat-row">
            <div><strong>{complete}<span>/12</span></strong><small>Participants complete</small></div>
            <div><strong>1,248</strong><small>Artifacts in scope</small></div>
            <div><strong>3</strong><small>Open comments</small></div>
            <div><strong>2</strong><small>Changes requested</small></div>
          </div>
          <div className="large-progress"><span style={{ width: `${(complete / 12) * 100}%` }} /></div>
          <div className="participant-header"><span>Participants</span><span>Role</span><span>Decision</span></div>
          {participants.map(([name, role, decision, initials]) => (
            <div className="participant-row" key={name}>
              <span className="person"><i>{initials}</i><strong>{name}</strong></span>
              <span>{role}</span>
              <StatusPill status={decision} />
            </div>
          ))}
        </section>

        <aside className="panel approval-panel">
          <div className="approval-icon"><ShieldCheck size={28} /></div>
          <span className="panel-kicker">Your decision</span>
          <h2>{reviewApproved ? "Approval recorded" : "Ready for your approval?"}</h2>
          <p>{reviewApproved ? "This illustrative approval is bound to changeset c8a71f2." : "Your decision will be cryptographically bound to the reviewed changeset and recorded in the audit trail."}</p>
          <div className="commit-bound"><GitCommitHorizontal size={16} /><span>Bound changeset<code>c8a71f2</code></span><LockKeyhole size={14} /></div>
          {!reviewApproved ? (
            <>
              <button className="primary-button full-width" onClick={() => { setReviewApproved(true); notify("Illustrative approval recorded"); }}><CheckCircle2 size={16} /> Record demo approval</button>
              <button className="secondary-button full-width">Request changes</button>
            </>
          ) : <div className="approval-success"><BadgeCheck size={20} /> Signed by GJ • just now</div>}
          <small className="demo-disclaimer">Demo only — no real electronic signature is created.</small>
        </aside>
      </div>

      <section className="panel comment-panel">
        <div className="panel-heading compact"><div><span className="panel-kicker">Discussion</span><h2>Open review comments</h2></div><button className="filter-button">All comments <ChevronDown size={13} /></button></div>
        <Comment author="Renee Okafor" initials="RO" id="SFT-041" text="Please provide the analysis supporting the 150 ms allocation before approval." time="38 min ago" replies={2} />
        <Comment author="Sam Brooks" initials="SB" id="VER-019" text="HIL procedure is drafted. I need the final fault-injection trigger definition." time="1h ago" replies={1} />
      </section>
    </>
  );
}

function Comment({ author, initials, id, text, time, replies }) {
  return <div className="comment"><span className="comment-avatar">{initials}</span><div><div className="comment-meta"><strong>{author}</strong><code>{id}</code><span>{time}</span></div><p>{text}</p><button className="text-button"><MessageSquareText size={13} /> {replies} replies</button></div><button className="icon-button"><MoreHorizontal size={16} /></button></div>;
}

function Verification({ notify }) {
  const tests = [
    ["RUN-109", "Primary compute failover — nominal load", "Passed", "132 ms", "S. Brooks"],
    ["RUN-110", "Primary compute failover — peak load", "Passed", "147 ms", "S. Brooks"],
    ["RUN-111", "Failover during telemetry burst", "In progress", "—", "L. Gomez"],
    ["RUN-112", "Repeated failover recovery", "Blocked", "—", "L. Gomez"],
  ];
  return (
    <>
      <PageHeader
        eyebrow="Verification cycle • AUR-24.11"
        title="Evidence, tied to intent"
        description="Plan, execute, and report verification with direct links to the requirements being proven."
        actions={<button className="primary-button" onClick={() => notify("Test run execution opened")}><Play size={15} /> Execute next run</button>}
      />
      <div className="verification-grid">
        <section className="panel cycle-hero">
          <div><span className="panel-kicker">Active cycle</span><h2>Flight control HIL qualification</h2><p>14 of 20 runs complete • ends Nov 12</p></div>
          <div className="cycle-donut"><strong>70%</strong><span>complete</span></div>
          <div className="result-legend"><span><i className="pass" /> 11 passed</span><span><i className="fail" /> 1 failed</span><span><i className="block" /> 2 blocked</span><span><i className="open" /> 6 open</span></div>
        </section>
        <MiniStat icon={PackageCheck} value="97%" label="Requirements allocated" />
        <MiniStat icon={TestTube2} value="184" label="Test cases" />
        <MiniStat icon={AlertTriangle} value="1" label="Failed run" warning />
      </div>
      <section className="panel test-table">
        <div className="panel-heading compact"><div><span className="panel-kicker">Test execution</span><h2>Current cycle</h2></div><div className="search-box compact"><Search size={15} /><input placeholder="Find a run…" /></div></div>
        <div className="test-table-head"><span>Run</span><span>Procedure</span><span>Result</span><span>Measured</span><span>Owner</span></div>
        {tests.map(([id, name, status, measured, owner]) => <div className="test-row" key={id}><code>{id}</code><span><strong>{name}</strong><small>Verifies SFT-041 • revision r6</small></span><StatusPill status={status} /><strong>{measured}</strong><span>{owner}</span></div>)}
      </section>
    </>
  );
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

function Integrations({ notify }) {
  return (
    <>
      <PageHeader
        eyebrow="Integration roadmap • Connector framework"
        title={<>Connect delivery work to <em>controlled intent.</em></>}
        description="A planned Jira Software connector keeps execution visible without making Jira the system of record for requirements, baselines, or approvals."
        actions={<button className="secondary-button" onClick={() => notify("Jira connector design review added to the roadmap")}><ClipboardCheck size={15} /> Review connector plan</button>}
      />

      <div className="integration-hero-grid">
        <section className="panel connector-card jira-card">
          <div className="connector-heading">
            <div className="jira-mark" aria-hidden="true">J</div>
            <div><span className="status-pill planned">PLANNED • PHASE 2</span><h2>Jira Software Cloud + Data Center</h2><p>Bidirectional issue links and governed status synchronization.</p></div>
          </div>
          <div className="connector-capabilities">
            <ConnectorCapability icon={Link2} title="Stable links" body="Relate Jira epics, stories, and defects to controlled OpenRM artifacts." />
            <ConnectorCapability icon={Activity} title="Status signals" body="Bring delivery state into readiness views through approved mapping rules." />
            <ConnectorCapability icon={MessageSquareText} title="Change context" body="Post revision and baseline references back to Jira without copying controlled content." />
          </div>
          <div className="connector-note"><ShieldCheck size={16} /><span><strong>Governance boundary</strong>OpenRM remains authoritative for requirements, revisions, baselines, approvals, and audit evidence.</span></div>
        </section>

        <section className="panel connector-policy-card">
          <div className="panel-heading compact"><div><span className="panel-kicker">Connection policy</span><h2>Secure by default</h2></div><LockKeyhole size={18} /></div>
          <PolicyRow label="Authentication" value="OAuth 2.0 / scoped PAT" />
          <PolicyRow label="Inbound events" value="Signed webhooks" />
          <PolicyRow label="Outbound writes" value="Allowlisted fields" />
          <PolicyRow label="Reliability" value="Idempotent retry queue" />
          <PolicyRow label="Audit" value="Actor + payload hash" />
        </section>
      </div>

      <div className="integration-detail-grid">
        <section className="panel mapping-panel">
          <div className="panel-heading compact"><div><span className="panel-kicker">Proposed data contract</span><h2>Jira mapping preview</h2></div><span className="roadmap-chip">Configurable per project</span></div>
          <div className="mapping-head"><span>OpenRM</span><span>Direction</span><span>Jira</span><span>Rule</span></div>
          <MappingRow source="Artifact link" direction="↔" target="Remote issue link" rule="Stable IDs only" />
          <MappingRow source="Owner" direction="←" target="Assignee" rule="Identity mapping" />
          <MappingRow source="Delivery state" direction="←" target="Status" rule="Mapped vocabulary" />
          <MappingRow source="Revision reference" direction="→" target="Comment / field" rule="No requirement text" />
          <MappingRow source="Suspect link" direction="→" target="Flag / label" rule="Optional automation" />
        </section>

        <section className="panel roadmap-panel">
          <div className="panel-heading compact"><div><span className="panel-kicker">Incremental delivery</span><h2>Connector roadmap</h2></div><GitBranch size={18} /></div>
          <RoadmapStep number="01" phase="Foundation" title="Connector SDK" body="Versioned adapter contract, secret references, health checks, and audit events." />
          <RoadmapStep number="02" phase="Jira pilot" title="Link + status sync" body="One design-partner project, configurable mappings, dry-run mode, and replayable webhooks." active />
          <RoadmapStep number="03" phase="Scale" title="Governed automation" body="Approval-aware writes, admin templates, metrics, and additional ALM connectors." />
        </section>
      </div>

      <section className="integration-callout">
        <div><span className="panel-kicker">Funding message</span><h2>Jira is the first adapter—not a one-off integration.</h2><p>The same Rust connector contract can support Azure DevOps, GitHub, GitLab, and other delivery systems later.</p></div>
        <button className="primary-button" onClick={() => notify("Connector SDK included in the proposed vertical slice")}>Include in vertical slice <ArrowRight size={15} /></button>
      </section>
    </>
  );
}

function ConnectorCapability({ icon: Icon, title, body }) {
  return <div className="connector-capability"><i><Icon size={17} /></i><span><strong>{title}</strong><small>{body}</small></span></div>;
}

function PolicyRow({ label, value }) {
  return <div className="policy-row"><span>{label}</span><strong>{value}</strong><Check size={14} /></div>;
}

function MappingRow({ source, direction, target, rule }) {
  return <div className="mapping-row"><strong>{source}</strong><span className="mapping-direction">{direction}</span><strong>{target}</strong><small>{rule}</small></div>;
}

function RoadmapStep({ number, phase, title, body, active = false }) {
  return <div className={`roadmap-step ${active ? "active" : ""}`}><span className="roadmap-number">{number}</span><span><small>{phase}</small><strong>{title}</strong><p>{body}</p></span></div>;
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
