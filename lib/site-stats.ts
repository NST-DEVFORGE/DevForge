import prData from "@/pr-data-report.json";

/**
 * pr-data-report.json's own `summary` block only covers the orgs that script
 * currently queries and does not include ESoC contributions (tracked
 * separately in data/esoc-stats.json). These totals are the manually
 * reconciled figures already used across the site — kept in one place so
 * the homepage and the open-source pages can't quietly disagree.
 */
export const TOTAL_MERGED_PRS = 285;
export const TOTAL_PRS = 335;
export const TOTAL_OPEN_PRS = prData.members.reduce((acc, m) => acc + m.allPRs.open, 0);
export const TOTAL_CONTRIBUTORS = prData.members.length;
