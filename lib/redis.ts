import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;

if (!redis && process.env.NODE_ENV !== "production") {
  console.warn(
    "[redis] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN absents — utilisation du stockage en mémoire (non persistant)."
  );
}

// Fallback en mémoire pour le développement local sans Upstash.
// Non partagé entre instances serverless : uniquement pour dev.
const memoryStore = new Map<string, string[]>();

export async function pushToList(
  key: string,
  value: unknown,
  maxLength = 200
): Promise<void> {
  const serialized = JSON.stringify(value);

  if (redis) {
    await redis.lpush(key, serialized);
    await redis.ltrim(key, 0, maxLength - 1);
    return;
  }

  const list = memoryStore.get(key) ?? [];
  list.unshift(serialized);
  memoryStore.set(key, list.slice(0, maxLength));
}

export async function readList<T>(key: string, count = 200): Promise<T[]> {
  if (redis) {
    const raw = await redis.lrange<string>(key, 0, count - 1);
    return raw.map((item) =>
      typeof item === "string" ? (JSON.parse(item) as T) : (item as T)
    );
  }

  const list = memoryStore.get(key) ?? [];
  return list.slice(0, count).map((item) => JSON.parse(item) as T);
}
