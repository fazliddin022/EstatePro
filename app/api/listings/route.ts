import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listings, users } from "@/lib/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { auth } from "@/lib/auth-config";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const listingType = searchParams.get("listingType") || "";
  const propertyType = searchParams.get("propertyType") || "";
  const city = searchParams.get("city") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const rooms = searchParams.get("rooms") || "";
  const search = searchParams.get("search") || "";

  const allListings = await db
    .select({
      id: listings.id,
      titleUz: listings.titleUz,
      titleRu: listings.titleRu,
      titleEn: listings.titleEn,
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
      images: listings.images,
      views: listings.views,
      createdAt: listings.createdAt,
      sellerName: users.name,
      sellerPhone: users.phone,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .where(eq(listings.status, "active"));

  let filtered = allListings;

  if (search) {
    filtered = filtered.filter((l) =>
      l.titleUz.toLowerCase().includes(search.toLowerCase()) ||
      l.titleRu.toLowerCase().includes(search.toLowerCase()) ||
      l.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.district?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (listingType) filtered = filtered.filter((l) => l.listingType === listingType);
  if (propertyType) filtered = filtered.filter((l) => l.propertyType === propertyType);
  if (city) filtered = filtered.filter((l) => l.city.toLowerCase().includes(city.toLowerCase()));
  if (rooms) filtered = filtered.filter((l) => l.rooms === Number(rooms));
  if (minPrice) filtered = filtered.filter((l) => l.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter((l) => l.price <= Number(maxPrice));

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const [listing] = await db.insert(listings).values({
    userId: session.user.id,
    titleUz: body.titleUz,
    titleRu: body.titleRu,
    titleEn: body.titleEn,
    descriptionUz: body.descriptionUz,
    descriptionRu: body.descriptionRu,
    descriptionEn: body.descriptionEn,
    price: body.price,
    priceType: body.priceType,
    listingType: body.listingType,
    propertyType: body.propertyType,
    rooms: body.rooms,
    area: body.area,
    floor: body.floor,
    totalFloors: body.totalFloors,
    city: body.city,
    district: body.district,
    address: body.address,
    images: body.images || [],
  }).returning();

  return NextResponse.json(listing);
}