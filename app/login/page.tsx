"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock, User, Eye, EyeOff, Home } from "lucide-react";
import { t, Lang } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("uz");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "buyer" as "buyer" | "seller",
  });

  const T = t[lang];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    if (isLogin) {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      setLoading(false);
      if (res?.error) {
        setError(lang === "uz" ? "Email yoki parol noto'g'ri!" : lang === "ru" ? "Неверный email или пароль!" : "Invalid email or password!");
        return;
      }
      router.push("/listings");
      return;
    }

    if (!form.name.trim()) {
      setError(lang === "uz" ? "Ismingizni kiriting" : lang === "ru" ? "Введите имя" : "Enter your name");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || T.error);
      return;
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    router.push("/listings");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <Home size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">{T.appName}</h1>
          <p className="text-gray-500 text-sm mt-1">{T.tagline}</p>
        </div>

        {/* Lang toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1 shadow-sm">
            {(["uz", "ru", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === l
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 p-8">

          {/* Tabs */}
          <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1 mb-6">
            {[T.login, T.register].map((tab, i) => {
              const active = (i === 0 && isLogin) || (i === 1 && !isLogin);
              return (
                <button
                  key={tab}
                  onClick={() => { setIsLogin(i === 0); setError(""); }}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {/* Role */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "buyer", label: T.iAmBuyer, icon: User },
                  { value: "seller", label: T.iAmSeller, icon: Building2 },
                ].map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setForm({ ...form, role: r.value as "buyer" | "seller" })}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.role === r.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <r.icon size={16} />
                    {r.label}
                  </button>
                ))}
              </div>
            )}

            {/* Name */}
            {!isLogin && (
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="name"
                  placeholder={T.name}
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                type="email"
                placeholder={T.email}
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
              />
            </div>

            {/* Phone */}
            {!isLogin && (
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+998</span>
                <input
                  name="phone"
                  placeholder={T.phone}
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
                />
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={T.password}
                value={form.password}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold text-sm rounded-xl hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200 mt-2"
            >
              {loading ? T.loading : isLogin ? T.login : T.register}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          EstatePro © 2026
        </p>
      </div>
    </div>
  );
}