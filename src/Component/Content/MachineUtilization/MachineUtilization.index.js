import "./style.scss";
import {
    InputDropdownHorizontal,
    PaginationStyle2,
    InputDateHorizontal,
    ExportButton,
    UploadImage,
    SearchBar,
    InputTextHorizontal,
} from "../../ComponentReuseable/index";
import { ReactComponent as Spindle2D } from "../../../svg/spindle-2d.svg";
import Card from "./Component/Card";
import { ReactComponent as ChartType1 } from "../../../svg/chart-type-1.svg";
import { ReactComponent as ChartType2 } from "../../../svg/chart-type-2.svg";
import DefaultAssetImage from "../../../svg/default-asset-image.svg";
import { useState, useEffect } from "react";
import { ReactComponent as StatusIcon } from "../../../svg/status.svg";
import ReactApexChart from "react-apexcharts";
import { ReturnHostBackend } from "../../ComponentReuseable/BackendHost";
import { getToken } from "../../ComponentReuseable/TokenParse";
import axios from "axios";
import { toast } from "react-toastify";
import ChartComponent from "./Component/ChartComponent";
import Tooltip from "../../ComponentReuseable/Tooltip";
import LoadingData from "../../ComponentReuseable/LoadingData";
import { exportCSVFile } from "../../ComponentReuseable/ExportFunction";

const factoryDummy = ["Factory 1", "Factory 2"];
const shopFloorDummy = ["Shoop Floor 1", "Shoop Floor 2"];
const typeDummy = ["Type 1", "Type 2"];
const machineNoDummy = ["Machine No 1", "Machine No 2"];
const parameterDummy = ["Parameter 1", "Parameter 2"];

const statusDummy = [
    {
        status: "running",
        total: 10,
    },
    {
        status: "idle",
        total: 2,
    },
    {
        status: "hold",
        total: 10,
    },
    {
        status: "stop",
        total: 10,
    },
    {
        status: "down",
        total: 10,
    },
];

const datadummy = [{}, {}, {}, {}];

const chartTypedummy = [1, 1, 1, 1];

const chartTypedummydummy = [
    {
        data: [1, 1, 1, 1],
    },
];

const generateDateGMT8 = (date) => {
    const dateInput = date;
    dateInput.setTime(
        dateInput.getTime() + dateInput.getTimezoneOffset() * 60 * 1000
    );
    dateInput.setTime(dateInput.getTime() + 8 * 60 * 60 * 1000);
    return dateInput;
};

const formatDate = (dateVal) => {
    var newDate = new Date(dateVal);

    var sMonth = padValue(newDate.getMonth() + 1);
    var sDay = padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    return sYear + "-" + sMonth + "-" + sDay;
};

const padValue = (value) => {
    return value < 10 ? "0" + value : value;
};

const MachineUtilization = (props) => {
    const today = new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
        .toISOString()
        .slice(0, 10);

    const [filter, setFilter] = useState({
        factory: "",
        shop_floor: "",
        machine_type: "",
        machine_number: "",
        machine_model: "",
        start_date: today,
        end_date: today,
        // 2022-03-10"
        date: formatDate(generateDateGMT8(new Date())),
    });

    const [isLoading, setIsLoading] = useState({
        data: false,
        factory: false,
        shop_floor: false,
        machine_type: false,
        machine_number: false,
    });

    const [assetList, setAssetList] = useState({
        count: 0,
        countRunning: 0,
        countIdle: 0,
        countHold: 0,
        countStop: 0,
        countDown: 0,
        list: [],
    });

    const [assetListexport, setAssetListexport] = useState({
        count: 0,
        countRunning: 0,
        countIdle: 0,
        countHold: 0,
        countStop: 0,
        countDown: 0,
        list: [],
    });
    const [factory, setFactory] = useState([]);
    const [shopFloor, setShopFloor] = useState([]);
    const [machineType, setMachineType] = useState([]);
    const [machineModel, setMachineModel] = useState([]);
    const [machineNumber, setMachineNumber] = useState([]);
    const [statusFilter, setStatusFilter] = useState([
        "running",
        "idle",
        "hold",
        "stop",
        "down",
    ]);

    const { t } = props;

    const defaultOption = {
        chart: {
            animations: {
                enabled: false,
            },
            id: "status-condition",
            width: "100%",
            toolbar: {
                show: false,
                // offsetX: -25,
                tools: {
                    download: false,
                    selection: false,
                    zoom: false,
                    reset: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                },
            },
            background: "#08091B",
        },
        grid: {
            show: true,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: "50%",
                rangeBarGroupRows: true,
            },
        },
        colors: [
            (params) => {
                const values = params.seriesIndex;
                const state = params.w.globals.seriesNames[values];
                return state === "UP" || state === "Good"
                    ? "#00A629"
                    : state === "Warning"
                    ? "#FEBC2C"
                    : state === "Critical" || state === "DOWN"
                    ? "#F11B2A"
                    : state === null
                    ? ""
                    : "#51414C";
            },
        ],
        fill: {
            type: "solid",
        },
        yaxis: {
            labels: {
                show: false,
                style: {
                    colors: ["white"],
                    fontSize: "18px",
                    fontWeight: 600,
                },
            },
        },
        xaxis: {
            axisBorder: {
                show: false,
                color: "#c3c3c5",
                offsetX: 922,
                offsetY: -1,
                height: 10,
            },
            type: "datetime",
            // YYYY-MM-DD
            min: new Date(filter.date).setHours(0, 0, 0),
            max: new Date(new Date(filter.date).setHours(23, 59, 59)).getTime(),
            // max: new Date(
            //     new Date(
            //         new Date().setDate(new Date().getDate() + 1)
            //     ).setHours(1, 30, 0)
            // ).getTime(),
            tickAmount: 24,
            tickPlacement: "on",
            labels: {
                show: true,
                style: {
                    colors: ["white"],
                    fontSize: "12px",

                    fontWeight: 500,
                    // cssClass: "apexcharts-xaxis-label",
                },
                datetimeUTC: false,
                format: "HH:mm",
            },
        },
        legend: {
            show: false,
        },
        tooltip: {
            custom: (opts) => {
                const padZero = (number) => {
                    if (number > 9) {
                        return number.toString();
                    } else {
                        return String(number).padStart(2, "0");
                    }
                };
                const start = new Date(opts.y1);
                const finish = new Date(opts.y2);
                const condition = opts.w.globals.seriesNames[opts.seriesIndex];
                return `<div class="chart-tooltip">
                <div>${padZero(start.getHours())}:${padZero(
                    start.getMinutes()
                )}:${padZero(start.getSeconds())} - ${padZero(
                    finish.getHours()
                )}:${padZero(finish.getMinutes())}:${padZero(
                    finish.getSeconds()
                )}</div>
                <div>${condition}</div>
                <div>`;
            },
        },
    };

    const defaultStatusSeries = [
        {
            name: "UP",
            data: [
                {
                    x: "Status",
                    y: [0, 1],
                },
            ],
        },
    ];

    const [statusChart, setStatusChart] = useState({
        changerSeries: defaultStatusSeries,
        series: defaultStatusSeries,
        options: defaultOption,
    });
    const [chartType, setChartType] = useState(chartTypedummydummy);

    const [limit, setLimit] = useState(4);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(12);

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

    const handleChangeSearch = (value) => {
        setSearch(value);
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

    const getFactoryDropdown = async () => {
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_FILTER_GET_FACTRORY_DROPDOWN_MACHINE,
            headers: {
                authorization: getToken(),
            },
        };
        try {
            const result = await axios(config);
            if (result.data) {
                setFactory(result.data.data);
            } else {
                setFactory([]);
            }
        } catch (e) {
            // console.error(e);

            toast.error(
                t("content.shop_floor_overview.error.Failedtogetfactorydata"),
                {
                    toastId: "failed-get-factory-data",
                }
            );
        }
    };

    const getShopFloorDropdown = async () => {
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_FILTER_GET_SHOP_FLOOR_DROPDOWN_MACHINE,
            headers: {
                authorization: getToken(),
            },
            data: {
                factory_name: filter.factory,
            },
        };
        try {
            const result = await axios(config);
            if (result.data) {
                setShopFloor(result.data.data);
            } else {
                setShopFloor([]);
            }
        } catch (e) {
            // console.error(e);

            toast.error(
                t(
                    "content.shop_floor_overview.error.ErrorcallingAPItogetroomsdata"
                ),
                {
                    toastId: "failed-get-shop-floor-data",
                }
            );
        }
    };

    const getMachineTypeDropdown = async () => {
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_FILTER_GET_MACHINE_TYPE_DROPDOWN_MACHINE,
            headers: {
                authorization: getToken(),
            },
            data: { shop_floor: filter.shop_floor },
        };
        try {
            const result = await axios(config);
            if (result.data) {
                ////////////console.log("getMachineTypeDropdown");
                ////////////console.log(result.data.data);
                setMachineType(result.data.data);
            } else {
                setMachineType([]);
            }
        } catch (e) {
            // console.error(e);

            toast.error(
                t(
                    "content.shop_floor_overview.error.Errorgettingfunctionsdata"
                ),
                {
                    toastId: "failed-get-machine-type-data",
                }
            );
        }
    };

    const getMachineNumberDropdown = async () => {
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env
                    .REACT_APP_MACHINE_PARAMETER_OVERVIEW_GET_MACHINE_NUMBER_DROPDOWN,
            headers: {
                authorization: getToken(),
            },
            data: {
                machine_model: filter.machine_model,
                machine_type: filter.machine_type,
            },
        };
        try {
            const result = await axios(config);
            if (result.data) {
                setMachineNumber(result.data.data);
            } else {
                setMachineNumber([]);
            }
        } catch (e) {
            // console.error(e);
            toast.error("Failed to get machine number data", {
                toastId: "failed-get-machine-number-data",
            });
        }
    };

    // const getMachineNumberDropdown = async () => {
    //     let config = {
    //         method: "POST",
    //         url:
    //             ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
    //             process.env.REACT_APP_FILTER_GET_MACHINE_NUMBER_DROPDOWN,
    //         headers: {
    //             authorization: getToken(),
    //         },
    //         data: {
    //             machine_type: filter.machine_type,
    //             shop_floor: filter.shop_floor,
    //         },
    //     };
    //     try {
    //         const result = await axios(config);
    //         if (result.data) {
    //             setMachineNumber(result.data.data);
    //         } else {
    //             setMachineNumber([]);
    //         }
    //     } catch (e) {
    //         // console.error(e);
    //         toast.error("Failed to get machine number data", {
    //             toastId: "failed-get-machine-number-data",
    //         });
    //     }
    // };

    const getMachineModelDropdown = async () => {
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env
                    .REACT_APP_MACHINE_PARAMETER_OVERVIEW_GET_MACHINE_MODEL_DROPDOWN_MACHINE,
            headers: {
                authorization: getToken(),
            },
            data: {
                machine_type: filter.machine_type,
            },
        };
        try {
            const result = await axios(config);
            if (result.data) {
                setMachineModel(result.data.data);
            } else {
                setMachineModel([]);
            }
        } catch (e) {
            // console.error(e);

            toast.error(
                t(
                    "content.shop_floor_overview.error.Errorgettingmodelnumbersdata"
                ),
                {
                    toastId: "failed-get-machine-model-data",
                }
            );
        }
    };

    const getChartData = async (asset_id, start_date, end_date) => {
        const data = new FormData();

        const categories = [];

        let stringdates = "";

        var now = new Date(end_date);

        // if (start_date !== end_date) {
        for (
            var d = new Date(start_date);
            d <= now;
            d.setDate(d.getDate() + 1)
        ) {
            stringdates = stringdates + toYearMMdd(new Date(d)) + ",";
        }
        // }

        data.append(
            "dates",
            stringdates !== "" ? stringdates.slice(0, -1) : ""
        );
        data.append("asset_id", asset_id);
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env.REACT_APP_GET_ALL_MACHINE_CHART,
            headers: {
                authorization: getToken(),
            },
            data: data,
        };
        try {
            const result = await axios(config);
            if (result.data) {
                ////////console.log("getChartData");
                ////////console.log(result.data);
                categories = result.data;
            } else {
                // setFactory([]);
                categories = [];
            }
        } catch (e) {
            // console.error(e);
            categories = [];
        }

        ////////console.log("categories")
        ////////console.log(categories)
        return categories;
    };

    const exportDataAsset = async (body) => {
        let assetidlist = "";
        let machinenumber = [];
        body.list.forEach((element) => {
            assetidlist = assetidlist + element.id + ",";
            machinenumber.push(element.asset_number);
        });

        let stringdates = "";

        var now = new Date(filter.end_date);

        // if (start_date !== end_date) {
        for (
            var d = new Date(filter.start_date);
            d <= now;
            d.setDate(d.getDate() + 1)
        ) {
            stringdates = stringdates + toYearMMdd(new Date(d)) + ",";
        }

        stringdates.slice(0, -1);

        try {
            // setIsLoadingExport(true);
            let config = {
                method: "post",
                url:
                    ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                    process.env.REACT_APP_EXPORT_MACHINE,
                headers: {
                    authorization: getToken(),
                },
                data: {
                    asset_id: assetidlist.slice(0, -1),
                    dates: stringdates,
                },
            };
            const result = await axios(config);

            let arrayexport = [];

            const fileName = `Machine_utilization_[${new Date()
                .toLocaleString("sv-SE")
                .replace(" ", ",")}]_[${
                filter.shop_floor == ""
                    ? "AllFloor"
                    : "ShopFloor " + filter.shop_floor
            }]_[${
                filter.factory == "" ? "AllRoom" : "Factory " + filter.factory
            }]_[${
                filter.machine_type == ""
                    ? "AllFunction"
                    : "type " + filter.machine_type
            }]_[${
                filter.machine_model == ""
                    ? "AllAssetNumber"
                    : "machine_model " + filter.model
            }]`;
            // const fileName = "data_export_alarm";

            // ////////console.log(result.data);

            let datalistexport = [];
            machinenumber.forEach((element, i) => {
                const dataExport = {
                    sheetName: element,
                    header: ["timestamp_start", "timestamp_end", "value"],
                    body: result.data[i].body,
                };
                datalistexport.push(dataExport);
            });

            ////////console.log(datalistexport)

            // const dataExport = result.data
            exportCSVFile(datalistexport, fileName);
            // setIsLoadingExport(false);
        } catch (e) {
            toast.error(
                t("content.shop_floor_overview.error.FailedtoexportAssets"),
                {
                    toastId: "AI_error-export-assets",
                }
            );
            // setIsLoadingExport(false);
        }
    };

    const getAssetListexport = async () => {
        setIsLoading((prev) => {
            prev.data = true;
            return { ...prev };
        });
        const data = new FormData();
        data.append("search", "");
        data.append("factory", filter.factory);
        data.append("shop_floor", filter.shop_floor);
        data.append("machine_type", filter.machine_type);
        data.append("machine_model", filter.machine_model);
        data.append("limit", 100000000);
        data.append("page", 1);

        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env.REACT_APP_GET_ALL_DETAIL_MACHINE,
            headers: {
                authorization: getToken(),
            },
            data: data,
        };
        try {
            const result = await axios(config);
            if (result.data) {
                // ////console.log("getAssetListexport");
                // ////console.log(result.data);
                setAssetListexport((prev) => {
                    prev.list = result.data.list;
                    return { ...prev };
                });

                setIsLoading((prev) => {
                    prev.data = false;
                    return { ...prev };
                });
            } else {
                setIsLoading((prev) => {
                    prev.data = false;
                    return { ...prev };
                });
                setAssetListexport((prev) => {
                    prev.count = 0;
                    prev.countRunning = 0;
                    prev.countIdle = 0;
                    prev.countHold = 0;
                    prev.countStop = 0;
                    prev.countDown = 0;
                    prev.list = [];
                    return { ...prev };
                });
            }
            if (result.data.list.length > 0) {
                if (result.data.list[0].total_data < limit) {
                    setCurrentPage(1);
                }
            }
        } catch (e) {
            setIsLoading((prev) => {
                prev.data = false;
                return { ...prev };
            });
            // console.error(e);

            toast.error(
                t("content.shop_floor_overview.error.failedtogetdataexport"),
                {
                    toastId: "failed-get-factory-data",
                }
            );
        }
    };

    const getAssetList = async () => {
        setIsLoading((prev) => {
            prev.data = true;
            return { ...prev };
        });
        const data = new FormData();
        data.append("search", search);
        data.append("factory", filter.factory);
        data.append("shop_floor", filter.shop_floor);
        data.append("machine_type", filter.machine_type);
        data.append("machine_model", filter.machine_model);
        data.append("limit", limit);
        data.append("page", currentPage);

        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env.REACT_APP_GET_ALL_DETAIL_MACHINE,
            headers: {
                authorization: getToken(),
            },
            data: data,
        };
        try {
            const result = await axios(config);
            if (result.data) {
                //////console.log("getAssetList");
                //////console.log(result.data);
                setAssetList((prev) => {
                    prev.count =
                        result.data.list[0] && result.data.list[0].total_data
                            ? result.data.list[0].total_data
                            : "0";
                    prev.list = result.data.list;
                    return { ...prev };
                });

                setIsLoading((prev) => {
                    prev.data = false;
                    return { ...prev };
                });
            } else {
                setIsLoading((prev) => {
                    prev.data = false;
                    return { ...prev };
                });
                setAssetList((prev) => {
                    prev.count = 0;
                    prev.countRunning = 0;
                    prev.countIdle = 0;
                    prev.countHold = 0;
                    prev.countStop = 0;
                    prev.countDown = 0;
                    prev.list = [];
                    return { ...prev };
                });
            }
            if (result.data.list.length > 0) {
                if (result.data.list[0].total_data < limit) {
                    setCurrentPage(1);
                }
            }
        } catch (e) {
            setIsLoading((prev) => {
                prev.data = false;
                return { ...prev };
            });
            // console.error(e);

            toast.error(
                t("content.shop_floor_overview.error.failedtogetdata"),
                {
                    toastId: "failed-get-factory-data",
                }
            );
        }
    };
    useEffect(() => {
        getMachineModelDropdown();
    }, [filter.machine_type]);
    useEffect(() => {
        getFactoryDropdown();

        // getLimit();
    }, []);

    useEffect(() => {
        // ////////////console.log("filter.shop_floor")
        // ////////////console.log(filter.shop_floor)
        getMachineTypeDropdown();
    }, [filter.shop_floor]);

    // useEffect(() => {
    //     window.addEventListener("resize", getLimit);
    //     getLimit();
    //     return () => window.removeEventListener("resize", getLimit);
    // }, [window]);

    useEffect(() => {
        getShopFloorDropdown();
    }, [filter.factory]);

    // useEffect(() => {
    //     getMachineNumberDropdown();
    // }, [filter.machine_type, filter.machine_model]);

    useEffect(() => {
        getAssetListexport();
        getAssetList();
    }, [
        filter.factory,
        filter.shop_floor,
        filter.machine_type,
        filter.machine_model,
        search,
        currentPage,
        limit,
        statusFilter,
    ]);

    useEffect(() => {
        // setCurrentPage(1);
    }, [
        filter.factory,
        filter.shop_floor,
        filter.machine_type,
        filter.machine_model,
        search,
    ]);
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
        }
    }, [assetList, currentPage]);

    return (
        <div className='machine-utilization-container'>
            <div className='machine-utilization-filter'>
                <SearchBar
                    name='search'
                    label={t("content.filter.search")}
                    inputWidth='200px'
                    value={search}
                    search={handleChangeSearch}
                    searchContent={() => {}}
                    placeholder={t("content.filter.search")}
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='factory'
                    label={t("content.filter.factory")}
                    value={filter.factory}
                    onSelect={(e) =>
                        setFilter((prev) => {
                            prev.factory = e.value;
                            return { ...prev };
                        })
                    }
                    options={factory}
                    isLoading={false}
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='shop_floor'
                    label={t("content.filter.shop_floor")}
                    value={filter.shop_floor}
                    onSelect={(e) =>
                        setFilter((prev) => {
                            prev.shop_floor = e.value;
                            return { ...prev };
                        })
                    }
                    options={shopFloor}
                    isLoading={false}
                    isDisabled={filter.factory === ""}
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_type'
                    label={t("content.filter.machine_type")}
                    value={filter.machine_type}
                    onSelect={(e) =>
                        setFilter((prev) => {
                            prev.machine_type = e.value;
                            return { ...prev };
                        })
                    }
                    options={machineType}
                    isLoading={false}
                    isDisabled={filter.shop_floor === ""}
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_model'
                    label={t("content.filter.machine_model")}
                    value={filter.machine_model}
                    onSelect={(e) =>
                        setFilter((prev) => {
                            prev.machine_model = e.value;
                            return { ...prev };
                        })
                    }
                    options={machineModel}
                    isLoading={false}
                    isDisabled={filter.machine_type === ""}
                />
            </div>
            <div className='machine-utilization-filter-date'>
                <div className='filter-date'>
                    <InputDateHorizontal
                        // labelWidth='100px'
                        inputWidth='200px'
                        name='start_date'
                        label={t("content.filter.start_date")}
                        value={filter.start_date}
                        onChange={(e) => {
                            setFilter((prev) => {
                                prev.start_date = e;
                                return { ...prev };
                            });
                        }}
                        isRequired={false}
                        maxDate={new Date()}
                    />
                    <InputDateHorizontal
                        // labelWidth='100px'
                        inputWidth='200px'
                        name='end_date'
                        label={t("content.filter.end_date")}
                        value={filter.end_date}
                        onChange={(e) => {
                            setFilter((prev) => {
                                prev.end_date = e;
                                return { ...prev };
                            });
                        }}
                        isRequired={false}
                        minDate={
                            filter.start_date !== "" ? filter.start_date : null
                        }
                        maxDate={new Date()}
                        isDisabled={filter.start_date === today}
                    />
                    <InputTextHorizontal
                        inputWidth='50px'
                        name='total'
                        label={t("content.machine_utilization.total")}
                        value={assetList.count}
                        onChange={() => {}}
                        isDisabled
                    />
                </div>

                <div className='export-button'>
                    <Tooltip
                        tooltip={
                            <span className='icon-tooltip'>{t("export.export")}</span>
                        }>
                        <ExportButton
                            onClick={() => {
                                exportDataAsset(assetListexport);
                            }}
                        />
                    </Tooltip>
                </div>
            </div>
            <div className='machine-utilization-content'>
                <LoadingData
                    isLoading={isLoading.data}
                    useAltBackground={false}
                    size={"250px"}
                />
                {assetList.list.map((data, i) =>  (
                    <div key={i} className='machine-utilization'>
                        <div className='machine-basic-information'>
                            <div className='header'>{data.asset_number}</div>
                            <div className='content'>
                                <div className='content-image'>
                                    <img
                                        src={
                                            data.asset_image !== ""
                                                ? ReturnHostBackend(
                                                      process.env
                                                          .REACT_APP_BACKEND_NODELINX
                                                  ) +
                                                  //   "/filerepository/CAD-IT/uploadFileFromAPI/" +
                                                  data.asset_image
                                                    ? ReturnHostBackend(
                                                          process.env
                                                              .REACT_APP_BACKEND_NODELINX
                                                      ) +
                                                      //   "/filerepository/CAD-IT/uploadFileFromAPI/" +
                                                      data.asset_image
                                                    : DefaultAssetImage
                                                : DefaultAssetImage
                                        }
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = DefaultAssetImage;
                                        }}
                                        alt='profile-pic'
                                    />
                                </div>
                                <div className='content-information'>
                                    <div className='information-detail'>
                                        <p>
                                            {t(
                                                "content.machine_utilization.machine_basic_information.machine_no"
                                            ) + ":"}
                                        </p>
                                        <span className='information-value'>
                                            {data.asset_name}
                                        </span>
                                    </div>
                                    <div className='information-detail'>
                                        <p>
                                            {t(
                                                "content.machine_utilization.machine_basic_information.machine_type"
                                            ) + ":"}
                                        </p>
                                        <span className='information-value'>
                                            {data.machine_type}
                                        </span>
                                    </div>
                                    <div className='information-detail'>
                                        <p>
                                            {t(
                                                "content.machine_utilization.machine_basic_information.location"
                                            ) + ":"}
                                        </p>
                                        <span className='information-value'>
                                            {"F[" +
                                                data.factory +
                                                "]" +
                                                " & " +
                                                "F[" +
                                                data.shop_floor +
                                                "]"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ChartComponent
                            asset_number={data.asset_number}
                            asset_id={data.id}
                            start_date={filter.start_date}
                            end_date={filter.end_date}
                            currentPage={currentPage}
                            t={t}
                        />
                    </div>
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
var toYearMMdd = (date) => {
    // var dateObj = new Date();
    // var month = dateObj.getUTCMonth() + 1; //months from 1-12
    // var day = dateObj.getUTCDate();
    // var year = dateObj.getUTCFullYear();

    return new Date(date).toISOString().split("T")[0];
};
export default MachineUtilization;
