export function publicAssetPath(path: string) {
  const absolutePath = path.startsWith("/") ? path : `/${path}`;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${absolutePath}`;
}
