import { DataGrid, GridCell } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Table from "./Table.jsx";
import { Box } from "@mui/system";
import { Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";


const columns = [
  { field: "plantGroup", headerName: "Plant Group", width: 362},
  { field: "cost", headerName: "cgt (₱/MWh)", width: 362},
  { field: "cap", headerName: "Capg (MW)", width: 362},
  { field: "emission", headerName: "eg (t CO2/MWh)", width: 362},
];

const initialRows = [
  {
    id: 1,
    plantGroup: "Coal",
    cost: "3800 - 3990 (differs by block time)",
    cap: "7000",
    emission: "0.95",
  },
  {
    id: 2,
    plantGroup: "Natural Gas",
    cost: "6500 - 6825 (differs by block time)",
    cap: "3300",
    emission: "0.40",
  },
  {
    id: 3,
    plantGroup: "Geothermal",
    cost: "1500 - 1575 (differs by block time)",
    cap: "800",
    emission: "0.10",
  },
  { id: 4, plantGroup: "Hydro", cost: "300", cap: "2500", emission: "0" },
  {
    id: 5,
    plantGroup: "Oil-based",
    cost: "14000 - 14700 (differs by block time)",
    cap: "1500",
    emission: "0.75",
  },
  { id: 6, plantGroup: "Solar", cost: "40", cap: "2500", emission: "0" },
  { id: 7, plantGroup: "Wind", cost: "60", cap: "400", emission: "0" },
];

const matrixValues = [
  { id : 1, values: [ 1, 2, 8, 4, 5, 6, 7 ]},
  { id : 2, values: [ 1, 2, 3, 4, 5, 6, 7 ]},
]

function Simplex(tableau) {
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

        for (let row = 0; row < rows; row++) {
            const normalizedRow = pivotRow.map(
                value => value / pivotElem
            );

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


function hasNegative(row) {
    for (let i = 0; i < row.length; i++) {
        if (row[i] < 0) {
            return true;
        }
    }
    return false;
}


function findPivotColId(row) {
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

function findPivotElemId(col, answers) {
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


function getBasicSolution(tableau, columnNames) {
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


function isCleared(col) {
    const values = [];

    for (let row = 0; row < col.length; row++) {
        if (Math.abs(col[row]) > 0) {
            values.push(col[row]);
        }
    }

    return values.length <= 1;
}


function findAnswer(col, answers) {
    for (let row = 0; row < col.length; row++) {
        if (col[row] === 1) {
            return answers[row];
        }
    }

    return 0;
}

// TEST TABLEAU
const tableau = [
    [1, 7, 1, 0, 0, 14],
    [2, 6, 0, 1, 0, 20],
    [-4, -20, 0, 0, 1, 0]
];




export default function App() {
  const [value, setValue] = useState(1);
  const sampleMin = Simplex(tableau);
  const [co2, setCo2] = useState(false);
  const [rows, setRows] = useState(initialRows);

  const [selectedRows, setSelectedRows] = useState({
    type: "include",
    ids: new Set(),
  });

  function removeSelected() {
    setSelectedRows({
      type: "include",
      ids: new Set(),
    });
  }

  function solveSelected(){
    let total = 0
    selectedRows.ids.forEach((id) => {

      total += matrixValues[id - 1].values[2]
    })

    console.log(total)
  }

  return (
    <Stack spacing={20} direction="column">
      <Paper sx={{ height: 450, width: "100%" }}>
        <div className="header">
          <Typography variant="h6" sx={{fontWeight: "bold" }}>Luzon Grid Dispatch</Typography>
          <div>
            <Switch
              color="warning"
              checked={co2}
              onChange={(e) => {
                setCo2(e.target.checked);
              }}
            />
            <TextField
              defaultValue="165000"
              label="Limit Daily C02"
              variant="standard"
              color="warning"
              focused
              disabled={!co2}
            />
            <Stack spacing={1} direction="row">
              <Button
                onClick={solveSelected}
                variant="contained"
                sx={{
                  bgcolor: "#e95b1e",
                  color: "#FFFFFF",
                }}
              >
                Solve
              </Button>
              <Button
                variant="outlined"
                onClick={removeSelected}
                sx={{ color: "#e95b1e", borderColor: "#e95b1e" }}
              >
                Reset
              </Button>
            </Stack>
          </div>
        </div>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          hideFooter
          sx={{
            mb: 2,
            mt: 1,
            border: 0,
            "& .MuiDataGrid-columnHeader": {
              bgcolor: "#e95b1e",
              color: "primary.contrastText",
            },
            "& .MuiCheckbox-root.Mui-checked": {
              color: "#e95b1e",
            },
            "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
              bgcolor: "#e95b1e",
              color: "primary.contrastText",
            },
          }}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={setSelectedRows}
        />
      </Paper>
      <Box sx={{ height: 400, width: "100%" }}>
        <TabContext value={value}>
            <TabList  
              variant="scrollable"
              scrollButtons="auto"
              onChange={(e, v) => setValue(v)}
              aria-label="lab tabs"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Item One" value="1" />
              <Tab label="Item Two" value="2" />
            </TabList>
            <TabPanel value="1" tabIndex={1}>
              <Table tableau={sampleMin.history[0][0]} basicSol={sampleMin.history[0][1]} keepMounted></Table>
            </TabPanel>
            <TabPanel value="2" tabIndex={2}>
              <Table tableau={sampleMin.history[1][0]} basicSol={sampleMin.history[1][1]}  keepMounted></Table>
            </TabPanel>
          </TabContext>
        
      </Box>
    </Stack>
  );
}
