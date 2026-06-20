import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  listClientAssignments,
  setClientAssignment,
  removeClientAssignment,
} from "@/lib/admin-clients.functions";
import { Shield, Save, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/clients")({
  component: AdminClientsPage,
  head: () => ({
    meta: [
      { title: "Admin · Clientes" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type Row = {
  id: string;
  email: string;
  created_at: string;
  client_id: string | null;
  lead_count: number;
};

function AdminClientsPage() {
  const [authReady, setAuthReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const listFn = useServerFn(listClientAssignments);
  const setFn = useServerFn(setClientAssignment);
  const removeFn = useServerFn(removeClientAssignment);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSignedIn(!!s?.user);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session?.user);
      setAuthReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listFn({});
      setRows(res.users);
      setDrafts(Object.fromEntries(res.users.map((u) => [u.id, u.client_id ?? ""])));
      setAccessDenied(false);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes("Forbidden") || msg.includes("admin")) setAccessDenied(true);
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (signedIn) void load();
  }, [signedIn]);

  const save = async (userId: string) => {
    const val = (drafts[userId] ?? "").trim();
    if (!val) {
      toast.error("client_id vacío");
      return;
    }
    try {
      await setFn({ data: { user_id: userId, client_id: val } });
      toast.success("Asignado");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const remove = async (userId: string) => {
    if (!confirm("¿Quitar el client_id de este usuario?")) return;
    try {
      await removeFn({ data: { user_id: userId } });
      toast.success("Removido");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (!authReady)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] text-slate-400">
        Cargando…
      </div>
    );

  if (!signedIn)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] text-slate-300">
        <a href="/hunter" className="text-[#4f8ef7] hover:underline">Inicia sesión primero →</a>
      </div>
    );

  if (accessDenied)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] text-slate-300 px-4">
        <div className="max-w-md text-center bg-[#1a1d27] border border-white/5 rounded-xl p-8">
          <Shield className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-white text-lg font-semibold mb-2">Acceso denegado</h2>
          <p className="text-sm text-slate-400">
            Esta página es solo para administradores.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-200">
      <header className="border-b border-white/5 bg-[#0f1117]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1100px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#4f8ef7]" />
            <h1 className="text-white text-sm font-semibold">Admin · Asignación de clientes</h1>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Recargar
          </button>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-6 py-6">
        <div className="bg-[#1a1d27] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#0f1117] text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Client ID</th>
                <th className="text-left px-4 py-3">Leads</th>
                <th className="text-left px-4 py-3">Creado</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    Cargando…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    Sin usuarios.
                  </td>
                </tr>
              )}
              {rows.map((u) => (
                <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white">{u.email}</td>
                  <td className="px-4 py-3">
                    <input
                      value={drafts[u.id] ?? ""}
                      onChange={(e) =>
                        setDrafts({ ...drafts, [u.id]: e.target.value })
                      }
                      placeholder="ej. acme_construction"
                      className="bg-[#0f1117] border border-white/10 rounded px-2 py-1 text-white text-xs font-mono w-56 focus:outline-none focus:border-[#4f8ef7]"
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-300">{u.lead_count}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => save(u.id)}
                        title="Guardar"
                        className="p-1.5 rounded hover:bg-[#4f8ef7]/15 text-[#4f8ef7]"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      {u.client_id && (
                        <button
                          onClick={() => remove(u.id)}
                          title="Quitar"
                          className="p-1.5 rounded hover:bg-red-500/15 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Tip: usa identificadores cortos en minúsculas (a-z, 0-9, _, -). El primer usuario que
          se registra recibe rol <code className="text-slate-300">admin</code> automáticamente.
        </p>
      </div>
    </div>
  );
}