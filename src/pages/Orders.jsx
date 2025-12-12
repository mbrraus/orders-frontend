import {
    Box, Button, Skeleton, Alert
} from "@mui/material";
import orderService from "@/services/orderService";
import useFetch from "@/hooks/useFetch";
import OrderList from "@/components/orders/OrderList";
import PageHeader from "@/components/common/PageHeader";

function formatDate(dateString) {
    if(!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
        year: "numeric",
        month:"2-digit",
        day: "2-digit",
        hour:"2-digit",
        minute:"2-digit"
    });
}
export default function Orders() {

    const { data: orders, loading, error, refetch } = useFetch(orderService.getAllOrders);

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
        { field: "totalAmount", headerName: "Total Amount", flex: 1 },
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
                <OrderList rows={filtered} columns={columns}/>
            )}
        </Box>
    );

}