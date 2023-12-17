import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {MetaModel} from "../pflow";
import {ClearAll} from "@mui/icons-material";

// TODO: support history, undo, redo, force layout

type CollectionProps = {
    metaModel: MetaModel;
}
export default function EditMenu(props: CollectionProps) {
    const { metaModel } = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClear = () => {
        metaModel.menuAction("select");
        metaModel.clearAll();
        handleClose();
    };

    return (
        <div>
            <Button
                id="edit-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{color: "#000000"}}
                onClick={handleClick}
            >
                edit
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClear}><ClearAll/>&nbsp;Clear All</MenuItem>
            </Menu>
        </div>
    );
}
