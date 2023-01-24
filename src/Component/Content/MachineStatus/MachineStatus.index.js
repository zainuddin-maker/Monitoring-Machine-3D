import { useState, useEffect } from "react";
import {
    SearchBar,
    InputDropdownHorizontal,
    PaginationStyle2,
    LoadingData,
} from "../../ComponentReuseable/index";
import { ReactComponent as StatusIcon } from "../../../svg/status.svg";
import { toast } from "react-toastify";
import axios from "axios";
import { ReturnHostBackend } from "../../ComponentReuseable/BackendHost";
import { getToken } from "../../ComponentReuseable/TokenParse";
import "./style.scss";
import MachineOverviewCard from "./Component/MachineOverviewCard";

const MachineStatus = (props) => {
    const { t, setSelectedAsset } = props;

    const getLimit = () => {
        if (typeof window !== undefined) {
            let content = document.getElementById("content");
            let width = content.clientWidth;
            let height = content.clientHeight;
            let dataLimit = Math.floor(width / 447) * Math.floor(height / 239);

            setLimit(dataLimit < 0 ? 0 : dataLimit);
        }
    };

    const [filter, setFilter] = useState({
        factory: "",
        shop_floor: "",
        machine_type: "",
        machine_model: "",
        machine_number: "",
    });

    const [isLoading, setIsLoading] = useState({
        data: false,
        factory: false,
        shop_floor: false,
        machine_type: false,
        machine_model: false,
        machine_number: false,
    });
    const [isRefresh, setIsRefresh] = useState(false);
    const [factory, setFactory] = useState([]);
    const [shopFloor, setShopFloor] = useState([]);
    const [machineType, setMachineType] = useState([]);
    const [machineModel, setMachineModel] = useState([]);
    const [machineNumber, setMachineNumber] = useState([]);
    const [limit, setLimit] = useState("");

    const [statusFilter, setStatusFilter] = useState([
        "running",
        "idle",
        "hold",
        "stop",
        "offline",
    ]);

    const [status, setStatus] = useState({
        running: true,
        idle: true,
        hold: true,
        stop: true,
        offline: true,
    });
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [assetList, setAssetList] = useState({
        count: 0,
        countRunning: 0,
        countIdle: 0,
        countHold: 0,
        countStop: 0,
        countOffline: 0,
        list: [],
    });

    const handleChangeSearch = (value) => {
        setSearch(value);
    };

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

    const getFactoryDropdown = async () => {
        setIsLoading((prev) => {
            prev.factory = true;
            return { ...prev };
        });
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_FILTER_GET_FACTRORY_DROPDOWN,
            headers: {
                authorization: getToken(),
            },
        };
        try {
            const result = await axios(config);
            if (result.data.data.length > 0) {
                setFactory(result.data.data);
            } else {
                setFactory([]);
            }
            setIsLoading((prev) => {
                prev.factory = false;
                return { ...prev };
            });
        } catch (e) {
            toast.error(t("toast.failed_to_get_factory_data"), {
                toastId: "failed-machine-status-get-factory-data",
            });
            setIsLoading((prev) => {
                prev.factory = false;
                return { ...prev };
            });
        }
    };

    const getShopFloorDropdown = async () => {
        setIsLoading((prev) => {
            prev.shop_floor = true;
            return { ...prev };
        });
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_FILTER_GET_SHOP_FLOOR_DROPDOWN,
            headers: {
                authorization: getToken(),
            },
            data: {
                factory_name: filter.factory,
            },
        };
        try {
            const result = await axios(config);
            if (result.data.data.length > 0) {
                setShopFloor(result.data.data);
            } else {
                setShopFloor([]);
            }
            setIsLoading((prev) => {
                prev.shop_floor = false;
                return { ...prev };
            });
        } catch (e) {
            // console.error(e);
            toast.error(t("toast.failed_to_get_shop_floor_data"), {
                toastId: "failed-machine-status-get-shop-floor-data",
            });
            setIsLoading((prev) => {
                prev.shop_floor = false;
                return { ...prev };
            });
        }
    };

    const getMachineTypeDropdown = async () => {
        setIsLoading((prev) => {
            prev.machine_type = true;
            return { ...prev };
        });
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_FILTER_GET_MACHINE_TYPE_DROPDOWN,
            headers: {
                authorization: getToken(),
            },
            data: {
                shop_floor: filter.shop_floor,
            },
        };
        try {
            const result = await axios(config);
            if (result.data.data.length > 0) {
                setMachineType(result.data.data);
            } else {
                setMachineType([]);
            }
            setIsLoading((prev) => {
                prev.machine_type = false;
                return { ...prev };
            });
        } catch (e) {
            // console.error(e);
            toast.error(t("toast.failed_to_get_machine_type_data"), {
                toastId: "failed-machine-status-get-machine-type-data",
            });
            setIsLoading((prev) => {
                prev.machine_type = false;
                return { ...prev };
            });
        }
    };

    const getMachineModelDropdown = async () => {
        setIsLoading((prev) => {
            prev.machine_model = true;
            return { ...prev };
        });
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_FILTER_GET_MACHINE_MODEL_DROPDOWN,
            headers: {
                authorization: getToken(),
            },
            data: {
                machine_type: filter.machine_type,
            },
        };
        try {
            const result = await axios(config);
            if (result.data.data.length > 0) {
                setMachineModel(result.data.data);
            } else {
                setMachineModel([]);
            }
            setIsLoading((prev) => {
                prev.machine_model = false;
                return { ...prev };
            });
        } catch (e) {
            // console.error(e);
            toast.error(t("toast.failed_to_get_machine_model_data"), {
                toastId: "failed-machine-status-get-machine-model-data",
            });
            setIsLoading((prev) => {
                prev.machine_model = false;
                return { ...prev };
            });
        }
    };

    const getAssetList = async (isRealtime) => {
        let loadingTimeout;
        if (isRealtime) {
            loadingTimeout = setTimeout(() => {
                setIsLoading((prev) => {
                    prev.data = true;
                    return { ...prev };
                });
            }, 10000);
        } else {
            setIsLoading((prev) => {
                prev.data = true;
                return { ...prev };
            });
            setIsRefresh(false);
        }

        const data = new FormData();
        data.append("search", search);
        data.append("factory", filter.factory);
        data.append("shop_floor", filter.shop_floor);
        data.append("machine_type", filter.machine_type);
        data.append("machine_model", filter.machine_model);
        data.append("status", JSON.stringify(statusFilter));
        data.append("limit", limit);
        data.append("page", currentPage);

        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env.REACT_APP_MACHINE_STATUS_OVERVIEW_GET_ASSET_LIST,
            headers: {
                authorization: getToken(),
            },
            data: data,
        };
        try {
            const result = await axios(config);
            if (result.data) {
                setAssetList((prev) => {
                    prev.count = result.data.count;
                    prev.countRunning = result.data.countRunning;
                    prev.countIdle = result.data.countIdle;
                    prev.countHold = result.data.countHold;
                    prev.countStop = result.data.countStop;
                    prev.countOffline = result.data.countOffline;
                    prev.list = result.data.list;
                    return { ...prev };
                });
                if (result.data.count < limit) {
                    setCurrentPage(1);
                }
            } else {
                setAssetList((prev) => {
                    prev.count = 0;
                    prev.countRunning = 0;
                    prev.countIdle = 0;
                    prev.countHold = 0;
                    prev.countStop = 0;
                    prev.countOffline = 0;
                    prev.list = [];
                    return { ...prev };
                });
            }
            if (isRealtime) {
                clearTimeout(loadingTimeout);
                setTimeout(() => {
                    setIsLoading((prev) => ({
                        ...prev,
                        data: false,
                    }));
                }, 500);
            } else {
                setTimeout(() => {
                    setIsLoading((prev) => {
                        prev.data = false;
                        return { ...prev };
                    });
                    setIsRefresh(true);
                }, 1000);
            }
        } catch (e) {
            // console.error(e);
            toast.error(t("toast.failed_to_get_machine_list"), {
                toastId: "failed-get-machine-list",
            });
            if (!isRefresh) {
                setIsLoading((prev) => {
                    prev.data = false;
                    return { ...prev };
                });
            } else {
                clearTimeout(loadingTimeout);
                setTimeout(() => {
                    setIsLoading((prev) => ({
                        ...prev,
                        data: false,
                    }));
                }, 500);
            }
            setIsRefresh(false);
        }
    };

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

    useEffect(() => {
        getFactoryDropdown();
        getLimit();
    }, []);

    useEffect(() => {
        window.addEventListener("resize", getLimit);
        getLimit();
        return () => window.removeEventListener("resize", getLimit);
    }, []);

    useEffect(() => {
        getShopFloorDropdown();
    }, [filter.factory]);

    useEffect(() => {
        getMachineTypeDropdown();
    }, [filter.shop_floor]);

    useEffect(() => {
        getMachineModelDropdown();
    }, [filter.machine_type]);

    // useEffect(() => {
    //     getMachineNumberDropdown();
    // }, [filter.machine_type, filter.shop_floor]);

    useEffect(async () => {
        if (limit !== "") {
            await getAssetList();
        }
    }, [filter, search, currentPage, limit, statusFilter, status]);

    useEffect(() => {
        let interval = null;
        if (assetList.list.length > 0 && isRefresh) {
            const fetchData = async () => {
                try {
                    await getAssetList(true);
                } catch (error) {
                    // ////console.log(error);
                }

                if (interval) {
                    interval = setTimeout(fetchData, 5000);
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
    }, [assetList, isRefresh]);

    useEffect(() => {
        if (assetList.list.length > 0) {
            setTotalPage(
                Math.ceil(assetList.list[0].total_data / limit) == 0
                    ? 1
                    : Math.ceil(assetList.list[0].total_data / limit)
            );
            if (Math.ceil(assetList.list[0].total_data / limit) < currentPage) {
                setCurrentPage(1);
            }
        } else {
            setTotalPage(1);
            setCurrentPage(1);
        }
    }, [assetList, currentPage]);

    return (
        <div className='machine-status-container'>
            <div className='machine-status-filter'>
                <SearchBar
                    name='search'
                    label={t("content.filter.search")}
                    inputWidth='200px'
                    value={search}
                    search={handleChangeSearch}
                    searchContent={() => getAssetList(search)}
                    placeholder={t("content.filter.search")}
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='factory'
                    label={t("content.filter.factory")}
                    value={filter.factory}
                    onSelect={(e) => {
                        setFilter((prev) => {
                            prev.factory = e.value;
                            return { ...prev };
                        });
                        if (e.value === "") {
                            setFilter((prev) => {
                                prev.shop_floor = "";
                                prev.machine_type = "";
                                prev.machine_model = "";
                                return { ...prev };
                            });
                        }
                    }}
                    options={factory}
                    isLoading={isLoading.factory}
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='shop_floor'
                    label={t("content.filter.shop_floor")}
                    value={filter.shop_floor}
                    onSelect={(e) => {
                        setFilter((prev) => {
                            prev.shop_floor = e.value;
                            return { ...prev };
                        });
                        if (e.value === "") {
                            setFilter((prev) => {
                                prev.machine_type = "";
                                prev.machine_model = "";
                                return { ...prev };
                            });
                        }
                    }}
                    options={shopFloor}
                    isDisabled={filter.factory === ""}
                    isLoading={isLoading.shop_floor}
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_type'
                    label={t("content.filter.machine_type")}
                    value={filter.machine_type}
                    onSelect={(e) => {
                        setFilter((prev) => {
                            prev.machine_type = e.value;
                            return { ...prev };
                        });
                        if (e.value === "") {
                            setFilter((prev) => {
                                prev.machine_model = "";
                                return { ...prev };
                            });
                        }
                    }}
                    options={machineType}
                    isDisabled={filter.shop_floor === ""}
                    isLoading={isLoading.machine_type}
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_model'
                    label={t("content.filter.machine_model")}
                    value={filter.machine_model}
                    onSelect={(e) => {
                        setFilter((prev) => {
                            prev.machine_model = e.value;
                            return { ...prev };
                        });
                    }}
                    options={machineModel}
                    isDisabled={filter.machine_type === ""}
                    isLoading={isLoading.machine_model}
                />
                {/* <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_number'
                    label={t("content.filter.machine_no")}
                    value={filter.machine_number}
                    onSelect={(e) =>
                        setFilter((prev) => {
                            prev.machine_number = e.value;
                            return { ...prev };
                        })
                    }
                    options={machineNumber}
                    isLoading={isLoading.machine_number}
                    isDisabled={filter.machine_type === ""}
                /> */}
            </div>
            <div className='machine-status-status'>
                <div
                    className='status-total'
                    name='status'
                    onClick={() => {
                        if (statusFilter.length >= 5) {
                            setStatusFilter([]);
                            setStatus((prev) => {
                                prev.running = false;
                                prev.idle = false;
                                prev.hold = false;
                                prev.stop = false;
                                prev.offline = false;
                                return { ...prev };
                            });
                        } else {
                            setStatusFilter([
                                "running",
                                "idle",
                                "hold",
                                "stop",
                                "offline",
                            ]);
                            setStatus((prev) => {
                                prev.running = true;
                                prev.idle = true;
                                prev.hold = true;
                                prev.stop = true;
                                prev.offline = true;
                                return { ...prev };
                            });
                        }
                    }}>
                    <StatusIcon
                        style={
                            statusFilter.length >= 5 ? { fill: "#0A3863" } : {}
                        }
                    />
                    <span>
                        <p>
                            {t("content.machine_status_overview.status.total") +
                                " :"}
                        </p>
                        <p>{assetList.count}</p>
                    </span>
                </div>
                <div className='all-status'>
                    <div
                        className='status'
                        onClick={() => {
                            let status = statusFilter;
                            let indexof = statusFilter.indexOf("running");
                            if (
                                statusFilter.find(
                                    (stats) => stats === "running"
                                )
                            ) {
                                status.splice(indexof, 1);
                                setStatus((prev) => {
                                    prev.running = false;
                                    return { ...prev };
                                });
                            } else {
                                status.push("running");
                                setStatus((prev) => {
                                    prev.running = true;
                                    return { ...prev };
                                });
                            }

                            setStatusFilter(status);
                        }}>
                        <StatusIcon
                            style={
                                status.running
                                    ? { fill: getStatusColor("running") }
                                    : {}
                            }
                        />
                        <span>
                            <p>
                                {t(
                                    "content.machine_status_overview.status.running"
                                ) + ":"}
                            </p>
                            <p>{assetList.countRunning}</p>
                        </span>
                    </div>
                    <div
                        className='status'
                        onClick={() => {
                            let status = statusFilter;
                            let indexof = statusFilter.indexOf("idle");
                            if (
                                statusFilter.find((stats) => stats === "idle")
                            ) {
                                status.splice(indexof, 1);
                                setStatus((prev) => {
                                    prev.idle = false;
                                    return { ...prev };
                                });
                            } else {
                                status.push("idle");
                                setStatus((prev) => {
                                    prev.idle = true;
                                    return { ...prev };
                                });
                            }
                            setStatusFilter(status);
                        }}>
                        <StatusIcon
                            style={
                                status.idle
                                    ? { fill: getStatusColor("idle") }
                                    : {}
                            }
                        />
                        <span>
                            <p>
                                {t(
                                    "content.machine_status_overview.status.idle"
                                ) + ":"}
                            </p>
                            <p>{assetList.countIdle}</p>
                        </span>
                    </div>
                    <div
                        className='status'
                        onClick={() => {
                            let status = statusFilter;
                            let indexof = status.indexOf("hold");
                            if (indexof !== -1) {
                                status.splice(indexof, 1);
                                setStatus((prev) => {
                                    prev.hold = false;
                                    return { ...prev };
                                });
                            } else {
                                status.push("hold");
                                setStatus((prev) => {
                                    prev.hold = true;
                                    return { ...prev };
                                });
                            }
                            setStatusFilter(status);
                        }}>
                        <StatusIcon
                            style={
                                status.hold
                                    ? { fill: getStatusColor("hold") }
                                    : {}
                            }
                        />
                        <span>
                            <p>
                                {t(
                                    "content.machine_status_overview.status.hold"
                                ) + ":"}
                            </p>
                            <p>{assetList.countHold}</p>
                        </span>
                    </div>
                    <div
                        className='status'
                        onClick={() => {
                            let status = statusFilter;
                            let indexof = status.indexOf("stop");
                            if (indexof !== -1) {
                                status.splice(indexof, 1);
                                setStatus((prev) => {
                                    prev.stop = false;
                                    return { ...prev };
                                });
                            } else {
                                status.push("stop");
                                setStatus((prev) => {
                                    prev.stop = true;
                                    return { ...prev };
                                });
                            }
                            setStatusFilter(status);
                        }}>
                        <StatusIcon
                            style={
                                status.stop
                                    ? { fill: getStatusColor("stop") }
                                    : {}
                            }
                        />
                        <span>
                            <p>
                                {t(
                                    "content.machine_status_overview.status.stop"
                                ) + ":"}
                            </p>
                            <p>{assetList.countStop}</p>
                        </span>
                    </div>
                    <div
                        className='status'
                        onClick={() => {
                            let status = statusFilter;
                            let indexof = status.indexOf("offline");
                            if (indexof !== -1) {
                                status.splice(indexof, 1);
                                setStatus((prev) => {
                                    prev.offline = false;
                                    return { ...prev };
                                });
                            } else {
                                status.push("offline");
                                setStatus((prev) => {
                                    prev.offline = true;
                                    return { ...prev };
                                });
                            }
                            setStatusFilter(status);
                        }}>
                        <StatusIcon
                            style={
                                status.offline
                                    ? { fill: getStatusColor("offline") }
                                    : {}
                            }
                        />
                        <span>
                            <p>
                                {t(
                                    "content.machine_status_overview.status.offline"
                                ) + ":"}
                            </p>
                            <p>{assetList.countOffline}</p>
                        </span>
                    </div>
                </div>
            </div>
            <div className='machine-status-content' id='content'>
                <LoadingData
                    isLoading={isLoading.data}
                    useAltBackground={false}
                    size={"250px"}
                />
                {assetList.list.map((asset, i) => (
                    <MachineOverviewCard
                        key={i}
                        t={t}
                        data={asset}
                        setSelectedAsset={setSelectedAsset}
                    />
                ))}
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
                        if (e.target.value !== "" && e.target.value !== "0") {
                            setCurrentPage(parseInt(e.target.value));
                        } else {
                            setCurrentPage(currentPage);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default MachineStatus;
