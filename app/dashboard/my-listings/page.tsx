import { auth } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { listings } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { Eye, PlusCircle } from "lucide-react";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function MyListingsPage() {
  const session = await auth();
  const userId = session?.user?.id!;

  const myListings = await db
    .select()
    .from(listings)
    .where(eq(listings.userId, userId))
    .orderBy(desc(listings.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Mening e'lonlarim</h1>
          <p className="text-gray-500 text-sm mt-1">{myListings.length} ta e'lon</p>
        </div>
        <Link
          href="/dashboard/add"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-sm font-bold rounded-xl no-underline hover:opacity-90 transition-opacity shadow-lg shadow-emerald-200"
        >
          <PlusCircle size={16} />
          Qo'shish
        </Link>
      </div>

      {myListings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">🏠</div>
          <p className="font-semibold text-gray-700">Hali e'lon yo'q</p>
          <Link href="/dashboard/add" className="inline-block mt-4 text-sm text-emerald-600 font-medium no-underline hover:underline">
            Birinchi e'lonni qo'shing →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50">
                {["E'lon", "Tur", "Narx", "Ko'rishlar", "Holati", ""].map((h) => (
                  <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myListings.map((listing, i) => (
                <tr key={listing.id} className={i < myListings.length - 1 ? "border-b border-gray-50" : ""}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                        {listing.propertyType === "house" ? "🏡" : listing.propertyType === "land" ? "🌱" : "🏠"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{listing.titleUz}</p>
                        <p className="text-xs text-gray-400">{listing.city}{listing.district ? `, ${listing.district}` : ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      listing.listingType === "sale"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {listing.listingType === "sale" ? "Sotish" : "Ijara"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-emerald-600 text-sm">
                      ${listing.price.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Eye size={14} />
                      {listing.views || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      listing.status === "active"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-50 text-gray-400"
                    }`}>
                      {listing.status === "active" ? "Aktiv" : "Nofaol"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="text-xs text-blue-600 font-medium no-underline hover:underline"
                      >
                        Ko'rish
                      </Link>
                      <DeleteButton id={listing.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}