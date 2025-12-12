import { Box } from "@mui/material";
import { DataGrid} from "@mui/x-data-grid";

export default function CustomerList({
    rows,
    columns,
}) {
    return <Box sx={{ height:500, width: "100%"}}>
        <DataGrid
        rows={rows}
        columns={columns}
        localeText={{ noRowsLabel: "No customers found" }}
        initialState={{
         pagination: { paginationModel: { pageSize: 10} },
         }}
        pageSizeOptions={[5,10,20]}
        />
    </Box>
}