"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, X } from "lucide-react";
import { t, Lang } from "@/lib/i18n";

const CITIES = ["Toshkent", "Samarqand", "Buxoro", "Namangan", "Andijon", "Qo'qon", "Farg'ona"];

export default function AddListingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("uz");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    titleUz: "", titleRu: "", titleEn: "",
    descriptionUz: "", descriptionRu: "", descriptionEn: "",
    price: "",
    priceType: "total",
    listingType: "sale",
    propertyType: "apartment",
    rooms: "",
    area: "",
    floor: "",
    totalFloors: "",
    city: "Toshkent",
    district: "",
    address: "",
  });

  const T = t[lang];

  const handleSubmit = async () => {
    if (!form.titleUz || !form.titleRu || !form.titleEn || !form.price) {
      setError("Majburiy maydonlarni to'ldiring");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          rooms: form.rooms ? Number(form.rooms) : null,
          area: form.area ? Number(form.area) : null,
          floor: form.floor ? Number(form.floor) : null,
          totalFloors: form.totalFloors ? Number(form.totalFloors) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || T.error);
        return;
      }
      router.push("/dashboard/my-listings");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">E'lon qo'shish</h1>
          <p className="text-gray-500 text-sm mt-1">Yangi mulk e'lon qiling</p>
        </div>
        {/* Lang toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(["uz", "ru", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                lang === l ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">

        {/* Listing type */}
        <div>
          <label className={labelClass}>Tur</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "sale", label: "Sotish" },
              { value: "rent", label: "Ijaraga berish" },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setForm({ ...form, listingType: type.value })}
                className={`py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${
                  form.listingType === type.value
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Property type */}
        <div>
          <label className={labelClass}>Mulk turi</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "apartment", label: "🏠 Kvartira" },
              { value: "house", label: "🏡 Uy" },
              { value: "land", label: "🌱 Yer" },
              { value: "commercial", label: "🏪 Tijorat" },
              { value: "office", label: "🏢 Ofis" },
            ].map((pt) => (
              <button
                key={pt.value}
                onClick={() => setForm({ ...form, propertyType: pt.value })}
                className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                  form.propertyType === pt.value
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Titles */}
        <div className="space-y-3">
          <label className={labelClass}>Sarlavha</label>
          {[
            { key: "titleUz", placeholder: "O'zbekcha sarlavha *" },
            { key: "titleRu", placeholder: "Русское название *" },
            { key: "titleEn", placeholder: "English title *" },
          ].map((field) => (
            <input
              key={field.key}
              value={form[field.key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className={inputClass}
            />
          ))}
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className={labelClass}>Tavsif</label>
          {[
            { key: "descriptionUz", placeholder: "O'zbekcha tavsif" },
            { key: "descriptionRu", placeholder: "Описание на русском" },
            { key: "descriptionEn", placeholder: "English description" },
          ].map((field) => (
            <textarea
              key={field.key}
              value={form[field.key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          ))}
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Narx *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="85000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Narx turi</label>
            <select
              value={form.priceType}
              onChange={(e) => setForm({ ...form, priceType: e.target.value })}
              className={inputClass}
            >
              <option value="total">Jami ($)</option>
              <option value="month">Oylik (so'm)</option>
            </select>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "rooms", label: "Xonalar", placeholder: "3" },
            { key: "area", label: "Maydon (m²)", placeholder: "75" },
            { key: "floor", label: "Qavat", placeholder: "5" },
            { key: "totalFloors", label: "Jami qavatlar", placeholder: "9" },
          ].map((field) => (
            <div key={field.key}>
              <label className={labelClass}>{field.label}</label>
              <input
                type="number"
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Shahar *</label>
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={inputClass}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tuman</label>
            <input
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              placeholder="Chilonzor"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Manzil</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Ko'cha nomi, uy raqami"
            className={inputClass}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
        >
          <PlusCircle size={16} />
          {loading ? T.loading : "E'lon qilish"}
        </button>
      </div>
    </div>
  );
}