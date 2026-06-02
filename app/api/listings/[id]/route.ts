import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listings, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth-config";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [listing] = await db
    .select({
      id: listings.id,
      titleUz: listings.titleUz,
      titleRu: listings.titleRu,
      titleEn: listings.titleEn,
      descriptionUz: listings.descriptionUz,
      descriptionRu: listings.descriptionRu,
      descriptionEn: listings.descriptionEn,
      price: listings.price,
      priceType: listings.priceType,
      listingType: listings.listingType,
      propertyType: listings.propertyType,
      status: listings.status,
      rooms: listings.rooms,
      area: listings.area,
      floor: listings.floor,
      totalFloors: listings.totalFloors,
      city: listings.city,
      district: listings.district,
      address: listings.address,
      images: listings.images,
      views: listings.views,
      createdAt: listings.createdAt,
      userId: listings.userId,
      sellerName: users.name,
      sellerPhone: users.phone,
      sellerEmail: users.email,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .where(eq(listings.id, id));

  if (!listing) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }

  // Views ni oshirish
  await db
    .update(listings)
    .set({ views: (listing.views || 0) + 1 })
    .where(eq(listings.id, id));

  return NextResponse.json(listing);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await db
    .delete(listings)
    .where(and(eq(listings.id, id), eq(listings.userId, session.user.id)));

  return NextResponse.json({ success: true });
}