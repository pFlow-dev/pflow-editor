import React, {useState} from "react";
import {IconButton, Tooltip} from "@mui/material";
import {MetaModel} from "../pflow";
import {Download, Image, Link, Share, UploadFile} from "@mui/icons-material";
import {downloadPngFromCanvas} from "../pflow/snapshot";
import JSZip from "jszip";
import {FileUploader} from "react-drag-drop-files";

interface SubMenuProps {
    metaModel: MetaModel;
}

export default function SubMenu(props: SubMenuProps) {
    const metaModel = props.metaModel;

    const [, setFile] = useState(new File([], ""));
    const handleFile = (file: File) => {
        // read file content
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target) {
                const content = e.target.result
                if (content && metaModel.loadJson(content.toString())) {
                    metaModel.update()
                }
            }
        };
        reader.readAsText(file);
        setFile(file);
    };

    function createDownloadLink() {
        const element = document.createElement("a");
        const file = new Blob([metaModel.toJson()], {type: "text/plain"});
        element.href = URL.createObjectURL(file);
        element.download = "model.json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    function createPngLink() {
        if (metaModel.mode !== "snapshot") {
            metaModel.menuAction("snapshot")
        }
        downloadPngFromCanvas()
    }

    function newShareLink() {
        const zip = new JSZip();
        zip.file("model.json", metaModel.toJson());
        zip.generateAsync({type: "base64"}).then((base64) => {
            fetch("/share.json?z=" + base64).then((response) => {
                response.blob().then((blob) => {
                    blob.text().then((text) => {
                        if (text.startsWith("{")) {
                            // TODO: add a dialog to show the link
                            console.log(JSON.parse(text))
                        }
                    })
                });
            });
        });
    }

    function updatePermalink() {
        const permalink = document.getElementById("permalink");
        if (permalink) {
            const zip = new JSZip();
            zip.file("model.json", metaModel.toJson());
            zip.generateAsync({type: "base64"}).then((base64) => {
                const uri = "?z=" + base64
                permalink.setAttribute("href", uri);
            });
        }
    }

    metaModel.onUpdate(updatePermalink)
    setTimeout(updatePermalink, 100)

    const color = "#3143a9";
    return <React.Fragment>
        <FileUploader sx={{color}} handleChange={handleFile} name="model upload" types={["JSON"]}>
            <Tooltip title="upload.json">
                <IconButton sx={{color}} aria-label="upload json">
                    <UploadFile/>
                </IconButton>
            </Tooltip>
        </FileUploader>
        <Tooltip title="model.json">
            <IconButton sx={{color}} aria-label="download json" onClick={() => createDownloadLink()}>
                <Download/>
            </IconButton>
        </Tooltip>
        <Tooltip title="snapshot.png">
            <IconButton sx={{color}} aria-label="snapshot" color="secondary" onClick={() => createPngLink()}>
                <Image/>
            </IconButton>
        </Tooltip>
        <Tooltip title="permalink">
            <a id="permalink" href="?permalink">
                <IconButton sx={{color}} aria-label="permalink" color="secondary">
                    <Link/>
                </IconButton>
            </a>
        </Tooltip>
        <Tooltip title="share">
            <IconButton sx={{color}} aria-label="share" color="secondary" onClick={() => newShareLink()}>
                <Share/>
            </IconButton>
        </Tooltip>
    </React.Fragment>;
}