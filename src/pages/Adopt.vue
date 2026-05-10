<template>
  <div class="min-h-screen watercolor-bg pt-20">
    <!-- Banner -->
    <div class="relative py-16 overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center opacity-20"
        :style="{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663636190019/HrRgiz8vkCidshPFr2vZfR/adopt-vs-buy-cLDJBGxfLPvvXEcYmVeKKL.webp)`,
        }"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-light/60 to-light" />

      <div class="container mx-auto max-w-6xl px-4 relative z-10">
        <div class="absolute top-4 right-10 text-6xl opacity-10 animate-float">
          🐾
        </div>
        <div
          class="absolute bottom-4 left-10 text-5xl opacity-10 animate-float-slow"
        >
          🌿
        </div>
        <div class="text-center">
          <span class="font-caveat text-2xl text-primary"
            >找到你的命中注定</span
          >
          <h1 class="font-nunito font-black text-5xl text-dark mt-2 mb-4">
            待領養動物
          </h1>
          <p class="text-dark/70 font-nunito max-w-xl mx-auto">
            每一隻都在等待屬於自己的家。透過下方篩選，找到最適合你的毛孩夥伴。
          </p>
        </div>
      </div>
    </div>

    <div class="container mx-auto max-w-6xl px-4 py-10">
      <!-- Search Section -->
      <div class="card-illustrated p-6 mb-6">
        <div>
          <label
            class="block text-sm font-bold text-dark mb-3 flex items-center gap-2"
          >
            <span class="text-lg">🔎</span>搜尋毛孩名稱或品種
          </label>
          <div class="flex gap-3">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="輸入名稱、品種或關鍵字..."
              @keydown.enter="performSearch"
              class="flex-1 px-4 py-3 rounded-lg border-2 border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <button
              v-if="searchKeyword"
              @click="searchKeyword = ''"
              class="px-4 py-3 bg-light border border-border rounded-lg hover:bg-gray-200 transition-colors"
              title="清除搜尋"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="card-illustrated p-6 mb-8">
        <div class="mb-4">
          <h3 class="text-sm font-bold text-dark mb-4 flex items-center gap-2">
            <span class="text-lg">🎛️</span>篩選條件
          </h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-bold text-dark mb-2"
              >動物類型</label
            >
            <select
              v-model="selectedType"
              class="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">全部</option>
              <option value="dog">🐶 狗狗</option>
              <option value="cat">🐱 貓咪</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-dark mb-2">城市</label>
            <select
              v-model="selectedCity"
              class="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">全部</option>
              <option value="台北市">台北市</option>
              <option value="新北市">新北市</option>
              <option value="基隆市">基隆市</option>
              <option value="桃園市">桃園市</option>
              <option value="新竹市">新竹市</option>
              <option value="新竹縣">新竹縣</option>
              <option value="苗栗縣">苗栗縣</option>
              <option value="台中市">台中市</option>
              <option value="彰化縣">彰化縣</option>
              <option value="南投縣">南投縣</option>
              <option value="雲林縣">雲林縣</option>
              <option value="嘉義市">嘉義市</option>
              <option value="嘉義縣">嘉義縣</option>
              <option value="台南市">台南市</option>
              <option value="高雄市">高雄市</option>
              <option value="屏東縣">屏東縣</option>
              <option value="台東縣">台東縣</option>
              <option value="花蓮縣">花蓮縣</option>
              <option value="宜蘭縣">宜蘭縣</option>
              <option value="澎湖縣">澎湖縣</option>
              <option value="金門縣">金門縣</option>
              <option value="連江縣">連江縣</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-dark mb-2">體型</label>
            <select
              v-model="selectedSize"
              class="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">全部</option>
              <option value="small">小型</option>
              <option value="medium">中型</option>
              <option value="large">大型</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Local Shelter Animals -->
      <h2
        class="font-nunito font-black text-2xl text-dark mb-6 flex items-center gap-2"
      >
        <span>🏠</span> 收容所待領養動物
      </h2>

      <div
        v-if="loadingShelter"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
      >
        <!-- Shimmer Loading Cards -->
        <div
          v-for="i in 9"
          :key="`loading-${i}`"
          class="rounded-lg overflow-hidden shadow-soft"
        >
          <!-- Image Skeleton -->
          <div class="shimmer-card h-48 rounded-t-lg"></div>

          <!-- Content Skeleton -->
          <div class="p-5 space-y-4">
            <!-- Title Skeleton -->
            <div class="shimmer-card h-6 rounded w-3/4"></div>

            <!-- Subtitle Skeleton -->
            <div class="shimmer-card h-4 rounded w-1/2"></div>

            <!-- Info Lines -->
            <div class="space-y-2">
              <div class="shimmer-card h-3 rounded w-full"></div>
              <div class="shimmer-card h-3 rounded w-5/6"></div>
              <div class="shimmer-card h-3 rounded w-4/5"></div>
            </div>

            <!-- Buttons Skeleton -->
            <div class="flex gap-3 pt-2">
              <div class="shimmer-card h-8 rounded-full flex-1"></div>
              <div class="shimmer-card h-8 rounded-full flex-1"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="shelterError" class="text-center py-20">
        <p class="text-red-600 font-nunito">{{ shelterError }}</p>
      </div>

      <div v-else-if="filtered.length === 0" class="text-center py-20">
        <p class="text-dark/70 font-nunito">
          找不到符合條件的動物，請調整篩選條件。
        </p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
      >
        <AnimalCard
          v-for="animal in pagedAnimals"
          :key="animal.id"
          :animal="animal"
        />
      </div>

      <!-- Pagination Controls -->
      <div class="flex items-center justify-between mt-4">
        <div class="text-sm text-dark/70">
          顯示 {{ (page - 1) * pageSize + 1 }} -
          {{ Math.min(page * pageSize, filtered.length) }}，共
          {{ filtered.length }} 筆
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="page <= 1"
            class="btn-paw-outline px-3 py-1"
          >
            上一步
          </button>
          <div class="inline-flex items-center gap-2">
            <button
              v-for="n in visiblePages"
              :key="n"
              @click="goToPage(n)"
              :class="[
                'px-3 py-1 rounded',
                n === page
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border',
              ]"
            >
              {{ n }}
            </button>
            <span
              v-if="
                visiblePages.length &&
                visiblePages[visiblePages.length - 1] < totalPages
              "
              class="px-2"
              >...</span
            >
            <button
              v-if="
                visiblePages.length &&
                visiblePages[visiblePages.length - 1] < totalPages
              "
              @click="goToPage(totalPages)"
              class="px-3 py-1 rounded bg-white border border-border"
            >
              {{ totalPages }}
            </button>
          </div>
          <button
            @click="nextPage"
            :disabled="page >= totalPages"
            class="btn-paw px-3 py-1"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import AnimalCard from "../components/AnimalCard.vue";
import {
  fetchBreeds,
  fetchAnimals,
  submitAdoption,
  fetchTaiwanOpenAnimals,
} from "../services/adoptApi.js";

const selectedType = ref("");
const selectedCity = ref("");
const selectedSize = ref("");
const searchKeyword = ref("");
// normalize city helper for reuse
const normalizeCity = (v) => {
  if (!v) return "";
  const s = ("" + v).trim().replace(/\s+/g, "").replace(/臺/g, "台");
  const full = [
    "台北市",
    "新北市",
    "基隆市",
    "桃園市",
    "新竹市",
    "新竹縣",
    "苗栗縣",
    "台中市",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義市",
    "嘉義縣",
    "台南市",
    "高雄市",
    "屏東縣",
    "台東縣",
    "花蓮縣",
    "宜蘭縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
  ];
  for (const name of full) if (s.indexOf(name) !== -1) return name;
  const map = {
    台北: "台北市",
    新北: "新北市",
    基隆: "基隆市",
    桃園: "桃園市",
    新竹: "新竹市",
    苗栗: "苗栗縣",
    台中: "台中市",
    彰化: "彰化縣",
    南投: "南投縣",
    雲林: "雲林縣",
    嘉義: "嘉義市",
    台南: "台南市",
    高雄: "高雄市",
    屏東: "屏東縣",
    台東: "台東縣",
    花蓮: "花蓮縣",
    宜蘭: "宜蘭縣",
    澎湖: "澎湖縣",
    金門: "金門縣",
    連江: "連江縣",
  };
  for (const k in map) if (s.indexOf(k) !== -1) return map[k];
  return s;
};
const loadingBreeds = ref(false);
const apiBreeds = ref([]);
const apiError = ref("");

// shelterAnimals will be populated from MOA open data; keep a small local fallback if needed
const localAnimals = [];

const shelterAnimals = ref([]);
const loadingShelter = ref(false);
const shelterError = ref("");

// load MOA dataset on mounted
onMounted(async () => {
  loadingShelter.value = true;
  shelterError.value = "";
  try {
    const list = await fetchTaiwanOpenAnimals();

    // map list to animal shape expected by AnimalCard
    shelterAnimals.value = list.map((b, idx) => {
      const rawCity =
        b.city ||
        (b.raw &&
          (b.raw.shelter_address ||
            b.raw.shelterAddress ||
            b.raw.shelterAddr ||
            b.raw["shelter_address"])) ||
        (b.raw &&
          (b.raw.area ||
            b.raw.site ||
            b.raw["所在地"] ||
            b.raw.county ||
            b.raw.town)) ||
        "";
      const cityNormalized = normalizeCity(rawCity);
      const description =
        b.description ||
        (b.raw &&
          (b.raw.animal_remark ||
            b.raw.remark ||
            b.raw.description ||
            b.raw["描述"])) ||
        "";
      const variety =
        b.variety ||
        b.breed ||
        b.origin ||
        (b.raw &&
          (b.raw.animal_Variety ||
            b.raw.animal_variety ||
            b.raw["animal_Variety"])) ||
        "";
      const opendate =
        b.opendate ||
        (b.raw &&
          (b.raw.animal_opendate || b.raw.opendate || b.raw.open_date)) ||
        "";
      return {
        id: b.id || idx,
        name: b.name || `動物 ${idx}`,
        type: b.species || (b.emoji === "🐈" ? "cat" : "dog"),
        breed: b.breed || b.origin || variety || "",
        variety,
        description,
        age: b.raw && (b.raw.age || b.raw.Age) ? b.raw.age || b.raw.Age : "",
        city: rawCity,
        cityNormalized,
        size: "",
        image: b.image || "",
        color: b.color || "",
        sex: b.sex || "",
        postedAt: b.postedAt || "",
        opendate,
        contactPhone: b.contactPhone || "",
        raw: b.raw || {},
      };
    });
    // if none returned, keep local fallback (empty)
  } catch (err) {
    console.error(err);
    shelterError.value = err.message || "載入收容所資料失敗";
    shelterAnimals.value = [];
  } finally {
    loadingShelter.value = false;
  }
});

const filtered = computed(() => {
  const source =
    shelterAnimals.value && shelterAnimals.value.length > 0
      ? shelterAnimals.value
      : localAnimals;
  return source.filter((animal) => {
    // Search filter
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      const matchesName = ("" + (animal.name || ""))
        .toLowerCase()
        .includes(keyword);
      const matchesBreed = ("" + (animal.breed || ""))
        .toLowerCase()
        .includes(keyword);
      const matchesVariety = ("" + (animal.variety || ""))
        .toLowerCase()
        .includes(keyword);
      const matchesColor = ("" + (animal.color || ""))
        .toLowerCase()
        .includes(keyword);
      if (!matchesName && !matchesBreed && !matchesVariety && !matchesColor)
        return false;
    }

    // Type filter
    if (selectedType.value && animal.type !== selectedType.value) return false;

    // City filter
    if (selectedCity.value) {
      // compare normalized city names (handle 臺/台 and shorthand)
      const c = (animal.cityNormalized || animal.city || "").replace(
        /臺/g,
        "台",
      );
      const s = (selectedCity.value || "").replace(/臺/g, "台");
      if (!c || c !== s) return false;
    }

    // Size filter
    if (selectedSize.value && animal.size !== selectedSize.value) return false;

    return true;
  });
});

// Pagination
const page = ref(1);
const pageSize = ref(9);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / pageSize.value)),
);
const pagedAnimals = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

function goToPage(n) {
  page.value = Math.min(Math.max(1, n), totalPages.value);
}
function prevPage() {
  goToPage(page.value - 1);
}
function nextPage() {
  goToPage(page.value + 1);
}

function performSearch() {
  // Reset to first page when searching
  page.value = 1;
  // The filtering is already handled by the computed property
}

// reset page when filters or data change
watch(
  [filtered, selectedType, selectedCity, selectedSize, searchKeyword],
  () => {
    page.value = 1;
  },
);

// Sliding window pagination: show pages starting at current page
const visibleCount = ref(10); // show up to 10 pages starting from current page
const visiblePages = computed(() => {
  const total = totalPages.value;
  if (total <= 0) return [];
  const start = page.value;
  const end = Math.min(start + visibleCount.value - 1, total);
  const arr = [];
  for (let p = start; p <= end; p++) arr.push(p);
  return arr;
});

const loadApiBreeds = async () => {
  loadingBreeds.value = true;
  apiError.value = "";
  try {
    const list = await fetchTaiwanOpenAnimals();
    const type = selectedType.value; // '' | 'dog' | 'cat'
    shelterAnimals.value = list.map((b, idx) => ({
      id: b.id || idx,
      name: b.name || `動物 ${idx}`,
      type: b.species || (b.emoji === "🐈" ? "cat" : "dog"),
      breed: b.breed || b.origin || "",
      age: b.raw && (b.raw.age || b.raw.Age) ? b.raw.age || b.raw.Age : "",
      city:
        b.city ||
        (b.raw &&
          (b.raw.area ||
            b.raw.site ||
            b.raw["所在地"] ||
            b.raw.county ||
            b.raw.town)) ||
        "",
      cityNormalized: normalizeCity(
        b.city ||
          (b.raw &&
            (b.raw.area ||
              b.raw.site ||
              b.raw["所在地"] ||
              b.raw.county ||
              b.raw.town)) ||
          "",
      ),
      region:
        b.region ||
        (b.raw &&
          (b.raw.county ||
            b.raw.town ||
            b.raw.area ||
            b.raw.region ||
            b.raw["縣市"])) ||
        "",
      description:
        (b.raw &&
          (b.raw.description ||
            b.raw.content ||
            b.raw.remark ||
            b.raw["描述"])) ||
        "",
      size: "",
      image: b.image || "",
      color: b.color || "",
      sex: b.sex || "",
      postedAt: b.postedAt || "",
      contactPhone: b.contactPhone || "",
      raw: b.raw || {},
    }));
    const breeds = await fetchBreeds(type || "");
    apiBreeds.value = breeds;
  } catch (err) {
    console.error(err);
    apiError.value = err.message || "載入失敗";
    apiBreeds.value = [];
  } finally {
    loadingBreeds.value = false;
  }
};

// optional: fetch sample animals from external APIs
const loadApiAnimals = async () => {
  apiError.value = "";
  try {
    const animals = await fetchAnimals({
      type: selectedType.value || "",
      limit: 9,
    });
    // map into local format and show via AnimalCard by setting apiBreeds as temporary container
    apiBreeds.value = animals.map((a, idx) => ({
      id: a.id || idx,
      name: a.name || "",
      origin: a.breed || a.type || "",
      emoji: a.type === "cat" ? "🐈" : "🐕",
    }));
  } catch (err) {
    apiError.value = err.message || "載入動物失敗";
  }
};
</script>
