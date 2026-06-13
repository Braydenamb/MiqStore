import { Wrench } from "lucide-react";

export const metadata = {
  title: "Sedang Dalam Perbaikan | MiqStore",
  description: "MiqStore sedang dalam perbaikan. Silakan kembali beberapa saat lagi.",
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center backdrop-blur-sm">
          <Wrench className="w-10 h-10 text-blue-400 animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Sedang Dalam Perbaikan
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            MiqStore sedang melakukan perawatan terjadwal untuk meningkatkan layanan kami.
            Silakan kembali beberapa saat lagi.
          </p>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Maintenance Mode Aktif
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-600">
          Terima kasih atas kesabarannya.
        </p>
      </div>
    </div>
  );
}
