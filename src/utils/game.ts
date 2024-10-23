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

function flagCase(indice: number): void {                                                                                       // fonction flagCase (flag d'une case)
    casesDecouvertes[indice] = 2;                                                                                               // modification dans le tableau des cases découvertes
}

function cliqueGauche(indice: number): void {                                                                                   // fonction main (début du jeu)
    if (champDeMines[indice] === 10) {bombe();}                                                                                 // si la case cliquée est une bombe, on va dans la fonction bombe   
    else if (champDeMines[indice] === 0) {caseVide(indice);}                                                                    // si la case cliquée est vide, on va dans la fonction caseVide
    else if (champDeMines[indice] !== 0) {decouvreCase(indice);}                                                                // si la case cliquée est un numéro, on va dans la fonction decouvreCase
    decouvreCase(indice);                                                                          
}

function cliqueDroite(indice: number): void {                                                                                    // fonction cliqueDroite (flag d'une case)
    flagCase(indice);
}                                                                                       
