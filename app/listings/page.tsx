"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search, MapPin, Home, Building2,
  Filter, BedDouble, Maximize2,
  TrendingUp, Eye,
} from "lucide-react";
import { t, Lang } from "@/lib/i18n";

type Listing = {
  id: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  price: number;
  priceType: string | null;
  listingType: string;
  propertyType: string;
  rooms: number | null;
  area: number | null;
  floor: number | null;
  totalFloors: number | null;
  city: string;
  district: string | null;
  images: string[] | null;
  views: number | null;
  createdAt: string;
  sellerName: string;
};

const CITIES = ["Toshkent", "Samarqand", "Buxoro", "Namangan", "Andijon"];
const PROPERTY_TYPES = ["apartment", "house", "land", "commercial", "office"];

function formatPrice(price: number, priceType: string | null, lang: Lang) {
  const T = t[lang];
  const formatted = price >= 1000
    ? `$${price.toLocaleString()}`
    : `${price.toLocaleString()} so'm`;
  if (priceType === "month") return `${formatted} / ${T.perMonth}`;
  return formatted;
}

function timeAgo(date: string, lang: Lang) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return lang === "uz" ? "Bugun" : lang === "ru" ? "Сегодня" : "Today";
  if (days === 1) return lang === "uz" ? "Kecha" : lang === "ru" ? "Вчера" : "Yesterday";
  return lang === "uz" ? `${days} kun oldin` : lang === "ru" ? `${days} дней назад` : `${days} days ago`;
}

export default function ListingsPage() {
  const [listingList, setListingList] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>("uz");
  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [city, setCity] = useState("");
  const [rooms, setRooms] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const T = t[lang];

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (listingType) params.set("listingType", listingType);
    if (propertyType) params.set("propertyType", propertyType);
    if (city) params.set("city", city);
    if (rooms) params.set("rooms", rooms);

    const res = await fetch(`/api/listings?${params}`);
    const data = await res.json();
    setListingList(data);
    setLoading(false);
  }, [search, listingType, propertyType, city, rooms]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const clearFilters = () => {
    setSearch("");
    setListingType("");
    setPropertyType("");
    setCity("");
    setRooms("");
  };

  const hasFilters = search || listingType || propertyType || city || rooms;

  const getTitle = (l: Listing) => {
    if (lang === "ru") return l.titleRu;
    if (lang === "en") return l.titleEn;
    return l.titleUz;
  };

  const getPropertyIcon = (type: string) => {
    if (type === "house") return "🏡";
    if (type === "land") return "🌱";
    if (type === "commercial") return "🏪";
    if (type === "office") return "🏢";
    return "🏠";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/listings" className="flex items-center gap-2 no-underline flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Home size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-lg">EstatePro</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={T.search}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Lang toggle */}
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {(["uz", "ru", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    lang === l ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-xl no-underline transition-colors"
            >
              + {T.addListing}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {lang === "uz" ? "Ko'chmas mulk toping" : lang === "ru" ? "Найдите недвижимость" : "Find Your Property"}
          </h1>
          <p className="text-emerald-100 text-lg mb-8">
            {T.tagline}
          </p>

          {/* Type toggle */}
          <div className="flex justify-center gap-3 mb-6">
            {[
              { value: "", label: lang === "uz" ? "Hammasi" : lang === "ru" ? "Все" : "All" },
              { value: "sale", label: T.buy },
              { value: "rent", label: T.rent },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setListingType(item.value)}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  listingType === item.value
                    ? "bg-white text-emerald-700"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-2 flex gap-2 shadow-2xl max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={T.search}
                className="w-full pl-10 pr-4 py-3 text-gray-900 text-sm outline-none rounded-xl"
              />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-9 pr-4 py-3 text-gray-900 text-sm outline-none rounded-xl w-36 appearance-none bg-gray-50 border-l border-gray-100"
              >
                <option value="">{T.city}</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              onClick={fetchListings}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              {lang === "uz" ? "Qidirish" : lang === "ru" ? "Найти" : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm">{T.filters}</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-emerald-600 font-medium">
                    {T.clearFilters}
                  </button>
                )}
              </div>

              {/* Property type */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  {lang === "uz" ? "Mulk turi" : lang === "ru" ? "Тип недвижимости" : "Property Type"}
                </p>
                <div className="space-y-1">
                  {PROPERTY_TYPES.map((pt) => (
                    <button
                      key={pt}
                      onClick={() => setPropertyType(propertyType === pt ? "" : pt)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                        propertyType === pt
                          ? "bg-emerald-50 text-emerald-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{getPropertyIcon(pt)}</span>
                      {T[pt as keyof typeof T] as string}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rooms */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  {T.rooms}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["1", "2", "3", "4", "5"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRooms(rooms === r ? "" : r)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                        rooms === r
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Listings */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{listingList.length}</span>
                {" "}{lang === "uz" ? "ta e'lon" : lang === "ru" ? "объявлений" : "listings"}
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl px-3 py-2"
              >
                <Filter size={14} />
                {T.filters}
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-44 bg-gray-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listingList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Home size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="font-semibold text-gray-700">{T.noListings}</p>
                {hasFilters && (
                  <button onClick={clearFilters} className="mt-3 text-sm text-emerald-600 font-medium hover:underline">
                    {T.clearFilters}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {listingList.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all no-underline group"
                  >
                    {/* Image */}
                    <div className="h-44 bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center relative">
                      <span className="text-5xl">{getPropertyIcon(listing.propertyType)}</span>
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          listing.listingType === "sale"
                            ? "bg-blue-600 text-white"
                            : "bg-emerald-500 text-white"
                        }`}>
                          {listing.listingType === "sale" ? T.buy : T.rent}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-gray-700 shadow-sm">
                          {T[listing.propertyType as keyof typeof T] as string}
                        </span>
                      </div>
                      {listing.views && listing.views > 0 ? (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                          <Eye size={11} />
                          {listing.views}
                        </div>
                      ) : null}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h2 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {getTitle(listing)}
                      </h2>

                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                        <MapPin size={11} />
                        <span>{listing.district ? `${listing.district}, ` : ""}{listing.city}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        {listing.rooms && (
                          <span className="flex items-center gap-1">
                            <BedDouble size={12} />
                            {listing.rooms} {T.rooms}
                          </span>
                        )}
                        {listing.area && (
                          <span className="flex items-center gap-1">
                            <Maximize2 size={12} />
                            {listing.area} {T.sqm}
                          </span>
                        )}
                        {listing.floor && (
                          <span className="flex items-center gap-1">
                            <TrendingUp size={12} />
                            {listing.floor}/{listing.totalFloors}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-lg font-extrabold text-emerald-600">
                          {formatPrice(listing.price, listing.priceType, lang)}
                        </p>
                        <span className="text-xs text-gray-400">
                          {timeAgo(listing.createdAt, lang)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}