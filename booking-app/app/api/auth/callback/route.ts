import { oauth2Client } from "@/lib/googleClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter" },
      { status: 400 },
    );
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    // トークンをセッションに保存するか、フロントエンドに返す
    // ここではフロントエンドにトークンを返す例を示します
    return NextResponse.json(tokens, { status: 200 });
  } catch (error) {
    console.error("Error getting tokens:", error);
    return NextResponse.json(
      { error: "Failed to get tokens" },
      { status: 500 },
    );
  }
}
