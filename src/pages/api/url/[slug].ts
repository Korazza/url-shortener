import type { NextApiRequest, NextApiResponse } from "next";

import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

const shortUrlBySlugHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const ctx = createTRPCContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  try {
    const slug = req.query.slug as string;
    console.log(slug);
    const shortUrl = await caller.shortUrl.getBySlug({ slug });
    await caller.shortUrl.incrementVisits({ slug });
    console.log(shortUrl.url);
    return res
      .setHeader(
        "Cache-Control",
        "public, s-maxage=2592000, stale-while-revalidate"
      )
      .status(200)
      .json(shortUrl);
  } catch (err) {
    if (err instanceof TRPCError) {
      const httpCode = getHTTPStatusCodeFromError(err);
      return res.status(httpCode).json(err);
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default shortUrlBySlugHandler;
