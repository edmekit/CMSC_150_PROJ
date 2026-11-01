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
import { Simplex, buildPrimalProb } from "./TableauFunc.jsx"


const columns = [
  { field: "plantGroup", headerName: "Plant Group", width: 362},
  { field: "cost", headerName: "cgt (₱/MWh)", width: 362},
  { field: "cap", headerName: "Capg (MW)", width: 362},
  { field: "emission", headerName: "eg (t CO2/MWh)", width: 362},
];

const rows = [
  {
    id: 'coal',
    plantGroup: "Coal",
    cost: "3800 - 3990 (differs by block time)",
    cap: "7000",
    emission: "0.95",
  },
  {
    id: 'gas',
    plantGroup: "Natural Gas",
    cost: "6500 - 6825 (differs by block time)",
    cap: "3300",
    emission: "0.40",
  },
  {
    id: 'geo',
    plantGroup: "Geothermal",
    cost: "1500 - 1575 (differs by block time)",
    cap: "800",
    emission: "0.10",
  },
  {
    id: 'oil',
    plantGroup: "Oil-based",
    cost: "14000 - 14700 (differs by block time)",
    cap: "1500",
    emission: "0.75",
  },
  { id: 'hydro', plantGroup: "Hydro", cost: "300", cap: "2500", emission: "0" },
  { id: 'solar', plantGroup: "Solar", cost: "40", cap: "2500", emission: "0" },
  { id: 'wind', plantGroup: "Wind", cost: "60", cap: "400", emission: "0" },
];


// TEST TABLEAU
const tableau = [
    [1, 7, 1, 0, 0, 14],
    [2, 6, 0, 1, 0, 20],
    [-4, -20, 0, 0, 1, 0]
];


export default function App() {
  const [value, setValue] = useState(1);
  const sampleMin = Simplex(tableau);
  const [c02, setC02] = useState(false);
  const [c02cap, setC02cap] = useState(165000);
  

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
    buildPrimalProb([...selectedRows.ids], true, 16500)
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
              checked={c02}
              onChange={(e) => {
                setCo2(e.target.checked);
              }}
            />
            <TextField
              defaultValue={c02cap}
              label="Limit Daily C02"
              variant="standard"
              color="warning"
              focused
              disabled={!c02}
              onChange={(e) => {
                setC02cap(e.target.value);
              }}
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
