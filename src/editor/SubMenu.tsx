import React, {useState} from "react";
import {IconButton, Tooltip} from "@mui/material";
import {MetaModel} from "../pflow";
import {Download, Image, Link, UploadFile} from "@mui/icons-material";
import {downloadPngFromCanvas} from "../pflow/snapshot";
import {FileUploader} from "react-drag-drop-files";
import {zip} from "../pflow/permalink";
import {downloadModelJson} from "../pflow/export";

interface SubMenuProps {
    metaModel: MetaModel;
}

export default function SubMenu(props: SubMenuProps) {
    const metaModel = props.metaModel;

    const handleFile = (file: File) => {
        metaModel.uploadFile(file).then(() => {
            metaModel.update();
        })
    };

    function createPngLink() {
        if (metaModel.mode !== "snapshot") {
            metaModel.menuAction("snapshot")
        }
        downloadPngFromCanvas()
    }

    const [state, setState] = useState({updating: false});

    async function updatePermalink() {
        if (state.updating) {
            return;
        }
        else {
            setState({updating: true});
            setTimeout(async () => {
                await updatePermalinkData();
                setState({updating: false});
            }, 500);
        }
    }
    async function updatePermalinkData() {
        const permalink = document.getElementById("permalink");
        if (permalink) {
            return zip(metaModel.toJson()).then((base64) => {
                const uri = "?z=" + base64
                permalink.setAttribute("href", uri);
            })
        }
        return Promise.resolve();
    }

    metaModel.onUpdate(updatePermalink)
    setTimeout(updatePermalink, 100)

    const color = "#3143a9";
    return <React.Fragment>
        <FileUploader sx={{color}} handleChange={handleFile} types={["JSON"]}>
            <Tooltip title="import json">
                <IconButton sx={{color}} aria-label="upload json">
                    <UploadFile/>
                </IconButton>
            </Tooltip>
        </FileUploader>
        <Tooltip title="export json">
            <IconButton sx={{color}} aria-label="download json" onClick={
                () => downloadModelJson(metaModel.toJson())
            }><Download/>
            </IconButton>
        </Tooltip>
        <Tooltip title="snapshot png">
            <IconButton sx={{color}} aria-label="snapshot" color="secondary" onClick={
                () => createPngLink()
            }><Image/>
            </IconButton>
        </Tooltip>
        <Tooltip title="permalink">
            <a id="permalink" href="?permalink">
                <IconButton sx={{color}} aria-label="permalink" color="secondary">
                    <Link/>
                </IconButton>
            </a>
        </Tooltip>
    </React.Fragment>;
}