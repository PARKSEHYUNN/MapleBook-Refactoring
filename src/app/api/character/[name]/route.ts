import { NextRequest } from "next/server";

import { characterHandler } from "@/features/character/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  return characterHandler(request, decodeURIComponent(name));
}
