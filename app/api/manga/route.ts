import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = new URL("https://api.mangadex.org/manga");

    // Copy all search params
    searchParams.forEach((value, key) => {
        url.searchParams.append(key, value);
    });

    try {
        const response = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error proxying manga request:", error);
        return NextResponse.json({ error: "Failed to fetch manga" }, { status: 500 });
    }
}
