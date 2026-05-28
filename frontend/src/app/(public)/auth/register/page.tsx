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
    <div className="mx-auto flex min-h-[calc(100vh-140px)] w-full max-w-md items-center px-6">
      <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="mb-1 text-2xl font-bold text-zinc-100">Đăng ký</h1>
        <p className="mb-6 text-sm text-zinc-400">Tạo tài khoản để đặt hàng nội bộ.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Họ và tên"
            className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
            required
          />
          <input
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="Username"
            className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
            className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
            required
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Mật khẩu"
            className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
            required
          />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="h-10 w-full rounded-lg bg-amber-500 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
          >
            {submitting ? "Đang xử lý..." : "Tạo tài khoản"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="text-amber-400 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
