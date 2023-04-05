import { z } from "zod";
import { nanoid } from "nanoid";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";

export const shortUrlRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().length(Number(env.SLUG_LENGTH)) }))
    .query(async ({ ctx, input }) => {
      console.log("getBySlug");
      const shortUrl = await ctx.prisma.shortUrl.findUnique({
        where: { slug: input.slug },
      });
      if (!shortUrl) throw new TRPCError({ code: "NOT_FOUND" });
      return shortUrl;
    }),
  create: publicProcedure
    .input(z.object({ url: z.string().url("Invalid URL") }))
    .mutation(async ({ ctx, input }) => {
      console.log("create");
      const shortUrl = await ctx.prisma.shortUrl.findUnique({
        where: { url: input.url },
      });
      if (shortUrl) return shortUrl;
      return ctx.prisma.shortUrl.create({
        data: { url: input.url, slug: nanoid(Number(env.SLUG_LENGTH)) },
      });
    }),
});
