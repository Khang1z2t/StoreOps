"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register(form);
      router.push("/auth/login");
    } catch {
      setError("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-140px)] w-full max-w-md items-center px-6 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />
      </div>

      <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <p className="mb-2 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">
          New Member
        </p>
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-100">Đăng ký</h1>
        <p className="mb-6 text-sm text-zinc-400">Tạo tài khoản để bắt đầu đặt hàng nội bộ.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Họ và tên</label>
            <input
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Nguyễn Văn A"
              className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Username</label>
            <input
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="yuno"
              className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

            <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Mật khẩu</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="**************"
              className="h-11 w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-xl bg-amber-500 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-amber-400 disabled:translate-y-0 disabled:opacity-60"
          >
            {submitting ? "Đang xử lý..." : "Tạo tài khoản"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-400">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="font-medium text-amber-400 transition-colors hover:text-amber-300 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
