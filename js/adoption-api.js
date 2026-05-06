(function () {
  const API_URL = 'https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&IsTransData=1';
  const OFFICIAL_URL = 'https://www.pet.gov.tw/AnimalApp/AnnounceMent.aspx?PageType=Adopt';
  const DEFAULT_IMAGE = 'images/ap.jpg';
  const COUNTRIES = [
    '臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市',
    '基隆市', '新竹市', '嘉義市', '新竹縣', '苗栗縣', '彰化縣',
    '南投縣', '雲林縣', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
    '臺東縣', '澎湖縣', '金門縣', '連江縣'
  ];

  const state = {
    animals: [],
    filtered: [],
    filters: {
      county: '',
      kind: '',
      sex: '',
      bodyType: '',
      keyword: ''
    }
  };

  const els = {};

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
      return;
    }
    fn();
  }

  function init() {
    if (!document.getElementById('adoptionApp')) {
      return;
    }

    cacheElements();
    bindEvents();
    loadAnimals();
  }

  function cacheElements() {
    els.county = document.getElementById('filterCounty');
    els.kind = document.getElementById('filterKind');
    els.sex = document.getElementById('filterSex');
    els.bodyType = document.getElementById('filterBodyType');
    els.keyword = document.getElementById('filterKeyword');
    els.reset = document.getElementById('filterReset');
    els.summary = document.getElementById('adoptionSummary');
    els.status = document.getElementById('adoptionStatus');
    els.results = document.getElementById('adoptionResults');
    els.empty = document.getElementById('adoptionEmpty');
    els.emptyReset = document.getElementById('adoptionEmptyReset');
    els.heroCount = document.getElementById('heroAnimalCount');
    els.modal = document.getElementById('animalDetailModal');
    els.modalTitle = document.getElementById('animalDetailTitle');
    els.modalImage = document.getElementById('animalDetailImage');
    els.modalBadges = document.getElementById('animalDetailBadges');
    els.modalVariety = document.getElementById('animalDetailVariety');
    els.modalKind = document.getElementById('animalDetailKind');
    els.modalSex = document.getElementById('animalDetailSex');
    els.modalBodyType = document.getElementById('animalDetailBodyType');
    els.modalAge = document.getElementById('animalDetailAge');
    els.modalPlace = document.getElementById('animalDetailPlace');
    els.modalShelter = document.getElementById('animalDetailShelter');
    els.modalTel = document.getElementById('animalDetailTel');
    els.modalAddress = document.getElementById('animalDetailAddress');
    els.modalOpenDate = document.getElementById('animalDetailOpenDate');
    els.modalStatus = document.getElementById('animalDetailStatus');
    els.modalCaption = document.getElementById('animalDetailCaption');
    els.modalOfficial = document.getElementById('animalDetailOfficialLink');
    els.modalCall = document.getElementById('animalDetailCall');
  }

  function bindEvents() {
    els.county.addEventListener('change', onFilterChange);
    els.kind.addEventListener('change', onFilterChange);
    els.sex.addEventListener('change', onFilterChange);
    els.bodyType.addEventListener('change', onFilterChange);
    els.keyword.addEventListener('input', onFilterChange);
    els.reset.addEventListener('click', resetFilters);
    els.emptyReset.addEventListener('click', resetFilters);
    els.results.addEventListener('click', onResultsClick);
  }

  function onFilterChange() {
    state.filters.county = els.county.value;
    state.filters.kind = els.kind.value;
    state.filters.sex = els.sex.value;
    state.filters.bodyType = els.bodyType.value;
    state.filters.keyword = els.keyword.value.trim();
    renderFilteredAnimals();
  }

  async function loadAnimals() {
    setStatus('正在載入農業部官方資料...');

    try {
      const response = await fetch(API_URL, { cache: 'no-store', mode: 'cors' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const rawAnimals = extractAnimals(payload);
      state.animals = rawAnimals.map(normalizeAnimal).filter(Boolean);

      if (!state.animals.length) {
        throw new Error('官方資料目前沒有可用項目');
      }

      setStatus('已載入官方領養資料。');
    } catch (error) {
      state.animals = fallbackAnimals();
      setStatus('官方資料暫時無法連線，先以示範資料顯示。你仍可直接前往官方入口。', true);
    }

    populateFilters();
    state.filtered = state.animals.slice();
    renderFilteredAnimals();
    els.heroCount.textContent = state.animals.length.toString();
  }

  function extractAnimals(payload) {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (!payload || typeof payload !== 'object') {
      return [];
    }

    const directKeys = ['data', 'Data', 'result', 'Result', 'records', 'Records', 'animals', 'Animals', 'items', 'Items'];
    for (const key of directKeys) {
      if (Array.isArray(payload[key])) {
        return payload[key];
      }
    }

    for (const key of directKeys) {
      if (payload[key] && Array.isArray(payload[key].data)) {
        return payload[key].data;
      }
    }

    return [];
  }

  function populateFilters() {
    populateSelect(els.county, uniqueSorted(state.animals.map(item => item.county).filter(Boolean)), '全部縣市');
    populateSelect(els.kind, uniqueSorted(state.animals.map(item => item.kind).filter(Boolean)), '全部種類');
    populateSelect(els.sex, uniqueSorted(state.animals.map(item => item.sex).filter(Boolean)), '不限');
    populateSelect(els.bodyType, uniqueSorted(state.animals.map(item => item.bodyType).filter(Boolean)), '不限');
  }

  function populateSelect(select, values, placeholder) {
    const current = select.value;
    select.innerHTML = '';

    const first = document.createElement('option');
    first.value = '';
    first.textContent = placeholder;
    select.appendChild(first);

    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });

    if (values.includes(current)) {
      select.value = current;
    }
  }

  function renderFilteredAnimals() {
    state.filtered = state.animals.filter(matchesFilters);
    els.summary.textContent = `顯示 ${state.filtered.length} / ${state.animals.length} 筆資料`;
    els.results.innerHTML = '';

    if (!state.filtered.length) {
      els.empty.classList.remove('hidden');
      return;
    }

    els.empty.classList.add('hidden');

    const fragment = document.createDocumentFragment();
    state.filtered.forEach((animal, index) => {
      fragment.appendChild(createCard(animal, index));
    });
    els.results.appendChild(fragment);
  }

  function matchesFilters(animal) {
    if (state.filters.county && animal.county !== state.filters.county) {
      return false;
    }

    if (state.filters.kind && animal.kind !== state.filters.kind) {
      return false;
    }

    if (state.filters.sex && animal.sex !== state.filters.sex) {
      return false;
    }

    if (state.filters.bodyType && animal.bodyType !== state.filters.bodyType) {
      return false;
    }

    if (!state.filters.keyword) {
      return true;
    }

    const keyword = normalizeText(state.filters.keyword);
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

    return haystack.includes(keyword);
  }

  function createCard(animal, index) {
    const column = document.createElement('div');
    column.className = 'col-lg-4 col-md-6 mb-4';

    const telLink = buildTelLink(animal.shelterTel);

    column.innerHTML = `
      <article class="animal-card">
        <div class="animal-card__media">
          <img src="${escapeAttr(animal.imageUrl)}" alt="${escapeAttr(animal.title)}" onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}'">
          <span class="animal-card__county">${escapeHtml(animal.county)}</span>
        </div>
        <div class="animal-card__body">
          <h3>${escapeHtml(animal.title)}</h3>
          <p class="animal-card__variety">${escapeHtml(animal.variety)}</p>
          <div class="animal-card__badges">
            <span>${escapeHtml(animal.sex)}</span>
            <span>${escapeHtml(animal.bodyType)}</span>
            <span>${escapeHtml(animal.status)}</span>
          </div>
          <dl class="animal-card__facts">
            <div><dt>年紀</dt><dd>${escapeHtml(animal.age)}</dd></div>
            <div><dt>收容所</dt><dd>${escapeHtml(animal.shelterName)}</dd></div>
          </dl>
          <div class="animal-card__actions">
            <button type="button" class="btn btn-primary btn-sm" data-action="detail" data-index="${index}">看詳情</button>
            ${telLink ? `<a class="btn btn-outline-secondary btn-sm" href="${telLink}">聯絡收容所</a>` : ''}
          </div>
        </div>
      </article>
    `;

    return column;
  }

  function onResultsClick(event) {
    const button = event.target.closest('[data-action="detail"]');
    if (!button) {
      return;
    }

    const index = Number(button.getAttribute('data-index'));
    const animal = state.filtered[index];
    if (!animal) {
      return;
    }

    fillModal(animal);
    window.jQuery(els.modal).modal('show');
  }

  function fillModal(animal) {
    els.modalTitle.textContent = animal.title;
    els.modalImage.src = animal.imageUrl;
    els.modalImage.alt = animal.title;
    els.modalBadges.innerHTML = [
      animal.county,
      animal.kind,
      animal.sex,
      animal.bodyType
    ].filter(Boolean).map((item) => `<span class="animal-badge">${escapeHtml(item)}</span>`).join('');
    els.modalVariety.textContent = animal.variety || '-';
    els.modalKind.textContent = animal.kind || '-';
    els.modalSex.textContent = animal.sex || '-';
    els.modalBodyType.textContent = animal.bodyType || '-';
    els.modalAge.textContent = animal.age || '-';
    els.modalPlace.textContent = animal.place || '-';
    els.modalShelter.textContent = animal.shelterName || '-';
    els.modalTel.textContent = animal.shelterTel || '-';
    els.modalAddress.textContent = animal.shelterAddress || '-';
    els.modalOpenDate.textContent = animal.openDate || '-';
    els.modalStatus.textContent = animal.status || '-';
    els.modalCaption.textContent = animal.caption || animal.remark || '請直接聯絡收容所，確認最新認養條件。';
    els.modalOfficial.href = OFFICIAL_URL;

    const telLink = buildTelLink(animal.shelterTel);
    if (telLink) {
      els.modalCall.href = telLink;
      els.modalCall.classList.remove('disabled');
      els.modalCall.removeAttribute('aria-disabled');
    } else {
      els.modalCall.href = '#';
      els.modalCall.classList.add('disabled');
      els.modalCall.setAttribute('aria-disabled', 'true');
    }
  }

  function resetFilters() {
    els.county.value = '';
    els.kind.value = '';
    els.sex.value = '';
    els.bodyType.value = '';
    els.keyword.value = '';
    state.filters = { county: '', kind: '', sex: '', bodyType: '', keyword: '' };
    renderFilteredAnimals();
  }

  function setStatus(message, isWarning) {
    els.status.textContent = message;
    els.status.classList.remove('hidden', 'status-note--warning');
    if (isWarning) {
      els.status.classList.add('status-note--warning');
    }
  }

  function normalizeAnimal(raw, index) {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    const place = firstNonEmpty(raw.animal_place, raw.animal_foundplace, raw.shelter_address);
    const shelterAddress = firstNonEmpty(raw.shelter_address, raw.animal_place, '');
    const county = detectCounty([place, shelterAddress, raw.shelter_name].join(' '));

    return {
      id: firstNonEmpty(raw.animal_id, raw.animal_subid, `${county}-${index}`),
      title: firstNonEmpty(raw.animal_title, raw.animal_Variety, '待認養動物'),
      kind: normalizeKind(raw.animal_kind),
      variety: firstNonEmpty(raw.animal_Variety, '米克斯'),
      sex: normalizeSex(raw.animal_sex),
      bodyType: normalizeBodyType(raw.animal_bodytype),
      age: formatText(raw.animal_age),
      sterilization: normalizeFlag(raw.animal_sterilization),
      bacterin: normalizeFlag(raw.animal_bacterin),
      status: formatText(raw.animal_status),
      remark: formatText(raw.animal_remark),
      caption: formatText(raw.animal_caption),
      openDate: formatDate(raw.animal_opendate),
      closeDate: formatDate(raw.animal_closeddate),
      updateDate: formatDate(raw.cDate || raw.animal_update || raw.album_update),
      shelterName: formatText(raw.shelter_name),
      shelterTel: formatText(raw.shelter_tel),
      shelterAddress: formatText(shelterAddress),
      place: formatText(place),
      county,
      imageUrl: resolveImageUrl(raw.album_file),
      officialUrl: OFFICIAL_URL
    };
  }

  function fallbackAnimals() {
    return [
      {
        id: 'fallback-1',
        title: '米克斯待認養',
        kind: '狗',
        variety: '米克斯',
        sex: '公',
        bodyType: '中',
        age: '成犬',
        sterilization: '未提供',
        bacterin: '未提供',
        status: '示範資料',
        remark: '官方資料暫時無法載入，先以示範資料顯示。',
        caption: '請改用官方入口確認最新資料。',
        openDate: '未提供',
        closeDate: '未提供',
        updateDate: '未提供',
        shelterName: '南投縣公立動物收容所',
        shelterTel: '049-2225440',
        shelterAddress: '南投縣南投市嶺興路36-1號',
        place: '南投縣',
        county: '南投縣',
        imageUrl: DEFAULT_IMAGE,
        officialUrl: OFFICIAL_URL
      },
      {
        id: 'fallback-2',
        title: '可愛貓咪待認養',
        kind: '貓',
        variety: '米克斯',
        sex: '母',
        bodyType: '小',
        age: '成貓',
        sterilization: '未提供',
        bacterin: '未提供',
        status: '示範資料',
        remark: '請透過官方資料確認認養流程。',
        caption: '示範資料僅供介面展示。',
        openDate: '未提供',
        closeDate: '未提供',
        updateDate: '未提供',
        shelterName: '臺北市動物之家',
        shelterTel: '02-87913254',
        shelterAddress: '臺北市內湖區安美街191號',
        place: '臺北市',
        county: '臺北市',
        imageUrl: DEFAULT_IMAGE,
        officialUrl: OFFICIAL_URL
      }
    ];
  }

  function detectCounty(text) {
    const normalized = normalizeText(text);
    const county = COUNTRIES.find((item) => normalized.includes(normalizeText(item)));
    return county || '其他';
  }

  function normalizeKind(value) {
    const text = formatText(value);
    const normalized = normalizeText(text);
    if (normalized.includes('dog') || normalized.includes('狗') || normalized.includes('犬')) {
      return '狗';
    }
    if (normalized.includes('cat') || normalized.includes('貓') || normalized.includes('猫')) {
      return '貓';
    }
    return text || '其他';
  }

  function normalizeSex(value) {
    const text = formatText(value);
    const normalized = normalizeText(text).toUpperCase();
    if (normalized === 'M' || normalized === 'MALE' || normalized.includes('公') || normalized.includes('雄')) {
      return '公';
    }
    if (normalized === 'F' || normalized === 'FEMALE' || normalized.includes('母') || normalized.includes('雌')) {
      return '母';
    }
    if (normalized.includes('未') || normalized.includes('不詳') || normalized.includes('UNKNOWN')) {
      return '未知';
    }
    return text || '未知';
  }

  function normalizeBodyType(value) {
    const text = formatText(value);
    if (!text) {
      return '未提供';
    }
    if (text.includes('小')) {
      return '小型';
    }
    if (text.includes('中')) {
      return '中型';
    }
    if (text.includes('大')) {
      return '大型';
    }
    return text;
  }

  function normalizeFlag(value) {
    const text = formatText(value);
    const normalized = normalizeText(text).toUpperCase();
    if (!text) {
      return '未提供';
    }
    if (['Y', 'YES', 'TRUE', '1'].includes(normalized) || normalized.includes('是') || normalized.includes('已')) {
      return '是';
    }
    if (['N', 'NO', 'FALSE', '0'].includes(normalized) || normalized.includes('否') || normalized.includes('未')) {
      return '否';
    }
    return text;
  }

  function formatText(value) {
    if (value == null) {
      return '';
    }
    const text = String(value).trim();
    return text === 'null' || text === 'undefined' ? '' : text;
  }

  function formatDate(value) {
    const text = formatText(value);
    if (!text) {
      return '未提供';
    }
    return text.length > 10 ? text.slice(0, 10) : text;
  }

  function resolveImageUrl(value) {
    const text = formatText(value);
    if (!text) {
      return DEFAULT_IMAGE;
    }
    if (/^https?:\/\//i.test(text) || /^\/\//.test(text) || /^data:/i.test(text)) {
      return text;
    }
    return DEFAULT_IMAGE;
  }

  function firstNonEmpty() {
    for (let i = 0; i < arguments.length; i += 1) {
      const text = formatText(arguments[i]);
      if (text) {
        return text;
      }
    }
    return '';
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'zh-Hant-TW'));
  }

  function normalizeText(value) {
    return formatText(value).replace(/台/g, '臺').toLowerCase();
  }

  function buildTelLink(value) {
    const text = formatText(value);
    if (!text) {
      return '';
    }
    return `tel:${text.replace(/\s+/g, '')}`;
  }

  function escapeHtml(value) {
    return formatText(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  ready(init);
}());
