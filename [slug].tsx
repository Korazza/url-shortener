import type { GetServerSideProps, NextPage } from "next";

import { prisma } from "@/server/db";

const RedirectPage: NextPage = () => null;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1000000, stale-while-revalidate=1000000"
  );
  const shortUrl = await prisma.shortUrl.findUnique({
    where: { slug: params?.slug as string },
  });
  if (!shortUrl)
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  return {
    redirect: {
      permanent: false,
      destination: shortUrl.url,
    },
    props: {},
  };
};

export default RedirectPage;
