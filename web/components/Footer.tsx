import { getProxies, getProxyStats } from "@/lib/proxies";
import FooterClient from "./FooterClient";

export default async function Footer() {
  const allProxies = await getProxies();
  const stats = getProxyStats(allProxies);

  return <FooterClient stats={stats} />;
}
