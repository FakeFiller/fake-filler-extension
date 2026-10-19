// Syncs the FillPilot options through the browser's own account sync (chrome.storage.sync), so they follow
// the user to every browser signed in to the same Google / Microsoft / Firefox account.
// AI API keys live in a separate chrome.storage.local entry and are never synced.

import { IFakeFillerOptions } from "src/types";

const SYNC_META_KEY = "optionsSyncMeta";
const SYNC_CHUNK_PREFIX = "optionsSync_";
const SYNC_ENABLED_KEY = "syncEnabled";
const LOCAL_UPDATED_AT_KEY = "optionsUpdatedAt";
// chrome.storage.sync allows 8 KB per item; 2000 characters stays under that even for multi-byte text.
const CHUNK_LENGTH = 2000;

interface ISyncMeta {
  updatedAt: number;
  chunks: number;
}

export interface ISyncStatus {
  enabled: boolean;
  lastSyncedAt: number | null;
  error: string | null;
}

function storageGet<T>(area: chrome.storage.StorageArea, keys: string | string[] | null): Promise<T> {
  return new Promise((resolve) => area.get(keys, (result) => resolve(result as T)));
}

function storageSet(area: chrome.storage.StorageArea, items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve, reject) =>
    area.set(items, () => (chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve()))
  );
}

function storageRemove(area: chrome.storage.StorageArea, keys: string[]): Promise<void> {
  return new Promise((resolve) => area.remove(keys, () => resolve()));
}

export async function IsSyncEnabled(): Promise<boolean> {
  const result = await storageGet<Record<string, boolean | undefined>>(chrome.storage.local, SYNC_ENABLED_KEY);
  return result[SYNC_ENABLED_KEY] !== false;
}

export async function GetSyncStatus(): Promise<ISyncStatus> {
  const local = await storageGet<Record<string, unknown>>(chrome.storage.local, [
    SYNC_ENABLED_KEY,
    LOCAL_UPDATED_AT_KEY,
    "syncError",
  ]);
  return {
    enabled: local[SYNC_ENABLED_KEY] !== false,
    lastSyncedAt: (local[LOCAL_UPDATED_AT_KEY] as number) || null,
    error: (local.syncError as string) || null,
  };
}

// Uploads the options. Called whenever they are saved locally.
export async function PushOptionsToSync(options: IFakeFillerOptions): Promise<void> {
  const updatedAt = Date.now();

  try {
    // Stamp this browser's copy before uploading anything, and even while sync is off: the sync change event
    // this upload fires then finds nothing newer to pull back over a later save, and edits made while sync was
    // off still win over older synced options when sync is turned on again.
    await storageSet(chrome.storage.local, { [LOCAL_UPDATED_AT_KEY]: updatedAt });
  } catch {
    // The upload below still compares by its own timestamp.
  }

  if (!(await IsSyncEnabled())) {
    return;
  }

  const json = JSON.stringify(options);
  const items: Record<string, unknown> = {};
  const chunkCount = Math.ceil(json.length / CHUNK_LENGTH);
  for (let i = 0; i < chunkCount; i += 1) {
    items[`${SYNC_CHUNK_PREFIX}${i}`] = json.substr(i * CHUNK_LENGTH, CHUNK_LENGTH);
  }

  const meta: ISyncMeta = { updatedAt, chunks: chunkCount };

  try {
    // Chunks first, then the meta entry, so other browsers never assemble a half-written set.
    await storageSet(chrome.storage.sync, items);
    await storageSet(chrome.storage.sync, { [SYNC_META_KEY]: meta });
    await storageSet(chrome.storage.local, { syncError: "" });

    const existing = await storageGet<Record<string, unknown>>(chrome.storage.sync, null);
    const staleKeys = Object.keys(existing).filter(
      (key) => key.startsWith(SYNC_CHUNK_PREFIX) && Number(key.substring(SYNC_CHUNK_PREFIX.length)) >= chunkCount
    );
    if (staleKeys.length > 0) {
      await storageRemove(chrome.storage.sync, staleKeys);
    }
  } catch (error) {
    // Usually the sync quota (about 100 KB in total); the options are still saved locally.
    await storageSet(chrome.storage.local, { syncError: (error as Error).message });
  }
}

// Returns the synced options when they are newer than this browser's copy, otherwise null.
export async function PullNewerOptionsFromSync(): Promise<IFakeFillerOptions | null> {
  if (!(await IsSyncEnabled())) {
    return null;
  }

  const synced = await storageGet<Record<string, unknown>>(chrome.storage.sync, null);
  const meta = synced[SYNC_META_KEY] as ISyncMeta | undefined;
  if (!meta || !meta.chunks) {
    return null;
  }

  const local = await storageGet<Record<string, number | undefined>>(chrome.storage.local, LOCAL_UPDATED_AT_KEY);
  if ((local[LOCAL_UPDATED_AT_KEY] || 0) >= meta.updatedAt) {
    return null;
  }

  let json = "";
  for (let i = 0; i < meta.chunks; i += 1) {
    const chunk = synced[`${SYNC_CHUNK_PREFIX}${i}`];
    if (typeof chunk !== "string") {
      // Another browser is still uploading; the next change event will bring the complete set.
      return null;
    }
    json += chunk;
  }

  try {
    const options = JSON.parse(json) as IFakeFillerOptions;
    await storageSet(chrome.storage.local, { [LOCAL_UPDATED_AT_KEY]: meta.updatedAt });
    return options;
  } catch {
    return null;
  }
}

export function IsSyncChange(changes: { [key: string]: chrome.storage.StorageChange }, areaName: string): boolean {
  return areaName === "sync" && SYNC_META_KEY in changes;
}

// Stores options that arrived from another browser as this browser's options.
export async function ApplySyncedOptions(options: IFakeFillerOptions): Promise<void> {
  await storageSet(chrome.storage.local, { options });
}

export async function SetSyncEnabled(enabled: boolean, currentOptions: IFakeFillerOptions): Promise<void> {
  await storageSet(chrome.storage.local, { [SYNC_ENABLED_KEY]: enabled, syncError: "" });
  if (!enabled) {
    return;
  }

  // Bring this browser up to date first, then share its options if nothing newer exists elsewhere.
  const newer = await PullNewerOptionsFromSync();
  if (newer) {
    await ApplySyncedOptions(newer);
    // The service worker passes the new options on to open tabs.
    chrome.runtime.sendMessage({ type: "optionsUpdated" }, () => chrome.runtime.lastError);
  } else {
    await PushOptionsToSync(currentOptions);
  }
}
