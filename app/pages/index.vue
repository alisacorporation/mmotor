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

const filteredGames = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return games
  return games.filter((game) =>
    `${game.title} ${game.genre} ${game.version}`.toLowerCase().includes(q)
  )
})

useSeoMeta({
  title: 'MMOTOR — Game Server Rankings',
  description: 'MMOTOR gaming server directory with top games, upcoming servers and recently started servers.',
  ogTitle: 'MMOTOR — Game Server Rankings',
  ogDescription: 'Discover and compare game servers.',
  twitterCard: 'summary_large_image'
})

function selectCategory(category: string) {
  activeCategory.value = category
}

function toggleTheme() {
  dark.value = !dark.value
}

function gameIcon(game: Game) {
  return game.version === 'High-Five' ? 'HF' : 'II'
}
</script>

<template>
  <div class="site-shell" :class="{ 'is-light': !dark }">
    <header class="topbar">
      <NuxtLink to="/" class="brand" aria-label="MMOTOR home">MMOTOR</NuxtLink>

      <button class="theme-button" type="button" aria-label="Toggle theme" @click="toggleTheme">
        <span class="moon">{{ dark ? '☾' : '☀' }}</span>
      </button>

      <label class="search-box">
        <span class="sr-only">Search games</span>
        <input v-model="query" placeholder="Search games..." />
        <span class="search-icon">⌕</span>
      </label>

      <button class="login-button" type="button">
        <span class="flag">🇺🇸</span>
        <span>LOGIN</span>
      </button>
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
          <div v-for="(game, index) in soon" :key="`soon-${index}`" class="game-row compact">
            <span class="rank">{{ index + 1 }}</span>
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
          <div v-for="(game, index) in started" :key="`started-${index}`" class="game-row compact">
            <span class="rank">{{ index + 1 }}</span>
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
          <div v-for="(game, index) in newGames" :key="`new-${index}`" class="game-row">
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
        </GamePanel>

        <GamePanel title="ALL GAMES" icon="⌘" :rows="3">
          <div v-for="(game, index) in allGames" :key="`all-${index}`" class="game-row">
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
        </GamePanel>
      </section>
    </main>
  </div>
</template>
