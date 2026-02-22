/**
 * 逆ジオコーディング（緯度・経度 → 地名）
 * Reverse Geocoding (coordinates → place name)
 *
 * BigDataCloud の無料クライアント用 API を使用。CORS 許可のためブラウザから直接呼び出せる。
 * Fair Use: ブラウザの Geolocation で取得した現在地の座標に限定。
 *
 * Uses BigDataCloud free client-side API. CORS allowed for direct browser calls.
 */

/** BigDataCloud reverse-geocode-client のレスポンス（一部） */
interface BigDataCloudResult {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
}

const CACHE_KEY_PRECISION = 4;

const cache = new Map<string, string>();

function cacheKey(lat: number, lon: number): string {
  const latR = Math.round(lat * Math.pow(10, CACHE_KEY_PRECISION));
  const lonR = Math.round(lon * Math.pow(10, CACHE_KEY_PRECISION));
  return `${latR},${lonR}`;
}

function buildPlaceName(data: BigDataCloudResult): string {
  const city = data.city ?? data.locality;
  const state = data.principalSubdivision;
  const parts: string[] = [];
  if (city) parts.push(city);
  if (state && state !== city) parts.push(state);
  if (parts.length > 0) return parts.join('・');
  if (data.countryName) return data.countryName;
  return '';
}

/**
 * 緯度・経度から地名を取得する（BigDataCloud 逆ジオコーディング）
 * 同一位置はキャッシュを返す。
 *
 * @param lat - 緯度 / Latitude
 * @param lon - 経度 / Longitude
 * @returns 地名（取得失敗時は null）/ Place name (null on failure)
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  const key = cacheKey(lat, lon);
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('localityLanguage', 'ja');

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as BigDataCloudResult;
  const name = buildPlaceName(data);
  if (name) cache.set(key, name);
  return name || null;
}
