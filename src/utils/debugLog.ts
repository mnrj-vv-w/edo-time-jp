/**
 * デバッグログユーティリティ
 * Debug Log Utility
 *
 * デバッグモード時のみメモリに構造化ログを蓄積し、コンソール出力とダウンロードで共有できるようにする。
 * 開発・調査時のみ有効化することを推奨。
 */

const MAX_LOGS = 500;
const STORAGE_KEY = "edo-time-debug";

export interface LogEntry {
  timestamp: string;
  scope: string;
  payload: Record<string, unknown>;
}

const logBuffer: LogEntry[] = [];

/**
 * デバッグモードかどうかを判定する
 * URL: ?debug=1 or ?debug=true、または localStorage の edo-time-debug が 1 or true のとき true
 */
export function isDebug(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  const q = params.get("debug");
  if (q === "1" || q === "true") return true;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "1" || stored === "true";
  } catch {
    return false;
  }
}

/**
 * デバッグモード時のみログを蓄積し、コンソールにも出す
 */
export function log(scope: string, payload: Record<string, unknown>): void {
  if (!isDebug()) return;
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    scope,
    payload,
  };
  logBuffer.push(entry);
  if (logBuffer.length > MAX_LOGS) logBuffer.shift();
  console.debug("[edo-time]", scope, payload);
}

/**
 * 蓄積したログ配列を返す
 */
export function getLogs(): LogEntry[] {
  return [...logBuffer];
}

/**
 * 蓄積したログを空にする
 */
export function clearLogs(): void {
  logBuffer.length = 0;
}

/**
 * 蓄積したログを JSON ファイルとしてダウンロードする
 */
export function downloadLogs(filename?: string): void {
  const name =
    filename ?? `edo-time-debug-${Date.now()}.json`;
  const json = JSON.stringify(getLogs(), null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
