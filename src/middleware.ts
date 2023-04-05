import { type NextRequest, NextResponse } from "next/server";

import type { RouterOutputs } from "@/utils/api";

export const config = {
  matcher: "/to/:slug*",
};

const middleware = async (req: NextRequest) => {
  const slug = req.nextUrl.pathname.split("/").pop();

  if (typeof slug !== "string")
    return NextResponse.redirect(req.nextUrl.origin);

  const data = await fetch(`${req.nextUrl.origin}/api/url/${slug}`);

  if (!data || data.status !== 200)
    return NextResponse.redirect(req.nextUrl.origin);

  const shortUrl =
    (await data.json()) as RouterOutputs["shortUrl"]["getBySlug"];

  return NextResponse.redirect(shortUrl.url);
};

export default middleware;
