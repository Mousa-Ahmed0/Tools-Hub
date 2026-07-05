export function revokeObjectUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function revokeObjectUrls(urls: string[]) {
  urls.forEach(revokeObjectUrl);
}
