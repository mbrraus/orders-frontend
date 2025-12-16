import { useState } from 'react';
import { Dialog, DialogTitle, Autocomplete, Box, TextField, Button, Alert } from '@mui/material';
import useFetch from "@/hooks/useFetch";
import customerService from "@/services/customerService";


export default function PlaceOrder({ open, onSubmit, onClose }) {
    const { data: customers = [] } =
        useFetch(customerService.getAllCustomers); // we only need to get active customers!!!


    const sortedCustomers = [...customers].sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
    );

    const [customerId, setCustomerId] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [error, setError] = useState(null);

    const [sku, setSku] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
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
        setUnitPrice("");
        setQuantity(1);
    }
    function createItem() {
        if (!sku || !unitPrice) { setError("Please fill all the fields."); return null; }
        return {
            productSku: sku,
            unitPrice: Number(unitPrice),
            quantity
        };
    }
    function addItemToList() {
        const item = createItem();
        if (!item) return;
        setOrderItems(items => [...items, item]);
        resetDraft();
    }
    async function handleSubmit(e) {
        e.preventDefault();
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
                    label="Product Name"
                    slotProps={{ readOnly: true, inputLabel: { sx: { fontSize: '0.85rem' } } }}
                    value="todo"
                    size="small"
                    margin='dense'

                />
                <TextField
                    label="Product SKU *"
                    slotProps={{ inputLabel: { sx: { fontSize: '0.85rem' } } }}
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    size="small"
                    margin='dense'
                />
                <TextField
                    label="Price *"
                    type='number'
                    slotProps={{ htmlInput: {step: "0.01", min: 0}, inputLabel: { sx: { fontSize: '0.85rem' } } }}
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    size="small"
                    margin='dense'
                />

                <TextField
                    label="Quantity"
                    slotProps={{ htmlInput: { min: 1, step: 1 }, inputLabel: { sx: { fontSize: '0.85rem' } } }}
                    type='number'
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
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
                {orderItems.length > 0 && (
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
                                    {item.productSku} · {item.quantity} × {item.unitPrice}
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