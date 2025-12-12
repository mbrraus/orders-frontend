import TopBar from "@/components/common/TopBar";
import { Box } from "@mui/material";

function MainLayout({ children }) {
    return (
        <Box>
            {/* Top Navigation */}
            <TopBar/>

            {/* Page Content */}
            <Box sx = {{padding:"20px"}}>
                {children}
            </Box>

        </Box>
    );
}

export default MainLayout;