import { auth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { listings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Home, Eye, TrendingUp, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const myListings = await db
    .select()
    .from(listings)
    .where(eq(listings.userId, userId));

  const totalViews = myListings.reduce((s, l) => s + (l.views || 0), 0);
  const activeListings = myListings.filter((l) => l.status === "active");
  const saleListings = myListings.filter((l) => l.listingType === "sale");
  const rentListings = myListings.filter((l) => l.listingType === "rent");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Salom, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Sizning ko'chmas mulk paneli</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Jami e'lonlar", value: myListings.length, icon: Home, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Aktiv e'lonlar", value: activeListings.length, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Jami ko'rishlar", value: totalViews, icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Sotish / Ijara", value: `${saleListings.length} / ${rentListings.length}`, icon: PlusCircle, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/add"
          className="flex items-center gap-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl p-5 no-underline hover:opacity-90 transition-opacity"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <PlusCircle size={24} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white">E'lon qo'shish</p>
            <p className="text-emerald-100 text-sm">Yangi mulk e'lon qiling</p>
          </div>
        </Link>

        <Link
          href="/dashboard/my-listings"
          className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 no-underline hover:border-emerald-200 transition-all"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Home size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Mening e'lonlarim</p>
            <p className="text-gray-500 text-sm">{myListings.length} ta e'lon</p>
          </div>
        </Link>
      </div>

      {/* Recent listings */}
      {myListings.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900 text-sm">So'nggi e'lonlar</h2>
            <Link href="/dashboard/my-listings" className="text-xs text-emerald-600 font-semibold no-underline">
              Hammasini ko'rish →
            </Link>
          </div>
          {myListings.slice(0, 5).map((listing, i) => (
            <div key={listing.id} className={`flex items-center justify-between px-6 py-4 ${i < Math.min(myListings.length, 5) - 1 ? "border-b border-gray-50" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-lg">
                  {listing.propertyType === "house" ? "🏡" : listing.propertyType === "land" ? "🌱" : "🏠"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{listing.titleUz}</p>
                  <p className="text-xs text-gray-400">{listing.city} · {listing.listingType === "sale" ? "Sotish" : "Ijara"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-600 text-sm">
                  ${listing.price.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400 justify-end mt-0.5">
                  <Eye size={11} />
                  {listing.views || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}