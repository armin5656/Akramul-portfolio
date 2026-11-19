import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest, requireAdmin } from "@/lib/admin-auth";
import { isMongoObjectId, parseArticle } from "@/lib/content-validation";
import { connectToDB } from "@/lib/mongoose";
import Article from "@/models/Articles.model";

export const runtime = "nodejs";
type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const { id } = await params;
  if (!isMongoObjectId(id)) return NextResponse.json({ error: "Invalid article id." }, { status: 400 });
  try {
    const parsed = parseArticle(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
    await connectToDB();
    const document = await Article.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    return document ? NextResponse.json(document) : NextResponse.json({ error: "Article not found." }, { status: 404 });
  } catch (error) {
    console.error("PUT /api/articles/[id] failed", error);
    return NextResponse.json({ error: "Unable to update the article." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  const { id } = await params;
  if (!isMongoObjectId(id)) return NextResponse.json({ error: "Invalid article id." }, { status: 400 });
  try {
    await connectToDB();
    const document = await Article.findByIdAndDelete(id);
    return document ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Article not found." }, { status: 404 });
  } catch (error) {
    console.error("DELETE /api/articles/[id] failed", error);
    return NextResponse.json({ error: "Unable to delete the article." }, { status: 500 });
  }
}
