export const DC_KEYWORDS = [
  "digitalocean",
  "amazon",
  "aws",
  "hosting",
  "ovh",
  "hetzner",
  "linode",
  "vultr",
  "contabo",
  "datacamp",
  "cloudflare",
  "google",
  "microsoft",
  "azure",
  "server",
  "datacenter",
  "data center",
  "colocation",
  "leaseweb",
  "choopa",
  "fastly",
  "akamai",
];

export function isDatacenter(asnOrg?: string | null): boolean {
  if (!asnOrg) return false;
  const lower = asnOrg.toLowerCase();
  return DC_KEYWORDS.some((kw) => lower.includes(kw));
}

export function isResidential(asnOrg?: string | null): boolean {
  return !isDatacenter(asnOrg);
}
