import { z } from "zod";
import { nanoid } from "nanoid";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";
import { TRPCError } from "@trpc/server";

export const shortUrlRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().max(Number(env.NEXT_PUBLIC_SLUG_MAX_LENGTH)),
      })
    )
    .query(async ({ ctx, input }) => {
      console.log("getBySlug");
      const shortUrl = await ctx.prisma.shortUrl.findUnique({
        where: { slug: input.slug },
      });
      if (!shortUrl) throw new TRPCError({ code: "NOT_FOUND" });
      return shortUrl;
    }),
  create: publicProcedure
    .input(
      z.object({
        url: z.string().url("Invalid URL"),
        slug: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("create");
      if (!!input.slug) {
        const shortUrl = await ctx.prisma.shortUrl.findUnique({
          where: { slug: input.slug },
        });
        if (shortUrl) return shortUrl;
      }
      return ctx.prisma.shortUrl.create({
        data: {
          url: input.url,
          slug: input.slug || nanoid(Number(env.NEXT_PUBLIC_SLUG_MAX_LENGTH)),
        },
      });
    }),
});
