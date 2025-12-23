import { useState } from 'react';
import { Dialog, DialogTitle, Autocomplete, Box, TextField, Button, Alert } from '@mui/material';
import useFetch from "@/hooks/useFetch";
import customerService from "@/services/customerService";
import catalogService from "@/services/catalogService";


export default function PlaceOrder({ open, onSubmit, onClose }) {
    const { data: customers = [] } =
        useFetch(customerService.getAllCustomers);

    const activeCustomers = customers.filter(c => c.state == "ACTIVE");


    const sortedCustomers = [...activeCustomers].sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
    );

    const [customerId, setCustomerId] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [error, setError] = useState(null);

    const [sku, setSku] = useState("");
    const [quantity, setQuantity] = useState(1);


    function handleClose() {
        resetDraft();
        setOrderItems([]);
        setSelectedCustomer(null);
        setCustomerId(null);
        setError(null);
        onClose();
    }

    function removeItem(index) {
        setOrderItems(items =>
            items.filter((_, i) => i !== index));
    }
    function resetDraft() {
        setSku("");
        setQuantity(1);
    }
    function createItem() {
        if (!sku) { setError("Please fill all the fields."); return null; }
        return {
            productSku: sku,
            quantity
        };
    }
    async function addItemToList() {
        const item = createItem();
        if (!item) return;

        const product = await getProductInfo();
        if (!product) return;

        setOrderItems(items => [...items, {
            ...item,
            snapshotName: product.name,
            snapshotPrice: product.price
        }]);
        resetDraft();
    }
    async function getProductInfo() {
        if (!sku) return null;
        try {
            const product = await catalogService.getProductBySku(sku);
            if (product.status !== "ACTIVE") {
                setError("Product is not active");
                return null;
            }
            return product;

        } catch (err) {
            setError("Product not found");
            return null;
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();

        // TODO: snapshot price and name should not be sent normally
        const items =
            orderItems.length > 0
                ? orderItems :
                [createItem()];

        if (!items[0]) {
            setError("At least one item required.");
            return;
        }
        try {
            await onSubmit({ customerId, orderItems: items });
            resetDraft();
        } catch (err) {
            console.error(err);
            setError("Failed to place the order.");
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Place an Order</DialogTitle>
            <Box
                flexDirection="column"
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    px: 3,
                    pb: 2
                }}
            >
                {error && <Alert severity="error" sx={{ mb: 2 }} >{error}</Alert>}

                {/* Customer selection */}
                <Autocomplete
                    sx={{ width: 400 }}
                    options={sortedCustomers}
                    value={selectedCustomer}
                    onChange={(event, newValue) => {
                        setSelectedCustomer(newValue);
                        setCustomerId(newValue ? newValue.id : null);
                    }}
                    getOptionLabel={(option) =>
                        `${option.fullName} (${option.email})`
                    }
                    isOptionEqualToValue={(option, value) => //ensure correct selection and highlighting
                        option.id === value.id
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Customer"
                            slotProps={{ inputLabel: { sx: { fontSize: '0.85rem' } } }}
                            size="small"
                            required
                        />
                    )}
                />
                <TextField
                    label="Product SKU *"
                    slotProps={{ inputLabel: { sx: { fontSize: '0.85rem' } } }}
                    value={sku}
                    onChange={(e) => { setError(null); setSku(e.target.value); }}
                    size="small"
                    margin='dense'
                />

                <TextField
                    label="Quantity"
                    slotProps={{ htmlInput: { min: 1, step: 1 }, inputLabel: { sx: { fontSize: '0.85rem' } } }}
                    type='number'
                    value={quantity}
                    onChange={(e) => { setError(null); setQuantity(Number(e.target.value)); }}
                    size="small"
                    margin='dense'
                />

                <Button
                    type="button"
                    variant="outlined"
                    onClick={addItemToList}
                >
                    + Add item
                </Button>

                {/* Remove item from the list */}
                {orderItems.length
                    > 0 && (
                        <Box sx={{ mt: 2 }}>
                            {orderItems.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 1,
                                    }}
                                >
                                    <span>
                                        {item.snapshotName} · {item.quantity} × {item.snapshotPrice}
                                    </span>

                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => removeItem(index)}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    )}

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        mt: 2,
                    }}>
                    <Button type="submit" variant="contained" fullWidth >
                        Place Order
                    </Button>
                    <Button onClick={handleClose} fullWidth >
                        Close
                    </Button>
                </Box>

            </Box>
        </Dialog>
    );

}