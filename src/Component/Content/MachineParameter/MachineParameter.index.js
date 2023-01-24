import { useState, useEffect, useRef } from "react";
import {
    InputDropdownHorizontal,
    LoadingData,
    InputDateHorizontal,
} from "../../ComponentReuseable/index";
import { ReactComponent as OperatingMode } from "../../../svg/operating-mode.svg";
// import { ReactComponent as ActualSpindleSpeed } from "../../../svg/actual-spindle-speed.svg";
import { ReactComponent as RightArrow } from "../../../svg/right-arrow.svg";
import { ReactComponent as LeftArrow } from "../../../svg/left-arrow.svg";
import { ReactComponent as Grid } from "../../../svg/grid.svg";
import DefaultAssetImage from "../../../svg/default-asset-image.svg";
import ReactApexChart from "react-apexcharts";
import Spindle from "./Component/Spindle";
import { ReturnHostBackend } from "../../ComponentReuseable/BackendHost";
import { getToken } from "../../ComponentReuseable/TokenParse";
import axios from "axios";
import { toast } from "react-toastify";
import ActualSpindleSpeed from "./Component/ActualSpindleSpeed";
import SpeedRateOverride from "./Component/SpeedRateOverride";
import ActualFeedRate from "./Component/ActualFeedRate";
import FeedRateOverride from "./Component/FeedRateOverride";
import SpindleLoad from "./Component/SpindleLoad";
import ServoMotorTemperature from "./Component/ServoMotorTemperature";
import PieOfPieChart from "./Component/PieOfPieChart";
import "./style.scss";
import { load } from "@amcharts/amcharts5/.internal/core/util/Net";
import { time } from "@amcharts/amcharts5";

const machineNoDummy = {
    operatingMode: null,
    actualSpindleSpeed: null,
    speedRateOverride: null,
    actualFeedRate: null,
    feedRateOverride: null,
    spindleLoad: null,
    servoTemperature: {
        tempX: 0,
        tempY: 0,
        tempZ: 0,
    },
    toolID: null,
    pathPosition: null,
    spindleX: {
        xLoad: 0,
        xAct: 0,
    },
    spindleY: {
        yLoad: 0,
        yAct: 0,
    },
    spindleZ: {
        zLoad: 0,
        zAct: 0,
    },
};

const MachineParameter = (props) => {
    const { t, i18n, selectedAsset } = props;

    let spindleOn = useRef(false);
    let model = useRef(document.getElementById("content-3d-model"));

    const today = new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
        .toISOString()
        .slice(0, 10);

    const [filter, setFilter] = useState({
        factory: "",
        shop_floor: "",
        machine_type: "",
        machine_model: "",
        machine_number: "",
    });

    const [isLoading, setIsLoading] = useState({
        data: false,
        latest_data: false,
        operation_summary: false,
        factory: false,
        shop_floor: false,
        machine_type: false,
        machine_model: false,
        machine_number: false,
        spindle: false,
        operating_mode: false,
        spindle_speed: false,
        feed_rate: false,
        spindle_load: false,
        temperature: false,
    });

    const [factory, setFactory] = useState([]);
    const [unit, setUnit] = useState([]);
    const [shopFloor, setShopFloor] = useState([]);
    const [machineType, setMachineType] = useState([]);
    const [machineModel, setMachineModel] = useState([]);
    const [machineNumber, setMachineNumber] = useState([]);
    const [show, setShow] = useState(false);
    const [isSpindleOn, setIsSpindleOn] = useState(false);
    const [operationSummarryFilter, setOperationSummarryFilter] = useState({
        start_date: today,
        end_date: today,
    });
    const [assetDetail, setAssetDetail] = useState(null);
    const [latestValue, setLatestValue] = useState({
        operating_mode: null,
        actual_spindle_speed: null,
        speed_rate_override: null,
        actual_feedrate: null,
        feedrate_override: null,
        spindle_load: null,
        server_motor_temperature_x: null,
        server_motor_temperature_y: null,
        server_motor_temperature_z: null,
        tool_id: null,
        path_position: null,
        xload: null,
        yload: null,
        zload: null,
        xact: null,
        yact: null,
        zact: null,
    });
    const [operationSummary, setOperationSummary] = useState({
        availability: 0,
        utilization: 0,
        runningTime: 0,
        idleTime: 0,
        holdTime: 0,
        stopTime: 0,
        downTime: 0,
        cuttingTime: 0,
        nonCuttingTime: 0,
        cuttingUtilization: 0,
        mttr: 0,
        mtbfr: 0,
        powerOnTime: 0,
    });
    const [isSummaryShow, setIsSummaryShow] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);
    const [animationName, setAnimationName] = useState(null);

    const options1 = {
        chart: {
            animations: {
                enabled: false,
            },
        },
        plotOptions: {
            radialBar: {
                startAngle: 0,
                endAngle: 360,
                hollow: {
                    size: "50%",
                },
                dataLabels: {
                    showOn: "always",
                    name: {
                        offsetY: 10,
                        show: true,
                        color: "#000",
                        fontSize: "12px",
                    },
                    value: {
                        offsetY: -23,
                        color: "#000",
                        fontSize: "16px",
                        show: true,
                    },
                },
            },
        },
        stroke: {
            lineCap: "round",
        },
        labels: [
            t(
                "content.machine_parameter_overview.operating_summary.content.availability"
            ),
        ],
        fill: {
            type: "solid",
            colors: ["#4CA966"],
        },
        grid: {
            padding: {
                top: -40,
                bottom: -40,
            },
        },
    };
    const options2 = {
        chart: {
            animations: {
                enabled: false,
            },
        },
        plotOptions: {
            radialBar: {
                startAngle: 0,
                endAngle: 360,
                hollow: {
                    size: "50%",
                },
                dataLabels: {
                    showOn: "always",
                    name: {
                        offsetY: 10,
                        show: true,
                        color: "#000",
                        fontSize: "12px",
                    },
                    value: {
                        offsetY: -23,
                        color: "#000",
                        fontSize: "16px",
                        show: true,
                    },
                },
            },
        },
        stroke: {
            lineCap: "round",
        },
        labels: [
            t(
                "content.machine_parameter_overview.operating_summary.content.utilization"
            ),
        ],
        fill: {
            type: "solid",
            colors: ["#4CA966"],
        },
        grid: {
            padding: {
                top: -40,
                bottom: -40,
            },
        },
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
                if (filter.factory === "") {
                    if (selectedAsset.factory !== "") {
                        setFilter((prev) => {
                            prev.factory = selectedAsset.factory;
                            return { ...prev };
                        });
                    } else {
                        setFilter((prev) => {
                            prev.factory = result.data.data[0].name;
                            return { ...prev };
                        });
                    }
                }
            } else {
                setFactory([]);
            }
            setIsLoading((prev) => {
                prev.factory = false;
                return { ...prev };
            });
        } catch (e) {
            // console.error(e);
            toast.error(t("toast.failed_to_get_factory_data"), {
                toastId: "failed-machine-parameter-get-factory-data",
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
                if (filter.shop_floor === "") {
                    if (selectedAsset.shop_floor !== "") {
                        setFilter((prev) => {
                            prev.shop_floor = selectedAsset.shop_floor;
                            return { ...prev };
                        });
                    } else {
                        setFilter((prev) => {
                            prev.shop_floor = result.data.data[0].name;
                            return { ...prev };
                        });
                    }
                }
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
                toastId: "failed-machine-parameter-get-shop-floor-data",
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
            data: { shop_floor: filter.shop_floor },
        };
        try {
            const result = await axios(config);
            if (result.data.data.length > 0) {
                setMachineType(result.data.data);
                if (filter.machine_type === "") {
                    if (selectedAsset.machine_type !== "") {
                        setFilter((prev) => {
                            prev.machine_type = selectedAsset.machine_type;
                            return { ...prev };
                        });
                    } else {
                        setFilter((prev) => {
                            prev.machine_type = result.data.data[0].name;
                            return { ...prev };
                        });
                    }
                }
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
                toastId: "failed-machine-parameter-get-machine-type-data",
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
                if (filter.machine_model === "") {
                    if (selectedAsset.machine_model !== "") {
                        setFilter((prev) => {
                            prev.machine_model = selectedAsset.machine_model;
                            return { ...prev };
                        });
                    } else {
                        setFilter((prev) => {
                            prev.machine_model = result.data.data[0].name;
                            return { ...prev };
                        });
                    }
                }
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
                toastId: "failed-machine-parameter-get-machine-model-data",
            });
            setIsLoading((prev) => {
                prev.machine_model = false;
                return { ...prev };
            });
        }
    };

    const getMachineNumberDropdown = async () => {
        setIsLoading((prev) => {
            prev.machine_number = true;
            return { ...prev };
        });
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_FILTER_GET_MACHINE_NUMBER_DROPDOWN,
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
            if (result.data.data.length > 0) {
                setMachineNumber(result.data.data);
                if (filter.machine_number === "") {
                    if (selectedAsset.machine_number !== "") {
                        setFilter((prev) => {
                            prev.machine_number = selectedAsset.machine_number;
                            return { ...prev };
                        });
                    } else {
                        setFilter((prev) => {
                            prev.machine_number = result.data.data[0].name;
                            return { ...prev };
                        });
                    }
                }
            } else {
                setMachineNumber([]);
            }
            setIsLoading((prev) => {
                prev.machine_number = false;
                return { ...prev };
            });
        } catch (e) {
            // console.error(e);
            toast.error(t("toast.failed_to_get_machine_number_data"), {
                toastId: "failed-machine-parameter-get-machine-number-data",
            });
            setIsLoading((prev) => {
                prev.machine_number = false;
                return { ...prev };
            });
        }
    };

    const getAssetDetails = async () => {
        // spindleOn.current = false;
        setIsSpindleOn(false);
        setIsLoading((prev) => {
            prev.data = true;
            return { ...prev };
        });
        setIsRefresh(false);
        // spindleOn.current = false;
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env
                    .REACT_APP_MACHINE_PARAMETER_OVERVIEW_GET_ASSET_DETAILS,
            headers: {
                authorization: getToken(),
            },
            data: {
                machine_number: filter.machine_number,
            },
        };
        try {
            const result = await axios(config);
            if (result.data.data.length > 0) {
                setAssetDetail(result.data.data[0]);
            } else {
                setAssetDetail([]);
            }
            setIsRefresh(true);
            // spindleOn.current = true;
            setIsLoading((prev) => {
                prev.data = false;
                return { ...prev };
            });
        } catch (e) {
            // console.error(e);
            toast.error(t("toast.failed_to_get_machine_details"), {
                toastId: "failed-get-machine-parameter-overview-data",
            });
            setIsRefresh(false);
            // spindleOn.current = false;
            setIsLoading((prev) => {
                prev.data = false;
                return { ...prev };
            });
        }
    };

    const getOperationSummary = async (isRealtime) => {
        let loadingTimeout;
        if (isRealtime) {
            loadingTimeout = setTimeout(() => {
                setIsLoading((prev) => {
                    prev.operation_summary = true;
                    return { ...prev };
                });
            }, 5000);
        } else {
            setIsLoading((prev) => {
                prev.operation_summary = true;
                return { ...prev };
            });
        }

        const data = new FormData();
        data.append("machine_number", filter.machine_number);
        data.append("start_date", operationSummarryFilter.start_date);
        data.append("end_date", operationSummarryFilter.end_date);

        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env
                    .REACT_APP_MACHINE_PARAMETER_OVERVIEW_GET_OPERATION_SUMMARY,
            headers: {
                authorization: getToken(),
            },
            data: data,
        };
        try {
            const result = await axios(config);

            if (result.data) {
                setOperationSummary((prev) => {
                    prev.availability = Math.round(result.data.availability);
                    prev.utilization = Math.round(result.data.utilization);
                    prev.runningTime = result.data.runningTime;
                    prev.idleTime = result.data.idleTime;
                    prev.holdTime = result.data.holdTime;
                    prev.stopTime = result.data.stopTime;
                    prev.downTime = result.data.downTime;
                    prev.cuttingTime = result.data.cuttingTime;
                    prev.nonCuttingTime = result.data.nonCuttingTime;
                    prev.cuttingUtilization = Math.round(
                        result.data.cuttingUtilization
                    );
                    prev.mttr = Math.round(result.data.mttr);
                    prev.mtbfr = Math.round(result.data.mtbfr);
                    prev.powerOnTime = result.data.powerOnTime;
                    return { ...prev };
                });
            } else {
                setOperationSummary((prev) => {
                    prev.availability = 0;
                    prev.utilization = 0;
                    prev.runningTime = 0;
                    prev.idleTime = 0;
                    prev.holdTime = 0;
                    prev.stopTime = 0;
                    prev.downTime = 0;
                    prev.cuttingTime = 0;
                    prev.nonCuttingTime = 0;
                    prev.cuttingUtilization = 0;
                    prev.mttr = 0;
                    prev.mtbfr = 0;
                    prev.powerOnTime = 0;
                    return { ...prev };
                });
            }
            if (isRealtime) {
                clearTimeout(loadingTimeout);
                setTimeout(() => {
                    setIsLoading((prev) => {
                        prev.operation_summary = false;
                        return { ...prev };
                    });
                }, 500);
            } else {
                setIsLoading((prev) => {
                    prev.operation_summary = false;
                    return { ...prev };
                });
            }
        } catch (e) {
            // console.error(e);
            toast.error(t("toast.failed_to_get_operation_summary_data"), {
                toastId: "failed-get-operation-summary-data",
            });
            if (isRealtime) {
                clearTimeout(loadingTimeout);
                setTimeout(() => {
                    setIsLoading((prev) => {
                        prev.operation_summary = false;
                        return { ...prev };
                    });
                }, 500);
            } else {
                setIsLoading((prev) => {
                    prev.operation_summary = false;
                    return { ...prev };
                });
            }
        }
    };

    const getLatestTagValue = async (isRealtime) => {
        let loadingTimeout;
        let timeOut;
        if (isRealtime) {
            loadingTimeout = setTimeout(() => {
                setIsLoading((prev) => {
                    prev.latest_data = true;
                    return { ...prev };
                });
            }, 5000);
        } else {
            setIsLoading((prev) => {
                prev.spindle = true;
                return { ...prev };
            });
        }

        let config = {
            method: "GET",
            url:
                ReturnHostBackend(process.env.REACT_APP_RAW_DATA) +
                process.env.REACT_APP_MACHINE_PARAMETER_LATEST +
                `/${assetDetail.asset_number}`,
            headers: {
                authorization: getToken(),
            },
        };
        try {
            const result = await axios(config);
            if (
                result.data &&
                result.data.length > 0 &&
                typeof result.data !== "string"
            ) {
                let tags = result.data;
                setLatestValue((prev) => {
                    prev.operating_mode =
                        tags.filter((latest) =>
                            latest.tagName.includes(
                                "OperatingModeTags-Automatic Manual Mode"
                            )
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes(
                                      "OperatingModeTags-Automatic Manual Mode"
                                  )
                              )[0].tagValue
                            : null;
                    prev.actual_spindle_speed =
                        tags.filter((latest) =>
                            latest.tagName.includes(
                                "MachineParameterTags-Actual Spindle Speed"
                            )
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes(
                                      "MachineParameterTags-Actual Spindle Speed"
                                  )
                              )[0].tagValue
                            : null;
                    prev.speed_rate_override =
                        tags.filter((latest) =>
                            latest.tagName.includes("Speed Override")
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Speed Override")
                              )[0].tagValue
                            : null;
                    prev.actual_feedrate =
                        tags.filter((latest) =>
                            latest.tagName.includes("Actual Feedrate")
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Actual Feedrate")
                              )[0].tagValue
                            : null;
                    prev.feedrate_override =
                        tags.filter((latest) =>
                            latest.tagName.includes("Feedrate Override")
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Feedrate Override")
                              )[0].tagValue
                            : null;
                    prev.spindle_load =
                        tags.filter((latest) =>
                            latest.tagName.includes("Spindle Load")
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Spindle Load")
                              )[0].tagValue
                            : null;
                    prev.server_motor_temperature_x =
                        tags.filter((latest) =>
                            latest.tagName.includes(
                                "Server Motor Temperature X"
                            )
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes(
                                      "Server Motor Temperature X"
                                  )
                              )[0].tagValue
                            : null;
                    prev.server_motor_temperature_y =
                        tags.filter((latest) =>
                            latest.tagName.includes(
                                "Server Motor Temperature Y"
                            )
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes(
                                      "Server Motor Temperature Y"
                                  )
                              )[0].tagValue
                            : null;
                    prev.server_motor_temperature_z =
                        tags.filter((latest) =>
                            latest.tagName.includes(
                                "Server Motor Temperature Z"
                            )
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes(
                                      "Server Motor Temperature Z"
                                  )
                              )[0].tagValue
                            : null;
                    prev.tool_id =
                        tags.filter((latest) =>
                            latest.tagName.includes("Tool Id")
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Tool Id")
                              )[0].tagValue
                            : null;
                    prev.path_position =
                        tags.filter((latest) =>
                            latest.tagName.includes("Path Position")
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Path Position")
                              )[0].tagValue
                            : null;
                    prev.xload =
                        tags.filter((latest) =>
                            latest.tagName.includes("Xload")
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Xload")
                              )[0].tagValue
                            : null;
                    prev.yload =
                        tags.filter((latest) =>
                            latest.tagName.includes("Yload")
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Yload")
                              )[0].tagValue
                            : null;
                    prev.zload =
                        tags.filter((latest) =>
                            latest.tagName.includes("Zload")
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Zload")
                              )[0].tagValue
                            : null;
                    prev.xact =
                        tags.filter((latest) => latest.tagName.includes("Xact"))
                            .length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Xact")
                              )[0].tagValue
                            : null;
                    prev.yact =
                        tags.filter((latest) => latest.tagName.includes("Yact"))
                            .length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Yact")
                              )[0].tagValue
                            : null;
                    prev.zact =
                        tags.filter((latest) => latest.tagName.includes("Zact"))
                            .length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes("Zact")
                              )[0].tagValue
                            : null;

                    return { ...prev };
                });
                // spindleOn.current = true;
                if (!isRealtime && !isSummaryShow) {
                    setTimeout(() => {
                        setIsSpindleOn(true);
                    }, 1000);
                }
            } else {
                setLatestValue((prev) => {
                    prev.operating_mode = null;
                    prev.actual_spindle_speed = null;
                    prev.speed_rate_override = null;
                    prev.actual_feedrate = null;
                    prev.feedrate_override = null;
                    prev.spindle_load = null;
                    prev.server_motor_temperature_x = null;
                    prev.server_motor_temperature_y = null;
                    prev.server_motor_temperature_z = null;
                    prev.tool_id = null;
                    prev.path_position = null;
                    prev.xload = null;
                    prev.yload = null;
                    prev.zload = null;
                    prev.xact = null;
                    prev.yact = null;
                    prev.zact = null;

                    return { ...prev };
                });
                // spindleOn.current = false;
                if (!isRealtime) {
                    setIsLoading((prev) => {
                        prev.spindle = false;
                        return { ...prev };
                    });
                    setIsSpindleOn(false);
                }
            }
            if (isRealtime) {
                clearTimeout(loadingTimeout);
                setTimeout(() => {
                    setIsLoading((prev) => {
                        prev.latest_data = false;
                        return { ...prev };
                    });
                }, 500);
            }
        } catch (e) {
            // console.error(e);
            toast.error(
                t("toast.failed_to_get_machine_parameter_latest_data"),
                {
                    toastId: "failed-get-machine-parameter-latest-data",
                }
            );
            setLatestValue((prev) => {
                prev.operating_mode = null;
                prev.actual_spindle_speed = null;
                prev.speed_rate_override = null;
                prev.actual_feedrate = null;
                prev.feedrate_override = null;
                prev.spindle_load = null;
                prev.server_motor_temperature_x = null;
                prev.server_motor_temperature_y = null;
                prev.server_motor_temperature_z = null;
                prev.tool_id = null;
                prev.path_position = null;
                prev.xload = null;
                prev.yload = null;
                prev.zload = null;
                prev.xact = null;
                prev.yact = null;
                prev.zact = null;

                return { ...prev };
            });
            // spindleOn.current = false;
            setIsSpindleOn(false);
            setIsLoading((prev) => {
                prev.spindle = false;
                return { ...prev };
            });
            if (isRealtime) {
                clearTimeout(loadingTimeout);
                setTimeout(() => {
                    setIsLoading((prev) => {
                        prev.latest_data = false;
                        return { ...prev };
                    });
                }, 500);
            }
        }
    };

    const getUnit = async () => {
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_MACHINE_PARAMETER_GET_UNIT,
            headers: {
                authorization: getToken(),
            },
            data: {
                asset_name: filter.machine_number,
            },
        };
        try {
            const result = await axios(config);
            if (result.data.data && result.data.data.length > 0) {
                setUnit(result.data.data);
            }
        } catch (e) {}
    };

    useEffect(() => {
        getFactoryDropdown();
    }, [filter.factory, selectedAsset]);

    useEffect(() => {
        getShopFloorDropdown();
    }, [filter.factory, filter.shop_floor, selectedAsset]);

    useEffect(() => {
        getMachineTypeDropdown();
    }, [filter.shop_floor, filter.machine_type, selectedAsset]);

    useEffect(() => {
        getMachineModelDropdown();
    }, [filter.machine_type, filter.machine_model, selectedAsset]);

    useEffect(() => {
        if (filter.machine_number) {
            getAssetDetails();
            getUnit();
        }
    }, [filter]);

    useEffect(() => {
        if (assetDetail) {
            getLatestTagValue();
        }
    }, [assetDetail, isSummaryShow]);

    useEffect(() => {
        if (filter.machine_number) {
            getOperationSummary();
        }
    }, [filter, operationSummarryFilter]);

    useEffect(() => {
        // setIsRefresh(false);
        let intervalLatestTag = null;
        if (isRefresh) {
            const intervalLatest = async () => {
                try {
                    await getLatestTagValue(true);
                } catch (error) {}

                if (intervalLatestTag) {
                    intervalLatestTag = setTimeout(intervalLatest, 1000);
                }
            };
            intervalLatestTag = setTimeout(intervalLatest, 1);
        }
        // spindleOn.current = filter.machine_number !== "";
        return () => {
            if (intervalLatestTag !== null) {
                clearTimeout(intervalLatestTag);
                intervalLatestTag = null;
            }
        };
    }, [isRefresh]);

    useEffect(() => {
        let intervalOperationSummary = null;
        if (
            isRefresh &&
            operationSummarryFilter.start_date &&
            operationSummarryFilter.end_date
        ) {
            const intervalSummary = async () => {
                try {
                    await getOperationSummary(true);
                } catch (error) {}

                if (intervalOperationSummary) {
                    intervalOperationSummary = setTimeout(
                        intervalSummary,
                        10000
                    );
                }
            };

            intervalOperationSummary = setTimeout(intervalSummary, 1);
        }
        // spindleOn.current = filter.machine_number !== "";
        return () => {
            if (intervalOperationSummary !== null) {
                clearTimeout(intervalOperationSummary);
                intervalOperationSummary = null;
            }
        };
    }, [isRefresh, operationSummarryFilter]);

    useEffect(() => {
        getMachineNumberDropdown();
    }, [
        filter.machine_model,
        filter.machine_type,
        filter.machine_number,
        selectedAsset,
    ]);
    return (
        <div className='machine-parameter-container'>
            <div className='machine-parameter-filter'>
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='factory'
                    label={t("content.filter.factory")}
                    value={filter.factory}
                    onSelect={(e) => {
                        setFilter((prev) => {
                            prev.factory = e.value;
                            prev.shop_floor = "";
                            prev.machine_type = "";
                            prev.machine_model = "";
                            prev.machine_number = "";
                            return { ...prev };
                        });

                        if (e.value === "") {
                            setFilter((prev) => {
                                prev.shop_floor = "";
                                prev.machine_type = "";
                                prev.machine_model = "";
                                prev.machine_number = "";
                                return { ...prev };
                            });
                        }
                    }}
                    options={factory}
                    isLoading={isLoading.factory}
                    noEmptyOption
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='shop_floor'
                    label={t("content.filter.shop_floor")}
                    value={filter.shop_floor}
                    onSelect={(e) => {
                        setFilter((prev) => {
                            prev.shop_floor = e.value;
                            prev.machine_type = "";
                            prev.machine_model = "";
                            prev.machine_number = "";
                            return { ...prev };
                        });

                        if (e.value === "") {
                            setFilter((prev) => {
                                prev.machine_type = "";
                                prev.machine_model = "";
                                prev.machine_number = "";
                                return { ...prev };
                            });
                        }
                    }}
                    options={shopFloor}
                    isLoading={isLoading.shop_floor}
                    isDisabled={filter.factory === ""}
                    noEmptyOption
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_type'
                    label={t("content.filter.machine_type")}
                    value={filter.machine_type}
                    onSelect={(e) => {
                        setFilter((prev) => {
                            prev.machine_type = e.value;
                            prev.machine_model = "";
                            prev.machine_number = "";
                            return { ...prev };
                        });

                        if (e.value === "") {
                            setFilter((prev) => {
                                prev.machine_model = "";
                                prev.machine_number = "";
                                return { ...prev };
                            });
                        }
                    }}
                    options={machineType}
                    isLoading={isLoading.machine_type}
                    isDisabled={filter.shop_floor === ""}
                    noEmptyOption
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_model'
                    label={t("content.filter.machine_model")}
                    value={filter.machine_model}
                    onSelect={(e) => {
                        setFilter((prev) => {
                            prev.machine_model = e.value;
                            prev.machine_number = "";
                            return { ...prev };
                        });

                        if (e.value === "") {
                            setFilter((prev) => {
                                prev.machine_number = "";
                                return { ...prev };
                            });
                        }
                    }}
                    options={machineModel}
                    isLoading={isLoading.machine_model}
                    isDisabled={filter.machine_type === ""}
                    noEmptyOption
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_number'
                    label={t("content.filter.machine_number")}
                    value={filter.machine_number}
                    onSelect={(e) =>
                        setFilter((prev) => {
                            prev.machine_number = e.value;
                            return { ...prev };
                        })
                    }
                    options={machineNumber}
                    isLoading={isLoading.machine_number}
                    isDisabled={filter.machine_model === ""}
                    noEmptyOption
                />
            </div>
            <div className='machine-parameter-content'>
                <LoadingData
                    isLoading={isLoading.data || isLoading.latest_data}
                    useAltBackground={false}
                    size={"250px"}
                />
                <div className='content-left-side'>
                    <div className='machine-basic-operating-mode'>
                        <div className='machine-basic-information'>
                            <div className='machine-basic-information-header'>
                                {t(
                                    "content.machine_parameter_overview.machine_basic_information.header.machine_basic_information"
                                )}
                            </div>
                            <div className='machine-basic-information-content'>
                                <div className='content-image'>
                                    <img
                                        className='image-preview'
                                        src={
                                            assetDetail
                                                ? ReturnHostBackend(
                                                      process.env
                                                          .REACT_APP_BACKEND_NODELINX
                                                  ) + assetDetail.asset_image
                                                    ? ReturnHostBackend(
                                                          process.env
                                                              .REACT_APP_BACKEND_NODELINX
                                                      ) +
                                                      assetDetail.asset_image
                                                    : DefaultAssetImage
                                                : DefaultAssetImage
                                        }
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = DefaultAssetImage;
                                        }}
                                        alt='asset-image'
                                    />
                                </div>
                                <div className='content-information'>
                                    <div className='information-detail'>
                                        <p>
                                            {t(
                                                "content.machine_parameter_overview.machine_basic_information.content.machine_type"
                                            ) + ":"}
                                        </p>
                                        <span className='information-value'>
                                            {assetDetail
                                                ? assetDetail.machine_type
                                                : "-"}
                                        </span>
                                    </div>
                                    <div className='information-detail'>
                                        <p>
                                            {t(
                                                "content.machine_parameter_overview.machine_basic_information.content.machine_no"
                                            ) + ":"}
                                        </p>
                                        <span className='information-value'>
                                            {assetDetail
                                                ? assetDetail.asset_name
                                                : "-"}
                                        </span>
                                    </div>
                                    <div className='information-detail'>
                                        <p>
                                            {t(
                                                "content.machine_parameter_overview.machine_basic_information.content.model"
                                            ) + ":"}
                                        </p>
                                        <span className='information-value'>
                                            {assetDetail
                                                ? assetDetail.machine_model
                                                : "-"}
                                        </span>
                                    </div>
                                    <div className='information-detail'>
                                        <p>
                                            {t(
                                                "content.machine_parameter_overview.machine_basic_information.content.location"
                                            ) + ":"}
                                        </p>
                                        <span className='information-value'>
                                            {assetDetail
                                                ? `${t(
                                                      "content.machine_parameter_overview.machine_basic_information.content.factory"
                                                  )}[${
                                                      assetDetail.factory
                                                          ? assetDetail.factory
                                                          : "-"
                                                  }] & ${t(
                                                      "content.machine_parameter_overview.machine_basic_information.content.shop_floor"
                                                  )}[${
                                                      assetDetail.shop_floor
                                                          ? assetDetail.shop_floor
                                                          : "-"
                                                  }]`
                                                : "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='operating-mode'>
                            <div className='operating-mode-header'>
                                {t(
                                    "content.machine_parameter_overview.operating_mode.header.operating_mode"
                                )}
                            </div>
                            <div className='operating-mode-content'>
                                <OperatingMode
                                    className={`mode mode-${
                                        latestValue.operating_mode &&
                                        !latestValue.operating_mode.includes(
                                            "known"
                                        )
                                            ? latestValue.operating_mode
                                            : ""
                                    } ${i18n.language}`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='spindle-speed'>
                        <div className='spindle-speed-header'>
                            {t(
                                "content.machine_parameter_overview.spindle_speed.header.spindle_speed"
                            )}
                        </div>
                        <div className='spindle-speed-content'>
                            <div className='actual-spindle-speed'>
                                <div className='actual-spindle-speed-header'>
                                    {t(
                                        "content.machine_parameter_overview.spindle_speed.content.actual_spindle_speed"
                                    )}
                                </div>
                                <div className='actual-spindle-speed-content'>
                                    <ActualSpindleSpeed
                                        value={
                                            latestValue.actual_spindle_speed &&
                                            !latestValue.actual_spindle_speed.includes(
                                                "known"
                                            )
                                                ? latestValue.actual_spindle_speed
                                                : null
                                        }
                                        unit={
                                            unit.length > 0
                                                ? unit.filter((unt) =>
                                                      unt.tag_name.includes(
                                                          "Actual Spindle Speed"
                                                      )
                                                  ).length > 0
                                                    ? unit.filter((unt) =>
                                                          unt.tag_name.includes(
                                                              "Actual Spindle Speed"
                                                          )
                                                      )[0].unit
                                                    : "r/min"
                                                : "r/min"
                                        }
                                    />
                                </div>
                            </div>
                            <div className='speed-rate-override'>
                                <div className='speed-rate-override-header'>
                                    {t(
                                        "content.machine_parameter_overview.spindle_speed.content.speed_rate_override"
                                    )}
                                </div>
                                <div className='speed-rate-override-content'>
                                    <SpeedRateOverride
                                        value={
                                            latestValue.speed_rate_override &&
                                            !latestValue.speed_rate_override.includes(
                                                "known"
                                            )
                                                ? latestValue.speed_rate_override
                                                : null
                                        }
                                        unit={
                                            unit.length > 0
                                                ? unit.filter((unt) =>
                                                      unt.tag_name.includes(
                                                          "Speed Override"
                                                      )
                                                  ).length > 0
                                                    ? unit.filter((unt) =>
                                                          unt.tag_name.includes(
                                                              "Speed Override"
                                                          )
                                                      )[0].unit
                                                    : "%"
                                                : "%"
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='feed-rate'>
                        <div className='feed-rate-header'>
                            {" "}
                            {t(
                                "content.machine_parameter_overview.feed_rate.header.feed_rate"
                            )}
                        </div>
                        <div className='feed-rate-content'>
                            <div className='actual-feed-rate'>
                                <div className='actual-feed-rate-header'>
                                    {t(
                                        "content.machine_parameter_overview.feed_rate.content.actual_feed_rate"
                                    )}
                                </div>
                                <div className='actual-feed-rate-content'>
                                    <ActualFeedRate
                                        value={
                                            latestValue.actual_feedrate &&
                                            !latestValue.actual_feedrate.includes(
                                                "known"
                                            )
                                                ? latestValue.actual_feedrate
                                                : null
                                        }
                                        unit={
                                            unit.length > 0
                                                ? unit.filter((unt) =>
                                                      unt.tag_name.includes(
                                                          "Actual Feedrate"
                                                      )
                                                  ).length > 0
                                                    ? unit.filter((unt) =>
                                                          unt.tag_name.includes(
                                                              "Actual Feedrate"
                                                          )
                                                      )[0].unit
                                                    : "mm/min"
                                                : "mm/min"
                                        }
                                    />
                                </div>
                            </div>
                            <div className='feed-rate-override'>
                                <div className='feed-rate-override-header'>
                                    {t(
                                        "content.machine_parameter_overview.feed_rate.content.feed_rate_override"
                                    )}
                                </div>
                                <div className='feed-rate-override-content'>
                                    <FeedRateOverride
                                        value={
                                            latestValue.feedrate_override &&
                                            !latestValue.feedrate_override.includes(
                                                "known"
                                            )
                                                ? Math.floor(
                                                      255 -
                                                          parseInt(
                                                              latestValue.feedrate_override
                                                          )
                                                  )
                                                : null
                                        }
                                        unit={
                                            unit.length > 0
                                                ? unit.filter((unt) =>
                                                      unt.tag_name.includes(
                                                          "Feedrate Override"
                                                      )
                                                  ).length > 0
                                                    ? unit.filter((unt) =>
                                                          unt.tag_name.includes(
                                                              "Feedrate Override"
                                                          )
                                                      )[0].unit
                                                    : "%"
                                                : "%"
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className='content-middle-side'
                    style={
                        animationName === "show"
                            ? isSummaryShow
                                ? {
                                      animation:
                                          "middle-side-animation-minimize 1s",
                                      overflowY: "auto",
                                  }
                                : {
                                      animation:
                                          "middle-side-animation-maximize 1s",
                                  }
                            : {}
                    }>
                    <div
                        className={`spindle-load-servo-motor-temperature${
                            isSummaryShow ? "-2" : "-1"
                        }`}
                        style={
                            animationName === "show"
                                ? isSummaryShow
                                    ? {
                                          animation: "coba 1s",
                                      }
                                    : { animation: "coba1 1s" }
                                : {}
                        }>
                        <div className='spindle-load'>
                            <div className='spindle-load-header'>
                                {t(
                                    "content.machine_parameter_overview.spindle_load.header.spindle_load"
                                )}
                            </div>
                            <div className='spindle-load-content'>
                                <SpindleLoad
                                    value={
                                        latestValue.spindle_load &&
                                        !latestValue.spindle_load.includes(
                                            "known"
                                        )
                                            ? latestValue.spindle_load
                                            : null
                                    }
                                    unit={
                                        unit.length > 0
                                            ? unit.filter((unt) =>
                                                  unt.tag_name.includes(
                                                      "Spindle Load"
                                                  )
                                              ).length > 0
                                                ? unit.filter((unt) =>
                                                      unt.tag_name.includes(
                                                          "Spindle Load"
                                                      )
                                                  )[0].unit
                                                : "%"
                                            : "%"
                                    }
                                />
                            </div>
                        </div>
                        <div className='servo-motor-temperature'>
                            <div className='servo-motor-temperature-header'>
                                {t(
                                    "content.machine_parameter_overview.servo_motor_temperature.header.servo_motor_temperature"
                                )}
                            </div>
                            <div className='servo-motor-temperature-content'>
                                <Grid className='grid' />
                                <div className='temperature'>
                                    <ServoMotorTemperature
                                        temperature={{
                                            tempX:
                                                latestValue.server_motor_temperature_x &&
                                                !latestValue.server_motor_temperature_x.includes(
                                                    "known"
                                                )
                                                    ? latestValue.server_motor_temperature_x
                                                    : 0,
                                            tempY:
                                                latestValue.server_motor_temperature_y &&
                                                !latestValue.server_motor_temperature_y.includes(
                                                    "known"
                                                )
                                                    ? latestValue.server_motor_temperature_y
                                                    : 0,
                                            tempZ:
                                                latestValue.server_motor_temperature_z &&
                                                !latestValue.server_motor_temperature_z.includes(
                                                    "known"
                                                )
                                                    ? latestValue.server_motor_temperature_z
                                                    : 0,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='spindle-load-and-axis'>
                        <div className='spindle-load-and-axis-header'>
                            {t(
                                "content.machine_parameter_overview.spindle_load_and_axis.header.spindle_load_and_axis"
                            )}
                        </div>
                        <div className='spindle-load-and-axis-content'>
                            <div
                                id='content-3d-model'
                                className={`content-3d-model${
                                    isSummaryShow ? "-1" : "-2"
                                }`}>
                                {!isSummaryShow && (
                                    <LoadingData
                                        isLoading={isLoading.spindle}
                                        useAltBackground={false}
                                        size={"100px"}
                                    />
                                )}
                                {!isSummaryShow && isSpindleOn ? (
                                    <Spindle
                                        model={model.current}
                                        spindleOn={isSpindleOn}
                                        isLoading={isLoading.spindle}
                                        setIsLoading={setIsLoading}
                                        x={
                                            latestValue.xact &&
                                            !latestValue.xact.includes("known")
                                                ? (
                                                      parseFloat(
                                                          latestValue.xact
                                                      ) / 100
                                                  ).toFixed(1)
                                                : null
                                        }
                                        y={
                                            latestValue.yact &&
                                            !latestValue.yact.includes("known")
                                                ? (
                                                      parseFloat(
                                                          latestValue.yact
                                                      ) / 100
                                                  ).toFixed(1)
                                                : null
                                        }
                                        z={
                                            latestValue.zact &&
                                            !latestValue.zact.includes("known")
                                                ? (
                                                      parseFloat(
                                                          latestValue.zact
                                                      ) / 100
                                                  ).toFixed(1)
                                                : null
                                        }
                                    />
                                ) : null}
                            </div>
                            <div
                                className={`content-basic-information${
                                    isSummaryShow ? "-1" : "-2"
                                }`}>
                                <div className='tool'>
                                    <span className='name'>
                                        {t(
                                            "content.machine_parameter_overview.spindle_load_and_axis.content.tool_id"
                                        ) + ":"}
                                    </span>
                                    <span className='value'>
                                        {latestValue.tool_id &&
                                        !latestValue.tool_id.includes("known")
                                            ? latestValue.tool_id
                                            : "-"}
                                    </span>
                                </div>
                                <div className='path'>
                                    <span className='name'>
                                        {t(
                                            "content.machine_parameter_overview.spindle_load_and_axis.content.path_positions"
                                        ) + ":"}
                                    </span>
                                    <span className='value'>
                                        {latestValue.path_position &&
                                        !latestValue.path_position.includes(
                                            "known"
                                        )
                                            ? latestValue.path_position
                                                  .split(" ")
                                                  .map((value) => {
                                                      return parseFloat(
                                                          value
                                                      ).toFixed(2);
                                                  })
                                                  .join(", ")
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`content-axis-information${
                                    isSummaryShow ? "-1" : "-2"
                                }`}>
                                <div className='xyz-position'>
                                    <span>X</span>
                                    <div className='load'>
                                        <span>
                                            {t(
                                                "content.machine_parameter_overview.spindle_load_and_axis.content.load"
                                            ) + ":"}
                                        </span>
                                        <span>
                                            {latestValue.xload &&
                                            !latestValue.xload.includes("known")
                                                ? latestValue.xload
                                                : "-"}
                                        </span>
                                    </div>
                                    <div className='position'>
                                        <span>
                                            {t(
                                                "content.machine_parameter_overview.spindle_load_and_axis.content.position"
                                            ) + ":"}
                                        </span>
                                        <span>
                                            {latestValue.xact &&
                                            !latestValue.xact.includes("known")
                                                ? parseFloat(
                                                      latestValue.xact
                                                  ).toFixed(1)
                                                : "-"}
                                        </span>
                                    </div>
                                </div>
                                <div className='xyz-position'>
                                    <span>Y</span>
                                    <div className='load'>
                                        <span>
                                            {t(
                                                "content.machine_parameter_overview.spindle_load_and_axis.content.load"
                                            ) + ":"}
                                        </span>
                                        <span>
                                            {latestValue.yload &&
                                            !latestValue.yload.includes("known")
                                                ? latestValue.yload
                                                : "-"}
                                        </span>
                                    </div>
                                    <div className='position'>
                                        <span>
                                            {t(
                                                "content.machine_parameter_overview.spindle_load_and_axis.content.position"
                                            ) + ":"}
                                        </span>
                                        <span>
                                            {latestValue.yact &&
                                            !latestValue.yact.includes("known")
                                                ? parseFloat(
                                                      latestValue.yact
                                                  ).toFixed(1)
                                                : "-"}
                                        </span>
                                    </div>
                                </div>
                                <div className='xyz-position'>
                                    <span>Z</span>
                                    <div className='load'>
                                        <span>
                                            {t(
                                                "content.machine_parameter_overview.spindle_load_and_axis.content.load"
                                            ) + ":"}
                                        </span>
                                        <span>
                                            {latestValue.zload &&
                                            !latestValue.zload.includes("known")
                                                ? latestValue.zload
                                                : "-"}
                                        </span>
                                    </div>
                                    <div className='position'>
                                        <span>
                                            {t(
                                                "content.machine_parameter_overview.spindle_load_and_axis.content.position"
                                            ) + ":"}
                                        </span>
                                        <span>
                                            {latestValue.zact &&
                                            !latestValue.zact.includes("known")
                                                ? parseFloat(
                                                      latestValue.zact
                                                  ).toFixed(1)
                                                : "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className='content-right-side'
                    style={
                        animationName === "show"
                            ? isSummaryShow
                                ? {
                                      animation:
                                          "right-side-animation-maximize 1s",
                                      minWidth: "540px",
                                  }
                                : {
                                      animation:
                                          "right-side-animation-minimize 1s",
                                      minWidth: "30px",
                                  }
                            : { minWidth: "30px" }
                    }>
                    <div className='toogle'>
                        {isSummaryShow ? (
                            <RightArrow
                                className='arrow'
                                onClick={() => {
                                    setIsSummaryShow((prev) => !prev);
                                    // setAnimationName("hide");

                                    // spindleOn.current = !isSummaryShow;
                                    setIsLoading((prev) => {
                                        prev.spindle = true;
                                        return { ...prev };
                                    });
                                    setTimeout(() => {
                                        setIsLoading((prev) => {
                                            prev.spindle = false;
                                            return { ...prev };
                                        });
                                        setIsSpindleOn((prev) => prev);
                                    }, 1000);
                                    setShow(false);
                                }}
                            />
                        ) : (
                            <LeftArrow
                                className='arrow'
                                onClick={() => {
                                    setIsSummaryShow((prev) => !prev);
                                    setAnimationName("show");
                                    // spindleOn.current = !isSummaryShow;
                                    setIsSpindleOn(false);
                                    setTimeout(() => {
                                        setShow(true);
                                    }, 500);
                                }}
                            />
                        )}
                    </div>
                    {isSummaryShow
                        ? show && (
                              <div className='operation-summary'>
                                  <LoadingData
                                      isLoading={isLoading.operation_summary}
                                      useAltBackground={false}
                                      size={"150px"}
                                  />
                                  <div className='operation-summary-header'>
                                      {t(
                                          "content.machine_parameter_overview.operating_summary.header.operating_summary"
                                      )}
                                  </div>
                                  <div className='operation-summary-content'>
                                      <div className='content-filter'>
                                          <InputDateHorizontal
                                              //   labelWidth='100px'
                                              inputWidth='150px'
                                              name='start_date'
                                              label={t(
                                                  "content.filter.start_date"
                                              )}
                                              value={
                                                  operationSummarryFilter.start_date
                                              }
                                              onChange={(e) => {
                                                  setOperationSummarryFilter(
                                                      (prev) => {
                                                          prev.start_date = e;
                                                          return { ...prev };
                                                      }
                                                  );
                                                  if (
                                                      new Date(e).getTime() >
                                                      new Date(
                                                          filter.end_date
                                                      ).getTime()
                                                  ) {
                                                      setOperationSummarryFilter(
                                                          (prev) => {
                                                              prev.end_date =
                                                                  "";
                                                              return {
                                                                  ...prev,
                                                              };
                                                          }
                                                      );
                                                  }
                                              }}
                                              isRequired={false}
                                              maxDate={new Date()}
                                          />
                                          <InputDateHorizontal
                                              // labelWidth='100px'
                                              inputWidth='150px'
                                              name='end_date'
                                              label={t(
                                                  "content.filter.end_date"
                                              )}
                                              value={
                                                  operationSummarryFilter.end_date
                                              }
                                              onChange={(e) => {
                                                  setOperationSummarryFilter(
                                                      (prev) => {
                                                          prev.end_date = e;
                                                          return { ...prev };
                                                      }
                                                  );
                                              }}
                                              isRequired={false}
                                              minDate={
                                                  operationSummarryFilter.start_date !==
                                                  ""
                                                      ? operationSummarryFilter.start_date
                                                      : null
                                              }
                                              maxDate={new Date()}
                                              isDisabled={
                                                  operationSummarryFilter.start_date ===
                                                  today
                                              }
                                          />
                                      </div>
                                      <div className='content-top-side'>
                                          <div className='availability-chart'>
                                              {typeof window !==
                                                  "undefined" && (
                                                  <ReactApexChart
                                                      height={"300"}
                                                      width={"100%"}
                                                      type='radialBar'
                                                      options={options1}
                                                      series={[
                                                          operationSummary.availability
                                                              ? operationSummary.availability
                                                              : 0,
                                                      ]}
                                                  />
                                              )}
                                          </div>
                                          <div className='utilization-chart'>
                                              {typeof window !==
                                                  "undefined" && (
                                                  <ReactApexChart
                                                      height={"300"}
                                                      width={"100%"}
                                                      type='radialBar'
                                                      options={options2}
                                                      series={[
                                                          operationSummary.utilization
                                                              ? operationSummary.utilization
                                                              : 0,
                                                      ]}
                                                  />
                                              )}
                                          </div>
                                      </div>
                                      <div className='content-bottom-side'>
                                          <div className='content-title'>
                                              <span className='title'>
                                                  {`${t(
                                                      "content.machine_parameter_overview.operating_summary.content.total_machine_power_on_time"
                                                  )} (${t("time.hours")}): ${
                                                      operationSummary.powerOnTime
                                                          ? operationSummary.powerOnTime
                                                          : 0
                                                  }`}
                                              </span>
                                          </div>
                                          <div className='content-chart'>
                                              {isSummaryShow && (
                                                  <PieOfPieChart
                                                      t={t}
                                                      data={operationSummary}
                                                  />
                                              )}
                                          </div>
                                          <div className='content-detail'>
                                              <div className='detail-left-side'>
                                                  <div className='name-value'>
                                                      <div className='name'>
                                                          {`${t(
                                                              "content.machine_parameter_overview.operating_summary.content.total_running_time"
                                                          )} (${t(
                                                              "time.hours"
                                                          )})`}
                                                      </div>
                                                      <div className='value value__running'>
                                                          {operationSummary.runningTime
                                                              ? operationSummary.runningTime
                                                              : 0}
                                                      </div>
                                                  </div>
                                                  <div className='name-value'>
                                                      <div className='name'>
                                                          {`${t(
                                                              "content.machine_parameter_overview.operating_summary.content.total_idle_time"
                                                          )} (${t(
                                                              "time.hours"
                                                          )})`}
                                                      </div>
                                                      <div className='value value__idle'>
                                                          {operationSummary.idleTime
                                                              ? operationSummary.idleTime
                                                              : 0}
                                                      </div>
                                                  </div>
                                                  <div className='name-value'>
                                                      <div className='name'>
                                                          {`${t(
                                                              "content.machine_parameter_overview.operating_summary.content.total_hold_time"
                                                          )} (${t(
                                                              "time.hours"
                                                          )})`}
                                                      </div>
                                                      <div className='value value__hold'>
                                                          {operationSummary.holdTime
                                                              ? operationSummary.holdTime
                                                              : 0}
                                                      </div>
                                                  </div>
                                                  <div className='name-value'>
                                                      <div className='name'>
                                                          {`${t(
                                                              "content.machine_parameter_overview.operating_summary.content.total_offline_time"
                                                          )} (${t(
                                                              "time.hours"
                                                          )})`}
                                                      </div>
                                                      <div className='value value__down'>
                                                          {operationSummary.downTime
                                                              ? operationSummary.downTime
                                                              : 0}
                                                      </div>
                                                  </div>
                                                  <div className='name-value'>
                                                      <div className='name'>
                                                          {`${t(
                                                              "content.machine_parameter_overview.operating_summary.content.total_stop_time"
                                                          )} (${t(
                                                              "time.hours"
                                                          )})`}
                                                      </div>
                                                      <div className='value value__stop'>
                                                          {operationSummary.stopTime
                                                              ? operationSummary.stopTime
                                                              : 0}
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className='detail-right-side'>
                                                  <div className='name-value'>
                                                      <div className='name'>
                                                          {`${t(
                                                              "content.machine_parameter_overview.operating_summary.content.total_cutting_time"
                                                          )} (${t(
                                                              "time.hours"
                                                          )})`}
                                                      </div>
                                                      <div className='value'>
                                                          {operationSummary.cuttingTime
                                                              ? operationSummary.cuttingTime
                                                              : 0}
                                                      </div>
                                                  </div>
                                                  <div className='name-value'>
                                                      <div className='name'>
                                                          {`${t(
                                                              "content.machine_parameter_overview.operating_summary.content.cutting_utilization"
                                                          )} (%)`}
                                                      </div>
                                                      <div className='value'>
                                                          {operationSummary.cuttingUtilization
                                                              ? operationSummary.cuttingUtilization
                                                              : 0}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className='content-detail'>
                                              <div className='detail-left-side'>
                                                  <div className='name-value'>
                                                      <div className='name'>
                                                          {`${t(
                                                              "content.machine_parameter_overview.operating_summary.content.mttr"
                                                          )} (${t(
                                                              "time.hours"
                                                          )})`}
                                                      </div>
                                                      <div className='value'>
                                                          {operationSummary.mttr
                                                              ? operationSummary.mttr
                                                              : 0}
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className='detail-right-side'>
                                                  <div className='name-value'>
                                                      <div className='name'>
                                                          {`${t(
                                                              "content.machine_parameter_overview.operating_summary.content.mtbf"
                                                          )} (${t(
                                                              "time.hours"
                                                          )})`}
                                                      </div>
                                                      <div className='value'>
                                                          {operationSummary.mtbfr
                                                              ? operationSummary.mtbfr
                                                              : 0}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )
                        : null}
                </div>
            </div>
        </div>
    );
};

export default MachineParameter;
