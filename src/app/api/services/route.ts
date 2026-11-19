import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest, requireAdmin } from "@/lib/admin-auth";
import { isMongoObjectId, parseService } from "@/lib/content-validation";
import { connectToDB } from "@/lib/mongoose";
import Service from "@/models/Service.model";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDB();
    return NextResponse.json(await Service.find({}).lean());
  } catch (error) {
    console.error("GET /api/services failed", error);
    return NextResponse.json({ error: "Unable to load services." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const parsed = parseService(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
    await connectToDB();
    return NextResponse.json(await Service.create(parsed.data), { status: 201 });
  } catch (error) {
    console.error("POST /api/services failed", error);
    return NextResponse.json({ error: "Unable to save the service." }, { status: 500 });
  }
}

// Kept for compatibility with older dashboard clients that send an id in the body.
export async function DELETE(request: NextRequest) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const body: unknown = await request.json();
    const id = body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>).id : undefined;
    if (typeof id !== "string" || !isMongoObjectId(id)) {
      return NextResponse.json({ error: "Invalid service id." }, { status: 400 });
    }
    await connectToDB();
    const document = await Service.findByIdAndDelete(id);
    return document ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Service not found." }, { status: 404 });
  } catch (error) {
    console.error("DELETE /api/services failed", error);
    return NextResponse.json({ error: "Unable to delete the service." }, { status: 500 });
  }
}
