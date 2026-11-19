import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Admin from "@/models/Admin.model";
import { hashPassword, isSameOriginRequest, requireAdmin } from "@/lib/admin-auth";
import { parseAdminUpdate } from "@/lib/content-validation";

export const runtime = "nodejs";

function logServerError(context: string, error: unknown) {
  // Keep detailed diagnostics in Vercel logs; never send connection strings to clients.
  console.error(`[${context}]`, error);
}

export async function GET(request: NextRequest) {
  try {
    const session = requireAdmin(request);
    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    await connectToDB();
    // Never return password hashes or plaintext passwords from this endpoint.
    const admin = await Admin.findById(session.adminId).select("_id email createdAt updatedAt").lean();
    if (!admin) return NextResponse.json({ error: "Admin account not found." }, { status: 404 });
    return NextResponse.json([admin]);
  } catch (error) {
    logServerError("GET /api/admin failed", error);
    return NextResponse.json(
      { error: "Unable to load admin information. Check the server database configuration and Vercel runtime logs." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = requireAdmin(req);
    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
    await connectToDB();
    const parsed = parseAdminUpdate(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const updates: { email?: string; password?: string } = { ...parsed.data };
    // Password is write-only and is stored as a scrypt hash.
    if (updates.password) updates.password = await hashPassword(updates.password);

    const updatedAdmin = await Admin.findByIdAndUpdate(session.adminId, { $set: updates }, {
      new: true,
      runValidators: true,
      projection: { password: 0 },
    }).select("_id email createdAt updatedAt");

    if (!updatedAdmin) {
      return NextResponse.json({ error: "No admin record found." }, { status: 404 });
    }

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    logServerError("PUT /api/admin failed", error);
    return NextResponse.json(
      { error: "Unable to update admin information. Check the server database configuration and Vercel runtime logs." },
      { status: 500 }
    );
  }
}
