import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest, requireAdmin } from "@/lib/admin-auth";
import { isMongoObjectId, parseExperience } from "@/lib/content-validation";
import { connectToDB } from "@/lib/mongoose";
import Experience from "@/models/Experience.model";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const { id } = await params;
  if (!isMongoObjectId(id)) return NextResponse.json({ error: "Invalid experience id." }, { status: 400 });
  try {
    const parsed = parseExperience(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
    await connectToDB();
    const document = await Experience.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    return document ? NextResponse.json(document) : NextResponse.json({ error: "Experience not found." }, { status: 404 });
  } catch (error) {
    console.error("PUT /api/experiences/[id] failed", error);
    return NextResponse.json({ error: "Unable to update the experience." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const { id } = await params;
  if (!isMongoObjectId(id)) return NextResponse.json({ error: "Invalid experience id." }, { status: 400 });
  try {
    await connectToDB();
    const document = await Experience.findByIdAndDelete(id);
    return document ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Experience not found." }, { status: 404 });
  } catch (error) {
    console.error("DELETE /api/experiences/[id] failed", error);
    return NextResponse.json({ error: "Unable to delete the experience." }, { status: 500 });
  }
}
