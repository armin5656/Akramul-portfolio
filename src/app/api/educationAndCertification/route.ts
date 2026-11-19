import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest, requireAdmin } from "@/lib/admin-auth";
import { parseEducation } from "@/lib/content-validation";
import { connectToDB } from "@/lib/mongoose";
import EducationAndCertification from "@/models/EducationAndCertification.model";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDB();
    return NextResponse.json(await EducationAndCertification.find({}).lean());
  } catch (error) {
    console.error("GET /api/educationAndCertification failed", error);
    return NextResponse.json({ error: "Unable to load education and certifications." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const parsed = parseEducation(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
    await connectToDB();
    return NextResponse.json(await EducationAndCertification.create(parsed.data), { status: 201 });
  } catch (error) {
    console.error("POST /api/educationAndCertification failed", error);
    return NextResponse.json({ error: "Unable to save education and certification content." }, { status: 500 });
  }
}
