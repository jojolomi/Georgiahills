import React, { useEffect, useState } from "react";
import { AdminApi } from "../../shared/api/adminApiClient";
import { Card, Table } from "../../shared/components/ui";
import { MARKET_CODES } from "../../../../../packages/shared/src/contracts/market.js";

export function SeoMarketsModule() {
  const [health, setHealth] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    AdminApi.getIntegrationHealth().then((res) => setHealth((res.data || res).seo || (res.data || res))).catch((e) => setMessage(e.message));
  }, []);

  const pages = health?.marketPages || {};
  const rows = MARKET_CODES.map((code) => {
    const item = pages[code] || { keywordCoverage: false, schemaCoverage: false };
    return [code, item.keywordCoverage ? "OK" : "Needs work", item.schemaCoverage ? "OK" : "Needs work"];
  });

  return <Card title="SEO + Market Health">
    {!health ? "Loading..." : <Table columns={["Market", "Keyword Coverage", "Schema Coverage"]} rows={rows} />}
    {message && <p className="muted">{message}</p>}
  </Card>;
}
