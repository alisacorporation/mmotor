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
        <GamePanel title="TOP GAME">
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
            <span class="version">{{ game.version }}</span>
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
          <PanelFooter />
        </GamePanel>

        <GamePanel title="COMING SOON">
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
          <div v-for="(game, index) in soon" :key="`soon-${index}`" class="game-row compact no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">{{ game.version }}</span>
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
            <span class="date">{{ game.date }}</span>
          </div>
          <PanelFooter />
        </GamePanel>

        <GamePanel title="ALREADY STARTED">
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
          <div v-for="(game, index) in started" :key="`started-${index}`" class="game-row compact no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">{{ game.version }}</span>
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
            <span class="date">{{ game.date }}</span>
          </div>
          <PanelFooter />
        </GamePanel>
      </section>

      <section class="bottom-grid">
        <GamePanel title="NEW GAMES" :rows="3">
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
          <div v-for="(game, index) in newGames" :key="`new-${index}`" class="game-row no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">{{ game.version }}</span>
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
          <PanelFooter />
        </GamePanel>

        <GamePanel title="ALL GAMES" :rows="3">
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
          <div v-for="(game, index) in allGames" :key="`all-${index}`" class="game-row no-rank">
            <span class="game-logo">{{ gameIcon(game) }}</span>
            <span class="game-name">
              <strong>{{ game.title }}</strong>
              <small>{{ game.genre }}</small>
            </span>
            <span class="version">{{ game.version }}</span>
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
          <PanelFooter />
        </GamePanel>
      </section>
    </main>
  </div>
</template>
