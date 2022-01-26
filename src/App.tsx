import React, { Component } from "react";
import { Box, ThemeProvider } from "@mui/system";
import { createTheme } from "@mui/material/styles";
import {
  Button,
  FormHelperText,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import axios from "axios";
import "./App.css";

type MyState = {
  dbResponse: any[];
  dbCanBeReset: boolean;
  columns: GridColumns;
  indicatorIds: any[];
  selectedIndicatorIds: string[];
};

const theme = createTheme({
  spacing: 45,
  palette: {
    background: {
      paper: "rgb(0, 77, 64)",
    },
    text: {
      primary: "#fff",
      secondary: "#777",
    },
    action: {
      active: "#004D40",
    },
  },
});

class App extends Component<{}, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      dbResponse: [],
      dbCanBeReset: true,
      columns: [],
      indicatorIds: [],
      selectedIndicatorIds: [],
    };
    this.getConnection = this.getConnection.bind(this);
    this.updateIndicatorIds = this.updateIndicatorIds.bind(this);
    this.handlePost = this.handlePost.bind(this);
  }
  public getConnection(event: any) {
    event.preventDefault();
    axios.get("http://localhost:3000/").then((res) => {
      this.setState({
        dbResponse: res.data,
      });
    });
  }

  public updateIndicatorIds(event: any) {
    let selection: string = event.target.value;
    let selectedIds: string[] = Object.assign(
      [],
      this.state.selectedIndicatorIds
    );
    if (selectedIds.includes(selection)) {
      selectedIds = selectedIds.filter((id: string) => id !== selection);
    } else {
      selectedIds.push(selection);
    }
    this.setState({
      selectedIndicatorIds: selectedIds,
    });
  }

  public handlePost(event: any) {
    event.preventDefault();
    let form: any = {};
    const yearMin = event.target[0].value;
    const yearMax = event.target[1].value;
    const indicatorIds = event.target[2].value;
    if (yearMin !== undefined) {
      form["yearMin"] = yearMin;
    }
    if (yearMax !== undefined) {
      form["yearMax"] = yearMax;
    }
    if (indicatorIds !== undefined && indicatorIds.length > 0) {
      form["indicatorIds"] = indicatorIds;
    }

    axios
      .post(`http://localhost:3000/sql/getAnnualData`, form)
      .then((res: any) => {
        console.log("res: ", res.data[0]);
        this.setState({
          dbResponse: res.data,
          columns: this.setColumns(Object.keys(res.data[0])),
        });
      });
  }

  public setColumns: (keys: string[]) => GridColumns = (keys: string[]) => {
    let columns: GridColumns = [];
    for (const key of keys) {
      columns.push({ field: key, headerName: key.toUpperCase(), width: 200 });
    }
    return columns;
  };

  public clearOrResetDB = () => {
    let url: string = `http://localhost:3000/sql/${
      this.state.dbCanBeReset ? "clearDB" : "setupDB"
    }`;
    axios.get(url).then((res) => {
      this.setState({ dbCanBeReset: !this.state.dbCanBeReset, dbResponse:[] });
      console.log("res: ", res);
    });
  };

  componentDidMount = () => {
    axios.get("http://localhost:3000/sql/getIndicatorData").then((res) => {
      this.setState({
        dbCanBeReset: res.data.length > 0,
        indicatorIds: res.data,
      });
    });
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Box className="container">
          <Box
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
              borderRadius: 2,
              p: 2,
              minWidth: 300,
            }}
          >
            <Box
              sx={{ color: "text.primary", fontSize: 34, fontWeight: "medium" }}
            >
              You may Search the data, clear the database, or [re]generate it.
            </Box>
            <Button
              variant="contained"
              style={{ color: "#0004D40", backgroundColor: "#004D40" }}
              type="submit"
              name="btn_login"
              className="col s12 btn btn-large waves-effect teal darken-4"
              onClick={this.clearOrResetDB}
            >
              {this.state.dbCanBeReset ? "Clear Database" : "Set Up Database"}
            </Button>
            <Box sx={{ color: "text.secondary" }}>
              Please enter Search Criteria:
            </Box>
            <Box
              sx={{
                color: "success.dark",
                fontWeight: "bold",
                mx: 0.5,
                fontSize: 14,
              }}
            >
              <form
                aria-describedby="my-helper-text"
                onSubmit={this.handlePost}
              >
                <div className="row">
                  <TextField
                    id="yearMin"
                    label="Year Minimum"
                    variant="filled"
                    className="validate"
                  />
                  &nbsp;
                  <TextField
                    id="yearMax"
                    label="Year Maximum"
                    variant="filled"
                    className="validate"
                  />
                </div>
                <div className="row">
                  <Select
                    sx={{
                      minWidth: 200,
                      opacity: 1,
                    }}
                    labelId="selectIndicatorIdsLabel"
                    label="Select Indicator Ids"
                    id="selectIndicatorIds"
                    value={this.state.selectedIndicatorIds}
                    onChange={this.updateIndicatorIds}
                  >
                    <MenuItem value="">Select One or More</MenuItem>
                    {this.state.indicatorIds.map(
                      ({ id, name, code }, index) => (
                        <MenuItem value={id} key={index}>
                          {code}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </div>
                &nbsp;
                <Button
                  variant="contained"
                  style={{ color: "#0004D40", backgroundColor: "#004D40" }}
                  type="submit"
                  name="btn_login"
                  className="col s12 btn btn-large waves-effect teal darken-4"
                >
                  Submit
                </Button>
              </form>
              <FormHelperText id="my-helper-text">
                Please enter search criteria and click submit when done.
              </FormHelperText>
              <div style={{ display: "flex", height: 400, width: "100%" }}>
                <div style={{ flexGrow: 1 }}>
                  <DataGrid
                    rows={this.state.dbResponse}
                    columns={this.state.columns}
                    pageSize={100}
                    rowsPerPageOptions={[100]}
                    checkboxSelection
                  />
                </div>
              </div>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
