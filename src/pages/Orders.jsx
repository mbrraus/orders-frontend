import {
    Box, Button, Skeleton, Alert
} from "@mui/material";
import orderService from "@/services/orderService";
import useFetch from "@/hooks/useFetch";
import OrderList from "@/components/orders/OrderList";
import PageHeader from "@/components/common/PageHeader";
import { useState } from "react";
import OrderItemsDialog from "@/components/orders/OrderItemsDialog";

function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getItemCount(items) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
}
export default function Orders() {

    const { data: orders, loading, error, refetch } = useFetch(orderService.getAllOrders);
    const [openItems, setOpenItems] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);


    // async function loadOrders() {
    //     try {
    //         const data = await orderService.getAllOrders();
    //         setOrders(data);
    //         setError(false);
    //     } catch (e) {
    //         setError("Failed to load orders", e);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // placeholder
    if (loading) {
        return (
            <Box p={3}>
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="rectangular" height={400} sx={{ mt: 2 }} />
            </Box>
        );
    }
    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "customerId", headerName: "Customer ID", flex: 1 },
        { field: "totalAmount", headerName: "Total Amount", flex: 1 },
        {
            field: "items", headerName: "# Items", renderCell: (params) => {
                const count = getItemCount(params.value);
                return (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <span>{count}</span>
                        <Button sx={{
                            color: "#1967b5ff",
                            textTransform: "none",
                            ml: "auto",
                            mr: 2
                        }}
                            onClick={() => {
                                setSelectedItems(params.row.items);
                                setOpenItems(true);
                            }}
                        >See items</Button>
                    </Box>
                );
            }, flex: 1
        },
        { field: "orderStatus", headerName: "Status", flex: 1 },
        { field: "createdAt", headerName: "Create Date", flex: 1, valueGetter: (value) => formatDate(value) },
    ];

    const filtered = orders.map(o => ({ ...o, id: o.id }));

    return (
        <Box p={3}>
            <PageHeader title="Orders" />
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
                <OrderList rows={filtered} columns={columns} />

            )}

            <OrderItemsDialog
                open={openItems}
                items={selectedItems}
                onClose={() => setOpenItems(false)}
            />
        </Box>
    );

}