import { type NextPage } from "next";
import { useRef } from "react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { env } from "@/env.mjs";

const HomePage: NextPage = () => {
  const urlInput = useRef<HTMLInputElement>(null);
  const slugInput = useRef<HTMLInputElement>(null);
  const { mutate, data, isLoading, isSuccess, error, isError } =
    api.shortUrl.create.useMutation();

  const mutateShortUrl = () => {
    mutate({
      url: urlInput.current?.value ?? "",
      slug: slugInput.current?.value ?? "",
    });
  };

  return (
    <>
      <Head>
        <title>Url Shortener</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-[100lvh] flex-col items-center justify-center bg-gradient-to-b from-blue-800 to-slate-900 text-slate-200">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            Url Shortener
          </h1>
          <div className="flex w-full place-items-center justify-center gap-2">
            <input
              ref={urlInput}
              className="rounded bg-slate-900/75 px-3 py-2 text-slate-50 shadow outline-none"
              placeholder="https://..."
              onKeyDown={(e) => {
                if (e.key === "Enter") mutateShortUrl();
              }}
            />
            <span className="text-slate-400">/to/</span>
            <input
              ref={slugInput}
              maxLength={Number(env.NEXT_PUBLIC_SLUG_MAX_LENGTH)}
              className="w-28 rounded bg-slate-900/75 py-2 text-center text-slate-50 shadow outline-none"
              placeholder="slug..."
              onKeyDown={(e) => {
                if (e.key === "Enter") mutateShortUrl();
              }}
            />
          </div>
          <button
            className="rounded-full bg-blue-900 px-5 py-2 shadow-lg transition hover:bg-blue-900/75 active:bg-blue-900/50"
            onClick={mutateShortUrl}
          >
            Generate
          </button>
          {isLoading && <span className="text-slate-400">Loading...</span>}
          {isSuccess && (
            <Link href={`/to/${data.slug}`} target="_blank">
              {window.location.origin}/to/{data.slug}
            </Link>
          )}
          {isError && (
            <span className="text-red-500">
              {error.data?.zodError?.fieldErrors["url"] ??
                (error.data?.code === "CONFLICT" && "URL already registered")}
            </span>
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;
