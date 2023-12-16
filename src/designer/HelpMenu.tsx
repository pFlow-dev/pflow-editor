import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {MetaModel} from "../pflow";
import {PermMedia, Psychology} from "@mui/icons-material";


type CollectionProps = {
    metaModel: MetaModel;
}
export default function HelpMenu(props: CollectionProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="help-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{color: "#000000"}}
                onClick={handleClick}
            >
                help
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
                <MenuItem onClick={handleClose}><Psychology/>&nbsp;Tutorial</MenuItem>
                <MenuItem onClick={handleClose}><PermMedia/>&nbsp;Examples</MenuItem>
            </Menu>
        </div>
    );
}
