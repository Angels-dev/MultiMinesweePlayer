<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { getDirections, genCellGrid, genMineGrid, cliqueGauche, cliqueDroit } from '@/utils/game'
import type { CellGrid, MineGrid } from '@/utils/game'

// Variables du jeu
const width = 10
const length = 15
const nbMines = 25

// Création grille des cases
const cellGrid = ref<CellGrid>([])
cellGrid.value = genCellGrid(width, length)

// Création grille des mines
let mineGrid: MineGrid = []

// État du jeu
const gameStatus = ref(0) // 0: vide, 1: en cours, 2: gagné, 3: perdu
const timer = ref(0)
let timerInterval: number | undefined = undefined

watch(gameStatus, async (status) => {
  if (status === 1) {
    timerInterval = setInterval(() => timer.value++, 1000)
  } else {
    if (timerInterval !== null) clearInterval(timerInterval)
    if (status === 2) alert('Vous avez gagné !')
    if (status === 3) alert('Vous avez perdu !')
  }
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
  if (!mineGrid.length) {
    mineGrid = genMineGrid(width, length, nbMines, cellIndex, rowIndex)
    gameStatus.value = 1
  }

  cliqueGauche(gameStatus.value, cellGrid.value, mineGrid, cellIndex, rowIndex)
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
    <h1>Solo</h1>
    <div class="timer" :gameStatus>{{ timer }}</div>
    <div class="grid">
      <div v-for="(row, rowIndex) in cellGrid" :key="rowIndex" class="row">
        <div v-for="(cell, cellIndex) in row" :key="cellIndex">
          <img class="cell" :src="cell"
            @mousedown.right="cliqueDroit(cellGrid, cellIndex, rowIndex)"
            @mousedown.left="handleMouseDown(rowIndex, cellIndex)"
            @mouseup.left="handleMouseUp(rowIndex, cellIndex)"
            @mousemove="handleMouseMove(rowIndex, cellIndex)"
            @contextmenu.prevent
            @select.prevent
            draggable="false"
          />
        </div>
      </div>
    </div>
    <div class="grid">
      <div v-for="(row, rowIndex) in cellGrid" :key="rowIndex" class="row">
        <div v-for="(cell, cellIndex) in row" :key="cellIndex">
          <img class="cell" :src="mineGrid.some(mine => mine[0] === cellIndex && mine[1] === rowIndex) ? '/sMine.png' : '/sEmpty.png'" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  border: 10px solid black;
}
.row {
  display: flex;
  height: 32px;
}
.cell {
  flex: 1;
  background-color: #f1f1f1;
  text-align: center;
  color: black;
  width: 32px;
  height: 32px;
  user-select: none;
}
</style>