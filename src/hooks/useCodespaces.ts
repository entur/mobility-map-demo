import { useQuery } from "@apollo/client";
import { CODESPACES_QUERY } from "api/graphql";
import { Codespace } from "model/codespace";
import { useMemo } from "react";

export default function useCodespaces() {
  const { data: codespaceData } = useQuery(CODESPACES_QUERY);

  return useMemo(() => {
    return (codespaceData?.codespaces || []) as Codespace[];
  }, [codespaceData?.codespaces]);
}
