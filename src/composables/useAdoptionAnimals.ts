import { computed, onMounted, ref, watch } from 'vue';
import { fetchAdoptionAnimals } from '@/services/adoptionApi';
import type { AdoptionFilters, AnimalRecord } from '@/types/adoption';

const DEFAULT_FILTERS: AdoptionFilters = {
  county: '',
  kind: '',
  sex: '',
  bodyType: '',
  keyword: ''
};

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-Hant-TW'));
}

function normalizeText(value: string): string {
  return value.replace(/台/g, '臺').toLowerCase();
}

export function useAdoptionAnimals() {
  const animals = ref<AnimalRecord[]>([]);
  const filters = ref<AdoptionFilters>({ ...DEFAULT_FILTERS });
  const loading = ref(true);
  const warning = ref('');

  const counties = computed(() => uniqueSorted(animals.value.map((animal) => animal.county)));
  const kinds = computed(() => uniqueSorted(animals.value.map((animal) => animal.kind)));
  const sexes = computed(() => uniqueSorted(animals.value.map((animal) => animal.sex)));
  const bodyTypes = computed(() => uniqueSorted(animals.value.map((animal) => animal.bodyType)));

  const filteredAnimals = computed(() =>
    animals.value.filter((animal) => {
      const current = filters.value;

      if (current.county && animal.county !== current.county) return false;
      if (current.kind && animal.kind !== current.kind) return false;
      if (current.sex && animal.sex !== current.sex) return false;
      if (current.bodyType && animal.bodyType !== current.bodyType) return false;

      const keyword = current.keyword.trim();
      if (!keyword) return true;

      const haystack = normalizeText([
        animal.title,
        animal.variety,
        animal.kind,
        animal.shelterName,
        animal.shelterAddress,
        animal.place,
        animal.remark,
        animal.caption
      ].join(' '));

      return haystack.includes(normalizeText(keyword));
    })
  );

  const summary = computed(() => `顯示 ${filteredAnimals.value.length} / ${animals.value.length} 筆資料`);

  async function load() {
    loading.value = true;
    warning.value = '';

    try {
      animals.value = await fetchAdoptionAnimals();
    } catch {
      warning.value = '資料暫時無法載入，已顯示示範內容。';
      animals.value = [];
    } finally {
      loading.value = false;
    }
  }

  function resetFilters() {
    filters.value = { ...DEFAULT_FILTERS };
  }

  function setFilters(next: Partial<AdoptionFilters>) {
    filters.value = {
      ...filters.value,
      ...next
    };
  }

  function hydrateFilters(query: URLSearchParams) {
    setFilters({
      county: query.get('county') ?? '',
      kind: query.get('kind') ?? '',
      sex: query.get('sex') ?? '',
      bodyType: query.get('bodyType') ?? '',
      keyword: query.get('keyword') ?? ''
    });
  }

  const queryString = computed(() => {
    const params = new URLSearchParams();
    const current = filters.value;

    if (current.county) params.set('county', current.county);
    if (current.kind) params.set('kind', current.kind);
    if (current.sex) params.set('sex', current.sex);
    if (current.bodyType) params.set('bodyType', current.bodyType);
    if (current.keyword) params.set('keyword', current.keyword);

    return params.toString();
  });

  watch(queryString, (value) => {
    const nextUrl = `${window.location.pathname}${value ? `?${value}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
  });

  onMounted(load);

  return {
    animals,
    filters,
    loading,
    warning,
    counties,
    kinds,
    sexes,
    bodyTypes,
    filteredAnimals,
    summary,
    load,
    resetFilters,
    setFilters,
    hydrateFilters
  };
}
