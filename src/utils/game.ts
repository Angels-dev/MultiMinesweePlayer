type CellGrid = string[][]                                                                                      // type CellGrid (grille de jeu)
type MineGrid = number[][]                                                                                      // type MineGrid (grille de bombes)

function genCellGrid(width: number, length: number): CellGrid {                                                 // fonction genCellGrid (génération de la grille de jeu)
    return Array.from({ length: width }, () => Array.from({ length: length }, () => "/sUnknown.png"))
}

function genMineGrid(width: number, length: number, nbMines: number): MineGrid {                                // fonction genMineGrid (génération des bombes)
    const mineGrid: MineGrid = []                                                                               // initialisation de la grille de bombes
    while (mineGrid.length < nbMines) {                                                                         // boucle pour placer les bombes
        const x = Math.floor(Math.random() * length)                                                            // position x de la bombe
        const y = Math.floor(Math.random() * width)                                                             // position y de la bombe
        const indice = [y, x]                                                                                   // id de la bombe
        if (!mineGrid.includes(indice)) mineGrid.push(indice)                                                   // si la bombe n'est pas déjà placée, on la place
    }
    return mineGrid;                                                                                            // retour de la grille de bombes
}

function cliqueGauche(cellGrid: CellGrid, mineGrid: MineGrid, x: number, y: number) {                           // fonction main (début du jeu)
    //const indice = [y, x]                                                                                     // id de la case cliquée
    //if (mineGrid.includes(indice)) bombe()                                                                    // si la case cliquée est une bombe, on va dans la fonction bombe   
    //else if (champDeMines[indice] === 0) {caseVide(indice);}                                                  // si la case cliquée est vide, on va dans la fonction caseVide
    //else if (champDeMines[indice] !== 0) {decouvreCase(indice);}                                              // si la case cliquée est un numéro, on va dans la fonction decouvreCase
    //decouvreCase(indice);
    if (cellGrid[y][x] === '/sClick.png') return cellGrid[y][x] = '/sEmpty.png'                                 // modification de l'image de la case
}

function cliqueDroit(cellGrid: string[][], x: number, y: number): void {                                        // fonction cliqueDroit (flag d'une case)                                                                                       // modification de l'image de la case
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


/*
const directions: number[] = [-11, -10, -9, -1, 1, 9, 10, 11];                                                                  // directions possibles pour découvrir les cases
const champDeMines: number[] = [];                                                                                              // champ de mines (0 = case vide, 10 = bombe, 1 à 8 = nombre de bombes adjacentes)
for (let i = 0; i < 100; i++) {champDeMines.push(0);}                                                                           // initialisation des cases à 0
const casesDecouvertes: number[] = [];                                                                                          // cases découvertes (0 = case non découverte, 1 = case découverte, 2 = case flag)
for (let i = 0; i < 100; i++) {casesDecouvertes.push(0);}                                                                       // initialisation des cases à 0

function bombe(): void {                                                                                                        // fonction bombe (game over)
    for (let i = 0; i < casesDecouvertes.length; i++) {casesDecouvertes[i] = 1;}
}

function caseVide(indice: number): void {                                                                                       // fonction caseVide (découverte des cases adjacentes à une case vide)
    for (let i = 0; i < directions.length; i++) {                                                                               // parcours des directions
        if (champDeMines[indice + directions[i]] !== 0) {decouvreCase(indice + directions[i]); return; }                        // si la case est un numéro, on ne fait rien
        else if (casesDecouvertes[indice + directions[i]] === 2) {decouvreCase(indice + directions[i]); return;}                // si la case est un drapeau, on ne fait rien
        else {decouvreCase(indice + directions[i]); caseVide(indice + directions[i]);}                                          // si la case est vide, on va dans la fonction caseVide
    }
}

function decouvreCase(indice: number): void {                                                                                   // fonction decouvreCase (découverte d'une case)
    casesDecouvertes[indice] = 1;                                                                                               // modification dans le tableau des cases découvertes 
}
*/                                                                         

export { genCellGrid, genMineGrid, cliqueGauche, cliqueDroit }                                                                  // export des variables et fonctions
export type { CellGrid, MineGrid }                                                                                              // export des types