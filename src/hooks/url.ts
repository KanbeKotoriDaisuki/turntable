import { cluster } from "radash";
import { useSearch } from "wouter";

export const useParsedData = () => {
  const raw = useSearch();
  const params = new URLSearchParams(raw);

  let parsed: Record<string, string | undefined> = {};
  for (const [key, value] of params) {
    parsed[key] = value;
  }

  const title = parsed.title;
  const tableItems: [string, number][] = cluster(
    parsed.items?.split(",") ?? [],
    2
  ).map(([name, weight]) => [name, Number(weight)]);
  const procedure = parsed.procedure?.split(",") ?? [];
  const historyItems = parsed.history?.split(",").map(Number) ?? [];

  return { title, tableItems, procedure, historyItems };
};
