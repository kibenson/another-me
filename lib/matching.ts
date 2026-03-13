/**
 * Computes cosine similarity between two frequency vectors.
 * Returns a value between 0 and 1 (1 = identical).
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] ** 2;
    magnitudeB += vecB[i] ** 2;
  }

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

/**
 * Builds a frequency vector for a user based on their tag usage counts.
 * Vector entries correspond to the ordered list of tagSlugs.
 */
export function buildTagVector(
  tagCounts: Record<string, number>,
  tagSlugs: string[]
): number[] {
  return tagSlugs.map((slug) => tagCounts[slug] ?? 0);
}

export interface MatchResult {
  userId: string;
  name: string | null;
  email: string;
  similarity: number;
  sharedTags: string[];
}

/**
 * Given a reference user's tag counts and a list of other users' tag counts,
 * returns sorted matches by cosine similarity (descending), filtered to >= minSimilarity.
 */
export function computeMatches(
  currentUserCounts: Record<string, number>,
  otherUsers: Array<{ userId: string; name: string | null; email: string; tagCounts: Record<string, number> }>,
  tagSlugs: string[],
  minSimilarity = 0.3
): MatchResult[] {
  const currentVec = buildTagVector(currentUserCounts, tagSlugs);

  const results: MatchResult[] = [];

  for (const other of otherUsers) {
    const otherVec = buildTagVector(other.tagCounts, tagSlugs);
    const similarity = cosineSimilarity(currentVec, otherVec);

    if (similarity >= minSimilarity) {
      const sharedTags = tagSlugs.filter(
        (slug) => (currentUserCounts[slug] ?? 0) > 0 && (other.tagCounts[slug] ?? 0) > 0
      );

      results.push({
        userId: other.userId,
        name: other.name,
        email: other.email,
        similarity,
        sharedTags,
      });
    }
  }

  return results.sort((a, b) => b.similarity - a.similarity);
}
