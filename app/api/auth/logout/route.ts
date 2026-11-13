import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (token) {
    deleteSession(token);
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete("admin_session");
  return response;
}

