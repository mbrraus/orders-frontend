import { useState } from "react";
import { TextField, Button, Box, Alert } from "@mui/material";

export default function CustomerForm({initialData = {}, onSubmit, onCancel}) {
    const [fullName, setFullName] = useState(initialData.fullName || "");
    const [email, setEmail] = useState(initialData.email || "");
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault(); // prevents browser refresh
        
        try {
            await onSubmit({fullName, email});
        } catch(err) {
            console.error(err);
            setError("Failed to save customer.");
        }
    }

    return (
        <Box display = "flex" flexDirection="column" component="form" onSubmit={handleSubmit} sx={{mt:1}} >
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
                size="small"
                label="Full Name"
                value = {fullName}
                onChange ={(e)=>setFullName(e.target.value)}
                margin="dense"
                required
            ></TextField>
            <TextField
                size="small"
                label = "Email"
                type="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                margin="dense"
                required
            ></TextField>

            <Button type ="submit" variant="contained" fullWidth sx={{mt:2}}>
                Save
            </Button>

            {onCancel && (
                <Button onClick = {onCancel} fullWidth sx ={{mt:1}}>
                    Cancel
                </Button>
            )}
        </Box>
    );
}