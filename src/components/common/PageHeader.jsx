import { Stack, Typography } from "@mui/material";

export default function PageHeader({ title, children }) {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
        >
            <Typography variant="h5" fontWeight={400}>
                {title}
            </Typography>
            <Stack direction="row" spacing={3} alignItems="center">
                {children}
            </Stack>
        </Stack>
    );
}