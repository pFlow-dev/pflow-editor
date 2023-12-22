import React from "react";
import {IconButton, Tooltip} from "@mui/material";
import {MetaModel} from "../pflow";
import {Download, Image, Link, UploadFile} from "@mui/icons-material";
import {downloadPngFromCanvas} from "../pflow/snapshot";
import {FileUploader} from "react-drag-drop-files";
import {downloadModelJson} from "../pflow/export";

interface SubMenuProps {
    metaModel: MetaModel;
}

export default function SubMenu(props: SubMenuProps) {
    const metaModel = props.metaModel;

    const handleFile = (file: File) => {
        metaModel.uploadFile(file).then(() => {
            metaModel.menuAction("select");
            metaModel.update();
        })
    };

    function createPngLink() {
        if (metaModel.mode !== "snapshot") {
            metaModel.menuAction("snapshot")
        }
        downloadPngFromCanvas()
    }

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
            <a id="permalink" href={"?z=" + metaModel.zippedJson}>
                <IconButton sx={{color}} aria-label="permalink" color="secondary">
                    <Link/>
                </IconButton>
            </a>
        </Tooltip>
        <Tooltip title="code sandbox">
            <a id="sandboxlink" href={"../sandbox/?z="+metaModel.zippedJson} target="_blank">
                <IconButton sx={{color}} aria-label="permalink" color="secondary">
                    <svg data-testid="ImageIcon" width="24px" height="24px" viewBox="0 0 24 24">
                        <path stroke={color} fill={color}
                            d="M9.942 21.837a201358.492 201358.492 0 0 0-5.775-3.738l-1.97-1.275v-1.991c0-1.576.01-1.987.049-1.968a9379.637 9379.637 0 0 0 8.59 4.368l.93.473.01 2.643c.006 1.454-.003 2.643-.02 2.643-.015 0-.832-.52-1.814-1.155m2.552-1.483.01-2.648.932-.473 7.55-3.838c.502-.256.952-.482 1-.503l.087-.039-.002 2.003-.001 2.003-4.726 3.042a713.717 713.717 0 0 1-4.793 3.071c-.063.028-.066-.119-.057-2.618m4.3-6.293c-1.322-.716-2.88-1.225-4.31-1.409-.986-.126-1.76-.127-2.814 0l-.194.022.272-.153c.571-.32 1.384-.564 2.13-.637l.304-.03.194-.59c.106-.324.181-.603.167-.62-.044-.049-1.29-.025-1.728.034-1.284.17-2.552.547-3.882 1.152-.468.212-1.736.917-2.19 1.217-.17.111-.328.203-.353.203-.054 0-1.382-.66-1.43-.71-.018-.019.008-.05.058-.067.05-.018.799-.347 1.663-.731 5.14-2.284 7.39-3.275 7.436-3.275.029 0 .293.105.588.234l.536.234.244-.21c.346-.3.679-.41 1.149-.38.195.014.427.055.517.092l.162.068.057-.185c.031-.102.26-.831.509-1.62.249-.79.445-1.458.436-1.484-.01-.027-.102-.083-.206-.124-.38-.152-.681-.65-.69-1.138-.003-.205.053-.429.325-1.3.182-.588.346-1.046.368-1.037.023.01.783.252 1.69.539a77.69 77.69 0 0 1 1.666.536c.03.03-.581 1.973-.672 2.137a1.51 1.51 0 0 1-.603.576c-.184.097-.271.113-.602.115l-.388.002-.417 1.328c-.23.73-.461 1.463-.514 1.626l-.097.297.144.046c.08.025.164.046.188.046.11 0 .604.33.728.487.29.365.437.9.373 1.351-.03.216-.15.631-.597 2.074l-.217.702.13.184c.173.244.335.61.266.601a5.457 5.457 0 0 1-.396-.203m1.156-9.659c.09-.103.338-.892.294-.939-.035-.038-1.61-.545-1.623-.522-.052.086-.257.854-.248.926.02.157.177.25.731.432.6.197.748.215.846.103m1.499 8.618a38.055 38.055 0 0 0-1.044-.62c-.342-.196-.625-.36-.63-.364-.014-.015.265-.844.297-.881.016-.02.757.278 1.647.662.889.384 1.603.711 1.587.728-.025.026-.786.42-1.275.662l-.16.078z"/>
                    </svg>
                </IconButton>
            </a>

        </Tooltip>
    </React.Fragment>;
}