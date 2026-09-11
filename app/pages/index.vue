<script setup lang="ts">
type Game = {
  title: string
  genre: string
  version: string
  stars: number
  players: string
  change?: string
  /** Start date in ISO form, "YYYY-MM-DD". Formatted for display by formatDate(). */
  date?: string
}

const categories = [
  'All',
  'World of Warcraft',
  'Lineage II',
  'MuOnline',
  'Counter-Strike',
  'AION',
  'Perfect World',
  'RF Online',
  'Silkroad Online',
  'Metin2',
  'Rappelz',
  'Tibia'
]

const VISIBLE_CATEGORIES = 6
const visibleCategories = computed(() => categories.slice(0, VISIBLE_CATEGORIES))
const hiddenCategories = computed(() => categories.slice(VISIBLE_CATEGORIES))

const games: Game[] = [
  { title: 'LA2DREAM', genre: 'MMORPG / Lineage II', version: 'Interlude', stars: 500, players: 'x500', change: '-63%' },
  { title: 'LA2DREAM', genre: 'MMORPG / Lineage II', version: 'High-Five', stars: 500, players: 'x500', change: '+63%' },
  { title: 'LA2DREAM', genre: 'MMORPG / Lineage II', version: 'Interlude', stars: 500, players: 'x200', change: '-63%' },
  { title: 'LA2DREAM', genre: 'MMORPG / Lineage II', version: 'Interlude', stars: 500, players: 'x250', change: '+63%' },
  { title: 'LA2DREAM', genre: 'MMORPG / Lineage II', version: 'High-Five', stars: 500, players: 'x50', change: '-63%' },
  { title: 'LA2DREAM', genre: 'MMORPG / Lineage II', version: 'Interlude', stars: 500, players: 'x50', change: '+63%' },
  { title: 'LA2DREAM', genre: 'MMORPG / Lineage II', version: 'Interlude', stars: 500, players: 'x100', change: '-63%' },
  { title: 'LA2DREAM', genre: 'MMORPG / Lineage II', version: 'High-Five', stars: 500, players: 'x500', change: '+63%' },
  { title: 'LA2DREAM', genre: 'MMORPG / Lineage II', version: 'Interlude', stars: 500, players: 'x500', change: '-63%' },
  { title: 'LA2DREAM', genre: 'MMORPG / Lineage II', version: 'Interlude', stars: 500, players: 'x500', change: '+63%' }
]

const soon = Array.from({ length: 10 }, (_, i) => ({
  ...games[i % games.length],
  date: '2024-12-23'
}))

const started = Array.from({ length: 10 }, (_, i) => ({
  ...games[(i + 1) % games.length],
  date: '2024-12-23'
}))

const newGames = games.slice(0, 3)
const allGames = [
  { ...games[1], stars: 1923, players: 'x50', change: '-13%' },
  { ...games[0] },
  { ...games[1], stars: 1923, players: 'x50', change: '-13%' }
]

const activeCategory = ref('All')
const query = ref('')
const dark = ref(true)
const showMore = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const moreWrap = ref<HTMLElement | null>(null)
const dropdownPos = ref({ top: 0, right: 0 })

const allGameEntries = [...games, ...soon, ...started, ...newGames, ...allGames]
const allVersions = Array.from(new Set(allGameEntries.map((game) => game.version)))
const allTitles = Array.from(new Set(allGameEntries.map((game) => game.title)))

const ratingThresholds = [
  { label: 'Any', value: 0 },
  { label: '500+', value: 500 },
  { label: '1000+', value: 1000 },
  { label: '1500+', value: 1500 },
  { label: '2000+', value: 2000 }
]

const rateTiers = [
  { label: 'x1–x5', min: 1, max: 5 },
  { label: 'x6–x10', min: 6, max: 10 },
  { label: 'x11–x100', min: 11, max: 100 },
  { label: 'x101–x999', min: 101, max: 999 },
  { label: 'x1000+', min: 1000, max: Infinity }
]

// The rate is the "x"-prefixed number already shown under the star rating (game.players),
// e.g. "x500" -> 500. There's no separate rate field — this parses the existing one.
function getRate(game: Game) {
  return parseInt(game.players.replace(/[^0-9]/g, ''), 10) || 0
}

// Dates are stored as ISO ("2024-12-23") and only formatted for display, so the
// stored value stays unambiguous and a future language switch only changes MONTHS.
// Rendering the month as a word avoids the 05.06 trap, where a numeric date reads
// as two different days depending on the reader's convention.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Parsed by hand rather than through Date: `new Date('2024-12-23')` is UTC midnight,
// so getDate() would report the 22nd for anyone west of Greenwich.
function formatDate(iso?: string) {
  if (!iso) return ''
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day || month < 1 || month > 12) return iso
  return `${day} ${MONTHS[month - 1]} ${year}`
}

const filters = reactive({
  version: '',
  minRating: 0,
  title: '',
  rates: [] as string[]
})

const customRateActive = ref(false)
const customRateMin = ref('')
const customRateMax = ref('')

const customMin = computed(() => {
  const n = parseInt(customRateMin.value, 10)
  return Number.isFinite(n) ? n : null
})
const customMax = computed(() => {
  const n = parseInt(customRateMax.value, 10)
  return Number.isFinite(n) ? n : null
})
const customRateSet = computed(() => customMin.value != null || customMax.value != null)
const rateFilterActive = computed(() => filters.rates.length > 0 || (customRateActive.value && customRateSet.value))

const filterOpen = ref(false)
const filterButtonEl = ref<HTMLElement | null>(null)
const filterPopupEl = ref<HTMLElement | null>(null)
const filterPos = ref({ top: 0, left: 0 })

const activeFilterCount = computed(
  () =>
    (filters.version ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.title ? 1 : 0) +
    (rateFilterActive.value ? 1 : 0)
)

function matchesFilters(game: Game) {
  if (filters.version && game.version !== filters.version) return false
  if (filters.minRating && game.stars < filters.minRating) return false
  if (filters.title && game.title !== filters.title) return false
  if (rateFilterActive.value) {
    const rate = getRate(game)
    const inPreset = filters.rates.some((label) => {
      const tier = rateTiers.find((t) => t.label === label)
      return tier && rate >= tier.min && rate <= tier.max
    })
    const inCustom =
      customRateActive.value &&
      customRateSet.value &&
      (customMin.value == null || rate >= customMin.value) &&
      (customMax.value == null || rate <= customMax.value)
    if (!inPreset && !inCustom) return false
  }
  return true
}

function toggleRateFilter(label: string) {
  const idx = filters.rates.indexOf(label)
  if (idx === -1) filters.rates.push(label)
  else filters.rates.splice(idx, 1)
}

function toggleCustomRate() {
  customRateActive.value = !customRateActive.value
}

function resetFilters() {
  filters.version = ''
  filters.minRating = 0
  filters.title = ''
  filters.rates = []
  customRateActive.value = false
  customRateMin.value = ''
  customRateMax.value = ''
}

const filteredGames = computed(() => {
  const q = query.value.trim().toLowerCase()
  return games.filter((game) => {
    if (q && !`${game.title} ${game.genre} ${game.version}`.toLowerCase().includes(q)) return false
    return matchesFilters(game)
  })
})

const filteredSoon = computed(() => soon.filter(matchesFilters))
const filteredStarted = computed(() => started.filter(matchesFilters))
const filteredNewGames = computed(() => newGames.filter(matchesFilters))
const filteredAllGames = computed(() => allGames.filter(matchesFilters))

useSeoMeta({
  title: 'MMOTOP — Game Server Rankings',
  description: 'MMOTOP gaming server directory with top games, upcoming servers and recently started servers.',
  ogTitle: 'MMOTOP — Game Server Rankings',
  ogDescription: 'Discover and compare game servers.',
  twitterCard: 'summary_large_image'
})

function selectCategory(category: string) {
  activeCategory.value = category
  showMore.value = false
}

function onDocumentClick(event: MouseEvent) {
  const target = event.target as Node

  if (showMore.value && moreWrap.value && !moreWrap.value.contains(target)) {
    showMore.value = false
  }

  if (filterOpen.value) {
    const inButton = filterButtonEl.value?.contains(target)
    const inPopup = filterPopupEl.value?.contains(target)
    if (!inButton && !inPopup) filterOpen.value = false
  }
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    showMore.value = false
    filterOpen.value = false
  }
}

function positionDropdown() {
  const rect = moreWrap.value?.getBoundingClientRect()
  if (!rect) return
  dropdownPos.value = {
    top: rect.bottom + 8,
    right: window.innerWidth - rect.right
  }
}

const FILTER_POPUP_WIDTH = 270

function positionFilterPopup() {
  const rect = filterButtonEl.value?.getBoundingClientRect()
  if (!rect) return
  const left = Math.min(rect.left, window.innerWidth - FILTER_POPUP_WIDTH - 10)
  filterPos.value = {
    top: rect.bottom + 10,
    left: Math.max(10, left)
  }
}

function repositionOpenPanels() {
  if (showMore.value) positionDropdown()
  if (filterOpen.value) positionFilterPopup()
}

watch(showMore, async (open) => {
  if (!open) return
  await nextTick()
  positionDropdown()
})

watch(filterOpen, async (open) => {
  if (!open) return
  await nextTick()
  positionFilterPopup()
})

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
  window.addEventListener('resize', repositionOpenPanels)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
  window.removeEventListener('resize', repositionOpenPanels)
})

function toggleTheme() {
  dark.value = !dark.value
}

function submitSearch() {
  searchInput.value?.focus()
}

function gameIcon(game: Game) {
  return game.version === 'High-Five' ? 'HF' : 'II'
}
</script>

<template>
  <div class="site-shell" :class="{ 'is-light': !dark }">
    <svg width="0" height="0" style="position: absolute" aria-hidden="true">
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFEA9E" />
          <stop offset="50%" stop-color="#FFD64A" />
          <stop offset="100%" stop-color="#F5A300" />
        </linearGradient>
      </defs>
    </svg>

    <header class="topbar">
      <NuxtLink to="/" class="brand" aria-label="MMOTOP home">MMOTOP</NuxtLink>

      <button class="theme-button" type="button" aria-label="Toggle theme" @click="toggleTheme">
        <svg
          v-if="dark"
          class="theme-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        <svg
          v-else
          class="theme-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </button>

      <label class="search-box">
        <span class="sr-only">Search games</span>
        <input
          ref="searchInput"
          v-model="query"
          placeholder="Search games..."
          @keydown.enter="submitSearch"
        />
        <button
          class="filter-button"
          type="button"
          aria-label="Filter"
          aria-haspopup="true"
          :aria-expanded="filterOpen"
          ref="filterButtonEl"
          :class="{ active: filterOpen || activeFilterCount > 0 }"
          @click="filterOpen = !filterOpen"
        >
          <svg class="filter-icon" viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <line x1="3" y1="5" x2="17" y2="5" />
            <circle cx="7" cy="5" r="1.6" fill="currentColor" stroke="none" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <circle cx="13" cy="10" r="1.6" fill="currentColor" stroke="none" />
            <line x1="3" y1="15" x2="17" y2="15" />
            <circle cx="9" cy="15" r="1.6" fill="currentColor" stroke="none" />
          </svg>
          <span v-if="activeFilterCount > 0" class="filter-badge">{{ activeFilterCount }}</span>
        </button>
        <button class="search-icon" type="button" aria-label="Search" @click="submitSearch">
          <svg class="search-svg" viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <line x1="12.7" y1="12.7" x2="17" y2="17" />
          </svg>
        </button>
      </label>

      <div
        v-if="filterOpen"
        class="filter-popup"
        ref="filterPopupEl"
        :style="{ top: filterPos.top + 'px', left: filterPos.left + 'px' }"
      >
        <div class="filter-popup-section">
          <span class="filter-popup-label">Version</span>
          <select class="filter-select" v-model="filters.version">
            <option value="">All versions</option>
            <option v-for="version in allVersions" :key="version" :value="version">{{ version }}</option>
          </select>
        </div>

        <div class="filter-popup-section">
          <span class="filter-popup-label">Min rating</span>
          <select class="filter-select" v-model.number="filters.minRating">
            <option v-for="threshold in ratingThresholds" :key="threshold.value" :value="threshold.value">
              {{ threshold.label }}
            </option>
          </select>
        </div>

        <div class="filter-popup-section">
          <span class="filter-popup-label">Game</span>
          <select class="filter-select" v-model="filters.title">
            <option value="">All games</option>
            <option v-for="title in allTitles" :key="title" :value="title">{{ title }}</option>
          </select>
        </div>

        <div class="filter-popup-section">
          <span class="filter-popup-label">Rate</span>
          <div class="filter-chip-row">
            <button
              v-for="tier in rateTiers"
              :key="tier.label"
              type="button"
              class="filter-chip"
              :class="{ active: filters.rates.includes(tier.label) }"
              @click="toggleRateFilter(tier.label)"
            >
              {{ tier.label }}
            </button>
            <button
              type="button"
              class="filter-chip"
              :class="{ active: customRateActive }"
              @click="toggleCustomRate"
            >
              Custom
            </button>
          </div>
          <div v-if="customRateActive" class="filter-custom-rate">
            <input
              v-model="customRateMin"
              type="number"
              min="0"
              placeholder="From"
              class="filter-custom-input"
            />
            <span class="filter-custom-sep">–</span>
            <input
              v-model="customRateMax"
              type="number"
              min="0"
              placeholder="To"
              class="filter-custom-input"
            />
          </div>
        </div>

        <div class="filter-popup-actions">
          <button type="button" class="filter-reset" @click="resetFilters">Reset</button>
          <button type="button" class="filter-apply" @click="filterOpen = false">Apply</button>
        </div>
      </div>

      <div class="account-actions">
        <button class="lang-button" type="button" aria-label="Language">
          <span class="flag">🇺🇸</span>
        </button>

        <button class="login-button" type="button">
          <span>LOGIN</span>
        </button>
      </div>
    </header>

    <nav class="category-bar" aria-label="Game categories">
      <button
        v-for="category in visibleCategories"
        :key="category"
        class="category"
        :class="{ active: activeCategory === category }"
        type="button"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>

      <div class="category-more-wrap" ref="moreWrap">
        <button
          class="category more"
          :class="{ active: showMore }"
          type="button"
          aria-haspopup="true"
          :aria-expanded="showMore"
          @click="showMore = !showMore"
        >
          More
          <span class="more-chevron" :class="{ open: showMore }">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>

        <div
          v-if="showMore"
          class="more-dropdown"
          role="menu"
          :style="{ top: dropdownPos.top + 'px', right: dropdownPos.right + 'px' }"
        >
          <button
            v-for="category in hiddenCategories"
            :key="category"
            class="more-dropdown-item"
            :class="{ active: activeCategory === category }"
            type="button"
            role="menuitem"
            @click="selectCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </nav>

    <main class="dashboard">
      <section class="top-grid">
        <GamePanel title="TOP GAME" class="accent-gold">
          <template #icon>
            <svg class="trophy-icon" viewBox="0 0 24 24" width="24" height="24">
              <defs>
                <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFF1C2" />
                  <stop offset="35%" stop-color="#FFCB4D" />
                  <stop offset="75%" stop-color="#F5A623" />
                  <stop offset="100%" stop-color="#D6820A" />
                </linearGradient>
                <linearGradient id="trophyBase" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#C97A3D" />
                  <stop offset="100%" stop-color="#7A431E" />
                </linearGradient>
              </defs>
              <path d="M5 2h14v6a7 7 0 0 1-14 0V2z" fill="url(#trophyGold)" />
              <path
                d="M5 3C2 3 1 5 1 7.5S2 12 5 11.6"
                fill="none"
                stroke="url(#trophyGold)"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M19 3C22 3 23 5 23 7.5S22 12 19 11.6"
                fill="none"
                stroke="url(#trophyGold)"
                stroke-width="2"
                stroke-linecap="round"
              />
              <rect x="10.5" y="13" width="3" height="4" fill="url(#trophyBase)" />
              <path d="M8 17 L16 17 L18.5 20 L5.5 20 Z" fill="url(#trophyBase)" />
              <path
                d="M7.5 3.2C6.6 5 6.8 7 8 8.3"
                stroke="#FFFDF3"
                stroke-width="1.1"
                stroke-linecap="round"
                fill="none"
                opacity="0.55"
              />
            </svg>
          </template>
          <div v-for="(game, index) in filteredGames.slice(0, 10)" :key="`top-${index}`" class="game-row">
            <span class="rank">{{ index + 1 }}</span>
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">
              <span class="version-name">{{ game.version }}</span>
              <small class="version-rate">{{ game.players }}</small>
            </span>
            <span class="rating">
              <span class="rating-value">
                <svg class="star-icon" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                  <path
                    d="M12 3 14.12 9.09 20.56 9.22 15.42 13.11 17.29 19.28 12 15.6 6.71 19.28 8.58 13.11 3.44 9.22 9.88 9.09Z"
                    fill="url(#starGrad)"
                  />
                </svg>
                {{ game.stars }}
              </span>
              <small>{{ game.players }}</small>
            </span>
            <span class="change" :class="{ positive: game.change?.startsWith('+') }">{{ game.change }}</span>
          </div>
          <div v-if="filteredGames.length === 0" class="empty-state">No games match the selected filters.</div>
          <PanelFooter />
        </GamePanel>

        <GamePanel title="COMING SOON" class="accent-blue">
          <template #icon>
            <svg class="clock-icon" viewBox="0 0 24 24" width="24" height="24">
              <defs>
                <linearGradient id="clockFace" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#CDEBFF" />
                  <stop offset="45%" stop-color="#5EC2FF" />
                  <stop offset="100%" stop-color="#2F7FE0" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="9" fill="url(#clockFace)" />
              <path
                d="M12 6.5v5.5l4 2.3"
                stroke="#0B2A55"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
              />
              <path
                d="M8.3 4.2C6 5.6 4.6 8 4.3 10.7"
                stroke="#EAF6FF"
                stroke-width="1"
                stroke-linecap="round"
                fill="none"
                opacity="0.55"
              />
            </svg>
          </template>
          <div v-for="(game, index) in filteredSoon" :key="`soon-${index}`" class="game-row compact no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">
              <span class="version-name">{{ game.version }}</span>
              <small class="version-rate">{{ game.players }}</small>
            </span>
            <span class="rating">
              <span class="rating-value">
                <svg class="star-icon" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                  <path
                    d="M12 3 14.12 9.09 20.56 9.22 15.42 13.11 17.29 19.28 12 15.6 6.71 19.28 8.58 13.11 3.44 9.22 9.88 9.09Z"
                    fill="url(#starGrad)"
                  />
                </svg>
                {{ game.stars }}
              </span>
              <small>{{ game.players }}</small>
            </span>
            <span class="date">{{ formatDate(game.date) }}</span>
          </div>
          <div v-if="filteredSoon.length === 0" class="empty-state">No games match the selected filters.</div>
          <PanelFooter />
        </GamePanel>

        <GamePanel title="ALREADY STARTED" class="accent-amber">
          <template #icon>
            <svg class="bolt-icon" viewBox="0 0 24 24" width="24" height="24">
              <defs>
                <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFF3B0" />
                  <stop offset="45%" stop-color="#FFD23F" />
                  <stop offset="100%" stop-color="#F5850B" />
                </linearGradient>
              </defs>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#boltGrad)" />
            </svg>
          </template>
          <div v-for="(game, index) in filteredStarted" :key="`started-${index}`" class="game-row compact no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">
              <span class="version-name">{{ game.version }}</span>
              <small class="version-rate">{{ game.players }}</small>
            </span>
            <span class="rating">
              <span class="rating-value">
                <svg class="star-icon" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                  <path
                    d="M12 3 14.12 9.09 20.56 9.22 15.42 13.11 17.29 19.28 12 15.6 6.71 19.28 8.58 13.11 3.44 9.22 9.88 9.09Z"
                    fill="url(#starGrad)"
                  />
                </svg>
                {{ game.stars }}
              </span>
              <small>{{ game.players }}</small>
            </span>
            <span class="date">{{ formatDate(game.date) }}</span>
          </div>
          <div v-if="filteredStarted.length === 0" class="empty-state">No games match the selected filters.</div>
          <PanelFooter />
        </GamePanel>
      </section>

      <section class="bottom-grid">
        <GamePanel title="NEW GAMES" :rows="3" class="accent-violet">
          <template #icon>
            <svg class="sparkle-icon" viewBox="0 0 24 24" width="24" height="24">
              <defs>
                <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFC2F0" />
                  <stop offset="50%" stop-color="#D06BFF" />
                  <stop offset="100%" stop-color="#7C3AED" />
                </linearGradient>
              </defs>
              <path
                d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                fill="url(#sparkleGrad)"
              />
            </svg>
          </template>
          <div v-for="(game, index) in filteredNewGames" :key="`new-${index}`" class="game-row no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">
              <span class="version-name">{{ game.version }}</span>
              <small class="version-rate">{{ game.players }}</small>
            </span>
            <span class="rating">
              <span class="rating-value">
                <svg class="star-icon" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                  <path
                    d="M12 3 14.12 9.09 20.56 9.22 15.42 13.11 17.29 19.28 12 15.6 6.71 19.28 8.58 13.11 3.44 9.22 9.88 9.09Z"
                    fill="url(#starGrad)"
                  />
                </svg>
                {{ game.stars }}
              </span>
              <small>{{ game.players }}</small>
            </span>
            <span class="change" :class="{ positive: game.change?.startsWith('+') }">{{ game.change }}</span>
          </div>
          <div v-if="filteredNewGames.length === 0" class="empty-state">No games match the selected filters.</div>
          <PanelFooter />
        </GamePanel>

        <GamePanel title="ALL GAMES" :rows="3" class="accent-teal">
          <template #icon>
            <svg class="grid-icon" viewBox="0 0 24 24" width="24" height="24">
              <defs>
                <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#8FF5D6" />
                  <stop offset="50%" stop-color="#10B981" />
                  <stop offset="100%" stop-color="#0891B2" />
                </linearGradient>
              </defs>
              <rect x="4" y="4" width="7" height="7" rx="1.8" fill="url(#gridGrad)" />
              <rect x="13" y="4" width="7" height="7" rx="1.8" fill="url(#gridGrad)" />
              <rect x="4" y="13" width="7" height="7" rx="1.8" fill="url(#gridGrad)" />
              <rect x="13" y="13" width="7" height="7" rx="1.8" fill="url(#gridGrad)" />
            </svg>
          </template>
          <div v-for="(game, index) in filteredAllGames" :key="`all-${index}`" class="game-row no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">
              <span class="version-name">{{ game.version }}</span>
              <small class="version-rate">{{ game.players }}</small>
            </span>
            <span class="rating">
              <span class="rating-value">
                <svg class="star-icon" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
                  <path
                    d="M12 3 14.12 9.09 20.56 9.22 15.42 13.11 17.29 19.28 12 15.6 6.71 19.28 8.58 13.11 3.44 9.22 9.88 9.09Z"
                    fill="url(#starGrad)"
                  />
                </svg>
                {{ game.stars }}
              </span>
              <small>{{ game.players }}</small>
            </span>
            <span class="change" :class="{ positive: game.change?.startsWith('+') }">{{ game.change }}</span>
          </div>
          <div v-if="filteredAllGames.length === 0" class="empty-state">No games match the selected filters.</div>
          <PanelFooter />
        </GamePanel>
      </section>
    </main>
  </div>
</template>
