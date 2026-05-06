import type { AnimalRecord } from '@/types/adoption';

const OFFICIAL_URL = 'https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1';
const PROXY_URL = '/api/adoption';
const FALLBACK_IMAGE = '/images/ap.jpg';
const COUNTY_NAMES = [
  '臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市',
  '基隆市', '新竹市', '嘉義市', '新竹縣', '苗栗縣', '彰化縣',
  '南投縣', '雲林縣', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '臺東縣', '澎湖縣', '金門縣', '連江縣'
];

type RawRecord = Record<string, unknown>;

function formatText(value: unknown): string {
  if (value == null) {
    return '';
  }

  const text = String(value).trim();
  return text === 'null' || text === 'undefined' ? '' : text;
}

function normalizeText(value: unknown): string {
  return formatText(value).replace(/台/g, '臺').toLowerCase();
}

function firstNonEmpty(...values: unknown[]): string {
  for (const value of values) {
    const text = formatText(value);
    if (text) {
      return text;
    }
  }
  return '';
}

function normalizeKind(value: unknown): string {
  const text = formatText(value);
  const normalized = normalizeText(value);
  if (normalized.includes('dog') || normalized.includes('狗') || normalized.includes('犬')) return '狗';
  if (normalized.includes('cat') || normalized.includes('貓') || normalized.includes('猫')) return '貓';
  return text || '其他';
}

function normalizeSex(value: unknown): string {
  const text = formatText(value);
  const normalized = normalizeText(value).toUpperCase();
  if (normalized === 'M' || normalized === 'MALE' || normalized.includes('公') || normalized.includes('雄')) return '公';
  if (normalized === 'F' || normalized === 'FEMALE' || normalized.includes('母') || normalized.includes('雌')) return '母';
  if (normalized.includes('未') || normalized.includes('不詳') || normalized.includes('UNKNOWN')) return '未知';
  return text || '未知';
}

function normalizeBodyType(value: unknown): string {
  const text = formatText(value);
  if (!text) return '未提供';
  if (text.includes('小')) return '小型';
  if (text.includes('中')) return '中型';
  if (text.includes('大')) return '大型';
  return text;
}

function normalizeFlag(value: unknown): string {
  const text = formatText(value);
  const normalized = normalizeText(value).toUpperCase();
  if (!text) return '未提供';
  if (['Y', 'YES', 'TRUE', '1'].includes(normalized) || normalized.includes('是') || normalized.includes('已')) return '是';
  if (['N', 'NO', 'FALSE', '0'].includes(normalized) || normalized.includes('否') || normalized.includes('未')) return '否';
  return text;
}

function formatDate(value: unknown): string {
  const text = formatText(value);
  if (!text) return '未提供';
  return text.length > 10 ? text.slice(0, 10) : text;
}

function detectCounty(text: string): string {
  const normalized = normalizeText(text);
  return COUNTY_NAMES.find((county) => normalized.includes(normalizeText(county))) ?? '其他';
}

function resolveImageUrl(value: unknown): string {
  const text = formatText(value);
  if (!text) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(text) || /^\/\//.test(text) || /^data:/i.test(text)) {
    return text;
  }
  return FALLBACK_IMAGE;
}

function normalizeAnimal(raw: RawRecord, index: number): AnimalRecord {
  const place = firstNonEmpty(raw.animal_place, raw.animal_foundplace, raw.shelter_address);
  const shelterAddress = firstNonEmpty(raw.shelter_address, place);
  const county = detectCounty([place, shelterAddress, raw.shelter_name].join(' '));

  return {
    id: firstNonEmpty(raw.animal_id, raw.animal_subid, `${county}-${index}`),
    title: firstNonEmpty(raw.animal_title, raw.animal_Variety, '待認養動物'),
    kind: normalizeKind(raw.animal_kind),
    variety: firstNonEmpty(raw.animal_Variety, '米克斯'),
    sex: normalizeSex(raw.animal_sex),
    bodyType: normalizeBodyType(raw.animal_bodytype),
    age: formatText(raw.animal_age) || '未提供',
    sterilization: normalizeFlag(raw.animal_sterilization),
    bacterin: normalizeFlag(raw.animal_bacterin),
    status: formatText(raw.animal_status) || '待認養',
    remark: formatText(raw.animal_remark),
    caption: formatText(raw.animal_caption),
    openDate: formatDate(raw.animal_opendate),
    closeDate: formatDate(raw.animal_closeddate),
    updateDate: formatDate(raw.cDate || raw.animal_update || raw.album_update),
    shelterName: formatText(raw.shelter_name) || '未提供',
    shelterTel: formatText(raw.shelter_tel),
    shelterAddress: formatText(shelterAddress),
    place: formatText(place),
    county,
    imageUrl: resolveImageUrl(raw.album_file),
    officialUrl: OFFICIAL_URL
  };
}

function extractAnimals(payload: unknown): RawRecord[] {
  if (Array.isArray(payload)) {
    return payload as RawRecord[];
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const candidate = payload as Record<string, unknown>;
  const keys = ['data', 'Data', 'result', 'Result', 'records', 'Records', 'animals', 'Animals', 'items', 'Items'];

  for (const key of keys) {
    const value = candidate[key];
    if (Array.isArray(value)) {
      return value as RawRecord[];
    }
  }

  for (const key of keys) {
    const value = candidate[key];
    if (value && typeof value === 'object') {
      const nested = value as Record<string, unknown>;
      if (Array.isArray(nested.data)) {
        return nested.data as RawRecord[];
      }
    }
  }

  return [];
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, { cache: 'no-store', mode: 'cors' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export async function fetchAdoptionAnimals(): Promise<AnimalRecord[]> {
  const configuredUrl = import.meta.env.VITE_ADOPTION_API_URL as string | undefined;
  const urls = [configuredUrl, PROXY_URL, OFFICIAL_URL].filter(Boolean) as string[];

  for (const url of urls) {
    try {
      const payload = await fetchJson(url);
      const animals = extractAnimals(payload).map(normalizeAnimal);
      if (animals.length > 0) {
        return animals;
      }
    } catch {
      // Try the next source.
    }
  }

  return fallbackAnimals();
}

function fallbackAnimals(): AnimalRecord[] {
  return [
    {
      id: 'fallback-1',
      title: '米克斯待認養',
      kind: '狗',
      variety: '米克斯',
      sex: '公',
      bodyType: '中型',
      age: '成犬',
      sterilization: '未提供',
      bacterin: '未提供',
      status: '示範資料',
      remark: '官方資料暫時無法載入，先以示範資料顯示。',
      caption: '請改用官方入口確認最新資料。',
      openDate: '未提供',
      closeDate: '未提供',
      updateDate: '未提供',
      shelterName: '臺北市動物之家',
      shelterTel: '02-87913254',
      shelterAddress: '臺北市內湖區安美街191號',
      place: '臺北市',
      county: '臺北市',
      imageUrl: FALLBACK_IMAGE,
      officialUrl: OFFICIAL_URL
    },
    {
      id: 'fallback-2',
      title: '可愛貓咪待認養',
      kind: '貓',
      variety: '米克斯',
      sex: '母',
      bodyType: '小型',
      age: '成貓',
      sterilization: '未提供',
      bacterin: '未提供',
      status: '示範資料',
      remark: '請透過官方資料確認認養流程。',
      caption: '示範資料僅供介面展示。',
      openDate: '未提供',
      closeDate: '未提供',
      updateDate: '未提供',
      shelterName: '南投縣公立動物收容所',
      shelterTel: '049-2225440',
      shelterAddress: '南投縣南投市嶺興路36-1號',
      place: '南投縣',
      county: '南投縣',
      imageUrl: FALLBACK_IMAGE,
      officialUrl: OFFICIAL_URL
    }
  ];
}

export function buildTelHref(value: string): string {
  return value ? `tel:${value.replace(/\s+/g, '')}` : '';
}
