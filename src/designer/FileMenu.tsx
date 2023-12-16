import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {MetaModel} from "../pflow";
import {Publish, Save, SaveAs, DataObject, Image} from "@mui/icons-material";


type CollectionProps = {
    metaModel: MetaModel;
}
export default function FileMenu(props: CollectionProps) {
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
                id="file-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{color: "#000000"}}
                onClick={handleClick}
            >
                file
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
                <MenuItem onClick={handleClose}><Publish/>&nbsp;Import</MenuItem>
                <MenuItem onClick={handleClose}><Save/>&nbsp;Save</MenuItem>
                <MenuItem onClick={handleClose}><SaveAs/>&nbsp;Save As</MenuItem>
                <MenuItem onClick={handleClose}><DataObject/>&nbsp;Export JSON</MenuItem>
                <MenuItem onClick={handleClose}><Image/>&nbsp;Export PNG</MenuItem>
            </Menu>
        </div>
    );
}
