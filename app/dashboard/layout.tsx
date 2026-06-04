import { auth } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, LayoutDashboard, PlusCircle, List, LogOut } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 fixed top-0 left-0 bottom-0 flex flex-col z-40">
        <div className="p-5 border-b border-gray-100">
          <Link href="/listings" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Home size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-gray-900">EstatePro</span>
          </Link>
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Dashboard</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{session.user?.name}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/dashboard/add", label: "E'lon qo'shish", icon: PlusCircle },
            { href: "/dashboard/my-listings", label: "Mening e'lonlarim", icon: List },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 no-underline transition-all"
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <SignOutButton />
        </div>
      </aside>

      <div className="flex-1 ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}