import "./style.scss";
import { PaginationStyle2, Table } from "../../ComponentReuseable/index";
import { ReactComponent as AddIcon } from "../../../svg/add-icon.svg";
import { ReactComponent as EditIcon } from "../../../svg/edit-icon.svg";
import editiconbaru from "../../../svg/edit-icon.svg";
import { ReactComponent as DeleteIcon } from "../../../svg/delete-icon.svg";
import { ReactComponent as ReverseEditIcon } from "../../../svg/reverseedit.svg";
import { ReactComponent as LeftButton } from "../../../svg/leftbutton.svg";
import { ReactComponent as RightButton } from "../../../svg/rightbutton.svg";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Renderall3d from "./Component/renderingall3d";
import { toast } from "react-toastify";
import { ReturnHostBackend } from "../../ComponentReuseable/BackendHost";
import { getToken } from "../../ComponentReuseable/TokenParse";

import useModal from "../../ComponentReuseable/useModal";
import ModalAddTable from "./Component/ModalAddTable";
import ModalEditTable from "./Component/ModalEditTable";
import ModalDeleteTable from "./Component/ModalDeleteTable";
import DeleteModal from "../../ComponentReuseable/DeleteModal";
import { isEditable } from "@testing-library/user-event/dist/utils";

import { getLimitTableDCIM } from "../../ComponentReuseable/Functions";

import LoadingData from "../../ComponentReuseable/LoadingData";

const limittable = 5;
const requestInterval = 5000;

const getStatusColor = (status) => {
    switch (status) {
        case "running":
            return "#59BA56";

        case "idle":
            return "#38B4DF";

        case "hold":
            return "#FFB71B";

        case "stop":
            return "#FA604B";

        default:
            return "#8899AB";
    }
};


const ShopFloor = (props) => {
    const { t } = props;
    const { isShowing: isShowingEditTable, toggle: showingEditTable } =
        useModal();

    const { isShowing: isShowingAddTable, toggle: showingAddTable } =
        useModal();

    const { isShowing: isShowingDeleteTable, toggle: showingDeleteTable } =
        useModal();


        const [statusFilter, setStatusFilter] = useState([
            "running",
            "idle",
            "hold",
            "stop",
            "offline",
        ]);

    const [edittable, setEditTable] = useState(false);
    const [fullmap, setFullmap] = useState(false);
    const [changemap, setChangemap] = useState(false);
    const [deletetable, setDeleteTable] = useState(false);
    const [selecteditemtable, setSelectedItemTable] = useState({
        itemselected: [],
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [isLoadingAsset, setIsLoadingAsset] = useState(false);
    const [isLoadingAssetCount, setIsLoadingAssetCount] = useState(false);
    const [assets, setAssets] = useState([]);
    const [assetStatus, setAssetStatus] = useState([]);
    const [selectedasset, setSelectedAsset] = useState({});

    const [countasset, setCountAsset] = useState({
        CNC: "0",
        EDM: "0",
        GrindingMachine: "0",
        CloseMoldMachine: "0",
        Millingmachine: "0",
        Drillingmachine: "0",
        Markingmachine: "0",
        Crane: "0",
        MoldTurningMachine: "0",
        Measuringmachine: "0",
    });

    const [countrunning, setCountRunning] = useState(0);
    const [countassetall, setCountAssetAll] = useState(0);
    const [lastTagStatus, setlastTagStatus] = useState([]);
    const [listcountasset, setlistcountasset] = useState([]);
    const [listcountrunning, setlistcountrungging] = useState([]);
    const [factory, setFactory] = useState({
        factory: "",
        shopfloor: "",
    });

    const [isLoading, setIsLoading] = useState({
        shopfloorinformation: false,
        factory: false,
        shop_floor: false,
        machine_type: false,
        machine_number: false,
        mapmachine: false,
    });
    const [body, setBodyTable] = useState([]);
    const [realTime, setRealTime] = useState(false);

    const [datenow, setDatenow] = useState(new Date());
    const actions = [
        {
            iconSrc: editiconbaru,
            onClick: (selectedItem, index) => {
                const found = assets.find(
                    (element) => element.asset_number === selectedItem.AssetID
                );

                setSelectedAsset(found);
                showingEditTable();
            },
        },
    ];

    const header = {
        AssetID: {
            width: "110px",
            name: t("content.shop_floor_overview.asset_list.content.AssetID"),
        },
        brand: {
            width: "90px",
            name: t("content.shop_floor_overview.asset_list.content.brand"),
        },
        model: {
            width: "140px",
            name: t("content.shop_floor_overview.asset_list.content.model"),
        },
        machine_no: {
            width: "110px",
            name: t(
                "content.shop_floor_overview.asset_list.content.machine_no"
            ),
        },
        type: {
            width: "120px",
            name: t("content.shop_floor_overview.asset_list.content.type"),
        },
    };

    // const body =
    // [
    //     { no: 1, brand: "0", model: "0", machine_no: "0", type: "0" },
    //     { no: "1", brand: "0", model: "0", machine_no: "0", type: "0" },
    //     { no: "1", brand: "0", model: "0", machine_no: "0", type: "0" }
    // ]
    // new Array(3).fill({}).map((item, index) => {
    //     return { no: "1", brand: "0", model: "0", machine_no: "0", type: "0" };
    // });

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

    const getAssets = async () => {
        const limittable = getLimitTableDCIM();
        setIsLoading((prev) => {
            prev.shopfloorinformation = true;
            return { ...prev };
        });
        // Call JDBC query to get all floors
        let config = {
            method: "post",

            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_GET_ASSET_LIST,
            headers: {
                authorization: getToken(),
            },
            data: { limit: limittable, page: currentPage },
        };

        try {
            const result = await axios(config);

            if (result.status === 200) {
                let { data } = result;

                if (data.count > 0) {
                    let { data: queryData } = data;

                    setAssets(queryData);
                    setFactory((prevState) => {
                        return {
                            factory: queryData[0].floor,
                            shopfloor: queryData[0].room,
                        };
                    });

                    let arraydatatable = [];

                    queryData.map((data, i) => {
                        const datatable = {
                            // no : i+1 ,
                            AssetID: data.asset_number,
                            brand: data.brand,
                            model: data.model_number,
                            machine_no: data.asset_name,
                            type: data.function,
                        };
                        arraydatatable.push(datatable);
                    });

                    setBodyTable(arraydatatable);
                    setIsLoading((prev) => {
                        prev.shopfloorinformation = false;
                        return { ...prev };
                    });
                } else {
                    setIsLoading((prev) => {
                        prev.shopfloorinformation = false;
                        return { ...prev };
                    });
                    setAssets([]);
                }
            } else {
                setIsLoading((prev) => {
                    prev.shopfloorinformation = false;
                    return { ...prev };
                });
                toast.error(
                    t(
                        "content.shop_floor_overview.error.ErrorcallingAPItogetassetsdatashopfloor"
                    ),
                    {
                        toastId: "AF_error-get-asset_S_400",
                    }
                );
            }
        } catch (e) {
            setIsLoading((prev) => {
                prev.shopfloorinformation = false;
                return { ...prev };
            });
            // //////////console.log(e.message);
            toast.error(
                t(
                    "content.shop_floor_overview.error.ErrorcallingAPItogetassetsdatashopfloor"
                ),
                {
                    toastId: "AF_error-get-asset_API",
                }
            );
        }
    };

    useEffect(() => {
        getAssets(currentPage);
        // (async () => {
        //     setIsLoadingAsset(true);
        //     await getAssets();
        //     setIsLoadingAsset(false);
        // })();
    }, [currentPage]);

    const handleDeleteAsset = async (asset_id) => {
        // setIsLoading(true);
        await deleteAsset(asset_id);
        await getAssets(currentPage);
        await getAssetsCount();
        await getAssetsCountrunning();
        setCurrentPage(1);
    };

    const deleteAsset = async (
        asset_id_list,
        asset_image,
        asset_data_sheet,
        asset_name,
        asset_number
    ) => {
        // API to delete asset_image
        // await deleteFile(asset_image);
        // // API to delete data_sheet
        // if (asset_data_sheet.length > 0) {
        //     asset_data_sheet.forEach(async (data) => {
        //         data = data.split("/").slice(-2).join("/");
        //         await deleteFile(data);
        //     });
        // }

        var asset_string_list = "";

        asset_id_list.forEach((element, i) => {
            if (i === asset_id_list.length - 1) {
                asset_string_list =
                    asset_string_list + assets[element].asset_id.toString();
            } else {
                asset_string_list =
                    asset_string_list +
                    assets[element].asset_id.toString() +
                    ",";
            }
        });

        // API to delete record in assets

        const config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env.REACT_APP_ASSET_DELETE_ASSET,
            headers: {
                authorization: getToken(),
            },
            data: {
                asset_id: asset_string_list,
            },
        };

        try {
            const result = await axios(config);
            ////////console.log("result delete");
            ////////console.log(result);

            if (result.status === 200) {
                toast.success(
                    t("content.shop_floor_overview.error.Succesdeletingasset")
                );
            } else {
                toast.error(
                    t("content.shop_floor_overview.error.Errordeletingasset"),
                    {
                        toastId: "AI_error-del-asset_S_400",
                    }
                );
            }
        } catch (e) {
            // ////////console.log(e.message);
            toast.error(
                t("content.shop_floor_overview.error.Errordeletingasset"),
                {
                    toastId: "AI_error-del-asset_API",
                }
            );
        }
    };

    const deleteFile = async (file_path) => {
        const config = {
            method: "delete",
            url:
                ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                process.env.REACT_APP_IMAGE_UPLOAD,
            headers: {
                authorization: getToken(),
            },
            data: {
                path: file_path,
            },
        };

        try {
            const result = await axios(config);
            if (result.status === 200) {
            } else {
                toast.error(
                    t("content.shop_floor_overview.error.Errordeletingfile"),
                    {
                        toastId: "AI_error-del-file_S_400",
                    }
                );
            }
        } catch (e) {
            // ////////console.log(e.message);
            toast.error(
                t(
                    "content.shop_floor_overview.error.ErrorcallingAPItodeletefile"
                ),
                { toastId: "AI_error-del-file_API" }
            );
        }
    };

    const getAssetsCount = async () => {
        const limittable = getLimitTableDCIM();
        setIsLoading((prev) => {
            prev.shopfloorinformation = true;
            return { ...prev };
        });
        // Call JDBC query to get all floors
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_GET_ASSET_COUNT,
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

                    let countforall = 0;
                    queryData.map((data, i) => {
                        countforall = countforall + parseInt(data.count);
                    });

                    setlistcountasset(queryData);

                    setCountAssetAll(countforall);
                    setTotalPage(Math.ceil(countforall / limittable));

                    setIsLoading((prev) => {
                        prev.shopfloorinformation = false;
                        return { ...prev };
                    });
                    // setAssets(queryData)
                } else {
                    setCountAssetAll(0);
                    setTotalPage(1);

                    setIsLoading((prev) => {
                        prev.shopfloorinformation = false;
                        return { ...prev };
                    });
                    // setAssets([])
                    // setFilterOptions((prevState) => {
                    //     return {
                    //         ...prevState,
                    //         floors: [],
                    //     };
                    // });
                }
            } else {
                setCountAssetAll(0);
                setTotalPage(1);

                setIsLoading((prev) => {
                    prev.shopfloorinformation = false;
                    return { ...prev };
                });

                toast.error(
                    t(
                        "content.shop_floor_overview.error.Errorgettingcountdata"
                    ),
                    {
                        toastId: "AF_error-get-floor_S_400",
                    }
                );
            }
        } catch (e) {
            setCountAssetAll(0);
            setTotalPage(1);

            setIsLoading((prev) => {
                prev.shopfloorinformation = false;
                return { ...prev };
            });
            // //////////console.log(e.message);
            toast.error(
                t("content.shop_floor_overview.error.Errorgettingcountdata"),
                {
                    toastId: "AF_error-get-floor_API",
                }
            );
        }
    };
    useEffect(() => {
        // Internal functions

        getAssetsCount();
        // (async () => {
        //     setIsLoadingAssetCount(true);
        //     await getAssetsCount();
        //     setIsLoadingAssetCount(false);
        // })();
    }, []);

    const getAssetsStatus = async () => {
        setIsLoading((prev) => {
            prev.mapmachine = true;
            return { ...prev };
        });

        setAssetStatus([]);
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_GET_STATUS_ASSET,
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
                    //console.log("queryData getAssetsStatus");

                    //console.log(queryData);

                    setAssetStatus(queryData);
                    setChangemap(true);
                    setDatenow(new Date());
                    setRealTime(true);
                    setIsLoading((prev) => {
                        prev.mapmachine = false;
                        return { ...prev };
                    });
                } else {
                    setIsLoading((prev) => {
                        prev.mapmachine = false;
                        return { ...prev };
                    });
                }
            } else {
                setIsLoading((prev) => {
                    prev.mapmachine = false;
                    return { ...prev };
                });
            }
        } catch (e) {
            setIsLoading((prev) => {
                prev.mapmachine = false;
                return { ...prev };
            });
            // //////////console.log(e.message);
            // toast.error(
            //     t("content.shop_floor_overview.error.Errorgettingcountdata"),
            //     {
            //         toastId: "AF_error-get-floor_API",
            //     }
            // );
        }
    };
    const getAssetsCountrunning = async () => {
        // setIsLoading((prev) => {
        //     prev.shopfloorinformation = true;
        //     return { ...prev };
        // });
        // Call JDBC query to get all floors
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_GET_ASSET_COUNT_RUNNING,
            headers: {
                authorization: getToken(),
            },
        };

        try {
            const result = await axios(config);
            // ////////console.log("result count REACT_APP_GET_ASSET_COUNT_RUNNING");
            // ////////console.log(result);

            if (result.status === 200) {
                let { data } = result;

                if (data.count > 0) {
                    let { data: queryData } = data;
                    //////////console.log("queryData count");
                    //////////console.log(queryData);

                    var countrunning = 0;

                    queryData.map((data, i) => {
                        countrunning = countrunning + parseInt(data.count);
                    });

                    setlistcountrungging(queryData);
                    setCountRunning(countrunning);

                    // setAssets(queryData)
                } else {
                    setIsLoading((prev) => {
                        prev.shopfloorinformation = false;
                        return { ...prev };
                    });
                    // setAssets([])
                    // setFilterOptions((prevState) => {
                    //     return {
                    //         ...prevState,
                    //         floors: [],
                    //     };
                    // });
                }
            } else {
                setIsLoading((prev) => {
                    prev.shopfloorinformation = false;
                    return { ...prev };
                });
                toast.error(
                    t(
                        "content.shop_floor_overview.error.Errorgettingcountdata"
                    ),
                    {
                        toastId: "AF_error-get-floor_S_400",
                    }
                );
            }
        } catch (e) {
            setIsLoading((prev) => {
                prev.shopfloorinformation = false;
                return { ...prev };
            });
            // //////////console.log(e.message);
            toast.error(
                t("content.shop_floor_overview.error.Errorgettingcountdata"),
                {
                    toastId: "AF_error-get-floor_API",
                }
            );
        }
    };
    useEffect(() => {
        getAssetsCountrunning();
    }, []);

    useEffect(() => {
        getAssetsStatus();
    }, []);

    useEffect(() => {
        let interval = null;

        if (realTime) {
            const getLatestChart = async () => {
                // const loadingTimeout = setTimeout(() => {
                //     setLoading((prev) => {
                //         prev.chartLatest = true;

                //         prev.infoLatest = true;
                //         return { ...prev };
                //     });
                // }, 10000);

                const config = {
                    method: "post",
                    url:
                        ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                        process.env.REACT_APP_GET_LATEST_STATUS_ASSET,
                    headers: {
                        authorization: getToken(),
                    },
                };

                axios(config)
                    .then((response) => {
                        if (response.data.length > 0) {
                            // let dummyserieslinebar =   seriestrendseriesline

                            //console.log("response.data[0]")
                            //console.log(response.data)

                            setlastTagStatus(response.data);
                        }
                        // clearTimeout(loadingTimeout);
                        // setTimeout(() => {
                        //     setLoading((prev) => ({
                        //         ...prev,
                        //         chartLatest: false,
                        //         infoLatest: false,
                        //     }));
                        // }, 500);
                    })
                    .catch((err) => {
                        ////////////console.log(err);
                        // clearTimeout(loadingTimeout);
                        // setTimeout(() => {
                        //     setLoading((prev) => ({
                        //         ...prev,
                        //         chartLatest: false,
                        //         infoLatest: false,
                        //     }));
                        // }, 500);

                        toast.error(
                            t(
                                "content.shop_floor_overview.error.Failedtogetrealtimedata"
                            ),
                            {
                                toastId: "error",
                            }
                        );
                    });
            };

            const fetchData = async () => {
                try {
                    await getLatestChart();
                } catch (error) {
                    // ////////////console.log(error);
                }

                if (interval) {
                    interval = setTimeout(fetchData, requestInterval);
                }
            };

            interval = setTimeout(fetchData, 1);
        }
        return () => {
            if (interval !== null) {
                clearTimeout(interval);
                interval = null;
            }
        };
    }, [realTime]);
    return (
        <div className='shop-floor-container'>
            <LoadingData
                isLoading={isLoading.shopfloorinformation}
                useAltBackground={false}
                size={"250px"}
            />
            {/* 
            {
                !fullmap && ( */}
            <div
                className={
                    fullmap
                        ? "left-side-content-widht-change"
                        : "left-side-content"
                }>
                <div className='shop-floor-information'>
                    <div className='shop-floor-header'>
                        <div className='title'>
                            {t(
                                "content.shop_floor_overview.shop_floor_information.header.shop_floor_information"
                            )}
                        </div>
                    </div>
                    <div className='shop-floor-content'>
                        <div
                            className='data-detail'
                            style={{ marginBottom: "30px" }}>
                            <p>
                                {t(
                                    "content.shop_floor_overview.shop_floor_information.content.factory"
                                ) + ":"}
                            </p>
                            <span className='data-value'>
                                {factory.factory}
                            </span>
                        </div>

                        <div className='data-detail'>
                            <p>
                                {t(
                                    "content.shop_floor_overview.shop_floor_information.content.shopfloor"
                                ) + ":"}
                            </p>
                            <span className='data-value'>
                                {factory.shopfloor}
                            </span>
                        </div>
                        <div className='data-detail'>
                            <p>
                                {" "}
                                {t(
                                    "content.shop_floor_overview.shop_floor_information.content.totalasset"
                                ) + ":"}
                            </p>
                            <span className='data-value'>{countassetall}</span>
                        </div>
                        <div className='data-detail' style={{ opacity: "0" }}>
                            <p>
                                {" "}
                                {t(
                                    "content.shop_floor_overview.shop_floor_information.content.cnc"
                                ) + ":"}
                            </p>
                            <span className='data-value'></span>
                        </div>

                        {listcountasset.map((data, i) => (
                            <div key={i} className='data-detail'>
                                <p>
                                    {/* {" "}
                                {t(
                                    "content.shop_floor_overview.shop_floor_information.content.cnc"
                                ) + ":"} */}
                                    {data.function}
                                </p>
                                <span className='data-value'>{data.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='asset-list'>
                    <div className='asset-list-header'>
                        <div className='title'>
                            {" "}
                            {t(
                                "content.shop_floor_overview.asset_list.header.asset_list"
                            )}
                        </div>
                        <div className='add-delete-button'>
                            <div
                                onClick={() => {
                                    showingAddTable();
                                }}
                                className='button'>
                                <AddIcon />
                            </div>

                            <div
                                style={{
                                    display: !edittable ? "flex" : "none",
                                }}
                                onClick={() => {
                                    setEditTable(true);
                                }}
                                className='button'>
                                <EditIcon />
                            </div>

                            <div
                                style={{
                                    display: !edittable ? "none" : "flex",
                                    border: "none",
                                }}
                                onClick={() => {
                                    setEditTable(false);
                                }}
                                className='button'>
                                <ReverseEditIcon />
                            </div>
                            <div
                                style={{
                                    display: !edittable ? "none" : "flex",
                                    opacity:
                                        selecteditemtable.itemselected.length >
                                        0
                                            ? "1"
                                            : "0.5",
                                }}
                                onClick={
                                    selecteditemtable.itemselected.length > 0
                                        ? () => {
                                              setDeleteTable(true);
                                              showingDeleteTable();
                                          }
                                        : () => {}
                                }
                                className='button'>
                                <DeleteIcon />
                            </div>
                        </div>
                    </div>
                    <div className='asset-list-content'>
                        <div className='content-table'>
                            <div className='table'>
                                <Table
                                    header={header}
                                    body={body}
                                    actions={edittable ? actions : []}
                                    actionWidth='30px'
                                    selectable={true}
                                    onSelect={(selectedItem, index) => {}}
                                    customCellClassNames={[]}
                                    checkable={edittable}
                                    onChecked={(selectedItem, index) => {
                                        setSelectedItemTable((prevState) => {
                                            return {
                                                itemselected: selectedItem,
                                            };
                                        });
                                    }}
                                />
                                <ModalAddTable
                                    isShowing={isShowingAddTable}
                                    hide={showingAddTable}
                                    t={t}
                                    onSubmit={async () => {
                                        // setIsLoading(true);
                                        await getAssets(currentPage);
                                        await getAssetsCount();
                                        await getAssetsCountrunning();
                                        // setIsLoading(false);
                                    }}
                                />

                                <ModalEditTable
                                    selectedAsset={selectedasset}
                                    isShowing={isShowingEditTable}
                                    hide={showingEditTable}
                                    t={t}
                                    onSubmit={async () => {
                                        // setIsLoading(true);
                                        await getAssets(currentPage);
                                        await getAssetsCount();
                                        await getAssetsCountrunning();
                                        // setIsLoading(false);
                                    }}
                                />

                                <DeleteModal
                                    isShowing={isShowingDeleteTable}
                                    hide={showingDeleteTable}
                                    t={t}
                                    onDelete={() => {
                                        handleDeleteAsset(
                                            selecteditemtable.itemselected
                                        );
                                        showingDeleteTable();
                                    }}
                                />
                            </div>
                            <div className='pagination'>
                                <PaginationStyle2
                                    firstPage={firstPage}
                                    lastPage={lastPage}
                                    nextPage={nextPage}
                                    prevPage={prevPage}
                                    currentPageNumber={currentPage}
                                    lastPageNumber={totalPage}
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
                </div>
            </div>

            {/* )
            } */}

            <div className='right-side-content-with-button'>
                <div
                    onClick={() => {
                        setFullmap(!fullmap);
                    }}
                    className='button-right-side'>
                    {fullmap ? <RightButton /> : <LeftButton />}
                </div>
                <div id='right-side-content' className='right-side-content'>
                    <div className='running_machine_and_legend'>
                        <div className='running-machine'>
                            <div className='shop-floor-header'>
                                <div className='title'>
                                    {t(
                                        "content.shop_floor_overview.shop_floor_information.content.RunningMachine"
                                    )}
                                </div>
                            </div>
                            <div className='shop-floor-content'>
                                <div className='data-detail'>
                                    <p>
                                        {" "}
                                        {t(
                                            "content.shop_floor_overview.shop_floor_information.content.totalasset"
                                        ) + ":"}
                                    </p>
                                    <span className='data-value'>
                                        {countrunning}
                                    </span>
                                </div>
                                <div
                                    className='data-detail'
                                    style={{ opacity: "0" }}>
                                    <p>
                                        {" "}
                                        {t(
                                            "content.shop_floor_overview.shop_floor_information.content.cnc"
                                        ) + ":"}
                                    </p>
                                    <span className='data-value'></span>
                                </div>

                                {listcountrunning.map((data, i) => (
                                    <div key={i} className='data-detail'>
                                        <p>
                                            {/* {" "}
                                            {t(
                                                "content.shop_floor_overview.shop_floor_information.content.cnc"
                                            ) + ":"} */}
                                            {data.function}
                                        </p>
                                        <span className='data-value'>
                                            {data.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="legend-running-machine">

                         

                                {
                                    statusFilter.map((data,i)=>

                                        <div className="row_legend_machine-machine">
                                        <div className="triangle-down" style={{borderTopColor:getStatusColor(data)}}>

                                        </div>
        
                                        <div className="text_legend_running_machine" >
                                          {t(
                                        "content.machine_utilization.status." +
                                            data
                                              )}
                                        </div>
                                        </div>
                                    )
                                }

                           

                           

                        </div>
                    </div>

                    <div id='render-map-3d' className='render-map-3d'>
                        <LoadingData
                            isLoading={isLoading.mapmachine}
                            useAltBackground={false}
                            size={"250px"}
                        />
                        {changemap && (
                            <Renderall3d
                                fullmap={fullmap}
                                changemap={changemap}
                                assetstatus={assetStatus}
                                lastTagStatus={lastTagStatus}
                                datenow={datenow}
                                t={t}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopFloor;
