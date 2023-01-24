import React, { useState, useEffect, useLayoutEffect } from "react";
// import axios from "axios";
import "./style.scss";

import { useModal } from "../../../ComponentReuseable/index";
// import DatasheetModal from "../../Rack/Component/DatasheetModal";
// import DatasheetModal from "../../Datasheet/DatasheetModal";

// import delete_file_icon from "../../../../svg/delete-file-icon.svg";
import { toast } from "react-toastify";
// import { getToken } from "../../../TokenParse/TokenParse";
import upladIcon from "../../../../svg/upload-icon.svg";
import exitButton from "../../../../svg/exit-button.svg";
import { ReturnHostBackend } from "../../../ComponentReuseable/BackendHost";
function AssetUploadFile(props) {
    // Destructure props
    let { height, width, onUpload, defaultFiles, triggerClear, isEdit, t } =
        props;

    const { isShowing: isShowingDataSheetPopup, toggle: toggleDataSheetPopup } =
        useModal();

    const [uploadedFiles, setUploadedFiles] = useState(
        defaultFiles == undefined || defaultFiles === "" ? [] : defaultFiles
    );

    const [selFile, setSelFile] = useState();

    useEffect(() => {
        // ////////console.log(defaultFiles);
        // isEdit &&
        setUploadedFiles(defaultFiles);
    }, [triggerClear]);

    function download(url, filename) {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
             
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            })
            .catch(console.error);
    }

    function downloadlokal(filedata , filename) {

       let file = filedata;
  
      let  fr = new FileReader();
        fr.readAsDataURL(file);

        var blob = new Blob([file],{type: file.type });
  
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // Functions
    const handleFileUpload = async (e) => {
        e.preventDefault();
        const { files } = e.target;
        const file = files[0];
        const file_name = files[0].name.replace(/\s/g, "");

        const checkExist = uploadedFiles.find((file) =>
            file.file_name.includes(file_name)
        );
        if (checkExist) {
            toast.error("This file already exist", {
                toastId: "AUF_error-file-exist",
            });
            return;
        }

        // Multiple Files
        setUploadedFiles((prev) => [
            ...prev,
            {
                file: file,
                file_name: file_name,
            },
        ]);
    };

    const handleDelete = async (delete_file) => {
        const removeSelFile = uploadedFiles.filter(
            (file) => file.file_name != delete_file
        );
        setUploadedFiles(removeSelFile);
    };

    useEffect(() => {
        console.log("uploadedFiles");
        console.log(uploadedFiles);
  
        onUpload(uploadedFiles);
    }, [uploadedFiles]);

    return (
        <div
            className='asset-upload-file'
            style={{
                height: height ? height : null,
                width: width ? width : null,
            }}>
            <input
                className='asset-upload-file-input-form'
                type='file'
                id='uploadedFile'
                name='uploadedFile'
                // accept='application/pdf'
                onChange={handleFileUpload}
            />

            <div className='asset-uploaded-files'>
                {uploadedFiles.map((uploadedFile, index) => {
                    return (
                        <div className='list-of-document' key={index}>
                            <div
                                onClick={() => {

                                    if (uploadedFile.file){
                                        downloadlokal(uploadedFile.file , uploadedFile.file_name.split(".")[0])
                                    }else {
                                        download(
                                            ReturnHostBackend(
                                                process.env
                                                    .REACT_APP_BACKEND_NODELINX
                                            ) +
                                                "/filerepository/CAD-IT/uploadFileFromAPI/" +
                                                uploadedFile.file_name.split(
                                                    "_"
                                                )[0] +
                                                "/" +
                                                uploadedFile.file_name,
                                            uploadedFile.file_name.split(".")[0]
                                        );
                                    }
                                 
                                }}
                                style={{cursor:"pointer"}}
                                className='label'>
                                {" "}
                                {uploadedFile.file_name}
                            </div>
                            <img
                                // className='reusable-button--exit'
                                className='imagedelete'
                                src={exitButton}
                                style={{ width: "10px" }}
                                alt='del'
                                onClick={() => {
                                    handleDelete(uploadedFile.file_name);
                                }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className='right-button-upload'>
                <div className='upload-button-document'>
                    <img
                        // className='reusable-button--exit'
                        src={upladIcon}
                        style={{ width: "20px" }}
                        alt='exit-button'
                        // onClick={() => {
                        //     hide();
                        // }}
                    />
                    <label htmlFor='uploadedFile' className='label'>
                        {t(
                            "content.shop_floor_overview.asset_list.content.Upload"
                        )}
                    </label>
                </div>
            </div>
        </div>
    );
}

export default AssetUploadFile;
