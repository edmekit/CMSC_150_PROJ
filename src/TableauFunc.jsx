const groups = ['coal', 'gas', 'geo', 'oil', 'hydro', 'solar', 'wind']
const timeblocks = 6
const demands = [6300, 8600, 11800, 12300, 14000, 10600]
const caps = [7000, 3300, 800, 1500, 2500] 
const solarCap = [0, 250, 1500, 1375, 200, 0, 0]
const windCap = [140, 120, 100, 100, 120, 140]

function diffPrice(base){
    const prices = [];
    const multipliers = [1, 1.01, 1.03, 1.05, 1.04, 1.02];

    multipliers.map((mult) => {
        prices.push(base * mult);
    })

    return prices
}

function makeVar(group, time){
    return `X${group}${time}`
}

const coalPrice = diffPrice(15200)
const gasPrice = diffPrice(26000)
const geoPrice = diffPrice(6000)
const oilPrice = diffPrice(56000)
const hydroPrice = [1200, 1200, 1200, 1200, 1200, 1200]
const solarPrice = [160, 160, 160, 160, 160, 160]
const windPrice = [240, 240, 240, 240, 240, 240]

export function buildPrimalProb(selected, c02, c02cap){
    const vars = [];
    const cons = []; // has coeff, sign, RHS

    for (let i = 0; i < timeblocks; i++){
        for (let j = 0; j < groups.length; j++){
            if (selected.includes(groups[j])){
                vars.push(makeVar(groups[j], i + 1))
            }
        }
    }
    
    // demand constraint
    for (let i = 0; i < timeblocks; i++){
        const coeffs = [];
        for (let j = 0; j < groups.length; j++){
            coeffs.push({
                key : makeVar(groups[j], i + 1),
                value : 1
            })
        }
        cons.push([coeffs, '>=', demands[i]])
    }

    // cap constraint
    for (let i = 0; i < groups.length; i++){
        if (groups[i] === 'solar'){
            for (let j = 0; j < timeblocks; j++){
                cons.push([[{
                    key: makeVar(groups[i], j + 1),
                    value : 1}], '<=' , solarCap[j]])
            }
        } else if (groups[i] === 'wind'){
            for (let j = 0; j < timeblocks; j++){
                cons.push([[{
                    key: makeVar(groups[i], j + 1),
                    value : 1}], '<=' , windCap[j]])
            }
        } else {
        for (let j = 0; j < timeblocks; j++){
            cons.push([[{
                    key: makeVar(groups[i], j + 1),
                    value : 1}], '<=' , caps[j]])
        }
        }
    }

    // coal minimum
    for (let i = 0; i < timeblocks; i++){
        cons.push([[{
                    key: makeVar('coal', i + 1),
                    value : 1}], '>=', caps[1] * 0.4])
    }

    


}

export function Simplex(tableau) {
    const tableauHistory = [];

    tableau = tableau.map(row => [...row]); // copy the tableau

    const rows = tableau.length;            
    const cols = tableau[0].length;

    while (hasNegative(tableau[rows - 1].slice(0, cols - 1))) { // last row without sol col
        const colIndex = findPivotColId(tableau[rows - 1].slice(0, cols - 1));
        const pivotCol = tableau.map(row => row[colIndex]);     // get values in pivot col
        
        const answers = tableau.map(row => row[cols - 1]);       // get values in sol col

        const rowIndex = findPivotElemId(pivotCol, answers);    

        if (rowIndex === -1) {
            throw new Error("Unbounded solution.");
        }

        const pivotRow = tableau[rowIndex].slice();
        const pivotElem = tableau[rowIndex][colIndex];
        
        const normalizedRow = pivotRow.map(value => value / pivotElem);

        for (let row = 0; row < rows; row++) {
            if (row === rowIndex) {
                tableau[rowIndex] = normalizedRow;
                continue;
            }

            const multiplier = tableau[row][colIndex];

            tableau[row] = tableau[row].map(
                (value, col) =>
                    value - normalizedRow[col] * multiplier
            );
        }
            const Min = tableau[rows - 1][cols - 1];

    let basic = tableau[rows - 1].slice(0, cols - 2);
    basic.push(Min);

    const solutionNames = ["S1", "S2", "X1", "X2", "Z"];

    const solutions = {
        columnNames: solutionNames,
        values: basic
    };

        tableauHistory.push([[...tableau], solutions]);
    }


    return {
        history: tableauHistory,
        finalTableau: tableau,
    };
}


export function hasNegative(row) {
    for (let i = 0; i < row.length; i++) {
        if (row[i] < 0) {
            return true;
        }
    }
    return false;
}


export  function findPivotColId(row) {
    let highestIndex = 0;
    let highestValue = row[0];

    for (let i = 0; i < row.length; i++) {
        if (row[i] >= 0) {
            continue;
        }

        if (row[i] < highestValue) {
            highestValue = row[i];
            highestIndex = i;
        }
    }
    return highestIndex;
}

export function findPivotElemId(col, answers) {
    let smallestRatio = Infinity;
    let smallestIndex = -1;

    for (let i = 0; i < col.length; i++) {
        if (col[i] <= 0) {
            continue;
        }
        const ratio = answers[i] / col[i];
        if (ratio < smallestRatio) {
            smallestRatio = ratio;
            smallestIndex = i;
        }
    }

    return smallestIndex;
}


export function getBasicSolution(tableau, columnNames) {
    const cols = tableau[0].length;
    const solutions = [];

    for (let col = 0; col < cols - 1; col++) {
        if (isCleared(tableau.map(row => row[col]))) {
            const answer = findAnswer(
                tableau.map(row => row[col]),
                tableau.map(row => row[cols - 1])
            );

            solutions.push(answer);
        } else {
            solutions.push(0);
        }
    }

    return {
        columnNames: columnNames.slice(0, cols - 1),
        values: solutions
    };
}


export function isCleared(col) {
    const values = [];

    for (let row = 0; row < col.length; row++) {
        if (Math.abs(col[row]) > 0) {
            values.push(col[row]);
        }
    }

    return values.length <= 1;
}


export function findAnswer(col, answers) {
    for (let row = 0; row < col.length; row++) {
        if (col[row] === 1) {
            return answers[row];
        }
    }

    return 0;
}