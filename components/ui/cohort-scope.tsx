"use client";

import { Fragment, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { cohortFromParam } from "@/lib/cohorts";

/**
 * Remounts its subtree when the selected year group changes.
 *
 * Switching year replaces every piece of state a page holds: the fetched
 * numbers, whether a fetch is in flight, any error from the last one, and the
 * author or member filters, which list people who are not in the other cohort.
 * Resetting those one by one inside an effect is how this broke — clearing the
 * data but not the loading flag left the page rendering neither a spinner nor
 * a result, so it went blank for as long as the next fetch took.
 *
 * Keying the subtree is React's own answer to "reset all state when an input
 * changes", and it cannot drift: new state is whatever the component starts
 * with, so a value added later is covered without anybody remembering to reset
 * it here.
 *
 * It reads the year on the client so the pages above it stay prerenderable;
 * reading searchParams in the page itself would make the whole route dynamic.
 */
export function CohortScope({ children }: { children: ReactNode }) {
    const cohort = cohortFromParam(useSearchParams().get("year"));
    return <Fragment key={cohort.id}>{children}</Fragment>;
}
