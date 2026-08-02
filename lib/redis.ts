import { createClient, type RedisClientType } from "redis";

const url = process.env.REDIS_URL;

if (!url && process.env.NODE_ENV !== "production") {
  console.warn(
    "[redis] REDIS_URL absent — utilisation du stockage en mémoire (non persistant)."
  );
}

let clientPromise: Promise<RedisClientType> | null = null;

async function getClient(): Promise<RedisClientType | null> {
  if (!url) return null;

  if (!clientPromise) {
    const client: RedisClientType = createClient({ url });
    client.on("error", (err) => console.error("[redis] client error", err));
    clientPromise = client.connect().then(() => client);
  }

  return clientPromise;
}

// Fallback en mémoire pour le développement local sans Redis.
// Non partagé entre instances serverless : uniquement pour dev.
const memoryStore = new Map<string, string[]>();
const memoryHashStore = new Map<string, Map<string, string>>();

export async function pushToList(
  key: string,
  value: unknown,
  maxLength = 200
): Promise<void> {
  const serialized = JSON.stringify(value);
  const client = await getClient();

  if (client) {
    await client.lPush(key, serialized);
    await client.lTrim(key, 0, maxLength - 1);
    return;
  }

  const list = memoryStore.get(key) ?? [];
  list.unshift(serialized);
  memoryStore.set(key, list.slice(0, maxLength));
}

export async function readList<T>(key: string, count = 200): Promise<T[]> {
  const client = await getClient();

  if (client) {
    const raw = await client.lRange(key, 0, count - 1);
    return raw.map((item) => JSON.parse(item) as T);
  }

  const list = memoryStore.get(key) ?? [];
  return list.slice(0, count).map((item) => JSON.parse(item) as T);
}

export async function removeFromListById(
  key: string,
  id: string
): Promise<boolean> {
  const client = await getClient();

  const matchesId = (raw: string): boolean => {
    try {
      return (JSON.parse(raw) as { id?: string }).id === id;
    } catch {
      return false;
    }
  };

  if (client) {
    const raw = await client.lRange(key, 0, -1);
    const filtered = raw.filter((item) => !matchesId(item));
    if (filtered.length === raw.length) return false;

    const multi = client.multi();
    multi.del(key);
    if (filtered.length > 0) {
      multi.rPush(key, filtered);
    }
    await multi.exec();
    return true;
  }

  const list = memoryStore.get(key) ?? [];
  const filtered = list.filter((item) => !matchesId(item));
  if (filtered.length === list.length) return false;

  memoryStore.set(key, filtered);
  return true;
}

export async function listLength(key: string): Promise<number> {
  const client = await getClient();
  if (client) return client.lLen(key);

  return (memoryStore.get(key) ?? []).length;
}

export async function getHashField(
  hashKey: string,
  field: string
): Promise<string | null> {
  const client = await getClient();

  if (client) {
    const value = await client.hGet(hashKey, field);
    return value ?? null;
  }

  return memoryHashStore.get(hashKey)?.get(field) ?? null;
}

export async function setHashField(
  hashKey: string,
  field: string,
  value: string
): Promise<void> {
  const client = await getClient();

  if (client) {
    await client.hSet(hashKey, field, value);
    return;
  }

  const hash = memoryHashStore.get(hashKey) ?? new Map<string, string>();
  hash.set(field, value);
  memoryHashStore.set(hashKey, hash);
}

export async function readHash(hashKey: string): Promise<Record<string, string>> {
  const client = await getClient();

  if (client) {
    return client.hGetAll(hashKey);
  }

  const hash = memoryHashStore.get(hashKey) ?? new Map<string, string>();
  return Object.fromEntries(hash);
}

export async function deleteHashField(hashKey: string, field: string): Promise<void> {
  const client = await getClient();

  if (client) {
    await client.hDel(hashKey, field);
    return;
  }

  memoryHashStore.get(hashKey)?.delete(field);
}
