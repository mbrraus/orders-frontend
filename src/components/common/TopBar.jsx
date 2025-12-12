import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

function TopBar() {
    return (
        <AppBar position="static" sx={{boxShadow: "0 1px 3px rgba(0,0,0,0.12)"}} >
            <Toolbar>
                <h3 style = {{flexGrow:1}}>Order Service Portal</h3>
                <Button color = "inherit" component={Link} to="/">
                    Home
                </Button>

                <Button color = "inherit" component={Link} to="/customers">
                    Customers
                </Button>

                <Button color = "inherit" component={Link} to="/orders">
                    Orders
                </Button>
                
            </Toolbar>

        </AppBar>
    );
}

export default TopBar;