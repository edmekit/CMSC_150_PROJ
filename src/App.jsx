import { DataGrid, GridCell } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useState } from "react";

const columns = [
  { field: "plantGroup", headerName: "Plant Group", width: 150 },
  { field: "cost", headerName: "cgt (₱/MWh)", width: 150 },
  { field: "cap", headerName: "Capg (MW)", width: 150 },
  { field: "emission", headerName: "eg (t CO2/MWh)", width: 150 },
];

const initialRows = [
  {
    id: 1,
    plantGroup: "Coal",
    cost: "3800 - 3990",
    cap: "7000",
    emission: "0.95",
  },
  {
    id: 2,
    plantGroup: "Natural Gas",
    cost: "6500 - 6825",
    cap: "3300",
    emission: "0.40",
  },
  {
    id: 3,
    plantGroup: "Geothermal",
    cost: "1500 - 1575",
    cap: "800",
    emission: "0.10",
  },
  { id: 4, plantGroup: "Hydro", cost: "300", cap: "2500", emission: "0" },
  {
    id: 5,
    plantGroup: "Oil-based",
    cost: "14000 - 14700",
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

export default function App() {
  const [co2, setCo2] = useState(false);
  const [rows, setRows] = useState(initialRows);

  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: "include",
    ids: new Set(),
  });

  function removeSelected() {
    setRowSelectionModel({
      type: "include",
      ids: new Set(),
    });
  }

  function solveSelected(){
    let total = 0
    rowSelectionModel.ids.forEach((id) => {

      total += matrixValues[id - 1].values[2]
    })

    console.log(total)
  }

  return (
    <Stack spacing={3} direction="row">
      <Paper sx={{ height: 450, width: 700 }}>
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
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={setRowSelectionModel}
        />
      </Paper>
      <Paper sx={{ height: 400, width: 300 }}></Paper>
    </Stack>
  );
}
