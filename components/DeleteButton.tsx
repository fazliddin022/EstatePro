"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("E'lonni o'chirishni tasdiqlaysizmi?")) return;
    setLoading(true);
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-500 font-medium hover:text-red-700 disabled:opacity-50 flex items-center gap-1"
    >
      <Trash2 size={13} />
      {loading ? "..." : "O'chirish"}
    </button>
  );
}