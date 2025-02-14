import React from "react";
import { Dialog } from "@mui/material";

const CustomDialog = ({
    maxWidth = "sm",
    fullWidth = true,
    open,
    ariaLabelledby = "alert-dialog-slide-description",
    children,
}) => {
    return (
        <Dialog
            maxWidth={maxWidth}
            keepMounted
            fullWidth={fullWidth}
            onClose={false}
            open={open}
            aria-labelledby={ariaLabelledby}
            sx={{ "& .MuiDialog-paper": { p: 0 }, transition: "transform 225ms" }}
        >
            {children}
        </Dialog>
    );
};

export default CustomDialog;
