export function makeHistogramBuckets(start: number, factor: number, count: number): number[] {
  const buckets: number[] = [];
  let current = start;
  
  for (let i = 0; i < count; i++) {
    buckets.push(current);
    current *= factor;
  }
  
  return buckets;
}

// Buckets padrão para duração de operações (em segundos)
export const DEFAULT_DURATION_BUCKETS = makeHistogramBuckets(0.01, 2, 10); // 0.01s to ~10s

// Buckets padrão para tamanho de payload (em bytes)
export const DEFAULT_SIZE_BUCKETS = makeHistogramBuckets(100, 2, 8); // 100B to ~25KB 