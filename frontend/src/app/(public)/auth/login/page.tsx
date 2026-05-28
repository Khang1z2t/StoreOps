"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMe, login } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { setTokens, setUser } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const tokens = await login({ identifier, password });
      setTokens(tokens.accessToken, tokens.refreshToken);
      const me = await getMe(tokens.accessToken);
      setUser(me);
      router.push("/");
    } catch {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] w-full max-w-md items-center px-6">
      <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="mb-1 text-2xl font-bold text-zinc-100">Đăng nhập</h1>
        <p className="mb-6 text-sm text-zinc-400">Dùng tài khoản nội bộ để tiếp tục.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Username hoặc email"
            className="h-10 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {submitting ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="text-amber-400 hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
