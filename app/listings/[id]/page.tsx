"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Home,
  BedDouble,
  Maximize2,
  TrendingUp,
  Eye,
  Phone,
  Mail,
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { t, Lang } from "@/lib/i18n";

type Listing = {
  id: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string | null;
  descriptionRu: string | null;
  descriptionEn: string | null;
  price: number;
  priceType: string | null;
  listingType: string;
  propertyType: string;
  status: string;
  rooms: number | null;
  area: number | null;
  floor: number | null;
  totalFloors: number | null;
  city: string;
  district: string | null;
  address: string | null;
  images: string[] | null;
  views: number | null;
  createdAt: string;
  userId: string;
  sellerName: string;
  sellerPhone: string | null;
  sellerEmail: string;
};

function formatPrice(price: number, priceType: string | null, lang: Lang) {
  const T = t[lang];
  const formatted =
    price >= 1000
      ? `$${price.toLocaleString()}`
      : `${price.toLocaleString()} so'm`;
  if (priceType === "month") return `${formatted} / ${T.perMonth}`;
  return formatted;
}

function getPropertyIcon(type: string) {
  if (type === "house") return "🏡";
  if (type === "land") return "🌱";
  if (type === "commercial") return "🏪";
  if (type === "office") return "🏢";
  return "🏠";
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>("uz");
  const [showPhone, setShowPhone] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchListing = useCallback(async () => {
    const res = await fetch(`/api/listings/${id}`);
    if (!res.ok) {
      router.push("/listings");
      return;
    }
    const data = await res.json();
    setListing(data);
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🏠</div>
          <p className="text-gray-400">
            {lang === "uz"
              ? "Yuklanmoqda..."
              : lang === "ru"
                ? "Загрузка..."
                : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  const T = t[lang];

  const getTitle = () => {
    if (lang === "ru") return listing.titleRu;
    if (lang === "en") return listing.titleEn;
    return listing.titleUz;
  };

  const getDescription = () => {
    if (lang === "ru") return listing.descriptionRu;
    if (lang === "en") return listing.descriptionEn;
    return listing.descriptionUz;
  };

  const details = [
    listing.rooms && {
      icon: BedDouble,
      label: T.rooms,
      value: `${listing.rooms} ta`,
    },
    listing.area && {
      icon: Maximize2,
      label: T.area,
      value: `${listing.area} ${T.sqm}`,
    },
    listing.floor && {
      icon: TrendingUp,
      label: T.floor,
      value: `${listing.floor} / ${listing.totalFloors}`,
    },
    {
      icon: MapPin,
      label: T.city,
      value: listing.district
        ? `${listing.district}, ${listing.city}`
        : listing.city,
    },
    listing.address && {
      icon: MapPin,
      label: T.address,
      value: listing.address,
    },
    { icon: Eye, label: T.views, value: listing.views || 0 },
    {
      icon: Calendar,
      label: lang === "uz" ? "Sana" : lang === "ru" ? "Дата" : "Date",
      value: new Date(listing.createdAt).toLocaleDateString(),
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    label: string;
    value: string | number;
  }[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/listings"
              className="flex items-center gap-2 no-underline"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Home size={16} className="text-white" />
              </div>
              <span className="font-extrabold text-gray-900 hidden sm:block">
                EstatePro
              </span>
            </Link>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              {lang === "uz" ? "Orqaga" : lang === "ru" ? "Назад" : "Back"}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Lang toggle */}
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {(["uz", "ru", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    lang === l
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-400"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-xl border transition-all ${
                saved
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"
              }`}
            >
              <Heart size={18} fill={saved ? "currentColor" : "none"} />
            </button>

            <button
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
              className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:border-gray-300 bg-white transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Image */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="h-72 bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center relative">
                <span className="text-8xl">
                  {getPropertyIcon(listing.propertyType)}
                </span>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                      listing.listingType === "sale"
                        ? "bg-blue-600 text-white"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {listing.listingType === "sale" ? T.buy : T.rent}
                  </span>
                  <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-white text-gray-700 shadow-sm">
                    {T[listing.propertyType as keyof typeof T] as string}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                  <Eye size={12} />
                  {listing.views || 0}{" "}
                  {lang === "uz"
                    ? "ko'rishlar"
                    : lang === "ru"
                      ? "просмотров"
                      : "views"}
                </div>
              </div>
            </div>

            {/* Title & Price */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                {getTitle()}
              </h1>
              <p className="text-3xl font-extrabold text-emerald-600 mb-4">
                {formatPrice(listing.price, listing.priceType, lang)}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={14} />
                <span>
                  {listing.address && `${listing.address}, `}
                  {listing.district && `${listing.district}, `}
                  {listing.city}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                {lang === "uz"
                  ? "Xususiyatlar"
                  : lang === "ru"
                    ? "Характеристики"
                    : "Details"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {details.map((detail, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-xl p-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <detail.icon size={15} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{detail.label}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {getDescription() && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  {T.description}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                  {getDescription()}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">{T.contact}</h3>

              {/* Seller */}
              <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
                <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {listing.sellerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {listing.sellerName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {lang === "uz"
                      ? "Sotuvchi"
                      : lang === "ru"
                        ? "Продавец"
                        : "Seller"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              {listing.sellerPhone && (
                <button
                  onClick={() => setShowPhone(!showPhone)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors mb-3 shadow-lg shadow-emerald-200"
                >
                  <Phone size={16} />
                  {showPhone
                    ? listing.sellerPhone
                    : lang === "uz"
                      ? "Telefon ko'rsatish"
                      : lang === "ru"
                        ? "Показать телефон"
                        : "Show phone"}
                </button>
              )}

              {/* Email */}

              <a
                href={`mailto:${listing.sellerEmail}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 font-semibold text-sm rounded-xl transition-all no-underline"
              >
                <Mail size={16} />
                {lang === "uz"
                  ? "Email yuborish"
                  : lang === "ru"
                    ? "Написать email"
                    : "Send email"}
              </a>

              <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {T.listingType === "sale" ? T.buy : T.rent}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {listing.listingType === "sale"
                      ? lang === "uz"
                        ? "Sotish"
                        : lang === "ru"
                          ? "Продажа"
                          : "For Sale"
                      : lang === "uz"
                        ? "Ijara"
                        : lang === "ru"
                          ? "Аренда"
                          : "For Rent"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {lang === "uz"
                      ? "Holati"
                      : lang === "ru"
                        ? "Статус"
                        : "Status"}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                    {T.active}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar listings link */}
            <Link
              href={`/listings?propertyType=${listing.propertyType}&listingType=${listing.listingType}`}
              className="block bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100 p-4 no-underline hover:border-emerald-200 transition-all"
            >
              <p className="font-semibold text-emerald-700 text-sm mb-1">
                {lang === "uz"
                  ? "O'xshash e'lonlar"
                  : lang === "ru"
                    ? "Похожие объявления"
                    : "Similar listings"}
              </p>
              <p className="text-xs text-gray-500">
                {T[listing.propertyType as keyof typeof T] as string} •{" "}
                {listing.listingType === "sale"
                  ? lang === "uz"
                    ? "Sotish"
                    : lang === "ru"
                      ? "Продажа"
                      : "Sale"
                  : lang === "uz"
                    ? "Ijara"
                    : lang === "ru"
                      ? "Аренда"
                      : "Rent"}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
