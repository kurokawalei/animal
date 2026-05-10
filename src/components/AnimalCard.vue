<template>
  <div
    class="card-illustrated overflow-hidden hover:shadow-lg transition-all hover:scale-105"
  >
    <!-- Image -->
    <div
      class="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden"
    >
      <img
        :src="animal.image"
        :alt="animal.name"
        class="w-full h-full object-cover"
      />
      <div class="absolute top-3 right-3">
        <button
          @click="isFavorite = !isFavorite"
          class="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-xl hover:scale-110 transition-transform shadow-md"
        >
          {{ isFavorite ? "❤️" : "🤍" }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <div class="flex items-start justify-between mb-2">
        <div>
          <h3 class="font-nunito font-black text-xl text-dark">
            {{ animal.name }}
          </h3>
          <p class="text-muted text-sm font-nunito">{{ animal.breed }}</p>
          <div class="mt-2 text-sm text-dark/70">
            <div v-if="regionName">所在地：{{ regionName }}</div>
            <div>物種：{{ speciesLabel }}</div>
            <div v-if="animal.breed">品種：{{ animal.breed }}</div>
            <div v-if="animal.variety">品種欄位：{{ animal.variety }}</div>
            <div v-if="animal.color">毛色：{{ animal.color }}</div>
            <div v-if="animal.sex">性別：{{ animal.sex }}</div>
            <div
              v-if="animal.description"
              class="mt-2 text-sm text-dark/60 line-clamp-2"
            >
              描述：{{ animal.description }}
            </div>
            <div v-if="postedAtLabel">刊登日期：{{ postedAtLabel }}</div>
            <div v-if="opendateLabel">開放日期：{{ opendateLabel }}</div>
            <div v-if="animal.contactPhone">
              連絡電話：{{ animal.contactPhone }}
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-nunito font-bold text-dark/70">
            {{ animal.age }}
          </div>
          <div class="text-xs text-muted">
            {{ typeEmoji }} {{ animal.type }}
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="flex gap-2 mb-4 flex-wrap">
        <span
          class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-nunito font-bold"
        >
          📍 {{ cityName }}
        </span>
        <span
          v-if="regionName"
          class="inline-block px-3 py-1 rounded-full bg-white border border-border text-dark text-xs font-nunito font-bold"
        >
          🗺️ {{ regionName }}
        </span>
        <span
          class="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-nunito font-bold"
        >
          📏 {{ sizeName }}
        </span>
      </div>

      <!-- CTA -->
      <div class="flex gap-3">
        <button
          @click="showDetailsModal = true"
          class="flex-1 btn-paw py-2 text-sm"
        >
          了解更多 →
        </button>
        <button
          @click="openAdoptModal"
          class="flex-1 btn-paw-outline py-2 text-sm"
        >
          申請領養
        </button>
      </div>
    </div>
  </div>

  <!-- Details Modal -->
  <div
    v-if="showDetailsModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div
      class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-nunito font-bold text-xl">
          {{ animal.name }} - 詳細資訊
        </h3>
        <button
          @click="showDetailsModal = false"
          class="text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✕
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div v-if="animal.name" class="border-b pb-2">
          <span class="font-bold text-dark">名稱：</span>
          <span class="text-dark/70">{{ animal.name }}</span>
        </div>
        <div v-if="speciesLabel" class="border-b pb-2">
          <span class="font-bold text-dark">物種：</span>
          <span class="text-dark/70">{{ speciesLabel }}</span>
        </div>
        <div v-if="animal.breed" class="border-b pb-2">
          <span class="font-bold text-dark">品種：</span>
          <span class="text-dark/70">{{ animal.breed }}</span>
        </div>
        <div v-if="animal.variety" class="border-b pb-2">
          <span class="font-bold text-dark">品種欄位：</span>
          <span class="text-dark/70">{{ animal.variety }}</span>
        </div>
        <div v-if="animal.color" class="border-b pb-2">
          <span class="font-bold text-dark">毛色：</span>
          <span class="text-dark/70">{{ animal.color }}</span>
        </div>
        <div v-if="animal.sex" class="border-b pb-2">
          <span class="font-bold text-dark">性別：</span>
          <span class="text-dark/70">{{ animal.sex }}</span>
        </div>
        <div v-if="cityName" class="border-b pb-2">
          <span class="font-bold text-dark">所在地：</span>
          <span class="text-dark/70">{{ cityName }}</span>
        </div>
        <div v-if="regionName" class="border-b pb-2">
          <span class="font-bold text-dark">地區：</span>
          <span class="text-dark/70">{{ regionName }}</span>
        </div>
        <div v-if="postedAtLabel" class="border-b pb-2">
          <span class="font-bold text-dark">刊登日期：</span>
          <span class="text-dark/70">{{ postedAtLabel }}</span>
        </div>
        <div v-if="opendateLabel" class="border-b pb-2">
          <span class="font-bold text-dark">開放日期：</span>
          <span class="text-dark/70">{{ opendateLabel }}</span>
        </div>
        <div v-if="animal.contactPhone" class="border-b pb-2">
          <span class="font-bold text-dark">連絡電話：</span>
          <span class="text-dark/70">{{ animal.contactPhone }}</span>
        </div>
        <div v-if="animal.age" class="border-b pb-2">
          <span class="font-bold text-dark">年齡：</span>
          <span class="text-dark/70">{{ animal.age }}</span>
        </div>
      </div>

      <div v-if="animal.description" class="mt-4 border-t pt-4">
        <span class="font-bold text-dark block mb-2">描述：</span>
        <p class="text-dark/70 text-sm leading-relaxed whitespace-pre-wrap">
          {{ animal.description }}
        </p>
      </div>

      <div class="mt-6 flex items-center justify-end gap-3">
        <button
          @click="showDetailsModal = false"
          class="btn-paw-outline px-4 py-2"
        >
          關閉
        </button>
        <button @click="openAdoptModal" class="btn-paw px-4 py-2">
          申請領養
        </button>
      </div>
    </div>
  </div>

  <!-- Adopt Modal -->
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-nunito font-bold">申請領養：{{ animal.name }}</h3>
        <button
          @click="closeAdoptModal"
          class="text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>

      <div class="space-y-3">
        <label class="block text-sm">您的姓名</label>
        <input v-model="form.name" class="w-full px-3 py-2 border rounded" />

        <label class="block text-sm">聯絡電話或 Email</label>
        <input v-model="form.contact" class="w-full px-3 py-2 border rounded" />

        <label class="block text-sm">簡短留言（選填）</label>
        <textarea
          v-model="form.message"
          rows="3"
          class="w-full px-3 py-2 border rounded"
        ></textarea>
      </div>

      <div class="mt-4 flex items-center justify-end gap-3">
        <button @click="closeAdoptModal" class="btn-paw-outline px-4 py-2">
          取消
        </button>
        <button
          @click="submitAdoptionRequest"
          :disabled="submitting"
          class="btn-paw px-4 py-2"
        >
          {{ submitting ? "送出中..." : "送出申請" }}
        </button>
      </div>

      <div v-if="submitResult" class="mt-3 text-sm text-green-600">
        送出成功，謝謝！
      </div>
      <div v-if="submitError" class="mt-3 text-sm text-red-600">
        {{ submitError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { submitAdoption } from "../services/adoptApi.js";

const props = defineProps({
  animal: {
    type: Object,
    required: true,
  },
});

const isFavorite = ref(false);
const showModal = ref(false);
const showDetailsModal = ref(false);
const submitting = ref(false);
const submitResult = ref(false);
const submitError = ref("");

const form = ref({ name: "", contact: "", message: "" });

const typeEmoji = computed(() => {
  const map = { dog: "🐶", cat: "🐱" };
  return map[props.animal.species || props.animal.type] || "🐾";
});

const cityName = computed(() => {
  // prefer normalized city name if available
  if (props.animal.cityNormalized) return props.animal.cityNormalized;
  if (props.animal.city) return props.animal.city;
  const map = { taipei: "台北", taichung: "台中", kaohsiung: "高雄" };
  return map[props.animal.city] || "";
});

const regionName = computed(() => {
  // prefer explicit region field, fallback to city
  const r =
    props.animal.region ||
    (props.animal.raw &&
      (props.animal.raw.county ||
        props.animal.raw.town ||
        props.animal.raw.region)) ||
    "";
  return r || "";
});

const speciesLabel = computed(() => {
  if (props.animal.species === "dog") return "狗";
  if (props.animal.species === "cat") return "貓";
  return props.animal.species || props.animal.type || "";
});

const postedAtLabel = computed(() => {
  const p =
    props.animal.postedAt ||
    (props.animal.raw &&
      (props.animal.raw.upload_date ||
        props.animal.raw.UploadDate ||
        props.animal.raw["刊登日期"])) ||
    "";
  if (!p) return "";
  const d = new Date(p);
  if (!isNaN(d)) return d.toLocaleDateString();
  return p;
});

const opendateLabel = computed(() => {
  const o =
    props.animal.opendate ||
    (props.animal.raw &&
      (props.animal.raw.animal_opendate ||
        props.animal.raw.opendate ||
        props.animal.raw.open_date ||
        props.animal.raw["開放日期"])) ||
    "";
  if (!o) return "";
  const d = new Date(o);
  if (!isNaN(d)) return d.toLocaleDateString();
  return o;
});

const sizeName = computed(() => {
  const map = { small: "小型", medium: "中型", large: "大型" };
  return map[props.animal.size] || props.animal.size;
});

function openAdoptModal() {
  submitResult.value = false;
  submitError.value = "";
  form.value = { name: "", contact: "", message: "" };
  showModal.value = true;
}

function closeAdoptModal() {
  showModal.value = false;
}

async function submitAdoptionRequest() {
  submitError.value = "";
  submitting.value = true;
  try {
    const payload = {
      animalId: props.animal.id,
      animalName: props.animal.name,
      applicantName: form.value.name,
      contact: form.value.contact,
      message: form.value.message,
      appliedAt: new Date().toISOString(),
    };
    await submitAdoption(payload);
    submitResult.value = true;
    // keep modal open briefly then close
    setTimeout(() => {
      showModal.value = false;
    }, 1200);
  } catch (err) {
    submitError.value = err.message || "送出失敗";
  } finally {
    submitting.value = false;
  }
}
</script>
