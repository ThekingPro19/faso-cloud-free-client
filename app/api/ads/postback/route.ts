
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Ne pas accepter de récompenses sans vérification.
  // La signature BitcoTasks sera ajoutée ensuite.
  return NextResponse.json(
    { error: "Postback not configured" },
    { status: 503 }
  );
}

export async function GET() {
  return NextResponse.json({
    service: "FASO CLOUD Free",
    postback: "not configured"
  });
}
