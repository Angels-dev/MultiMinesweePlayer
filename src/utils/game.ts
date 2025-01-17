type CellGrid = string[][]   // type CellGrid (grille de jeu)
type MineGrid = number[][]   // type MineGrid (grille de bombes)
type Directions = number[][] // type Directions (directions possibles)

function getDirections(x: number, y: number): Directions {
    return [[x-1, y-1], [x-1, y], [x-1, y+1], [x, y-1], [x, y+1], [x+1, y-1], [x+1, y], [x+1, y+1]]
}

function genCellGrid(width: number, length: number): CellGrid {                                                 // fonction genCellGrid (génération de la grille de jeu)
    return Array.from({ length: width }, () => Array.from({ length: length }, () => "/sUnknown.png"))
}

function genMineGrid(width: number, length: number, nbMines: number, fx: number, fy: number): MineGrid {        // fonction genMineGrid (génération des bombes)
    const mineGrid: MineGrid = []                                                                               // initialisation de la grille de bombes
    const directions = getDirections(fx, fy)
    
    while (mineGrid.length < nbMines) {                                                                         // boucle pour placer les bombes
        const x = Math.floor(Math.random() * length)                                                            // position x de la bombe
        const y = Math.floor(Math.random() * width)                                                             // position y de la bombe
        const indice = [x, y]
        
        if (directions.some(d => d[0] === x && d[1] === y) || (x === fx && y === fy)) continue                  // vérifie si la bombe n'est pas déjà placée et si ce n'est pas le premier clic
        if (!mineGrid.some(m => m[0] === x && m[1] === y)) mineGrid.push(indice)                                // vérifie si la bombe n'est pas déjà placée et si ce n'est pas le premier clic
    }
    mineGrid.sort((a, b) => a[0] - b[0] || a[1] - b[1])                                                         // Trier les bombes par ordre x puis y
    return mineGrid                                                                                             // retour de la grille de bombes
}


function cliqueGauche(cellGrid: CellGrid, mineGrid: MineGrid, x: number, y: number): number {
    const checkDrop = ['/sEmpty.png', '/sUnknown.png', '/sFlag.png', '/sQuestion.png']
    if (checkDrop.includes(cellGrid[y][x])) return 1
    else if (cellGrid[y][x] === '/sClick.png') {
        const result = checkCell(cellGrid, mineGrid, x, y)
        if (result !== 0) return result
    }
    else {
        const result = revealCell(cellGrid, mineGrid, x, y)
        if (result !== 0) return result
    }

    // Continuer le jeu
    return 1
}

function cliqueDroit(cellGrid: string[][], x: number, y: number) {                                              // fonction cliqueDroit (flag d'une case)
    switch (cellGrid[y][x]) {
        case '/sUnknown.png':
            cellGrid[y][x] = "/sFlag.png"
            break
        case '/sFlag.png':
            cellGrid[y][x] = "/sQuestion.png"
            break
        case '/sQuestion.png':
            cellGrid[y][x] = "/sUnknown.png"
            break
    }
}

function checkCell(cellGrid: CellGrid, mineGrid: MineGrid, x: number, y: number): number {
    if (mineGrid.some(m => m[0] === x && m[1] === y)) return gameOver(cellGrid, mineGrid, x, y)

    // Compter le nombre de mines adjacentes
    let minesAdjacentes = 0
    const directions = getDirections(x, y)
    for (const [dx, dy] of directions) {
        if (dx < 0 || dx >= cellGrid[0].length || dy < 0 || dy >= cellGrid.length) continue
        if (mineGrid.some(m => m[0] === dx && m[1] === dy)) minesAdjacentes++
    }

    // Si la cellule a des mines adjacentes, afficher le nombre de mines
    if (minesAdjacentes > 0) {
        cellGrid[y][x] = `/s${minesAdjacentes}.png`
        
        const result = revealCell(cellGrid, mineGrid, x, y)
        if (result !== 0) return result
    } else {
        cellGrid[y][x] = '/sEmpty.png'
        for (const [dx, dy] of directions) {
            if (dx >= 0 && dx < cellGrid[0].length && dy >= 0 && dy < cellGrid.length && cellGrid[dy][dx] === '/sUnknown.png') {
                const result = checkCell(cellGrid, mineGrid, dx, dy)
                if (result !== 0) return result
            }
        }
    }

    // Vérifier si toutes les cellules non-mines sont révélées pour déterminer la victoire
    if (cellGrid.flat().every((cell, index) => {
        const x = index % cellGrid[0].length
        const y = Math.floor(index / cellGrid[0].length)
        return cell !== '/sUnknown.png' || mineGrid.some(m => m[0] === x && m[1] === y)
    })) return 2

    // Continuer le jeu
    return 0
}

function revealCell(cellGrid: CellGrid, mineGrid: MineGrid, x: number, y: number): number {
    const directions = getDirections(x, y)
    let flagCount = 0
    for (const [dx, dy] of directions) {
        if (dx >= 0 && dx < cellGrid[0].length && dy >= 0 && dy < cellGrid.length && cellGrid[dy][dx] === '/sFlag.png') flagCount++
    }
    const cellValue = parseInt(cellGrid[y][x].match(/\/s(\d)\.png$/)?.[1] || '0')
    if (flagCount === cellValue) {
        for (const [dx, dy] of directions) {
            if (dx >= 0 && dx < cellGrid[0].length && dy >= 0 && dy < cellGrid.length && (cellGrid[dy][dx] === '/sHighlight.png' || cellGrid[dy][dx] === '/sUnknown.png')) {
                cellGrid[dy][dx] = '/sUnknown.png'

                const result = checkCell(cellGrid, mineGrid, dx, dy)
                if (result !== 0) return result
            }
        }
    }

    // Continuer le jeu
    return 0
}

function gameOver(cellGrid: CellGrid, mineGrid: MineGrid, x: number, y: number): number {
    for (const [mx, my] of mineGrid) {
        if (cellGrid[my][mx] === '/sUnknown.png') cellGrid[my][mx] = '/sMine.png'
    }

    // Vérifier l'emplacement de tous les flags dans toute la grille et les remplacer par '/sFlagWrong.png' s'il y en a un qui n'est pas sur une bombe
    for (let y = 0; y < cellGrid.length; y++) {
        for (let x = 0; x < cellGrid[y].length; x++) {
            if (cellGrid[y][x] === '/sFlag.png') if (!mineGrid.some(m => m[0] === x && m[1] === y)) cellGrid[y][x] = '/sFlagWrong.png'
        }
    }

    cellGrid[y][x] = '/sExploded.png'
    return 3
}

export { getDirections, genCellGrid, genMineGrid, cliqueGauche, cliqueDroit } // export des fonctions
export type { Directions, CellGrid, MineGrid }                                // export des types