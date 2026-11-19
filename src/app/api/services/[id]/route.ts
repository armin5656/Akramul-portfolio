import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest, requireAdmin } from "@/lib/admin-auth";
import { isMongoObjectId, parseService } from "@/lib/content-validation";
import { connectToDB } from "@/lib/mongoose";
import Service from "@/models/Service.model";

export const runtime = "nodejs";
type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const { id } = await params;
  if (!isMongoObjectId(id)) return NextResponse.json({ error: "Invalid service id." }, { status: 400 });
  try {
    const parsed = parseService(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
    await connectToDB();
    const document = await Service.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    return document ? NextResponse.json(document) : NextResponse.json({ error: "Service not found." }, { status: 404 });
  } catch (error) {
    console.error("PUT /api/services/[id] failed", error);
    return NextResponse.json({ error: "Unable to update the service." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const { id } = await params;
  if (!isMongoObjectId(id)) return NextResponse.json({ error: "Invalid service id." }, { status: 400 });
  try {
    await connectToDB();
    const document = await Service.findByIdAndDelete(id);
    return document ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Service not found." }, { status: 404 });
  } catch (error) {
    console.error("DELETE /api/services/[id] failed", error);
    return NextResponse.json({ error: "Unable to delete the service." }, { status: 500 });
  }
}
