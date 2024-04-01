function checkAndCorrectURL(url: string): string {
  // Detect if it has http or https
  const hasHttps: boolean = url.startsWith('https://');

  // Remove "http://" or "https://" if present
  url = url.replace(/^https?:\/\//i, '');

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  const httpType: string = hasHttps ? 'https://' : 'http://';
  return httpType + url;
}

export default checkAndCorrectURL;
