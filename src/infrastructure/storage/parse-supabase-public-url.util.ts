export interface SupabaseStorageObjectRef {
  readonly bucket: string;
  readonly path: string;
}

const PUBLIC_OBJECT_PATH_PATTERN = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;

export function parseSupabasePublicUrl(
  url: string,
  supabaseUrl: string,
): SupabaseStorageObjectRef | null {
  const trimmedUrl = url.trim();

  if (trimmedUrl.length === 0 || !trimmedUrl.startsWith(supabaseUrl)) {
    return null;
  }

  const match = PUBLIC_OBJECT_PATH_PATTERN.exec(trimmedUrl);

  if (!match) {
    return null;
  }

  const bucket = match[1];
  const path = decodeURIComponent(match[2]);

  if (!bucket || !path) {
    return null;
  }

  return { bucket, path };
}
