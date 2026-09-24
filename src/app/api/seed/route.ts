import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Development/testing ONLY route to seed db via API
export async function POST() {
  try {
    // Basic implementation since actual script is in prisma/seed.ts
    // We could run child_process here but it's simpler to just require the seed logic or give a 200
    // Real implementation would either invoke the seed functions or exec the process
    return NextResponse.json({ message: "Use 'npx prisma db seed' or run the script manually" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
