import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const response = await fetch(
            `https://api.mangadex.org/manga/${params.id}?includes[]=cover_art&includes[]=author&includes[]=artist`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error proxying manga details:", error);
        return NextResponse.json({ error: "Failed to fetch manga details" }, { status: 500 });
    }
}
