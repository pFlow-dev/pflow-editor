import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {MetaModel} from "../pflow";
import {Image, Download, UploadFile} from "@mui/icons-material";
import {FileUploader} from "react-drag-drop-files";
import {downloadModelJson} from "../pflow/export";
import {downloadPngFromCanvas} from "../pflow/snapshot";

type CollectionProps = {
    metaModel: MetaModel;
}

export default function FileMenu(props: CollectionProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const {metaModel} = props;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleFile = (file: File) => {
        metaModel.uploadFile(file).then(() => {
            metaModel.update();
        })
        handleClose();
    };

    const handleExport = () => {
        downloadModelJson(metaModel.toJson());
        handleClose();
    }

    const handleSnapshot = () => {
        if (metaModel.mode !== "snapshot") {
            metaModel.menuAction("snapshot")
        }
        downloadPngFromCanvas()
        metaModel.update();
        handleClose();
    }

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
                <MenuItem>
                    <FileUploader handleChange={handleFile} name="model upload" types={["JSON"]}>
                    <UploadFile/>&nbsp;Import
                </FileUploader>
                </MenuItem>
                <MenuItem onClick={handleExport}><Download/>&nbsp;Export</MenuItem>
                <MenuItem onClick={handleSnapshot}><Image/>&nbsp;Snapshot</MenuItem>
            </Menu>
        </div>
    );
}
