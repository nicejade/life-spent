import type { Gender } from '../types/main';

/**
 * URL query parameters for sharing life calculation results.
 * Format: ?birth=YYYYMMDD&gender=male|female&median-age=77
 */
export interface ShareParams {
  birth: string; // Format: YYYYMMDD (e.g., "19961228")
  gender: Gender;
  medianAge: number;
}

/**
 * Build a shareable URL with current calculation parameters.
 * @param params - The parameters to encode in the URL
 * @returns Complete URL with query parameters
 */
export function buildShareUrl(params: ShareParams): string {
  const url = new URL(window.location.href);
  
  // Clear existing search params
  url.search = '';
  
  // Add new parameters
  url.searchParams.set('birth', params.birth);
  url.searchParams.set('gender', params.gender);
  url.searchParams.set('median-age', String(params.medianAge));
  
  return url.toString();
}

/**
 * Parse share parameters from URL query string.
 * @returns Parsed parameters or null if invalid
 */
export function parseShareParams(): ShareParams | null {
  const url = new URL(window.location.href);
  const birth = url.searchParams.get('birth');
  const gender = url.searchParams.get('gender');
  const medianAge = url.searchParams.get('median-age');
  
  // Validate required parameters
  if (!birth || !gender || !medianAge) {
    return null;
  }
  
  // Validate birth date format (YYYYMMDD)
  if (!/^\d{8}$/.test(birth)) {
    return null;
  }
  
  // Validate gender
  if (gender !== 'male' && gender !== 'female') {
    return null;
  }
  
  // Validate median age (positive number, max 150)
  const medianAgeNum = parseFloat(medianAge);
  if (isNaN(medianAgeNum) || medianAgeNum <= 0 || medianAgeNum > 150) {
    return null;
  }
  
  // Validate date is reasonable (not in future, not too old)
  const year = parseInt(birth.substring(0, 4), 10);
  const month = parseInt(birth.substring(4, 6), 10);
  const day = parseInt(birth.substring(6, 8), 10);
  
  const birthDate = new Date(year, month - 1, day);
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 150, 0, 1);
  
  if (isNaN(birthDate.getTime()) || birthDate > now || birthDate < minDate) {
    return null;
  }
  
  return {
    birth,
    gender: gender as Gender,
    medianAge: medianAgeNum
  };
}

/**
 * Convert birth date string (YYYYMMDD) to Date object.
 * @param birthStr - Birth date string in YYYYMMDD format
 * @returns Date object
 */
export function birthStringToDate(birthStr: string): Date {
  const year = parseInt(birthStr.substring(0, 4), 10);
  const month = parseInt(birthStr.substring(4, 6), 10);
  const day = parseInt(birthStr.substring(6, 8), 10);
  return new Date(year, month - 1, day);
}

/**
 * Convert Date object to birth date string (YYYYMMDD).
 * @param date - Date object
 * @returns Birth date string in YYYYMMDD format
 */
export function dateToBirthString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Copy share URL to clipboard.
 * @param url - The URL to copy
 * @returns Promise that resolves when copied
 */
export async function copyShareUrl(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}
