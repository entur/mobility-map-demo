import { useQuery } from "@apollo/client";
import { OPERATORS_QUERY } from "api/graphql";
import { Operator } from "model/operator";
import { useMemo } from "react";

export default function useCodespaces() {
  const { data } = useQuery(OPERATORS_QUERY);

  return useMemo(() => {
    return (data?.operators || []) as Operator[];
  }, [data?.operators]);
}
