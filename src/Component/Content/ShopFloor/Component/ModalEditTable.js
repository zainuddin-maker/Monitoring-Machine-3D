import {
    ModalContainer,
    InputTextVertical,
    InputPasswordVertical,
    UploadImage,
} from "../../../ComponentReuseable";
import "./style.scss";
import { ReactComponent as EditIcon } from "../../../../svg/edit-profile-icon.svg";
import { InputTextHorizontal } from "../../../ComponentReuseable";
import { InputDropdownHorizontal } from "../../../ComponentReuseable";
import { PaginationStyle2 } from "../../../ComponentReuseable";
import { InputTextAreaHorizantal } from "../../../ComponentReuseable";
import { Table } from "../../../ComponentReuseable";

import exitButton from "../../../../svg/exit-button.svg";
import upladIcon from "../../../../svg/upload-icon.svg";
import UploadPhoto from "./UploadPhoto";
import { useState, useEffect } from "react";
import { getToken } from "../../../ComponentReuseable/TokenParse";
import { toast } from "react-toastify";
import axios from "axios";
import { ReturnHostBackend } from "../../../ComponentReuseable/BackendHost";
import AssetUploadFile from "./AssetUploadFile";
import { getUserDetails } from "../../../ComponentReuseable/TokenParse";
import { indexOf } from "@amcharts/amcharts5/.internal/core/util/Array";

import { InputDropdownCreatableVertical } from "../../../ComponentReuseable";
const ModalEditTable = (props) => {
    // [
    //     { no: 1, brand: "0", model: "0", machine_no: "0", type: "0" },
    //     { no: "1", brand: "0", model: "0", machine_no: "0", type: "0" },
    //     { no: "1", brand: "0", model: "0", machine_no: "0", type: "0" }
    // ]

    const { isShowing, hide, t, onSubmit, selectedAsset } = props;

    const header = {
        timestamp: {
            width: "110px",
            name: t("content.shop_floor_overview.asset_list.content.Timestamp"),
        },
        modifiedby: {
            width: "110px",
            name: t(
                "content.shop_floor_overview.asset_list.content.Modifiedby"
            ),
        },
        modificationtype: {
            width: "150px",
            name: t(
                "content.shop_floor_overview.asset_list.content.ModificationType"
            ),
        },
        asset_id: {
            width: "90px",
            name: t("content.shop_floor_overview.asset_list.content.AssetID"),
        },
        type: {
            width: "80px",
            name: t("content.shop_floor_overview.asset_list.content.type"),
        },
        brand: {
            width: "80px",
            name: t("content.shop_floor_overview.asset_list.content.brand"),
        },
        image: {
            width: "80px",
            name: t("content.shop_floor_overview.asset_list.content.Image"),
        },

        model: {
            width: "80px",
            name: t("content.shop_floor_overview.asset_list.content.model"),
        },
        machine_number: {
            width: "130px",
            name: t(
                "content.shop_floor_overview.asset_list.content.machine_no"
            ),
        },
        factory: {
            width: "80px",
            name: t("content.shop_floor_overview.asset_list.content.factory"),
        },
        shopfloor: {
            width: "80px",
            name: t("content.shop_floor_overview.asset_list.content.shopfloor"),
        },
        file: {
            width: "80px",
            name: t("content.shop_floor_overview.asset_list.content.Files"),
        },
        remark: {
            width: "110px",
            name: t("content.shop_floor_overview.asset_list.content.remark"),
        },
        changes: {
            width: "110px",
            name: "Changes",
        },
    };

    const [body, setBodytable] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    const [noupdatedatasheet, SetNoUpdateDataSheet] = useState([]);

    const [isIsformation, setIsInformation] = useState(true);

    const [inputOptions, setInputOptions] = useState({
        floors: [],
        rooms: [],
        functions: [],
        brands: [],
        model_numbers: [],
        functionsnew: [],
        brandsnew: [],
        model_numbersnew: [],
    });

    const [inputData, setInputData] = useState({
        asset_id: "",
        asset_image: "",
        asset_image_file: null,
        asset_image_file_name: "",
        asset_number: "",
        asset_name: "",
        data_sheet: [],
        asset_short_name: "",
        function_id: "",
        function_idnew: "",
        floor_id: "",
        room_id: "",
        area: [""],
        commissioned_date: "",
        // formatDate(new Date()),
        brand: "",
        brandnew: "",
        model_number: "",
        model_numbernew: "",
        description: "",
        data_sheet_file: null,
        data_sheet_file_path: "",
    });
    const [isLoadingFloor, setIsLoadingFloor] = useState(false);
    const [isLoadingFunction, setIsLoadingFunction] = useState(false);
    const [isLoadingBrand, setIsLoadingBrand] = useState(false);
    const [isLoadingModel, setIsLoadingModel] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRoom, setIsLoadingRoom] = useState(false);
    const [progressBarUpload, setProgressBarUpload] = useState();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(10);
    const [changeTable, setarraychangeTable] = useState([]);
    const [limit, setLimit] = useState(5);
    const firstPage = () => {
        setCurrentPage(1);
    };
    const lastPage = () => {
        setCurrentPage(totalPage);
    };
    const nextPage = () => {
        if (currentPage < totalPage) {
            setCurrentPage((prev) => prev + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleInputChange = (e) => {
        let { name, value } = e.target;

        if (name == "asset_number") {
            setInputData((prev) => {
                return {
                    ...prev,
                    asset_number: value.replace(/[#|/|?|%]/gi, ""),
                };
            });
        } else {
            // //////////////console.log(name, "  :", value);
            // //////////////console.log("");
            setInputData((prev) => {
                prev[name] = value;
                return { ...prev };
            });
        }
    };
    const getFunctions = async () => {
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_ASSET_GET_FUNCTIONS_DROPDOWN,
            headers: {
                authorization: getToken(),
            },
            data: {},
        };

        try {
            const result = await axios(config);
            // //////////////console.log("result type")
            // //////////////console.log(result)
            if (result.status === 200) {
                let { data } = result;

                if (data.count > 0) {
                    let { data: queryData } = data;

                    // queryData = queryData.map((row) => {
                    //     return {
                    //         id: row.id,
                    //         name: row.machine_type,
                    //     };
                    // });

                    setInputOptions((prevState) => {
                        return {
                            ...prevState,
                            functions: queryData.map((row) => {
                                return {
                                    id: row.id,
                                    name: row.machine_type,
                                };
                            }),
                            functionsnew: queryData.map((row) => {
                                return {
                                    id: row.id,
                                    value: row.machine_type,
                                    label: row.machine_type,
                                };
                            }),
                        };
                    });
                } else {
                    setInputOptions((prevState) => {
                        return {
                            ...prevState,
                            functions: [],
                            functionsnew: [],
                        };
                    });
                }
            } else {
                toast.error(
                    t(
                        "content.shop_floor_overview.error.Errorgettingfunctionsdata"
                    ),
                    {
                        toastId: "AA_error-get-function_S_400",
                    }
                );
            }
        } catch (e) {
            toast.error(
                t(
                    "content.shop_floor_overview.error.Errorgettingfunctionsdata"
                ),
                {
                    toastId: "AA_error-get-function_API",
                }
            );
        }
    };
    useEffect(() => {
        if (isShowing) {
            getFunctions();
            (async () => {
                setIsLoadingFunction(true);
                await getFunctions();
                setIsLoadingFunction(false);
            })();
        }
    }, [isShowing]);

    const getBrands = async () => {
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_ASSET_GET_BRANDS,
            headers: {
                authorization: getToken(),
            },
        };

        try {
            const result = await axios(config);

            // //////////////console.log("getBrands");
            // //////////////console.log(result);
            if (result.status === 200) {
                let { data } = result;

                if (data.count > 0) {
                    let { data: queryData } = data;

                    queryData = queryData.filter((data) => {
                        return data.machine_brand.length != 0;
                    });

                    setInputOptions((prev) => {
                        return {
                            ...prev,
                            brands: queryData.map((row) => {
                                return {
                                    id: row.id,
                                    name: row.machine_brand,
                                };
                            }),
                            brandsnew: queryData.map((row) => {
                                return {
                                    id: row.id,
                                    value: row.machine_brand,
                                    label: row.machine_brand,
                                };
                            }),
                        };
                    });
                } else {
                    setInputOptions((prev) => {
                        return {
                            ...prev,
                            brands: [],
                            brandsnew: [],
                        };
                    });
                }
            } else {
                toast.error(
                    t(
                        "content.shop_floor_overview.error.Errorgettingbrandsdata"
                    ),
                    {
                        toastId: "AA_error-get-brand_S_400",
                    }
                );
            }
        } catch (e) {
            // //////////////console.log(e.message);
            toast.error(
                t("content.shop_floor_overview.error.Errorgettingbrandsdata"),
                {
                    toastId: "AA_error-get-brand_API",
                }
            );
        }
    };
    useEffect(() => {
        if (isShowing) {
            setIsInformation(true);
            getBrands();
            (async () => {
                setIsLoadingBrand(true);
                await getBrands();
                setIsLoadingBrand(false);
            })();
        }
    }, [isShowing]);

    // Get Models
    const getModels = (function_id, brand_id) => {
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_ASSET_GET_MODELS,
            headers: {
                authorization: getToken(),
            },
            data: {
                function_id:
                    function_id === null || function_id === undefined
                        ? ""
                        : function_id,
                brand_id:
                    brand_id === null || brand_id === undefined ? "" : brand_id,
            },
        };

        try {
            axios(config)
                .then((result) => {
                    //////////////console.log("getModels");
                    //////////////console.log(result);
                    //////////////console.log(function_id, brand_id);
                    if (result.data) {
                        let { data } = result;
                        if (data.count > 0) {
                            let { data: queryData } = data;

                            queryData = queryData.filter((data) => {
                                return data.machine_model.length != 0;
                            });

                            setInputOptions((prev) => {
                                return {
                                    ...prev,
                                    model_numbers: queryData.map((row) => {
                                        return {
                                            id: row.id,
                                            // value: row.machine_model,
                                            name: row.machine_model,
                                        };
                                    }),
                                    model_numbersnew: queryData.map((row) => {
                                        return {
                                            id: row.id,
                                            // value: row.machine_model,
                                            label: row.machine_model,
                                        };
                                    }),
                                };
                            });
                        } else {
                            setInputOptions((prev) => {
                                return {
                                    ...prev,
                                    model_numbers: [],
                                    model_numbersnew: [],
                                };
                            });
                        }
                    } else {
                        toast.error(
                            t(
                                "content.shop_floor_overview.error.Errorgettingmodelnumbersdata"
                            ),
                            {
                                toastId: "AA_error-get-model_S_400",
                            }
                        );
                    }
                })
                .catch(() => {});
        } catch (e) {
            // //////////////console.log(e.message);
            toast.error(
                t(
                    "content.shop_floor_overview.error.Errorgettingmodelnumbersdata"
                ),
                {
                    toastId: "AA_error-get-model_API",
                }
            );
        }
    };
    useEffect(() => {
        if (isShowing) {
            getModels( inputData.function_idnew.id, inputData.brandnew.id);
            // (async () => {
            //     setIsLoadingModel(true);
            //     await getModels(inputData.function_id, inputData.brand);
            //     setIsLoadingModel(false);
            // })();
        }
    }, [inputData.function_id, inputData.brand, isShowing , inputData.function_idnew ,inputData.brandnew]);

    const handleInputUpdate = async (e) => {
        e.preventDefault();

        var formData_Q2 = new FormData();

        // var listquery = {};

        // listquery.asset_image_file = inputData.asset_image_file;
        // listquery.asset_image_file_name =
        //     inputData.asset_image_file_name.replace(/\s/g, "");
        // listquery.asset_number = inputData.asset_number;
        // listquery.asset_name = inputData.asset_name;
        // listquery.model_number = inputData.model_number;
        // listquery.description = inputData.description;
        // listquery.room_id = 9;

        formData_Q2.append(
            "asset_image_file",
            inputData.asset_image_file == null ? "" : inputData.asset_image_file
        );
        formData_Q2.append(
            "asset_image_file_name",
            inputData.asset_image_file_name == ""
                ? ""
                : inputData.asset_image_file_name.replace(/\s/g, "")
        );
        formData_Q2.append("asset_number", inputData.asset_number);
        formData_Q2.append("asset_name", inputData.asset_name);
        formData_Q2.append("room_id", inputData.room_id);

        formData_Q2.append("model_number", inputData.model_numbernew.id);

        formData_Q2.append("description", inputData.description);
        formData_Q2.append("asset_id", inputData.asset_id);
        formData_Q2.append("asset_image", inputData.asset_image);

        let delete_datasheet = [];

        noupdatedatasheet.forEach((element1) => {
            let found = false;
            inputData.data_sheet_file.forEach((element2) => {
                if (element1 === element2) {
                    found = true;
                }
            });

            if (!found) {
                delete_datasheet.push(element1);
            }
        });

        const new_data_sheets = inputData.data_sheet_file.filter(
            (data) => !data.file_name.includes(inputData.asset_id)
        );
        console.log("inputData.data_sheet_file")
        console.log(inputData.data_sheet_file)

        let data_sheet_name = "";

        inputData.data_sheet_file.forEach((data, index) => {
            //////////////console.log("data sheet");

            if (index === inputData.data_sheet_file.length - 1) {
                if (!data.file_name.includes(inputData.asset_id)) {
                    data_sheet_name =
                        data_sheet_name +
                        inputData.asset_id +
                        "_" +
                        data.file_name;
                } else {
                    data_sheet_name = data_sheet_name + data.file_name;
                }
            } else {
                if (!data.file_name.includes(inputData.asset_id)) {
                    data_sheet_name =
                        data_sheet_name +
                        inputData.asset_id +
                        "_" +
                        data.file_name +
                        ", ";
                } else {
                    data_sheet_name = data_sheet_name + data.file_name + ", ";
                }
            }
        });

        let data_changes = "";

        if (inputData.description !== selectedAsset.description) {
            data_changes = data_changes + "remark,";
        }

        if (
            inputData.function_idnew.id.toString() !==
            selectedAsset.function_id.toString()
        ) {
            data_changes = data_changes + "type,";
        }

        if (inputData.brandnew.id.toString() !== selectedAsset.brand_id.toString()) {
            data_changes = data_changes + "brand,";
        }

        if (
            inputData.model_numbernew.id.toString() !==
            selectedAsset.model_number_id.toString()
        ) {
            data_changes = data_changes + "model,";
        }

        if (
            inputData.asset_image_file_name !== "" &&
            selectedAsset.asset_image.split("_")[2] !==
                inputData.asset_image_file_name.replace(/\s/g, "")
        ) {
            data_changes = data_changes + "image,";
        }

        if (inputData.asset_name !== selectedAsset.asset_name) {
            data_changes = data_changes + "machine_number,";
        }

        if (new_data_sheets.length > 0 || delete_datasheet.length > 0) {
            data_changes = data_changes + "file,";
        }

        if (
            inputData.floor_id.toString() !== selectedAsset.floor_id.toString()
        ) {
            data_changes = data_changes + "factory,";
        }

        if (inputData.room_id.toString() !== selectedAsset.room_id.toString()) {
            data_changes = data_changes + "shopfloor,";
        }

        if (inputData.asset_number !== selectedAsset.asset_number) {
            data_changes = data_changes + "asset_id,";
        }

        if (data_changes !== "") {
            const config_Q2 = {
                method: "post",
                url:
                    ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                    process.env.REACT_APP_ASSET_UPDATE_ASSET,
                headers: {
                    authorization: getToken(),
                },
                data: formData_Q2,
                onUploadProgress: (data) => {
                    setProgressBarUpload(
                        Math.round((data.loaded / data.total) * 100)
                    );
                },
            };

            setIsLoading(true);
            try {
                const result = await axios(config_Q2);
                setProgressBarUpload(0);

                if (result.status !== 200) {
                    toast.error(
                        t(
                            "content.shop_floor_overview.error.ErrorcallingAPItoupdateasset"
                        ),
                        {
                            toastId: "AU_error-update-asset_S_400",
                        }
                    );
                    setIsLoading(false);
                    return;
                }
            } catch (e) {
                setProgressBarUpload(0);
                // //////////////console.log(e.message);
                toast.error(
                    t(
                        "content.shop_floor_overview.error.ErrorcallingAPItoupdateasset"
                    ),
                    {
                        toastId: "AU_error-update-asset_API",
                    }
                );
                setIsLoading(false);
                return;
            }

            setIsLoading(false);

            if (delete_datasheet.length > 0) {
                delete_datasheet.forEach((data) => {
                    const config_Q3 = {
                        method: "delete",
                        url:
                            ReturnHostBackend(
                                process.env.REACT_APP_BACKEND_NODELINX
                            ) + process.env.REACT_APP_IMAGE_UPLOAD,
                        headers: {
                            authorization: getToken(),
                        },
                        data: {
                            path: inputData.asset_id + "/" + data.file_name,
                        },
                        onUploadProgress: (data) =>
                            setProgressBarUpload(
                                Math.round((data.loaded / data.total) * 100)
                            ),
                    };

                    try {
                        axios(config_Q3)
                            .then((result) => {
                                if (result.data) {
                                } else {
                                    toast.error(
                                        t(
                                            "content.shop_floor_overview.error.ErrorcallingAPItodeletedatasheets"
                                        ),
                                        {
                                            toastId:
                                                "AU_error-delete-datasheet_S_400",
                                        }
                                    );
                                }
                            })
                            .catch(() => {});
                    } catch (e) {
                        // //////////////console.log(e.message);
                        setProgressBarUpload(0);
                        toast.error(
                            t(
                                "content.shop_floor_overview.error.ErrorcallingAPItodeletedatasheets"
                            ),
                            {
                                toastId: "AU_error-delete-datasheet_API",
                            }
                        );
                    }
                });
            }

            if (new_data_sheets.length > 0) {
                const formData_Q3 = new FormData();
                new_data_sheets.forEach((data) => {
                    formData_Q3.append(
                        "pathFile",
                        inputData.asset_id +
                            "/" +
                            inputData.asset_id +
                            "_" +
                            data.file_name
                    );
                    formData_Q3.append("file", data.file);
                });

                const config_Q3 = {
                    method: "post",
                    url:
                        ReturnHostBackend(
                            process.env.REACT_APP_BACKEND_NODELINX
                        ) + process.env.REACT_APP_IMAGE_UPLOAD,
                    headers: {
                        authorization: getToken(),
                    },
                    data: formData_Q3,
                    onUploadProgress: (data) =>
                        setProgressBarUpload(
                            Math.round((data.loaded / data.total) * 100)
                        ),
                };

                setIsLoading(true);
                let data_sheets_arr = [];
                try {
                    const result = await axios(config_Q3);
                    setProgressBarUpload(0);
                    if (result.status === 200) {
                        data_sheets_arr = result.data.pathFile;
                    } else {
                        toast.error(
                            t(
                                "content.shop_floor_overview.error.ErrorcallingAPItouploaddatasheets"
                            ),
                            {
                                toastId: "AU_error-upload-datasheet_S_400",
                            }
                        );
                    }
                } catch (e) {
                    // //////////////console.log(e.message);
                    setProgressBarUpload(0);
                    toast.error(
                        t(
                            "content.shop_floor_overview.error.ErrorcallingAPItouploaddatasheets"
                        ),
                        {
                            toastId: "AU_error-upload-datasheet_API",
                        }
                    );
                }
                setIsLoading(false);
            }
            let dataaddmodification = {
                modified_at: new Date(),
                modified_by: getUserDetails().fullname,
                description: inputData.description,
                type:
                inputOptions.functionsnew.length > 0 &&
                inputData.function_idnew.label,

                // type:
                //     inputOptions.functions.length > 0 &&
                //     inputOptions.functions.find(
                //         (element) =>
                //             element.id.toString() ===
                //             inputData.function_id.toString()
                //     )
                //         ? inputOptions.functions.find(
                //               (element) =>
                //                   element.id.toString() ===
                //                   inputData.function_id.toString()
                //           ).name
                //         : inputData.function_id,

                        brand:
                        inputOptions.brandsnew.length > 0 && inputData.brandnew.label,
                // brand: inputOptions.brands.find(
                //     (element) =>
                //         element.id.toString() === inputData.brand.toString()
                // )
                //     ? inputOptions.brands.find(
                //           (element) =>
                //               element.id.toString() ===
                //               inputData.brand.toString()
                //       ).name
                //     : inputData.brand,
                model:
                inputOptions.model_numbersnew.length > 0 &&
                inputData.model_numbernew.label,
                // model:
                //     inputOptions.model_numbers.length > 0 &&
                //     inputOptions.model_numbers.find(
                //         (element) =>
                //             element.id.toString() ===
                //             inputData.model_number.toString()
                //     )
                //         ? inputOptions.model_numbers.find(
                //               (element) =>
                //                   element.id.toString() ===
                //                   inputData.model_number.toString()
                //           ).name
                //         : inputData.model_number,
                image:
                    inputData.asset_image_file_name == ""
                        ? selectedAsset.asset_image.split("_")[2]
                        : inputData.asset_image_file_name.replace(/\s/g, ""),
                machine_number: inputData.asset_name,
                files: data_sheet_name,
                changes: data_changes !== "" ? data_changes.slice(0, -1) : "",
                factory:
                    inputOptions.floors.length > 0 &&
                    inputOptions.floors.find(
                        (element) =>
                            element.id.toString() ===
                            inputData.floor_id.toString()
                    )
                        ? inputOptions.floors.find(
                              (element) =>
                                  element.id.toString() ===
                                  inputData.floor_id.toString()
                          ).name
                        : selectedAsset.floor,
                shopfloor:
                    inputOptions.rooms.length > 0 &&
                    inputOptions.rooms.find(
                        (element) =>
                            element.id.toString() ===
                            inputData.room_id.toString()
                    )
                        ? inputOptions.rooms.find(
                              (element) =>
                                  element.id.toString() ===
                                  inputData.room_id.toString()
                          ).name
                        : inputData.room_id,
                modification_type: "Changes",
                asset_id: inputData.asset_number,
            };

            const config_modification = {
                method: "post",
                url:
                    ReturnHostBackend(process.env.REACT_APP_JDBC) +
                    process.env.REACT_APP_ADD_MODIFICATION,
                headers: {
                    authorization: getToken(),
                },
                data: dataaddmodification,
                onUploadProgress: (data) =>
                    setProgressBarUpload(
                        Math.round((data.loaded / data.total) * 100)
                    ),
            };

            setIsLoading(true);

            try {
                const result = await axios(config_modification);
                setProgressBarUpload(0);

                if (result.status === 200) {
                    toast.success(
                        t("content.shop_floor_overview.error.AssetUpdated")
                    );
                } else {
                    toast.error(
                        t(
                            "content.shop_floor_overview.error.ErrorcallingAPItoaddmodification"
                        ),
                        {
                            toastId: "AA_error-add-modification",
                        }
                    );
                    setIsLoading(false);
                    return;
                }
            } catch (e) {
                // //////////////console.log(e);
                setProgressBarUpload(0);
                toast.error(
                    t(
                        "content.shop_floor_overview.error.ErrorcallingAPItoaddmodification"
                    ),
                    {
                        toastId: "AA_error-add-modification",
                    }
                );
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
        } else {
            toast.error(t("content.shop_floor_overview.error.nodatachanged"), {
                toastId: "no-data-updated",
            });
        }

        handleInputClear();
        onSubmit();
        hide();
    };

    const valAssetNum = async (asset_number) => {
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_ASSET_VAL_EXIST_ASSET_NUMBER,
            headers: {
                authorization: getToken(),
            },
            data: {
                asset_number: asset_number,
            },
        };
        setIsLoading(true);
        try {
            const result = await axios(config);
            if (result.status === 200) {
                setIsLoading(false);
                if (result.data.count != 0) {
                    return result.data.data[0].id;
                } else {
                    return undefined;
                }
            } else {
                toast.error("Error validating existing asset number", {
                    toastId: "AA_error-val-asset-num_S_400",
                });
            }
        } catch (e) {
            // //////////////console.log(e.message);
            toast.error("Error validating existing asset number", {
                toastId: "AA_error-val-asset-num_API",
            });
        }
        setIsLoading(false);
    };
    const handleInputClear = () => {
        setInputData((prev) => {
            return {
                ...prev,
                asset_id: "",
                asset_image: "",
                asset_image_file: null,
                asset_image_file_name: "",
                asset_number: "",
                asset_name: "",
                asset_short_name: "",
                function_id: "",
                floor_id: "",
                room_id: "",
                area: [""],
                commissioned_date: "",
                // formatDate(new Date()),
                data_sheet: [],
                brand: "",
                model_number: "",
                description: "",
                data_sheet_file: null,
                data_sheet_file_path: "",
                function_idnew: "",
                brandnew: "",
                model_numbernew: "",
            };
        });
    };

    useEffect(() => {
        if (isShowing) {
            const getRooms = async (floorId) => {
                let config = {
                    method: "post",
                    url:
                        ReturnHostBackend(process.env.REACT_APP_JDBC) +
                        process.env.REACT_APP_CONNECTIVITY_GET_ROOMS_BY_FLOOR,
                    headers: {
                        authorization: getToken(),
                    },
                    data: {
                        floor_id:
                            floorId === null || floorId === undefined
                                ? ""
                                : floorId,
                    },
                };

                try {
                    const result = await axios(config);

                    if (result.status === 200) {
                        let { data } = result;

                        if (data.count > 0) {
                            let { data: queryData } = data;

                            queryData = queryData.map((row) => {
                                return {
                                    id: row.room_id,
                                    name: row.room_name,
                                };
                            });

                            setInputOptions((prevState) => {
                                return {
                                    ...prevState,
                                    rooms: queryData,
                                };
                            });
                        } else {
                            setInputOptions((prevState) => {
                                return {
                                    ...prevState,
                                    rooms: [],
                                };
                            });
                        }
                    } else {
                        toast.error(
                            t(
                                "content.shop_floor_overview.error.ErrorcallingAPItogetroomsdata"
                            ),
                            {
                                toastId: "AA_error-get-room_S_400",
                            }
                        );
                    }
                } catch (e) {
                    toast.error(
                        t(
                            "content.shop_floor_overview.error.ErrorcallingAPItogetroomsdata"
                        ),
                        {
                            toastId: "AA_error-get-room_API",
                        }
                    );
                }
            };
            (async () => {
                setIsLoadingRoom(true);
                await getRooms(inputData.floor_id);
                setIsLoadingRoom(false);
            })();
        }
    }, [inputData.floor_id, isShowing]);

    useEffect(() => {
        if (isShowing) {
            // Internal functions
            const getFloors = async () => {
                // Call JDBC query to get all floors
                let config = {
                    method: "post",
                    url:
                        ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                        process.env.REACT_APP_CONNECTIVITY_GET_FLOORS,
                    headers: {
                        authorization: getToken(),
                    },
                };

                try {
                    const result = await axios(config);

                    if (result.status === 200) {
                        let { data } = result;

                        if (data.count > 0) {
                            let { data: queryData } = data;

                            setInputOptions((prevState) => {
                                return {
                                    ...prevState,
                                    floors: queryData.map((row) => {
                                        return {
                                            id: row.floor_id,
                                            name: row.floor_name,
                                        };
                                    }),
                                };
                            });
                        } else {
                            setInputOptions((prevState) => {
                                return {
                                    ...prevState,
                                    floors: [],
                                };
                            });
                        }
                    } else {
                        toast.error(
                            t(
                                "content.shop_floor_overview.error.ErrorcallingAPItogetfloorsdata"
                            ),
                            {
                                toastId: "AA_error-get-floor_S_400",
                            }
                        );
                    }
                } catch (e) {
                    toast.error(
                        t(
                            "content.shop_floor_overview.error.ErrorcallingAPItogetfloorsdata"
                        ),
                        {
                            toastId: "AA_error-get-floor_API",
                        }
                    );
                }
            };

            (async () => {
                setIsLoadingFloor(true);
                await getFloors();
                setIsLoadingFloor(false);
            })();
        }
    }, [isShowing]);

    useEffect(() => {
        if (isShowing) {
            if (selectedAsset !== undefined) {
                // await
                getDataSheet(selectedAsset.asset_id);
            }
        }
    }, [selectedAsset, isShowing]);

    useEffect(() => {
        if (isShowing) {
            if (selectedAsset !== undefined) {
                // await
                getdataModification(selectedAsset.asset_number, currentPage);
            }
        }
    }, [selectedAsset, isShowing, currentPage]);

    useEffect(() => {
        if (isShowing) {
            if (selectedAsset !== undefined) {
                // await
                getcountdataModification(selectedAsset.asset_number);
            }
        }
    }, [selectedAsset, isShowing]);

    const getcountdataModification = (asset_id) => {
        const config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_GET_COUNT_MODIFICATION,
            headers: {
                authorization: getToken(),
            },
            data: {
                asset_id: asset_id,
            },
            onUploadProgress: (data) =>
                setProgressBarUpload(
                    Math.round((data.loaded / data.total) * 100)
                ),
        };

        try {
            // const result =
            axios(config)
                .then((result) => {
                    if (result.data) {
                        // let { data } = result.data;

                        //////////////console.log("data getdata Count Modification");
                        //////////////console.log(result.data.count);
                        setTotalPage(Math.ceil(result.data.count / limit));
                    } else {
                        toast.error(
                            t(
                                "content.shop_floor_overview.error.Errorgettingcountmodification"
                            ),
                            {
                                toastId: "ADI_error-get-count-modification",
                            }
                        );
                    }
                })
                .catch(() => {});
        } catch (e) {}
    };

    const getdataModification = (asset_id, currentPage) => {
        const config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_GET_MODIFICATION,
            headers: {
                authorization: getToken(),
            },
            data: {
                asset_id: asset_id,
                limit: limit,
                page: currentPage,
            },
            onUploadProgress: (data) =>
                setProgressBarUpload(
                    Math.round((data.loaded / data.total) * 100)
                ),
        };

        try {
            // const result =
            axios(config)
                .then((result) => {
                    if (result.data) {
                        let arraydatatable = [];
                        let key = Object.keys(header);
                        result.data.data.map((data, i) => {
                            const datatable = {
                                timestamp: data.modified_at,

                                // date: "",
                                modifiedby: data.modified_by,
                                modificationtype: data.modification_type,

                                asset_id: data.asset_id,
                                type: data.type,
                                brand: data.brand,
                                image: data.image,
                                model: data.model,
                                machine_number: data.machine_number,
                                factory: data.factory,
                                shopfloor: data.shopfloor,
                                file: data.files,
                                remark: data.description,
                                changes:
                                    data.changes !== ""
                                        ? data.changes
                                              .split(",")
                                              .map((data, i) =>
                                                  key.indexOf(
                                                      data.toLowerCase()
                                                  )
                                              )
                                        : [],
                            };

                            arraydatatable.push(datatable);
                        });
                        //////////console.log("datachangelist")

                        setBodytable(arraydatatable);
                    } else {
                        toast.error(
                            t(
                                "content.shop_floor_overview.error.Errorgettingmodification"
                            ),
                            {
                                toastId: "ADI_error-get-modification",
                            }
                        );
                    }
                })
                .catch(() => {});
        } catch (e) {
            selectedAsset.data_sheet = "";
            // //////////////console.log(e.message);
            // toast.warning("No data sheet for selected asset.", {
            //     toastId: "error-get-data-sheet" + asset_id,
            // });
        }
    };

    const getDataSheet = (asset_id) => {
        //////console.log("selectedAsset")
        //////console.log(selectedAsset)
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                "/api/listDirectory",
            headers: {
                authorization: getToken(),
            },
            data: {
                path: asset_id,
            },
        };

        try {
            // const result =
            axios(config)
                .then((result) => {
                    if (result.data) {
                        const resultArr = [];

                        result.data.map((data) => {
                            resultArr.push({
                                file_name: data.name,
                            });
                        });

                        //console.log("selectedAsset");
                        //console.log(selectedAsset);
                        setInputData((prev) => {
                            // prev.data_sheet = [...resultArr]
                            return {
                                ...prev,
                                asset_id: selectedAsset.asset_id,
                                asset_image: selectedAsset.asset_image
                                    ? selectedAsset.asset_image
                                    : "",
                                asset_image_file: null,
                                asset_image_file_name: "",
                                asset_number: selectedAsset.asset_number,
                                asset_name: selectedAsset.asset_name,
                                asset_short_name: "",
                                function_id: selectedAsset.function_id,
                                floor_id: selectedAsset.floor_id,
                                room_id: selectedAsset.room_id,
                                area: ["", ""],
                                commissioned_date: "",
                                data_sheet: [...resultArr],
                                // formatDate(new Date()),
                                brand: selectedAsset.brand_id,
                                model_number: selectedAsset.model_number_id,
                                description: selectedAsset.description,
                                data_sheet_file: null,
                                data_sheet_file_name: "",
                                function_idnew: {
                                    id: selectedAsset.function_id,
                                    value: selectedAsset.function,
                                    label: selectedAsset.function,
                                },
                                brandnew: {
                                    id: selectedAsset.brand_id,
                                    value: selectedAsset.brand,
                                    label: selectedAsset.brand,
                                },
                                model_numbernew: {
                                    id: selectedAsset.model_number_id,
                                    // value: row.machine_model,
                                    label: selectedAsset.model_number,
                                },
                            };
                        });

                        SetNoUpdateDataSheet(resultArr);
                    } else {
                        toast.error(
                            t(
                                "content.shop_floor_overview.error.Errorgettingassetdatasheet"
                            ),
                            {
                                toastId: "ADI_error-get-datasheet_S_400",
                            }
                        );
                    }
                })
                .catch(() => {
                    setInputData((prev) => {
                        // prev.data_sheet = [...resultArr]
                        return {
                            ...prev,
                            asset_id: selectedAsset.asset_id,
                            asset_image: selectedAsset.asset_image
                                ? selectedAsset.asset_image
                                : "",
                            asset_image_file: null,
                            asset_image_file_name: "",
                            asset_number: selectedAsset.asset_number,
                            asset_name: selectedAsset.asset_name,
                            asset_short_name: "",
                            function_id: selectedAsset.function_id,
                            floor_id: selectedAsset.floor_id,
                            room_id: selectedAsset.room_id,
                            area: ["", ""],
                            commissioned_date: "",
                            data_sheet: [],
                            // formatDate(new Date()),
                            brand: selectedAsset.brand_id,
                            model_number: selectedAsset.model_number_id,
                            description: selectedAsset.description,
                            data_sheet_file: null,
                            data_sheet_file_name: "",
                            function_idnew: {
                                id: selectedAsset.function_id,
                                value: selectedAsset.function,
                                label: selectedAsset.function,
                            },
                            brandnew: {
                                id: selectedAsset.brand_id,
                                value: selectedAsset.brand,
                                label: selectedAsset.brand,
                            },
                            model_numbernew: {
                                id: selectedAsset.model_number_id,
                                // value: row.machine_model,
                                label: selectedAsset.model_number,
                            },
                        };
                    });
                });
        } catch (e) {
            setInputData((prev) => {
                // prev.data_sheet = [...resultArr]
                return {
                    ...prev,
                    asset_id: selectedAsset.asset_id,
                    asset_image: selectedAsset.asset_image
                        ? selectedAsset.asset_image
                        : "",
                    asset_image_file: null,
                    asset_image_file_name: "",
                    asset_number: selectedAsset.asset_number,
                    asset_name: selectedAsset.asset_name,
                    asset_short_name: "",
                    function_id: selectedAsset.function_id,
                    floor_id: selectedAsset.floor_id,
                    room_id: selectedAsset.room_id,
                    area: ["", ""],
                    commissioned_date: "",
                    data_sheet: [],
                    // formatDate(new Date()),
                    brand: selectedAsset.brand_id,
                    model_number: selectedAsset.model_number_id,
                    description: selectedAsset.description,
                    data_sheet_file: null,
                    data_sheet_file_name: "",
                    function_idnew: {
                        id: selectedAsset.function_id,
                        value: selectedAsset.function,
                        label: selectedAsset.function,
                    },
                    brandnew: {
                        id: selectedAsset.brand_id,
                        value: selectedAsset.brand,
                        label: selectedAsset.brand,
                    },
                    model_numbernew: {
                        id: selectedAsset.model_number_id,
                        // value: row.machine_model,
                        label: selectedAsset.model_number,
                    },
                };
            });

            // //////////////console.log(e.message);
            // toast.warning("No data sheet for selected asset.", {
            //     toastId: "error-get-data-sheet" + asset_id,
            // });
        }
    };
    // Delete Brand
    const deleteBrand = async (brand_id) => {
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env.REACT_APP_ASSET_DELETE_BRAND,
            headers: {
                authorization: getToken(),
            },
            data: {
                brand_id: brand_id,
            },
        };
        setIsLoadingBrand(true);
        try {
            const result = await axios(config);
            if (result.status === 200) {
                if (result.data.includes("violates foreign key constraint")) {

                    t(
                        "content.shop_floor_overview.error.ErrorcallingAPItogetfloorsdata"
                    )
                    toast.error(
                        t(
                            "content.shop_floor_overview.error.Failedtodeletebrandoptionduetoexistingmodelnumberwiththisbrand"
                        ),
                        { toastId: "AA_error-del-brand" }
                    );
                }

                setIsLoading(true);
                await getBrands();
                toast.success(t(
                    "content.shop_floor_overview.error.succesdeletebrand"
                ), {
                    toastId: "AA_succes-delete-brand_S_400",
                });
                setIsLoading(false);
            } else {
                toast.error(t(
                    "content.shop_floor_overview.error.Errordeletingbrand"
                ), {
                    toastId: "AA_error-del-brand_S_400",
                });
            }
        } catch (e) {
            // //console.log(e.message);
            toast.error(t(
                "content.shop_floor_overview.error.ErrorcallingAPItodeletebrand"
            ), {
                toastId: "AA_error-del-brand_API",
            });
        }
        setIsLoadingBrand(false);
    };

    const addBrand = async (brand) => {
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_ASSET_ADD_BRAND,
            headers: {
                authorization: getToken(),
            },
            data: {
                brand: brand,
            },
        };

        setIsLoadingBrand(true);
        try {
            const result = await axios(config);
            if (result.status === 200) {
                setIsLoadingBrand(true); 
                await getBrands();
                toast.success(t(
                    "content.shop_floor_overview.error.succesaddingbrand"
                ), {
                    toastId: "AA_succes-add-brand_S_400",
                });
                setIsLoadingBrand(false);
                return result.data.data[0].id;
            } else {
                toast.error(t(
                    "content.shop_floor_overview.error.Erroraddingbrand"
                ), { 
                    toastId: "AA_error-add-brand_S_400",
                });
            }
        } catch (e) {
            // //console.log(e.message)
            toast.error(t(
                "content.shop_floor_overview.error.ErrorcallingAPItoaddbrand"
            ), {
                toastId: "AA_error-add-brand_API",
            });
        }
        setIsLoadingBrand(false);
    };

    const addType = async (type) => {
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_ASSET_ADD_TYPE,
            headers: {
                authorization: getToken(),
            },
            data: {
                type: type,
            },
        };

        setIsLoadingFunction(true);
        try {
            const result = await axios(config);
            if (result.status === 200) {
                setIsLoadingFunction(true);
                await getFunctions();
                setIsLoadingFunction(false);
                toast.success(t(
                    "content.shop_floor_overview.error.succesaddingtype"
                ), {
                    toastId: "AA_succes-add-brand_S_400",
                });
                return result.data.data[0].id;
            } else {
                toast.error(t(
                    "content.shop_floor_overview.error.Erroraddingtype"
                ), {
                    toastId: "AA_error-add-brand_S_400",
                });
            }
        } catch (e) {
            // //console.log(e.message)
            toast.error(t(
                "content.shop_floor_overview.error.ErrorcallingAPItoaddtype"
            ), {
                toastId: "AA_error-add-brand_API",
            });
        }
        setIsLoadingFunction(false);
    };

    const deleteType = async (type_id) => {
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env.REACT_APP_ASSET_DELETE_TYPE,
            headers: {
                authorization: getToken(),
            },
            data: {
                type_id: type_id,
            },
        };
        setIsLoadingFunction(true);
        try {
            const result = await axios(config);
            if (result.status === 200) {
                if (result.data.includes("violates foreign key constraint")) {
                    toast.error(
                        t(
                            "content.shop_floor_overview.error.Failedtodeletebrandoptionduetoexistingmodelnumberwiththistype"
                        ),
                        { toastId: "AA_error-del-type" }
                    );
                }

                // setIsLoading(true);
                
                await getFunctions();
                toast.success( t(
                    "content.shop_floor_overview.error.succesdeletetype"
                ), {
                    toastId: "AA_succes-delete-brand_S_400",
                });
                // setIsLoading(false);
            } else {
                toast.error(t(
                    "content.shop_floor_overview.error.Errordeletingtype"
                ), {
                    toastId: "AA_error-del-type_S_400",
                });
            }
        } catch (e) {
            // //console.log(e.message);
            toast.error(t(
                "content.shop_floor_overview.error.ErrorcallingAPItodeletetype"
            ), {
                toastId: "AA_error-del-type_API",
            });
        }
        setIsLoadingFunction(false);
    };

    // Add Model Number
    const addModel = async (brand_id, function_id, model_number) => {
        //console.log("addModel")
        //console.log([brand_id, function_id, model_number])
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_ASSET_ADD_MODEL,
            headers: {
                authorization: getToken(),
            },
            data: {
                brand_id: brand_id,
                function_id: function_id,
                model_number: model_number,
            },
        };
        setIsLoadingModel(true);
        try {
            const result = await axios(config);
            // //console.log(result.data.data[0].id);
            if (result.status === 200) {
                setIsLoadingModel(true);
                await getModels(
                    inputData.function_idnew.id,
                    inputData.brandnew.id
                );
              
                toast.success(  t(
                    "content.shop_floor_overview.error.succesaddingmodel"
                ), {
                    toastId: "AA_succes-add-model_S_400",
                });
                setIsLoadingModel(false);
                return result.data.data[0].id;
            } else {
                toast.error( t(
                    "content.shop_floor_overview.error.Erroraddingmodelnumber"
                ), {
                    toastId: "AA_error-add-model_S_400",
                });
            }
        } catch (e) {
            // //console.log(e.message)
            toast.error(t(
                "content.shop_floor_overview.error.ErrorcallingAPItoaddmodelnumber"
            ), {
                toastId: "AA_error-add-model_API",
            });
        }
        setIsLoadingModel(false);
    };

    // Delete Model Number
    const deleteModel = async (model_number_id) => {
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env.REACT_APP_ASSET_DELETE_MODEL,
            headers: {
                authorization: getToken(),
            },
            data: {
                model_number_id: model_number_id,
            },
        };
        setIsLoadingModel(true);
        try {
            const result = await axios(config);
            // //console.log(result);
            if (result.status === 200) {
                if (
                    typeof result.data == "string" &&
                    result.data.includes("violates foreign key constraint")
                ) {

                   
                    toast.error(
                        t(
                            "content.shop_floor_overview.error.Failedtodeletemodelnumberoptionduetoexistingassetwiththismodelnumber"
                        ),
                        { toastId: "AA_error-del-model" }
                    );
                }

                setIsLoadingModel(true);
                await getModels(
                    inputData.function_idnew.id,
                    inputData.brandnew.id
                );
                toast.success( t(
                    "content.shop_floor_overview.error.succesdeletemodel"
                ), {
                    toastId: "AA_succes-delete-model_S_400",
                });
                setIsLoadingModel(false);
            } else {
                toast.error(t(
                    "content.shop_floor_overview.error.Errordeletingmodelnumber"
                ), {
                    toastId: "AA_error-del-model_S_400",
                });
            }
        } catch (e) {
            // //console.log(e.message);
            toast.error(t(
                "content.shop_floor_overview.error.ErrorcallingAPItodeletemodelnumber"
            ), {
                toastId: "AA_error-del-model_API",
            });
        }
        setIsLoadingModel(false);
    };
    return (
        <ModalContainer
            width={isIsformation ? "380px" : "1300px"}
            title={t(
                "content.shop_floor_overview.machine_information.header.Machine_information"
            )}
            isShowing={isShowing}
            hide={hide}
            // hide ={hide}
            // submitName={isEdit ? t("profile.content.update") : undefined}
            submitName={
                isIsformation
                    ? // t(
                      //       "content.shop_floor_overview.asset_list.content.Add_machine"
                      //   )
                      t(
                        "content.shop_floor_overview.asset_list.content.Update_machine"
                    )
                    : undefined
            }
            // formId={""}
            // showRequired={true}
            onSubmit={handleInputUpdate}
            showRequired={false}
            isProfile
            children={
                <div className='machine-information-modal'>
                    <div className='choose-information-modification'>
                        <div
                            onClick={() => {
                                setIsInformation(true);
                            }}
                            className='information'
                            style={{
                                color: isIsformation ? "#000000" : "#666666",
                                fontWeight: "bold",
                            }}>
                            {t(
                                "content.shop_floor_overview.asset_list.content.Information"
                            )}
                        </div>

                        <div
                            onClick={() => {
                                setIsInformation(false);
                            }}
                            className='modification'
                            style={{
                                color: !isIsformation ? "#000000" : "#666666",
                                fontWeight: "bold",
                            }}>
                            {t(
                                "content.shop_floor_overview.asset_list.content.Modification"
                            )}
                        </div>
                    </div>

                    {isIsformation && (
                        <>
                            <div className='top-side'>
                                <UploadPhoto
                                    height='140px'
                                    width='130px'
                                    onUpload={(photoFile) => {
                                        setInputData((prev) => {
                                            return {
                                                ...prev,
                                                asset_image_file: photoFile,
                                                asset_image_file_name:
                                                    photoFile.name.replace(
                                                        /\s/g,
                                                        ""
                                                    ),
                                            };
                                        });
                                    }}
                                    defaultImage={
                                        inputData.asset_image !== "" &&
                                        inputData.asset_image_file == null
                                            ? //     ?
                                              ReturnHostBackend(
                                                  process.env
                                                      .REACT_APP_BACKEND_NODELINX
                                              ) +
                                              //   "/filerepository/CAD-IT/uploadFileFromAPI/" +
                                              inputData.asset_image
                                            : inputData.asset_image_file
                                    }
                                    triggerClear={inputData.asset_image_file}
                                />
                            </div>
                            <div className='bottom-side'>
                                <form
                                    id='update-asset-form'
                                    className='asset-add-pop-container'
                                    // onSubmit={handleInputAdd}
                                >
                                    <InputTextHorizontal
                                        inputWidth='250px'
                                        name='asset_number'
                                        label={t(
                                            "content.shop_floor_overview.asset_list.content.AssetID"
                                        )}
                                        value={inputData.asset_number}
                                        onChange={handleInputChange}
                                        isRequired={true}
                                        isDisabled
                                    />

                                    {/* <InputDropdownHorizontal
                                        inputWidth='205px'
                                        name='function_id'
                                        label={t(
                                            "content.shop_floor_overview.asset_list.content.type"
                                        )}
                                        onSelect={(e) => {
                                            // //////////////console.log(e)
                                            const found =
                                                inputOptions.functions.find(
                                                    (element) =>
                                                        element.id.toString() ===
                                                        e.value
                                                );
                                            // //////////////console.log(found);
                                            setInputData((prev) => {
                                                prev.function_id = e.value;
                                                return { ...prev };
                                            });
                                        }}
                                        noEmptyOption
                                        isLoading={false}
                                        // width='100%'

                                        // label='Function'
                                        value={
                                            inputOptions.functions.length > 0 &&
                                            inputOptions.functions.find(
                                                (element) =>
                                                    element.id.toString() ===
                                                    inputData.function_id
                                            )
                                                ? inputOptions.functions.find(
                                                      (element) =>
                                                          element.id.toString() ===
                                                          inputData.function_id
                                                  ).name
                                                : selectedAsset.function
                                        }
                                        options={inputOptions.functions}
                                        // onSelect={handleInputChange}
                                        // isRequired={true}
                                        // isLoading={isLoadingFunction}
                                    /> */}

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}>
                                        <label className='reusable-input-horizontal-label'>
                                            {t(
                                                "content.shop_floor_overview.asset_list.content.type"
                                            )}
                                            *:
                                        </label>
                                        <InputDropdownCreatableVertical
                                            name='type'
                                            label=''
                                            value={inputData.function_idnew}
                                            options={inputOptions.functionsnew}
                                            // onChange={handleInputChange}
                                            onSelect={(selectedOption) => {
                                                setInputData((prev) => {
                                                    return {
                                                        ...prev,
                                                        function_idnew:
                                                            selectedOption,
                                                        model_number: "",
                                                        model_numbernew: "",
                                                    };
                                                });
                                            }}
                                            onCreateOption={(createdItem) => {
                                                addType(createdItem);
                                            }}
                                            onDeleteOption={(deletedItem) => {
                                                deleteType(deletedItem.id);
                                                setInputData((prev) => {
                                                    return {
                                                        ...prev,
                                                        function_idnew: "",
                                                        model_number: "",
                                                        model_numbernew: "",
                                                    };
                                                });
                                            }}
                                            // isRequired={true}
                                            // inputwWidth='100%'
                                            width='64%'
                                            isLoading={isLoadingFunction}
                                        />
                                    </div>
{/* 
                                    <InputDropdownHorizontal
                                        inputWidth='205px'
                                        name='brand'
                                        label={t(
                                            "content.shop_floor_overview.asset_list.content.brand"
                                        )}
                                        value={
                                            inputOptions.brands.length > 0 &&
                                            inputOptions.brands.find(
                                                (element) =>
                                                    element.id.toString() ===
                                                    inputData.brand
                                            )
                                                ? inputOptions.brands.find(
                                                      (element) =>
                                                          element.id.toString() ===
                                                          inputData.brand
                                                  ).name
                                                : selectedAsset.brand
                                        }
                                        options={inputOptions.brands}
                                        onSelect={(e) => {
                                            // //////////////console.log(found);
                                            setInputData((prev) => {
                                                prev.brand = e.value;
                                                return { ...prev };
                                            });
                                        }}
                                        noEmptyOption
                                        isLoading={false}
                                    /> */}

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}>
                                        <label className='reusable-input-horizontal-label'>
                                            {t(
                                                "content.shop_floor_overview.asset_list.content.brand"
                                            )}
                                            *:
                                        </label>
                                        <InputDropdownCreatableVertical
                                            name='brand'
                                            label=''
                                            value={inputData.brandnew}
                                            options={inputOptions.brandsnew}
                                            // onChange={handleInputChange}
                                            onSelect={(selectedOption) => {
                                                setInputData((prev) => {
                                                    return {
                                                        ...prev,
                                                        brandnew:
                                                            selectedOption,
                                                        model_number: "",
                                                        model_numbernew: "",
                                                    };
                                                });
                                            }}
                                            onCreateOption={(createdItem) => {
                                                addBrand(createdItem);
                                            }}
                                            onDeleteOption={(deletedItem) => {
                                                deleteBrand(deletedItem.id);
                                                setInputData((prev) => {
                                                    return {
                                                        ...prev,
                                                        brandnew: "",
                                                        model_number: "",
                                                        model_numbernew: "",
                                                    };
                                                });
                                            }}
                                            // isRequired={true}
                                            // inputwWidth='100%'
                                            width='64%'
                                            isLoading={isLoadingBrand}
                                        />
                                    </div>
                                    {/* <InputDropdownHorizontal
                                        inputWidth='205px'
                                        name='modelid'
                                        label={t(
                                            "content.shop_floor_overview.asset_list.content.model"
                                        )}
                                        value={
                                            inputOptions.model_numbers.length >
                                                0 &&
                                            inputOptions.model_numbers.find(
                                                (element) =>
                                                    element.id.toString() ===
                                                    inputData.model_number
                                            )
                                                ? inputOptions.model_numbers.find(
                                                      (element) =>
                                                          element.id.toString() ===
                                                          inputData.model_number
                                                  ).name
                                                : selectedAsset.model_number
                                        }
                                        options={inputOptions.model_numbers}
                                        onSelect={(e) => {
                                            // //////////////console.log(found);
                                            setInputData((prev) => {
                                                prev.model_number = e.value;
                                                return { ...prev };
                                            });
                                        }}
                                        noEmptyOption
                                        isLoading={false}
                                    /> */}

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}>
                                        <label className='reusable-input-horizontal-label'>
                                            {t(
                                                "content.shop_floor_overview.asset_list.content.model"
                                            )}
                                            *:
                                        </label>
                                        <InputDropdownCreatableVertical
                                            name='model_number'
                                            label=''
                                            value={inputData.model_numbernew}
                                            options={
                                                inputOptions.model_numbersnew
                                            }
                                            // onChange={handleInputChange}
                                            onSelect={(selectedOption) => {
                                                setInputData((prev) => {
                                                    return {
                                                        ...prev,
                                                        model_numbernew:
                                                            selectedOption,
                                                    };
                                                });
                                            }}
                                            onCreateOption={(createdItem) => {
                                                addModel(
                                                    inputData.brandnew.id,
                                                    inputData.function_idnew.id,
                                                    createdItem
                                                );
                                            }}
                                            onDeleteOption={(deletedItem) => {
                                                deleteModel(deletedItem.id);
                                                setInputData((prev) => {
                                                    return {
                                                        ...prev,
                                                        model_numbernew: "",
                                                    };
                                                });
                                            }}
                                            // inputWidth='100%'
                                            width='64%'
                                            isDisabled={
                                                inputData.function_idnew ===
                                                    "" ||
                                                inputData.brandnew === ""
                                            }
                                            // isRequired={true}
                                            isLoading={isLoadingModel}
                                        />
                                    </div>

                                    <InputTextHorizontal
                                        inputWidth='250px'
                                        name='asset_name'
                                        label={t(
                                            "content.shop_floor_overview.asset_list.content.machine_no"
                                        )}
                                        value={inputData.asset_name}
                                        onChange={handleInputChange}
                                        isRequired={true}

                                        // isDisabled={!isEdit}
                                    />
                                    <div className='box-document'>
                                        {t(
                                            "content.shop_floor_overview.asset_list.content.location"
                                        )}
                                        :
                                    </div>
                                    <InputDropdownHorizontal
                                        //  labelWidth = '300px'
                                        inputWidth='205px'
                                        name='factory'
                                        label={t(
                                            "content.shop_floor_overview.asset_list.content.factory"
                                        )}
                                        islocation
                                        value={
                                            inputOptions.floors.length > 0 &&
                                            inputOptions.floors.find(
                                                (element) =>
                                                    element.id.toString() ===
                                                    inputData.floor_id
                                            )
                                                ? inputOptions.floors.find(
                                                      (element) =>
                                                          element.id.toString() ===
                                                          inputData.floor_id
                                                  ).name
                                                : selectedAsset.floor
                                        }
                                        options={inputOptions.floors}
                                        onSelect={(e) => {
                                            // //////////////console.log(found);
                                            setInputData((prev) => {
                                                prev.floor_id = e.value;
                                                return { ...prev };
                                            });
                                        }}
                                        noEmptyOption
                                        isLoading={false}
                                    />
                                    <InputDropdownHorizontal
                                        inputWidth='205px'
                                        name='shop'
                                        label={t(
                                            "content.shop_floor_overview.asset_list.content.shopfloor"
                                        )}
                                        islocation
                                        value={
                                            inputOptions.rooms.length > 0 &&
                                            inputOptions.rooms.find(
                                                (element) =>
                                                    element.id.toString() ===
                                                    inputData.room_id
                                            )
                                                ? inputOptions.rooms.find(
                                                      (element) =>
                                                          element.id.toString() ===
                                                          inputData.room_id
                                                  ).name
                                                : selectedAsset.room
                                        }
                                        options={inputOptions.rooms}
                                        onSelect={(e) => {
                                            // //////////////console.log("room_id");
                                            // //////////////console.log(e.value);
                                            setInputData((prev) => {
                                                prev.room_id = e.value;
                                                return { ...prev };
                                            });
                                        }}
                                        noEmptyOption
                                        isLoading={false}
                                    />

                                    <InputTextAreaHorizantal
                                        name='description'
                                        label={t(
                                            "content.shop_floor_overview.asset_list.content.remark"
                                        )}
                                        value={inputData.description}
                                        onChange={handleInputChange}
                                        height='100px'
                                        inputWidth='205px'
                                        // isRequired={true}
                                    />

                                    <div
                                        className='box-document'
                                        style={{
                                            borderBottom: "1px solid #3D5D7A",
                                        }}>
                                        {t(
                                            "content.shop_floor_overview.asset_list.content.Documents"
                                        )}
                                    </div>

                                    <AssetUploadFile
                                        t={t}
                                        onUpload={(file, file_name) => {
                                            setInputData((prev) => {
                                                return {
                                                    ...prev,
                                                    data_sheet_file: file,
                                                };
                                            });
                                        }}
                                        defaultFiles={inputData.data_sheet}
                                        triggerClear={
                                            inputData.data_sheet_file === null
                                        }
                                    />
                                </form>
                            </div>
                        </>
                    )}

                    {!isIsformation && (
                        <div className='asset-list-modification'>
                            <div className='content-table'>
                                <div className='table'>
                                    <Table
                                        header={header}
                                        body={body}
                                        actions={[]}
                                        actionWidth='30px'
                                        selectable={true}
                                        customCellClassNames={[]}
                                    />
                                </div>
                                <div className='pagination'>
                                    <PaginationStyle2
                                        firstPage={firstPage}
                                        lastPage={lastPage}
                                        nextPage={nextPage}
                                        prevPage={prevPage}
                                        currentPageNumber={currentPage}
                                        lastPageNumber={
                                            totalPage !== 0 ? totalPage : 1
                                        }
                                        validateInput={(e) => {
                                            if (
                                                e.target.value !== "" &&
                                                e.target.value !== "0"
                                            ) {
                                                setCurrentPage(
                                                    parseInt(e.target.value)
                                                );
                                            } else {
                                                setCurrentPage(currentPage);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            }
        />
    );
};

export default ModalEditTable;
