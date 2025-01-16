const K = 100;
const calcELOProb = (playerELO, challengerELO) => 1/(1+10**((challengerELO-playerELO)/400))
export const calcELOUpdates = (winnerELO, loserELO) => 
    [Math.round(winnerELO+K*(1-calcELOProb(winnerELO, loserELO))), 
        Math.round(loserELO+K*(0-calcELOProb(loserELO, winnerELO)))]

export function getTwoRandomItems(list) {
    if (list.length < 2) {
        throw new Error("List must contain at least two items to select random items.");
    }
    
    const firstIndex = Math.floor(Math.random() * list.length);
    let secondIndex;
    do {
        secondIndex = Math.floor(Math.random() * list.length);
    } while (secondIndex === firstIndex);
    
    return [firstIndex, secondIndex];
}
