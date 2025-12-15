import { Button, Box, Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";

export default function OrderItemsDialog({open, items=[], onClose}) {

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Order items</DialogTitle>
            <DialogContent dividers>
                {items.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1
                        }}
                    >
                        <span>{item.productName}</span>
                        <span>
                            {item.quantity} x {item.unitPrice} ₺
                        </span>
                    </Box>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ textTransform: "none", color: "#1967b5ff" }}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}