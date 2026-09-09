<script setup lang="ts">
type Game = {
  title: string
  genre: string
  version: string
  stars: number
  players: string
  change?: string
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
  'RF Online'
]

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
  date: '12.23.2024'
}))

const started = Array.from({ length: 10 }, (_, i) => ({
  ...games[(i + 1) % games.length],
  date: '12.23.2024'
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

const filteredGames = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return games
  return games.filter((game) =>
    `${game.title} ${game.genre} ${game.version}`.toLowerCase().includes(q)
  )
})

useSeoMeta({
  title: 'MMOTOP — Game Server Rankings',
  description: 'MMOTOP gaming server directory with top games, upcoming servers and recently started servers.',
  ogTitle: 'MMOTOP — Game Server Rankings',
  ogDescription: 'Discover and compare game servers.',
  twitterCard: 'summary_large_image'
})

function selectCategory(category: string) {
  activeCategory.value = category
}

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
        <button class="filter-button" type="button" aria-label="Filter">
          <svg class="filter-icon" viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <line x1="3" y1="5" x2="17" y2="5" />
            <circle cx="7" cy="5" r="1.6" fill="currentColor" stroke="none" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <circle cx="13" cy="10" r="1.6" fill="currentColor" stroke="none" />
            <line x1="3" y1="15" x2="17" y2="15" />
            <circle cx="9" cy="15" r="1.6" fill="currentColor" stroke="none" />
          </svg>
        </button>
        <button class="search-icon" type="button" aria-label="Search" @click="submitSearch">
          <span class="search-glyph">⌕</span>
        </button>
      </label>

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
        v-for="category in categories.slice(0, showMore ? categories.length : 8)"
        :key="category"
        class="category"
        :class="{ active: activeCategory === category }"
        type="button"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>

      <button class="category more" type="button" @click="showMore = !showMore">
        More <span>{{ showMore ? '⌃' : '⌄' }}</span>
      </button>
    </nav>

    <main class="dashboard">
      <section class="top-grid">
        <GamePanel title="TOP GAME" icon="🏆">
          <div v-for="(game, index) in filteredGames.slice(0, 10)" :key="`top-${index}`" class="game-row">
            <span class="rank">{{ index + 1 }}</span>
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">{{ game.version }}</span>
            <span class="rating">★ {{ game.stars }}<small>{{ game.players }}</small></span>
            <span class="change" :class="{ positive: game.change?.startsWith('+') }">{{ game.change }}</span>
          </div>
          <PanelFooter />
        </GamePanel>

        <GamePanel title="COMING SOON" icon="◷">
          <div v-for="(game, index) in soon" :key="`soon-${index}`" class="game-row compact no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">{{ game.version }}</span>
            <span class="rating">★ {{ game.stars }}<small>{{ game.players }}</small></span>
            <span class="date">{{ game.date }}</span>
          </div>
          <PanelFooter />
        </GamePanel>

        <GamePanel title="ALREADY STARTED" icon="ϟ">
          <div v-for="(game, index) in started" :key="`started-${index}`" class="game-row compact no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">{{ game.version }}</span>
            <span class="rating">★ {{ game.stars }}<small>{{ game.players }}</small></span>
            <span class="date">{{ game.date }}</span>
          </div>
          <PanelFooter />
        </GamePanel>
      </section>

      <section class="bottom-grid">
        <GamePanel title="NEW GAMES" icon="⌁" :rows="3">
          <div v-for="(game, index) in newGames" :key="`new-${index}`" class="game-row no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">{{ game.version }}</span>
            <span class="rating">★ {{ game.stars }}<small>{{ game.players }}</small></span>
            <span class="change" :class="{ positive: game.change?.startsWith('+') }">{{ game.change }}</span>
          </div>
          <PanelFooter />
        </GamePanel>

        <GamePanel title="ALL GAMES" icon="⌘" :rows="3">
          <div v-for="(game, index) in allGames" :key="`all-${index}`" class="game-row no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">{{ game.version }}</span>
            <span class="rating">★ {{ game.stars }}<small>{{ game.players }}</small></span>
            <span class="change" :class="{ positive: game.change?.startsWith('+') }">{{ game.change }}</span>
          </div>
          <PanelFooter />
        </GamePanel>
      </section>
    </main>
  </div>
</template>
