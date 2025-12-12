import { useState } from "react";
import {
  Box, Button, Dialog, DialogTitle, DialogContent,
  Skeleton, TextField, Snackbar, Alert
} from "@mui/material";
import customerService from "@/services/customerService"
import CustomerForm from "@/components/customers/CustomerForm";
import CustomerList from "@/components/customers/CustomerList";
import PageHeader from "@/components/common/PageHeader";
import useFetch from "@/hooks/useFetch";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false); // this is for snackbar

  const { data: customers, loading, error, refetch } = useFetch(customerService.getAllCustomers);

  if (loading) {
    return (
      <Box p={3}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
      </Box>
    );
  }
  /* must match the property name in the row object */
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "fullName", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
  ];

  const filtered = customers.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase())
  )
    .map((c) => ({
      ...c,
      id: c.id
    }));

  {

  }
  return (
    <Box p={3}>

      <PageHeader title="Customers">
        <Button
          size="small"
          variant="contained"
          disabled={error !== null}
          disableElevation={false}
          sx={{ borderRadius: "5px", boxShadow: "0 1px 3px rgba(0,0,0,0.12)", textTransform: "none" }}
          color="primary"
          startIcon={<span style={{ fontSize: 20 }}>＋</span>}
          onClick={() => {
            if (!error) setOpenCreate(true)
          }}
        >Create Customer </Button>

        <TextField
          size="small"
          placeholder="Search customers..."
          sx={{ width: 500 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </PageHeader>

      {error ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              Retry
            </Button>
          }
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      ) : (
        <CustomerList rows={filtered} columns={columns} />
      )}


      {/* Creation Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="xs">
        <DialogTitle>Create Customer</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <CustomerForm
            onSubmit={async (data) => {
              await customerService.createCustomer(data);
              setOpenCreate(false);
              setSuccessOpen(true);
              refetch();
            }}
            onCancel={() => setOpenCreate(false)}
          ></CustomerForm>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ justifyContent: "center" }}>
          Customer created successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
}
