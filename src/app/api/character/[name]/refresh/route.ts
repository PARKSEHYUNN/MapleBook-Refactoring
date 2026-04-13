import { NextRequest } from "next/server";

import { characterRefreshHandler } from "@/features/character/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  return characterRefreshHandler(request, decodeURIComponent(name));
}
