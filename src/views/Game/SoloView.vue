<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { genCellGrid, genMineGrid, cliqueGauche, cliqueDroit } from '@/utils/game'
import type { CellGrid, MineGrid } from '@/utils/game'

const width = 10
const length = 15
const nbMines = 25

// Création grille des cases
const cellGrid = ref<CellGrid>([])
cellGrid.value = genCellGrid(width, length)

// Création grille des mines
let mineGrid: MineGrid = []
mineGrid = genMineGrid(width, length, nbMines)

// État pour gérer le clic et la position de la cellule
const isMouseDown = ref(false)
const currentCell = ref<{ rowIndex: number, cellIndex: number } | null>(null)

const handleMouseDown = (rowIndex: number, cellIndex: number) => {
  isMouseDown.value = true
  currentCell.value = { rowIndex, cellIndex }
  if (cellGrid.value[rowIndex][cellIndex] === '/sUnknown.png') cellGrid.value[rowIndex][cellIndex] = '/sClick.png'
}

const handleMouseUp = (rowIndex: number, cellIndex: number) => {
  isMouseDown.value = false
  cliqueGauche(cellGrid.value, mineGrid, cellIndex, rowIndex)
  currentCell.value = null
}

const handleMouseMove = (rowIndex: number, cellIndex: number) => {
  if (isMouseDown.value && currentCell.value) {
    const { rowIndex: prevRowIndex, cellIndex: prevCellIndex } = currentCell.value
    if (prevRowIndex !== rowIndex || prevCellIndex !== cellIndex) {
      if (cellGrid.value[prevRowIndex][prevCellIndex] === '/sClick.png') cellGrid.value[prevRowIndex][prevCellIndex] = '/sUnknown.png' // Réinitialiser l'image précédente
      if (cellGrid.value[rowIndex][cellIndex] === '/sUnknown.png') cellGrid.value[rowIndex][cellIndex] = '/sClick.png' // Changer l'image actuelle
      currentCell.value = { rowIndex, cellIndex }
    }
  }
}

const handleGlobalMouseMove = (event: MouseEvent) => {
  if (isMouseDown.value && currentCell.value) {
    const target = event.target as HTMLElement
    if (!target.classList.contains('cell')) {
      const { rowIndex, cellIndex } = currentCell.value
      if (cellGrid.value[rowIndex][cellIndex] === '/sClick.png') {
        cellGrid.value[rowIndex][cellIndex] = '/sUnknown.png'
      }
      currentCell.value = null
    }
  }
}

onMounted(() => document.addEventListener('mousemove', handleGlobalMouseMove))
onUnmounted(() => document.removeEventListener('mousemove', handleGlobalMouseMove))
</script>

<template>
  <div class="main">
    <h1>Solo</h1>
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