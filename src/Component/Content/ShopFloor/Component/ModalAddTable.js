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
import { InputTextAreaHorizantal } from "../../../ComponentReuseable";

import exitButton from "../../../../svg/exit-button.svg";
import upladIcon from "../../../../svg/upload-icon.svg";

import { useState } from "react";
import { useEffect } from "react";
import { ReturnHostBackend } from "../../../ComponentReuseable/BackendHost";
import axios from "axios";
import { getToken } from "../../../ComponentReuseable/TokenParse";
import { toast } from "react-toastify";
import AssetUploadFile from "./AssetUploadFile";
import UploadPhoto from "./UploadPhoto";
import { getUserDetails } from "../../../ComponentReuseable/TokenParse";
import { InputDropdownCreatableVertical } from "../../../ComponentReuseable";
const factoryDummy = ["Factory 1", "Factory 2"];

const ModalAddTable = (props) => {
    const { isShowing, hide, t, onSubmit } = props;
    const [isEdit, setIsEdit] = useState(false);
    const [input, setInput] = useState({
        username: "taicang",
        job_number: "job number",
        email: "taicang@domain.com",
        password: "password",
    });

    const [filter, setFilter] = useState({
        factory: "",
        shop_floor: "",
        type: "",
        machine_no: "",
        // start_date: today,
        // end_date: today,
    });

    const [inputOptions, setInputOptions] = useState({
        floors: [],
        rooms: [],
        functions: [],
        functionsnew: [],
        brands: [],
        brandsnew: [],
        model_numbers: [],
        model_numbersnew: [],
    });

    const [inputData, setInputData] = useState({
        asset_image_file: null,
        asset_image_file_name: "",
        asset_number: "",
        asset_name: "",
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

    const handleInputChange = (e) => {
        let { name, value } = e.target;

        if (name == "asset_number") {
            // //////////console.log("asset id : ", value.replace(/[#|/|?|%]/gi, ""));
            // //////////console.log("");
            setInputData((prev) => {
                return {
                    ...prev,
                    asset_number: value.replace(/[#|/|?|%]/gi, ""),
                };
            });
            // } else if (name == "asset_name") {
            //     setInputData((prev) => {
            //         return {
            //             ...prev,
            //             asset_name: value.replace(/[#|/|?|%]/gi, ""),
            //         };
            //     });
        } else {
            // //////////console.log(name, "  :", value);
            // //////////console.log("");
            setInputData((prev) => {
                prev[name] = value;
                return { ...prev };
            });
        }
        // else  {
        //     setInputData((prev) => {
        //         prev[name] = value;
        //         return { ...prev };
        //     });
        // }

        // if (name == "function_id") {
        //     setInputData((prev) => {
        //         return {
        //             ...prev,
        //             model_number: "",
        //         };
        //     });
        // } else if (name == "floor_id") {
        //     setInputData((prev) => {
        //         return {
        //             ...prev,
        //             room_id: "",
        //         };
        //     });
        // }
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
            // //////////console.log("result type")
            // //////////console.log(result)
            if (result.status === 200) {
                let { data } = result;

                if (data.count > 0) {
                    let { data: queryData } = data;

                    // queryData = queryData.map((row) => {
                    // return {
                    //     id: row.id,
                    //     name: row.machine_type,
                    // };
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
            // (async () => {
            //     setIsLoadingFunction(true);
            //     await getFunctions(null, null);
            //     setIsLoadingFunction(false);
            // })();
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

            // //////////console.log("getBrands");
            // //////////console.log(result);
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
            // //////////console.log(e.message);
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
                    //////////console.log("getModels");
                    //////////console.log(result);
                    //////////console.log(function_id, brand_id);
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
            // //////////console.log(e.message);
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
            (async () => {
                let checkAssetNUmber = await valAssetNum(
                    inputData.asset_number
                );
                if (checkAssetNUmber !== undefined) {
                    toast.error(
                        t(
                            "content.shop_floor_overview.error.Assetnumberalreadyexist"
                        ),
                        {
                            toastId: "AA_error-asset-num-exist",
                        }
                    );
                    return;
                }
            })();
        }
    }, [isShowing, inputData.asset_number]);
    useEffect(() => {
        if (isShowing) {
            (async () => {
                setIsLoadingModel(true);
                await getModels(
                    inputData.function_idnew.id,
                    inputData.brandnew.id
                );
                setIsLoadingModel(false);
            })();
        }
    }, [
        inputData.function_id,
        inputData.brand,
        isShowing,
        inputData.function_idnew,
        inputData.brandnew,
    ]);

    const handleInputAdd = async (e) => {
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
        ////////console.log("listquery");
        ////////console.log(listquery);

        const config_Q2 = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env.REACT_APP_ASSET_ADD_ASSET,
            headers: {
                authorization: getToken(),
            },
            data: formData_Q2,
            onUploadProgress: (data) =>
                setProgressBarUpload(
                    Math.round((data.loaded / data.total) * 100)
                ),
        };

        setIsLoading(true);
        let new_added_asset_id;
        try {
            const result = await axios(config_Q2);
            setProgressBarUpload(0);
            //////////console.log("result")
            //////////console.log(result)
            if (result.status === 200) {
                new_added_asset_id = result.data.data[0].id;
            } else {
                toast.error(
                    t(
                        "content.shop_floor_overview.error.ErrorcallingAPItoaddasset"
                    ),
                    {
                        toastId: "AA_error-add-asset_S_400",
                    }
                );
                setIsLoading(false);
                return;
            }
        } catch (e) {
            // //////////console.log(e);
            setProgressBarUpload(0);
            toast.error(
                t(
                    "content.shop_floor_overview.error.ErrorcallingAPItoaddasset"
                ),
                {
                    toastId: "AA_error-add-asset_API",
                }
            );
            setIsLoading(false);
            return;
        }
        setIsLoading(false);

        let data_sheet_name = "";

        inputData.data_sheet_file.forEach((data, index) => {
            //////////console.log("data sheet");

            if (index === inputData.data_sheet_file.length - 1) {
                data_sheet_name = data_sheet_name + data.file_name;
            } else {
                data_sheet_name = data_sheet_name + data.file_name + ", ";
            }
        });

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
            //         (element) => element.id.toString() === inputData.function_id
            //     )
            //         ? inputOptions.functions.find(
            //               (element) =>
            //                   element.id.toString() === inputData.function_id
            //           ).name
            //         : inputData.function_id,
            brand:
                inputOptions.brandsnew.length > 0 && inputData.brandnew.label,
            // brand:
            //     inputOptions.brands.length > 0 &&
            //     inputOptions.brands.find(
            //         (element) => element.id.toString() === inputData.brand
            //     )
            //         ? inputOptions.brands.find(
            //               (element) => element.id.toString() === inputData.brand
            //           ).name
            //         : inputData.brand,
            model:
                inputOptions.model_numbersnew.length > 0 &&
                inputData.model_numbernew.label,

            // model:
            //     inputOptions.model_numbers.length > 0 &&
            //     inputOptions.model_numbers.find(
            //         (element) =>
            //             element.id.toString() === inputData.model_number
            //     )
            //         ? inputOptions.model_numbers.find(
            //               (element) =>
            //                   element.id.toString() === inputData.model_number
            //           ).name
            //         : inputData.model_number,
            image:
                inputData.asset_image_file_name == ""
                    ? ""
                    : inputData.asset_image_file_name.replace(/\s/g, ""),
            machine_number: inputData.asset_name,
            files: data_sheet_name,
            changes: "",
            factory:
                inputOptions.floors.length > 0 &&
                inputOptions.floors.find(
                    (element) =>
                        element.id.toString() === inputData.floor_id.toString()
                )
                    ? inputOptions.floors.find(
                          (element) =>
                              element.id.toString() ===
                              inputData.floor_id.toString()
                      ).name
                    : inputData.floor_id,
            shopfloor:
                inputOptions.rooms.length > 0 &&
                inputOptions.rooms.find(
                    (element) => element.id.toString() === inputData.room_id
                )
                    ? inputOptions.rooms.find(
                          (element) =>
                              element.id.toString() === inputData.room_id
                      ).name
                    : inputData.room_id,
            modification_type: "Creation",
            asset_id: inputData.asset_number,
        };

        //////////console.log("dataaddmodification");
        //////////console.log(dataaddmodification);

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
                //////////console.log("result modification")
                //////////console.log(result)
            } else {
                toast.error(
                    t(
                        "content.shop_floor_overview.error.ErrorcallingAPImodification"
                    ),
                    {
                        toastId: "AA_error-add-modification",
                    }
                );
                setIsLoading(false);
                return;
            }
        } catch (e) {
            // //////////console.log(e);
            setProgressBarUpload(0);
            toast.error(
                t(
                    "content.shop_floor_overview.error.ErrorcallingAPImodification"
                ),
                {
                    toastId: "AA_error-add-modification",
                }
            );
            setIsLoading(false);
            return;
        }
        setIsLoading(false);

        if (inputData.data_sheet_file.length > 0) {
            const formData_Q3 = new FormData();
            inputData.data_sheet_file.forEach((data) => {
                formData_Q3.append(
                    "pathFile",
                    new_added_asset_id +
                        "/" +
                        new_added_asset_id +
                        "_" +
                        data.file_name
                );
                formData_Q3.append("file", data.file);
            });

            const config_Q3 = {
                method: "post",
                url:
                    ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                    process.env.REACT_APP_IMAGE_UPLOAD,
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
                            toastId: "AA_error-upload-datasheet_S_400",
                        }
                    );
                }
            } catch (e) {
                // //////////console.log(e.message);
                setProgressBarUpload(0);
                toast.error(
                    t(
                        "content.shop_floor_overview.error.ErrorcallingAPItouploaddatasheets"
                    ),
                    {
                        toastId: "AA_error-upload-datasheet_API",
                    }
                );
            }
            setIsLoading(false);
        } else {
            toast.success(t("content.shop_floor_overview.error.NewAssetAdded"));
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
                toast.error(
                    t(
                        "content.shop_floor_overview.error.Errorvalidatingexistingassetnumber"
                    ),
                    {
                        toastId: "AA_error-val-asset-num_S_400",
                    }
                );
            }
        } catch (e) {
            // //////////console.log(e.message);
            toast.error(
                t(
                    "content.shop_floor_overview.error.Errorvalidatingexistingassetnumber"
                ),
                {
                    toastId: "AA_error-val-asset-num_API",
                }
            );
        }
        setIsLoading(false);
    };
    const handleInputClear = async () => {
        // Delete temp Data Sheet
        // if (
        //     inputData.data_sheet_file_name &&
        //     inputData.data_sheet_file_name.length > 0
        // ) {
        //     const temp_data_sheet_file_path =
        //         "temp/data_sheet/" + inputData.data_sheet_file_name;
        //     await deleteFile(temp_data_sheet_file_path);
        // }

        setInputData((prev) => {
            return {
                ...prev,
                asset_image_file: null,
                asset_image_file_name: "",
                asset_number: "",
                asset_name: "",
                asset_short_name: "",
                function_id: "",
                function_idnew:"",
                floor_id: "",
                room_id: "",
                area: ["", ""],
                commissioned_date: "",
                // formatDate(new Date()),
                brand: "",
                brandnew: "",
                model_number: "",
                model_numbernew:"",
                description: "",
                data_sheet_file: null,
                data_sheet_file_name: "",
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
            width={"380px"}
            title={t(
                "content.shop_floor_overview.machine_information.header.Machine_information"
            )}
            isShowing={isShowing}
            hide={hide}
            submitName={t(
                "content.shop_floor_overview.asset_list.content.Add_machine"
            )}
            onSubmit={handleInputAdd}
            //     // hide();
            // }

            formId={""}
            showRequired={false}
            isProfile
            children={
                <div className='machine-information-modal'>
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
                                            photoFile.name.replace(/\s/g, ""),
                                    };
                                });
                            }}
                            defaultImage={inputData.asset_image_file}
                            triggerClear={inputData.asset_image_file}
                        />
                    </div>
                    <div className='bottom-side'>
                        <form
                            id='update-profile-form'
                            className='asset-add-pop-container'>
                            <InputTextHorizontal
                                inputWidth='250px'
                                name='asset_number'
                                label={t(
                                    "content.shop_floor_overview.asset_list.content.AssetID"
                                )}
                                value={inputData.asset_number}
                                onChange={handleInputChange}
                                isRequired={true}
                            />

                            {/* <InputDropdownHorizontal
                                inputWidth='205px'
                                name='function_id'
                                label={t(
                                    "content.shop_floor_overview.asset_list.content.type"
                                )}
                                onSelect={(e) => {
                                    const found = inputOptions.functions.find(
                                        (element) =>
                                            element.id.toString() === e.value
                                    );

                                    setInputData((prev) => {
                                        prev.function_id = e.value;
                                        return { ...prev };
                                    });
                                }}
                                noEmptyOption
                                isLoading={false}
                                isRequired={true}
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
                                        : inputData.function_id
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
                                                function_idnew: selectedOption,
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

                            {/* <InputDropdownHorizontal
                                inputWidth='205px'
                                name='brand'
                                // label={t("content.filter.factory")}
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
                                        : inputData.brand
                                }
                                options={inputOptions.brands}
                                onSelect={(e) => {
                                    //console.log("inputOptions.brands");
                                    //console.log(inputOptions.brands);
                                    //console.log("e.value");
                                    //console.log(e.value);

                                    setInputData((prev) => {
                                        prev.brand = e.value;
                                        return { ...prev };
                                    });
                                }}
                                noEmptyOption
                                isLoading={false}
                                isRequired={true}
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
                                                brandnew: selectedOption,
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
                                    inputOptions.model_numbers.length > 0 &&
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
                                        : inputData.model_number
                                }
                                options={inputOptions.model_numbers}
                                onSelect={(e) => {
                                    // //////////console.log(found);
                                    setInputData((prev) => {
                                        prev.model_number = e.value;
                                        return { ...prev };
                                    });
                                }}
                                noEmptyOption
                                isLoading={false}
                                isRequired={true}
                                isDisabled={
                                    inputData.brand === "" ||
                                    inputData.function_id === ""
                                }
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
                                    options={inputOptions.model_numbersnew}
                                    // onChange={handleInputChange}
                                    onSelect={(selectedOption) => {
                                        setInputData((prev) => {
                                            return {
                                                ...prev,
                                                model_numbernew: selectedOption,
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
                                        inputData.function_idnew === "" ||
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
                                *:
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
                                        : inputData.floor_id
                                }
                                options={inputOptions.floors}
                                onSelect={(e) => {
                                    //console.log(inputOptions.floors);
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
                                        : inputData.room_id
                                }
                                options={inputOptions.rooms}
                                onSelect={(e) => {
                                    // //////////console.log("room_id");
                                    // //////////console.log(e.value);
                                    setInputData((prev) => {
                                        prev.room_id = e.value;
                                        return { ...prev };
                                    });
                                }}
                                noEmptyOption
                                isLoading={false}
                                isDisabled={inputData.floor_id === ""}
                            />

                            <InputTextAreaHorizantal
                                name='description'
                                label={t(
                                    "content.shop_floor_overview.asset_list.content.remark"
                                )}
                                // value={"inputData.description"}
                                value={inputData.description}
                                onChange={handleInputChange}
                                height='100px'
                                inputWidth='205px'
                                // isRequired={true}
                            />

                            <div
                                className='box-document'
                                style={{ borderBottom: "1px solid #3D5D7A" }}>
                                {t(
                                    "content.shop_floor_overview.asset_list.content.Documents"
                                )}
                            </div>

                            <AssetUploadFile
                                onUpload={(file, file_name) => {
                                    setInputData((prev) => {
                                        return {
                                            ...prev,
                                            data_sheet_file: file,
                                            // data_sheet_file_name: file_name,
                                        };
                                    });
                                }}
                                defaultFiles={[]}
                                triggerClear={inputData.data_sheet_file == null}
                                t={t}
                            />
                        </form>
                    </div>
                </div>
            }
        />
    );
};

export default ModalAddTable;
