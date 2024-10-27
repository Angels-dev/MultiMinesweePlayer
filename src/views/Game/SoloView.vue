<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { getDirections, genCellGrid, genMineGrid, cliqueGauche, cliqueDroit } from '@/utils/game'
import type { CellGrid, MineGrid } from '@/utils/game'

// Variables du jeu
const width = ref(10)
const length = ref(15)
const nbMines = ref(20)

// Création grille des cases
const cellGrid = ref<CellGrid>([])
cellGrid.value = genCellGrid(width.value, length.value)

// Création grille des mines
let mineGrid: MineGrid = []

// État du jeu
const gameStatus = ref(0) // 0: vide, 1: en cours, 2: gagné, 3: perdu
const timer = ref(0)
let timerInterval: number | null = null

// Fonction pour démarrer une nouvelle partie
const startNewGame = () => {
  gameStatus.value = 0
  timer.value = 0
  cellGrid.value = genCellGrid(width.value, length.value)
}

// Formater le timer en heure:minute:seconde
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  // Si les heures sont 0, ne pas les afficher
  const hoursDisplay = hours > 0 ? `${hours}:` : ''
  // Afficher les minutes sans padding de 0
  const minutesDisplay = `${minutes}:`
  // Toujours afficher les secondes avec un padding de 0
  const secondsDisplay = String(secs).padStart(2, '0')

  return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`
}

// Watch pour démarrer ou arrêter le timer selon l'état du jeu
watch(gameStatus, async (status) => {
  if (status === 0) {
    timer.value = 0
    cellGrid.value = genCellGrid(width.value, length.value)
  }
  if (status === 1) timerInterval = setInterval(() => timer.value++, 1000)
  else if (timerInterval) clearInterval(timerInterval)
})

// État pour gérer le clic et la position de la cellule
const isMouseDown = ref(false)
const currentCell = ref<{ rowIndex: number, cellIndex: number } | null>(null)

// État pour suivre les cases surlignées
const highlightedCells = ref<number[][]>([])

// Gestion des événements de clic et de la position de la cellule
const handleMouseDown = (rowIndex: number, cellIndex: number) => {
  isMouseDown.value = true
  currentCell.value = { rowIndex, cellIndex }
  const cellValue = cellGrid.value[rowIndex][cellIndex]

  if (cellValue === '/sUnknown.png') cellGrid.value[rowIndex][cellIndex] = '/sClick.png' // Si la cellule est inconnue, on la vérifie
  else if (/\/s\d\.png$/.test(cellValue)) highlightAdjacentUnknownCells(cellIndex, rowIndex) // Vérifie si la cellule contient un chiffre

}

// Gestion des événements de relâchement de clic et de la position de la cellule
const handleMouseUp = async (rowIndex: number, cellIndex: number) => {
  isMouseDown.value = false
  if (!gameStatus.value) {
    mineGrid = genMineGrid(width.value, length.value, nbMines.value, cellIndex, rowIndex)
    gameStatus.value = 1
  }

  gameStatus.value = cliqueGauche(cellGrid.value, mineGrid, cellIndex, rowIndex)
  currentCell.value = null

  // Réinitialiser les cases surlignées
  for (const [dx, dy] of highlightedCells.value) { if (cellGrid.value[dy][dx] === '/sHighlight.png') cellGrid.value[dy][dx] = '/sUnknown.png' }
  highlightedCells.value = []
}

// Gestion des événements de déplacement de la souris et de la position de la cellule
const handleMouseMove = (rowIndex: number, cellIndex: number) => {
  if (isMouseDown.value && currentCell.value) {
    const { rowIndex: prevRowIndex, cellIndex: prevCellIndex } = currentCell.value

    if (prevRowIndex !== rowIndex || prevCellIndex !== cellIndex) {
      const cellValue = cellGrid.value[rowIndex][cellIndex]

      // Réinitialiser les cases surlignées
      for (const [dx, dy] of highlightedCells.value) { cellGrid.value[dy][dx] = '/sUnknown.png' }
      highlightedCells.value = []

      // Changer l'image actuelle
      if (cellValue === '/sUnknown.png') cellGrid.value[rowIndex][cellIndex] = '/sClick.png'
      else if (/\/s\d\.png$/.test(cellValue)) highlightAdjacentUnknownCells(cellIndex, rowIndex)

      // Réinitialiser l'image précédente
      const prevCellValue = cellGrid.value[prevRowIndex][prevCellIndex]
      if (prevCellValue === '/sClick.png') cellGrid.value[prevRowIndex][prevCellIndex] = '/sUnknown.png'

      currentCell.value = { rowIndex, cellIndex }
    }
  }
}

// Gestion des événements de déplacement de la souris et de la position de la cellule
const handleGlobalMouseMove = (event: MouseEvent) => {
  if (isMouseDown.value && currentCell.value) {
    const target = event.target as HTMLElement

    if (!target.classList.contains('cell')) {
      const { rowIndex, cellIndex } = currentCell.value

      if (cellGrid.value[rowIndex][cellIndex] === '/sClick.png') cellGrid.value[rowIndex][cellIndex] = '/sUnknown.png'
      currentCell.value = null
    }
  }
}

// Fonction pour surligner toutes les cases adjacentes inconnues
const highlightAdjacentUnknownCells = (cellIndex: number, rowIndex: number) => {
  const directions = getDirections(cellIndex, rowIndex)
  
  highlightedCells.value = [] // Réinitialiser la liste des cases surlignées

  for (const [dx, dy] of directions) {
    if (dx < 0 || dx >= cellGrid.value[0].length || dy < 0 || dy >= cellGrid.value.length) continue
    if (cellGrid.value[dy][dx] === '/sUnknown.png') {
      cellGrid.value[dy][dx] = '/sHighlight.png'
      highlightedCells.value.push([dx, dy])
    }
  }
}

// Écoute des événements de déplacement de la souris
onMounted(() => document.addEventListener('mousemove', handleGlobalMouseMove))
onUnmounted(() => document.removeEventListener('mousemove', handleGlobalMouseMove))
</script>

<template>
  <div class="main">
    <div class="space">
      <h1>Solo</h1>
      <div class="timer" :gameStatus>{{ formatTime(timer) }}</div>
    </div>

    <div class="menu">
      <div class="presets">
        <button class="rounded" @click="width = 10; length = 15; nbMines = 20">Facile</button>
        <button class="rounded" @click="width = 20; length = 50; nbMines = 180">Moyen</button>
        <button class="rounded" @click="width = 50; length = 80; nbMines = 800">Difficile</button>
        <button class="rounded" @click="width = 100; length = 100; nbMines = 2000">Extrême</button>
      </div>

      <div class="inputs">
        <div>
          <label for="length">Colonnes</label>
          <input type="number" v-model="length" min="10" max="50" id="length" />
        </div>
        <div>
          <label for="width">Lignes</label>
          <input type="number" v-model="width" min="10" max="50" id="width" />
        </div>
        <div>
          <label for="nbMines">Mines</label>
          <input type="number" v-model="nbMines" min="10" max="250" id="nbMines" />
        </div>
      </div>

      <button class="rounded newgame" @click="startNewGame">Nouvelle partie</button>
    </div>

    <div class="grid">
      <div v-for="(row, rowIndex) in cellGrid" :key="rowIndex" class="row">
        <img v-for="(cell, cellIndex) in row" :key="cellIndex" class="cell" :src="cell"
          @mousedown.right="gameStatus == 1 ? cliqueDroit(cellGrid, cellIndex, rowIndex) : null"
          @mousedown.left="gameStatus == 0 || gameStatus == 1 ? handleMouseDown(rowIndex, cellIndex) : null"
          @mouseup.left="gameStatus == 0 || gameStatus == 1 ? handleMouseUp(rowIndex, cellIndex) : null"
          @mousemove="gameStatus == 0 || gameStatus == 1 ? handleMouseMove(rowIndex, cellIndex) : null"
          @contextmenu.prevent
          @select.prevent
          draggable="false"
        />
      </div>
    </div>
    
    <transition name="fade">
      <div v-if="gameStatus === 2" class="message">Vous avez gagné !</div>
      <div v-else-if="gameStatus === 3" class="message">Vous avez perdu !</div>
    </transition>
  </div>
</template>

<style scoped>
.main {
  gap: 0
}
</style>