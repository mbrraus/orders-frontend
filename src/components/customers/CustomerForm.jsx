import { useState } from "react";
import { TextField, Button, Box, Alert, Dialog, DialogTitle } from "@mui/material";

export default function CustomerForm({ open, initialData = {}, onSubmit, onClose }) {
    const [fullName, setFullName] = useState(initialData.fullName || "");
    const [email, setEmail] = useState(initialData.email || "");
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault(); // prevents browser refresh

        try {
            await onSubmit({ fullName, email });
        } catch (err) {
            console.error(err);
            setError("Failed to save customer.");
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Create Customer</DialogTitle>
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
                }} >
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    size="small"
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    margin="dense"
                    required
                ></TextField>
                <TextField
                    size="small"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                ></TextField>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        mt: 2,
                    }}>
                    <Button type="submit" variant="contained" fullWidth >
                        Save
                    </Button>
                    <Button onClick={onClose} fullWidth >
                        Close
                    </Button>
                </Box>

            </Box>
        </Dialog>

    );
}