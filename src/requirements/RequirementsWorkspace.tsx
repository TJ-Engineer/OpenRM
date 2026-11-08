/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- Effects synchronize remote API state. */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  FileClock,
  Folder,
  GitCompareArrows,
  History,
  Plus,
  RefreshCw,
  Save,
  Search,
  Tags,
  Upload,
  X,
} from "lucide-react";

import { resolveApiBaseUrl, sessionHeaders } from "../api/client";
import type { components } from "../api/generated";

type Project = components["schemas"]["Project"];
type Requirement = components["schemas"]["Requirement"];
type RequirementRevision = components["schemas"]["RequirementRevision"];
type RequirementComparison = components["schemas"]["RequirementComparison"];
type CreateRequirement = components["schemas"]["CreateRequirementRequest"];
type WorkspaceItem = Record<string, unknown> & { id?: string; name?: string; color?: string };

type RequirementsWorkspaceProps = {
  notify: (message: string) => void;
};

const DEFAULT_ORGANIZATION = "00000000-0000-4000-8000-000000000001";
const DEFAULT_PROJECT = "00000000-0000-4000-8000-000000000101";
const DEFAULT_TOKEN = "dev:local-user";

const PREVIEW_REQUIREMENTS: Requirement[] = [
  {
    id: "00000000-0000-4000-8000-000000000201",
    project_id: DEFAULT_PROJECT,
    key: "SYS-184",
    title: "Maintain attitude during failover",
    statement: "The flight controller shall maintain commanded vehicle attitude within ±2° during failover.",
    attributes: { priority: "critical" },
    folder_id: null,
    tag_ids: [],
    revision: 12,
    created_by: "preview-user",
    created_at: "2026-11-01T12:00:00Z",
    updated_at: "2026-11-08T12:00:00Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000202",
    project_id: DEFAULT_PROJECT,
    key: "SYS-203",
    title: "Record command transitions",
    statement: "The system shall record command transitions with a monotonic timestamp and actor identity.",
    attributes: { priority: "high" },
    folder_id: null,
    tag_ids: [],
    revision: 8,
    created_by: "preview-user",
    created_at: "2026-11-01T12:00:00Z",
    updated_at: "2026-11-08T11:00:00Z",
  },
];

function runtimeConfig() {
  return {
    baseUrl: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
    organizationId: import.meta.env.VITE_OPENRM_ORGANIZATION_ID || DEFAULT_ORGANIZATION,
    projectId: import.meta.env.VITE_OPENRM_PROJECT_ID || DEFAULT_PROJECT,
    token: import.meta.env.VITE_OPENRM_TOKEN || DEFAULT_TOKEN,
  };
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = runtimeConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      ...sessionHeaders(config.token, config.organizationId),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.error?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export function RequirementsWorkspace({ notify }: RequirementsWorkspaceProps) {
  const config = runtimeConfig();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState(config.projectId);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [folders, setFolders] = useState<WorkspaceItem[]>([]);
  const [tags, setTags] = useState<WorkspaceItem[]>([]);
  const [savedViews, setSavedViews] = useState<WorkspaceItem[]>([]);
  const [revisions, setRevisions] = useState<RequirementRevision[]>([]);
  const [comparison, setComparison] = useState<RequirementComparison | null>(null);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [mode, setMode] = useState<"loading" | "live" | "preview">("loading");
  const [error, setError] = useState("");
  const [editor, setEditor] = useState<"create" | "edit" | null>(null);
  const [busy, setBusy] = useState(false);
  const importInput = useRef<HTMLInputElement>(null);
  const pageSize = 25;

  const selected = useMemo(
    () => requirements.find((requirement) => requirement.id === selectedId) || requirements[0] || null,
    [requirements, selectedId],
  );

  const loadProjects = async () => {
    try {
      const response = await apiRequest<{ items: Project[] }>("/api/v1/projects");
      setProjects(response.items);
      if (!response.items.some((project) => project.id === projectId) && response.items[0]) {
        setProjectId(response.items[0].id);
      }
      setMode("live");
    } catch {
      setProjects([
        {
          id: DEFAULT_PROJECT,
          key: "AURORA-2",
          name: "Aurora Flight Computer",
          description: "Static preview fallback",
          created_at: "2026-11-01T12:00:00Z",
        },
      ]);
      setRequirements(PREVIEW_REQUIREMENTS);
      setTotal(PREVIEW_REQUIREMENTS.length);
      setSelectedId(PREVIEW_REQUIREMENTS[0].id);
      setMode("preview");
    }
  };

  const loadWorkspace = async () => {
    if (mode === "preview") return;
    setError("");
    const query = new URLSearchParams({ limit: String(pageSize), offset: String(offset) });
    if (search.trim()) query.set("search", search.trim());
    if (folderFilter) query.set("folder_id", folderFilter);
    if (tagFilter) query.set("tag_id", tagFilter);
    try {
      const [requirementPage, folderPage, tagPage, savedViewPage] = await Promise.all([
        apiRequest<{ items: Requirement[]; total: number }>(
          `/api/v1/projects/${projectId}/requirements?${query}`,
        ),
        apiRequest<{ items: WorkspaceItem[] }>(`/api/v1/projects/${projectId}/workspace/folders`),
        apiRequest<{ items: WorkspaceItem[] }>(`/api/v1/projects/${projectId}/workspace/tags`),
        apiRequest<{ items: WorkspaceItem[] }>(`/api/v1/projects/${projectId}/workspace/saved-views`),
      ]);
      setRequirements(requirementPage.items);
      setTotal(requirementPage.total);
      setFolders(folderPage.items);
      setTags(tagPage.items);
      setSavedViews(savedViewPage.items);
      setSelectedId((current) =>
        requirementPage.items.some((requirement) => requirement.id === current)
          ? current
          : requirementPage.items[0]?.id || null,
      );
      setMode("live");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load requirements");
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  useEffect(() => {
    if (mode !== "loading") void loadWorkspace();
  }, [projectId, offset, folderFilter, tagFilter, mode]);

  useEffect(() => {
    if (!selected || mode !== "live") {
      setRevisions([]);
      setComparison(null);
      return;
    }
    void apiRequest<{ items: RequirementRevision[] }>(
      `/api/v1/projects/${projectId}/requirements/${selected.id}/revisions`,
    )
      .then((response) => setRevisions(response.items))
      .catch(() => setRevisions([]));
  }, [selected?.id, selected?.revision, projectId, mode]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setOffset(0);
    void loadWorkspace();
  };

  const saveView = async () => {
    if (mode !== "live") return notify("Saved views require a running API");
    const name = window.prompt("Saved view name", search ? `Search: ${search}` : "Current requirements");
    if (!name) return;
    try {
      await apiRequest(`/api/v1/projects/${projectId}/workspace/saved-views`, {
        method: "POST",
        body: JSON.stringify({ name, filters: { search, folder_id: folderFilter || null, tag_id: tagFilter || null } }),
      });
      notify("Saved view created");
      await loadWorkspace();
    } catch (requestError) {
      notify(requestError instanceof Error ? requestError.message : "Could not save view");
    }
  };

  const exportRequirements = async () => {
    if (mode !== "live") return notify("Export requires a running API");
    try {
      const payload = await apiRequest(`/api/v1/projects/${projectId}/requirements/export`);
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `openrm-${projectId}-requirements.json`;
      link.click();
      URL.revokeObjectURL(url);
      notify("Requirements exported");
    } catch (requestError) {
      notify(requestError instanceof Error ? requestError.message : "Export failed");
    }
  };

  const importRequirements = async (file: File) => {
    if (mode !== "live") return notify("Import requires a running API");
    try {
      const parsed = JSON.parse(await file.text());
      const items = Array.isArray(parsed) ? parsed : parsed.items;
      await apiRequest(`/api/v1/projects/${projectId}/requirements/import`, {
        method: "POST",
        headers: { "X-Idempotency-Key": `web-import-${Date.now()}` },
        body: JSON.stringify({ items }),
      });
      notify("Requirements imported");
      await loadWorkspace();
    } catch (requestError) {
      notify(requestError instanceof Error ? requestError.message : "Import failed");
    } finally {
      if (importInput.current) importInput.current.value = "";
    }
  };

  const compareRevisions = async () => {
    if (!selected || revisions.length < 2 || mode !== "live") return;
    const oldest = revisions[revisions.length - 1].revision;
    const newest = revisions[0].revision;
    try {
      const result = await apiRequest<RequirementComparison>(
        `/api/v1/projects/${projectId}/requirements/${selected.id}/compare?from_revision=${oldest}&to_revision=${newest}`,
      );
      setComparison(result);
    } catch (requestError) {
      notify(requestError instanceof Error ? requestError.message : "Comparison failed");
    }
  };

  return (
    <section className="requirements-live-page">
      <header className="page-header">
        <div>
          <div className="eyebrow">Controlled content • {total} current requirements</div>
          <h1>Requirements workspace</h1>
          <p>Create, revise, organize, search, compare, import, and export controlled requirements.</p>
        </div>
        <div className="page-actions">
          <button className="secondary-button" onClick={() => importInput.current?.click()}>
            <Upload size={16} /> Import
          </button>
          <input
            ref={importInput}
            className="visually-hidden"
            type="file"
            accept="application/json"
            aria-label="Import requirements JSON"
            onChange={(event) => event.target.files?.[0] && void importRequirements(event.target.files[0])}
          />
          <button className="secondary-button" onClick={() => void exportRequirements()}>
            <Download size={16} /> Export
          </button>
          <button className="primary-button" onClick={() => setEditor("create")}>
            <Plus size={16} /> New requirement
          </button>
        </div>
      </header>

      <div className={`workspace-mode ${mode}`} role="status" aria-live="polite">
        {mode === "loading" && <><RefreshCw size={14} /> Connecting to the requirements API…</>}
        {mode === "live" && <><CheckCircle2 size={14} /> Live controlled workspace</>}
        {mode === "preview" && <><AlertTriangle size={14} /> Preview fallback — start the API to persist changes</>}
      </div>
      {error && <div className="workspace-error" role="alert">{error}</div>}

      <div className="workspace-toolbar">
        <form className="search-box" onSubmit={submitSearch} role="search">
          <Search size={16} />
          <input
            aria-label="Search requirements"
            placeholder="Search ID, title, or text…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>
        <select aria-label="Project" value={projectId} onChange={(event) => { setProjectId(event.target.value); setOffset(0); }}>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.key} — {project.name}</option>)}
        </select>
        <select aria-label="Folder filter" value={folderFilter} onChange={(event) => { setFolderFilter(event.target.value); setOffset(0); }}>
          <option value="">All folders</option>
          {folders.map((folder) => <option key={String(folder.id)} value={String(folder.id)}>{String(folder.name)}</option>)}
        </select>
        <select aria-label="Tag filter" value={tagFilter} onChange={(event) => { setTagFilter(event.target.value); setOffset(0); }}>
          <option value="">All tags</option>
          {tags.map((tag) => <option key={String(tag.id)} value={String(tag.id)}>{String(tag.name)}</option>)}
        </select>
        <button className="filter-button" onClick={() => void saveView()}><Save size={14} /> Save view</button>
      </div>

      <div className="requirements-shell live-workspace">
        <aside className="requirements-tree panel" aria-label="Project organization">
          <div className="tree-header"><span>Project structure</span><Folder size={15} /></div>
          <button className={`tree-row strong ${!folderFilter ? "active" : ""}`} onClick={() => setFolderFilter("")}>
            <Folder size={14} /><span>All requirements</span><small>{total}</small>
          </button>
          {folders.map((folder) => (
            <button key={String(folder.id)} className={`tree-row ${folderFilter === folder.id ? "active" : ""}`} onClick={() => setFolderFilter(String(folder.id))}>
              <Folder size={14} /><span>{String(folder.name)}</span><small>Folder</small>
            </button>
          ))}
          <div className="saved-view-label">SAVED VIEWS</div>
          {savedViews.map((view) => (
            <button key={String(view.id)} className="tree-row" onClick={() => {
              const filters = (view.filters || {}) as Record<string, string | null>;
              setSearch(filters.search || "");
              setFolderFilter(filters.folder_id || "");
              setTagFilter(filters.tag_id || "");
            }}>
              <FileClock size={14} /><span>{String(view.name)}</span><small>View</small>
            </button>
          ))}
          <div className="saved-view-label">TAGS</div>
          {tags.map((tag) => (
            <button key={String(tag.id)} className={`tree-row ${tagFilter === tag.id ? "active" : ""}`} onClick={() => setTagFilter(String(tag.id))}>
              <Tags size={14} /><span>{String(tag.name)}</span><small style={{ color: String(tag.color || "#64748b") }}>●</small>
            </button>
          ))}
        </aside>

        <section className="requirements-table panel" aria-label="Requirements results">
          <div className="table-head"><span>ID</span><span>Requirement</span><span>Revision</span><span>Priority</span><span>Author</span></div>
          {requirements.length === 0 && <div className="empty-requirements">No requirements match this view.</div>}
          {requirements.map((requirement) => (
            <button
              key={requirement.id}
              className={`requirement-row ${selected?.id === requirement.id ? "selected" : ""}`}
              aria-pressed={selected?.id === requirement.id}
              onClick={() => setSelectedId(requirement.id)}
            >
              <code>{requirement.key}</code>
              <span className="requirement-title"><strong>{requirement.title}</strong><small>{requirement.statement}</small></span>
              <span className="status-pill connected">r{requirement.revision}</span>
              <span className="status-pill planned">{String(requirement.attributes.priority || "normal")}</span>
              <span className="owner-cell"><i>{requirement.created_by.slice(0, 2).toUpperCase()}</i>{requirement.created_by}</span>
            </button>
          ))}
          <nav className="pagination" aria-label="Requirements pagination">
            <button className="secondary-button" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - pageSize))}><ArrowLeft size={14} /> Previous</button>
            <span>{total === 0 ? 0 : offset + 1}–{Math.min(offset + pageSize, total)} of {total}</span>
            <button className="secondary-button" disabled={offset + pageSize >= total} onClick={() => setOffset(offset + pageSize)}>Next <ArrowRight size={14} /></button>
          </nav>
        </section>

        <aside className="requirement-inspector panel" aria-label="Requirement details">
          {selected ? (
            <>
              <div className="inspector-header"><div><code>{selected.key}</code><span className="status-pill connected">r{selected.revision}</span></div></div>
              <h2>{selected.title}</h2>
              <div className="inspector-section"><label>Statement</label><p>{selected.statement}</p></div>
              <div className="inspector-grid">
                <div><label>Author</label><strong>{selected.created_by}</strong></div>
                <div><label>Revision</label><strong>r{selected.revision}</strong></div>
                <div><label>Priority</label><strong>{String(selected.attributes.priority || "Normal")}</strong></div>
                <div><label>Updated</label><strong>{new Date(selected.updated_at).toLocaleDateString()}</strong></div>
              </div>
              <div className="revision-history">
                <div className="tree-header"><span>Revision history</span><History size={14} /></div>
                {revisions.slice(0, 5).map((revision) => <div className="revision-item" key={revision.id}><strong>r{revision.revision}</strong><span>{revision.title}</span><small>{revision.created_by}</small></div>)}
              </div>
              {comparison && <div className="comparison-result" role="status"><strong>Changed fields</strong><span>{comparison.changed_fields.join(", ") || "No changes"}</span></div>}
              <button className="secondary-button full-width" disabled={revisions.length < 2} onClick={() => void compareRevisions()}><GitCompareArrows size={15} /> Compare first to current</button>
              <button className="primary-button full-width" onClick={() => setEditor("edit")}>Revise requirement <ArrowRight size={15} /></button>
            </>
          ) : <div className="empty-requirements">Select or create a requirement.</div>}
        </aside>
      </div>

      {editor && (
        <RequirementEditor
          mode={editor}
          requirement={editor === "edit" ? selected : null}
          folders={folders}
          tags={tags}
          busy={busy}
          onClose={() => setEditor(null)}
          onSubmit={async (draft) => {
            if (mode !== "live") {
              notify("Preview mode does not persist changes");
              setEditor(null);
              return;
            }
            setBusy(true);
            try {
              if (editor === "create") {
                await apiRequest(`/api/v1/projects/${projectId}/requirements`, {
                  method: "POST",
                  headers: { "X-Idempotency-Key": `web-create-${Date.now()}` },
                  body: JSON.stringify(draft),
                });
                notify("Requirement created");
              } else if (selected) {
                await apiRequest(`/api/v1/projects/${projectId}/requirements/${selected.id}`, {
                  method: "PUT",
                  headers: { "X-Idempotency-Key": `web-revise-${selected.id}-${selected.revision}` },
                  body: JSON.stringify({ ...draft, key: undefined, expected_revision: selected.revision }),
                });
                notify("Requirement revision committed");
              }
              setEditor(null);
              await loadWorkspace();
            } catch (requestError) {
              notify(requestError instanceof Error ? requestError.message : "Requirement command failed");
            } finally {
              setBusy(false);
            }
          }}
        />
      )}
    </section>
  );
}

function RequirementEditor({
  mode,
  requirement,
  folders,
  tags,
  busy,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  requirement: Requirement | null;
  folders: WorkspaceItem[];
  tags: WorkspaceItem[];
  busy: boolean;
  onClose: () => void;
  onSubmit: (draft: CreateRequirement) => Promise<void>;
}) {
  const [key, setKey] = useState(requirement?.key || "");
  const [title, setTitle] = useState(requirement?.title || "");
  const [statement, setStatement] = useState(requirement?.statement || "");
  const [priority, setPriority] = useState(String(requirement?.attributes.priority || "medium"));
  const [folderId, setFolderId] = useState(requirement?.folder_id || "");
  const [tagIds, setTagIds] = useState(requirement?.tag_ids || []);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="requirement-editor" role="dialog" aria-modal="true" aria-labelledby="requirement-editor-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close requirement editor"><X size={18} /></button>
        <div className="eyebrow">Controlled command</div>
        <h2 id="requirement-editor-title">{mode === "create" ? "Create requirement" : `Revise ${requirement?.key}`}</h2>
        <form onSubmit={(event) => {
          event.preventDefault();
          void onSubmit({
            key: key.trim(),
            title: title.trim(),
            statement: statement.trim(),
            attributes: { priority },
            folder_id: folderId || null,
            tag_ids: tagIds,
          });
        }}>
          <label>Requirement key<input required pattern="[A-Z][A-Z0-9-]{1,31}" disabled={mode === "edit"} value={key} onChange={(event) => setKey(event.target.value.toUpperCase())} /></label>
          <label>Title<input required maxLength={200} value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label>Statement<textarea required maxLength={20000} rows={7} value={statement} onChange={(event) => setStatement(event.target.value)} /></label>
          <div className="editor-grid">
            <label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value)}><option>low</option><option>medium</option><option>high</option><option>critical</option></select></label>
            <label>Folder<select value={folderId} onChange={(event) => setFolderId(event.target.value)}><option value="">Unfiled</option>{folders.map((folder) => <option key={String(folder.id)} value={String(folder.id)}>{String(folder.name)}</option>)}</select></label>
          </div>
          <fieldset className="editor-tags">
            <legend>Tags</legend>
            {tags.length === 0 && <span>No project tags are defined.</span>}
            {tags.map((tag) => {
              const tagId = String(tag.id);
              return (
                <label key={tagId}>
                  <input
                    type="checkbox"
                    checked={tagIds.includes(tagId)}
                    onChange={(event) => setTagIds((current) => event.target.checked
                      ? [...current, tagId]
                      : current.filter((value) => value !== tagId))}
                  />
                  {String(tag.name)}
                </label>
              );
            })}
          </fieldset>
          <div className="editor-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={busy}>{busy ? "Saving…" : mode === "create" ? "Create requirement" : "Commit revision"}</button></div>
        </form>
      </section>
    </div>
  );
}
