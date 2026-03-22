import { NextResponse } from "next/server";
import { getAllJobs } from "@/lib/jobs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const q = searchParams.get("q") || undefined;
  const location = searchParams.get("location") || undefined;
  const type = searchParams.get("type") || undefined;
  const page = searchParams.get("page") || undefined;
  const limit = searchParams.get("limit") || undefined;

  const result = await getAllJobs({ q, location, type, page, limit });
  
  return NextResponse.json(result);
}
