import "./style.scss";
import {
    InputDropdownHorizontal,
    PaginationStyle2,
    InputDateHorizontal,
    ExportButton,
    Table,
    Tooltip,
    LoadingData,
    exportCSVFile,
    getLimitTableDCIM,
} from "../../ComponentReuseable/index";
import Card from "./Component/Card";
import { ReactComponent as Speedo } from "../../../svg/speedo1.svg";
import { useState, useEffect } from "react";
import { RadialGauge } from "canvas-gauges";
import Chart from "./Component/Chart";
import { toast } from "react-toastify";
import axios from "axios";
import { ReturnHostBackend } from "../../ComponentReuseable/BackendHost";
import { getToken } from "../../ComponentReuseable/TokenParse";
import { PushNotification } from "../../ComponentReuseable/PushNotification";
import SpindleCondition from "./Component/SpindleCondition";

const typeDummy = ["low", "high"];

const SpindleConditionOverview = (props) => {
    const { t } = props;

    const today = new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
        .toISOString()
        .slice(0, 10);

    const [limit, setLimit] = useState(getLimitTableDCIM());
    const [factory, setFactory] = useState([]);
    const [shopFloor, setShopFloor] = useState([]);
    const [machineType, setMachineType] = useState([]);
    const [machineModel, setMachineModel] = useState([]);
    const [machineNumber, setMachineNumber] = useState([]);
    const [parameterLogs, setParameterLogs] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [spindleCondition, setSpindleCondition] = useState([]);
    const [assetTags, setAssetTags] = useState([]);
    const [state, setState] = useState({});
    const [tags, setTags] = useState([]);
    const [parameter, setParameter] = useState({
        type: "",
        parameter: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [filter, setFilter] = useState({
        factory: "",
        shop_floor: "",
        machine_type: "",
        machine_model: "",
        machine_number: "",
        start_date: today,
        end_date: today,
    });

    const [isLoading, setIsLoading] = useState({
        data: false,
        parameter_logs: false,
        factory: false,
        shop_floor: false,
        machine_type: false,
        machine_model: false,
        machine_number: "MFTC-2-04-004",
        export: false,
    });
    const header = {
        date_time: {
            width: "200px",
            name: t(
                "content.spindle_condition.parameter_alert_log.content.date_time"
            ),
        },
        duration: {
            width: "80px",
            name: t(
                "content.spindle_condition.parameter_alert_log.content.duration"
            ),
        },
        parameter: {
            width: "200px",
            name: t(
                "content.spindle_condition.parameter_alert_log.content.parameter"
            ),
        },
        description: {
            width: "200px",
            name: t(
                "content.spindle_condition.parameter_alert_log.content.description"
            ),
        },
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
        window.addEventListener("resize", function () {
            setLimit(getLimitTableDCIM());
        });
        return () =>
            window.removeEventListener("resize", function () {
                setLimit(getLimitTableDCIM());
            });
    }, []);

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
                    setFilter((prev) => {
                        prev.factory = result.data.data[0].name;
                        return { ...prev };
                    });
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
                toastId: "failed-spindle-condition-get-factory-data",
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
                if (filter.shop_floor === "") {
                    setFilter((prev) => {
                        prev.shop_floor = result.data.data[0].name;
                        return { ...prev };
                    });
                }
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
                toastId: "failed-spindle-condition-get-shop-floor-data",
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
                    setFilter((prev) => {
                        prev.machine_type = result.data.data[0].name;
                        return { ...prev };
                    });
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
                toastId: "failed-spindle-condition-get-machine-type-data",
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
                    setFilter((prev) => {
                        prev.machine_model = result.data.data[0].name;
                        return { ...prev };
                    });
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
                toastId: "failed-spindle-condition-get-machine-model-data",
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
                    setFilter((prev) => {
                        prev.machine_number = result.data.data[0].name;
                        return { ...prev };
                    });
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
                toastId: "failed-spindle-condition-get-machine-number-data",
            });
            setIsLoading((prev) => {
                prev.machine_number = false;
                return { ...prev };
            });
        }
    };

    const getParameterAlertLogs = async () => {
        setIsLoading((prev) => {
            prev.parameter_logs = true;
            return { ...prev };
        });
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env
                    .REACT_APP_SPINDLE_CONDITION_GET_PARAMETER_ALERT_LOGS,
            headers: {
                authorization: getToken(),
            },
            data: {
                machine_number: filter.machine_number,
                start_date: filter.start_date,
                end_date: filter.end_date,
                type: parameter.type,
                parameter:
                    parameter.parameter !== ""
                        ? parameter.parameter.split("_").join(" ")
                        : "",
                page: currentPage,
                limit: limit,
            },
        };
        try {
            const result = await axios(config);
            let params = [];
            if (result.data && result.data.data.length > 0) {
                setParameterLogs(result.data.data);
                if (result.data.data[0].total_data < limit) {
                    setCurrentPage(1);
                }
            } else {
                setParameterLogs([]);
            }

            setIsLoading((prev) => {
                prev.parameter_logs = false;
                return { ...prev };
            });
        } catch (e) {
            // console.error(e);
            toast.error(t("toast.failed_to_get_parameter_alert_logs_data"), {
                toastId: "failed-get-parameter-alert-logs-data",
            });
            setIsLoading((prev) => {
                prev.parameter_logs = false;
                return { ...prev };
            });
        }
    };

    const getAssetTags = async () => {
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_SPINDLE_CONDITION_GET_ASSET_TAGS,
            headers: {
                authorization: getToken(),
            },
            data: {
                machine_number: filter.machine_number,
            },
        };
        try {
            const result = await axios(config);
            if (result.data) {
                let params = [];
                let tag = [];
                let data = result.data.data;
                let filtered = data.filter(function (dt) {
                    return (
                        dt.tag_name ===
                            "MachineParameterTags-Actual Spindle Speed" ||
                        dt.tag_name ===
                            "MachineParameterTags-Actual Feedrate" ||
                        dt.tag_name === "MachineParameterTags-Spindle Load" ||
                        dt.tag_name === "MachineParameterTags-Speed Override" ||
                        dt.tag_name === "MachineParameterTags-Feedrate Override"
                    );
                });
                setAssetTags(filtered);
                if (filtered.length > 0) {
                    filtered.map((data, index) => {
                        let newData = data.tag_name
                            .split("-")[1]
                            .toLowerCase()
                            .split(" ")
                            .join("_");
                        if (!params.includes(newData)) {
                            params.push(newData);
                        }
                    });
                    filtered.map((dt) => {
                        tag.push(dt.tag_id);
                    });
                }
                setParameters(params);
                setTags(tag);
            } else {
                setAssetTags([]);
                setTags([]);
            }
        } catch (e) {
            // console.error(e);
            toast.error(t("toast.failed_to_get_asset_tags"), {
                toastId: "failed-spindle-condition-get-asset-tags",
            });
        }
    };

    const exportData = async (e) => {
        setIsLoading((prev) => {
            prev.export = true;
            return { ...prev };
        });
        const promise = [];
        if (assetTags.length > 0) {
            assetTags.forEach((tag, index) => {
                const data = new FormData();
                data.append(
                    "machine_number",
                    filter.machine_number === "" ? "" : filter.machine_number
                );
                data.append(
                    "start_date",
                    filter.start_date === "" ? "" : filter.start_date
                );
                data.append(
                    "end_date",
                    filter.end_date === "" ? "" : filter.end_date
                );
                data.append("tag_id", tag.tag_id);
                data.append("tag_name", tag.tag_name);
                data.append("tag_unit", tag.unit);
                data.append("low", tag.low);
                data.append("high", tag.high);

                const config = {
                    method: "post",
                    url:
                        ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                        process.env.REACT_APP_SPINDLE_CONDITION_EXPORT_DATA,
                    headers: {
                        authorization: getToken(),
                    },
                    data: data,
                };

                promise.push(
                    axios(config)
                        .then((response) => {
                            if (response.data) {
                                if (response.status === 200) {
                                    return response.data;
                                } else {
                                    toast.warning(t("toast.data_is_empty"), {
                                        toastId: "data-empty",
                                    });
                                }
                            } else {
                                toast.warning(t("toast.data_is_empty"), {
                                    toastId: "data-empty",
                                });
                            }
                        })
                        .catch((err) => {
                            toast.error(t("toast.failed_to_get_data"), {
                                toastId: "failed-get-data",
                            });
                            setIsLoading((prev) => {
                                prev.export = false;
                                return { ...prev };
                            });
                        })
                );
            });
        }
        let startDate = new Date(new Date(filter.start_date).setHours(0, 0, 0));
        let endDate =
            filter.end_date === filter.start_date
                ? new Date(
                      new Date(
                          new Date(filter.end_date).setDate(
                              new Date(filter.end_date).getDate() + 1
                          )
                      ).setHours(0, 0, 0)
                  )
                : new Date(filter.end_date);
        let currentTime = startDate;
        const arrayMappingDate = [];
        while (currentTime < endDate) {
            arrayMappingDate.push({
                timestamp: new Date(currentTime),
            });
            currentTime.setTime(currentTime.getTime() + 15 * 60 * 1000);
        }

        await Promise.all(promise).then((values) => {
            let bodyParameterChart,
                headersParameterChart,
                headersParameterLogs,
                bodyParameterLogs,
                parameterChartData,
                datas;
            if (values.length > 0) {
                let arrayDataChart = values.reduce((prev, current, index) => {
                    return prev.concat(current.parameterCharts);
                }, []);
                let arrayDataLogs = values[0].parameterLogs;

                if (arrayDataChart.length > 0) {
                    datas = {};
                    arrayDataChart.map((data) => {
                        let tagName = data.tag_name
                            .split(" ")
                            .join("_")
                            .toLowerCase();
                        let tagValue = `${t("export.value")} ${t(
                            "export." + tagName
                        )} (${data.tag_unit})`;
                        let tagLow = `${t("export.low")} ${t(
                            "export." + tagName
                        )} (${data.tag_unit})`;
                        let tagHigh = `${t("export.high")} ${t(
                            "export." + tagName
                        )} (${data.tag_unit})`;
                        let newData = {
                            [t("export.timestamp")]: data.start_time,
                            [tagValue]: data.value,
                            [tagLow]: data.low,
                            [tagHigh]: data.high,
                        };
                        datas = Object.assign(datas, newData);
                    });
                    parameterChartData = arrayMappingDate.map((time) => {
                        let tempData = {
                            [t("export.timestamp")]: time.timestamp,
                        };
                        arrayDataChart.map((data) => {
                            let tagName = data.tag_name
                                .split(" ")
                                .join("_")
                                .toLowerCase();
                            let tagValue = `${t("export.value")} ${t(
                                "export." + tagName
                            )} (${data.tag_unit})`;
                            let tagLow = `${t("export.low")} ${t(
                                "export." + tagName
                            )} (${data.tag_unit})`;
                            let tagHigh = `${t("export.high")} ${t(
                                "export." + tagName
                            )} (${data.tag_unit})`;
                            if (
                                time.timestamp.getTime() ===
                                new Date(data.timestamp).getTime()
                            ) {
                                tempData[tagValue] = data.value;
                                tempData[tagLow] = data.low;
                                tempData[tagHigh] = data.high;
                            }
                        });
                        return tempData;
                    });
                }

                headersParameterLogs = [
                    t("export.date_time"),
                    t("export.duration"),
                    t("export.type"),
                    t("export.parameter"),
                    t("export.description"),
                ];
                bodyParameterLogs = arrayDataLogs.map((data) => {
                    let param = data.parameter
                        .split(" ")
                        .join("_")
                        .toLowerCase();
                    let desc = data.description
                        .split(" ")
                        .join("_")
                        .toLowerCase();
                    return {
                        [t("export.date_time")]: new Date(
                            data.start_time
                        ).toLocaleString("sv-SE"),
                        [t("export.duration")]: data.duration
                            ? data.duration
                            : "-",
                        [t("export.type")]: t(
                            "export." + data.type.toLowerCase()
                        ),
                        [t("export.parameter")]: t("export." + param),
                        [t("export.description")]: t("export." + desc),
                    };
                });

                headersParameterChart = Object.keys(datas) || [
                    "timestamp",
                    "tag_name",
                    "low",
                    "high",
                    "value",
                ];
                bodyParameterChart = parameterChartData.map((data) => {
                    data[t("export.timestamp")] = new Date(
                        data[t("export.timestamp")]
                    ).toLocaleString("sv-SE");
                    return data;
                });
                bodyParameterChart = parameterChartData.filter((data) => {
                    return Object.keys(data).length > 1;
                });

                const fileName = `[${t(
                    "export.spindle_condition"
                )}][${new Date().toLocaleString("sv-SE").replace(" ", ",")}][${
                    t("export.factory") + " " + filter.factory
                }][${t("export.shop_floor") + " " + filter.shop_floor}][${
                    t("export.machine_type") + " " + filter.machine_type
                }][${
                    t("export.machine_number") + " " + filter.machine_number
                }][${t("export.start_date") + " " + filter.start_date}][${
                    t("export.end_date") + " " + filter.end_date
                }]`;

                const data = [
                    {
                        sheetName: t("export.parameter_alert_logs"),
                        header: headersParameterLogs,
                        body: bodyParameterLogs,
                    },
                    {
                        sheetName: t("export.parameter_chart"),
                        header: headersParameterChart,
                        body: bodyParameterChart,
                    },
                ];
                exportCSVFile(data, fileName);
            }
            setIsLoading((prev) => {
                prev.export = false;
                return { ...prev };
            });
        });
    };

    const body = parameterLogs.map((data, index) => {
        return {
            date_time: data
                ? new Date(data.start_time).toLocaleString("sv-SE")
                : "",
            duration: data ? data.duration : "",
            parameter: data
                ? t(
                      "content.spindle_condition.parameter_alert_log.content.body." +
                          data.parameter.split(" ").join("_").toLowerCase()
                  )
                : "",
            description: data
                ? t(
                      "content.spindle_condition.parameter_alert_log.content.body." +
                          data.description.split(" ").join("_").toLowerCase()
                  )
                : "",
        };
    });

    useEffect(() => {
        if (filter.machine_number) {
            setIsLoading((prev) => {
                prev.data = true;
                return { ...prev };
            });
            getAssetTags(); //setAssetTags, setParameters, setTags
            setIsLoading((prev) => {
                prev.data = false;
                return { ...prev };
            });
        }
    }, [filter.machine_number]);

    useEffect(() => {
        if (
            filter.start_date !== "" &&
            filter.end_date !== "" &&
            filter.machine_number !== ""
        ) {
            getParameterAlertLogs(); //setParameterLogs, setCurrentPage
        }
    }, [parameter, filter, limit, currentPage]);

    useEffect(() => {
        getFactoryDropdown();
    }, [filter.factory]);

    useEffect(() => {
        getShopFloorDropdown();
    }, [filter.factory, filter.shop_floor]);

    useEffect(() => {
        getMachineTypeDropdown();
    }, [filter.shop_floor, filter.machine_type]);

    useEffect(() => {
        getMachineModelDropdown();
    }, [filter.machine_model, filter.machine_type]);

    useEffect(() => {
        getMachineNumberDropdown();
    }, [filter.machine_type, filter.machine_model, filter.machine_number]);

    useEffect(() => {
        if (parameterLogs.length > 0) {
            setTotalPage(
                Math.ceil(parameterLogs[0].total_data / limit) == 0
                    ? 1
                    : Math.ceil(parameterLogs[0].total_data / limit)
            );
            if (Math.ceil(parameterLogs[0].total_data / limit) < currentPage) {
                setCurrentPage(1);
            }
        } else {
            setTotalPage(1);
            setCurrentPage(1);
        }
    }, [parameterLogs, currentPage]);

    return (
        <div className='spindle-condition-container1'>
            <div className='spindle-condition-filter'>
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='factory'
                    label={t("content.filter.factory")}
                    value={filter.factory}
                    options={factory}
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
                    isLoading={isLoading.factory}
                    noEmptyOption
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='shop_floor'
                    label={t("content.filter.shop_floor")}
                    value={filter.shop_floor}
                    options={shopFloor}
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
                    isLoading={isLoading.shop_floor}
                    isDisabled={filter.factory === ""}
                    noEmptyOption
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_type'
                    label={t("content.filter.machine_type")}
                    value={filter.machine_type}
                    options={machineType}
                    onSelect={(e) => {
                        setFilter((prev) => {
                            prev.machine_type = e.value;
                            prev.machine_number = "";
                            prev.machine_model = "";
                            return { ...prev };
                        });

                        if (e.value === "") {
                            setFilter((prev) => {
                                prev.machine_number = "";
                                prev.machine_model = "";
                                return { ...prev };
                            });
                        }
                    }}
                    isLoading={isLoading.machine_type}
                    isDisabled={filter.shop_floor === ""}
                    noEmptyOption
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_model'
                    label={t("content.filter.machine_model")}
                    value={filter.machine_model}
                    options={machineModel}
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
                    isLoading={isLoading.machine_model}
                    isDisabled={filter.machine_type === ""}
                    noEmptyOption
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_number'
                    label={t("content.filter.machine_number")}
                    value={filter.machine_number}
                    options={machineNumber}
                    onSelect={(e) =>
                        setFilter((prev) => {
                            prev.machine_number = e.value;
                            return { ...prev };
                        })
                    }
                    isLoading={isLoading.machine_number}
                    isDisabled={filter.machine_type === ""}
                    noEmptyOption
                />
            </div>
            <div className='spindle-condition-filter-date'>
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
                            if (
                                new Date(e).getTime() >
                                new Date(filter.end_date).getTime()
                            ) {
                                setFilter((prev) => {
                                    prev.end_date = "";
                                    return { ...prev };
                                });
                            }
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
                </div>
                <div className='export-button'>
                    <Tooltip
                        tooltip={
                            <span className='icon-tooltip'>
                                {t("export.export")}
                            </span>
                        }>
                        <ExportButton
                            onClick={exportData}
                            isLoading={isLoading.export}
                        />
                    </Tooltip>
                </div>
            </div>
            <div className='spindle-condition-content'>
                <LoadingData
                    isLoading={isLoading.data}
                    useAltBackground={false}
                    size={"250px"}
                />
                <div className='left-side'>
                    <SpindleCondition
                        t={t}
                        machine_number={
                            assetTags.length > 0
                                ? assetTags[0].asset_number
                                : null
                        }
                        assetTags={assetTags}
                    />
                    <div className='parameter-log'>
                        <Card
                            title={t(
                                "content.spindle_condition.parameter_alert_log.header.parameter_alert_log"
                            )}
                            isLoading={isLoading.parameter_logs}
                            children={
                                <div className='parameter-content'>
                                    <div className='content-filter'>
                                        <div className='filter'>
                                            <InputDropdownHorizontal
                                                name='type'
                                                label={t(
                                                    "content.spindle_condition.parameter_alert_log.filter.type"
                                                )}
                                                value={
                                                    parameter.type !== ""
                                                        ? t(
                                                              "content.spindle_condition.parameter_alert_log.content.body." +
                                                                  parameter.type
                                                          )
                                                        : ""
                                                }
                                                onSelect={(e) => {
                                                    setParameter((prev) => {
                                                        prev.type = e.value;
                                                        return { ...prev };
                                                    });

                                                    if (e.value === "") {
                                                        setParameter((prev) => {
                                                            prev.parameter = "";
                                                            return { ...prev };
                                                        });
                                                    }
                                                }}
                                                options={typeDummy}
                                                isLoading={false}
                                                trans={
                                                    "content.spindle_condition.parameter_alert_log.content.body."
                                                }
                                            />
                                        </div>
                                        <div className='filter'>
                                            <InputDropdownHorizontal
                                                name='parameter'
                                                label={t(
                                                    "content.spindle_condition.parameter_alert_log.filter.parameter"
                                                )}
                                                value={
                                                    parameter.parameter !== ""
                                                        ? t(
                                                              "content.spindle_condition.parameter_alert_log.content.body." +
                                                                  parameter.parameter
                                                          )
                                                        : ""
                                                }
                                                onSelect={(e) =>
                                                    setParameter((prev) => {
                                                        prev.parameter =
                                                            e.value;
                                                        return { ...prev };
                                                    })
                                                }
                                                options={parameters}
                                                isLoading={false}
                                                trans={
                                                    "content.spindle_condition.parameter_alert_log.content.body."
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className='content-table'>
                                        <div className='table'>
                                            <>
                                                <Table
                                                    header={header}
                                                    body={body}
                                                    actions={[]}
                                                    selectable={false}
                                                    onSelect={(
                                                        selectedItem,
                                                        index
                                                    ) => {
                                                        // console.log(selectedItem);
                                                    }}
                                                    customCellClassNames={[]}
                                                />
                                                {parameterLogs.length === 0 &&
                                                    !isLoading.parameter_logs && (
                                                        <div className='no-data'>
                                                            No Data
                                                        </div>
                                                    )}
                                            </>
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
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        );
                                                    } else {
                                                        setCurrentPage(
                                                            currentPage
                                                        );
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>
                <div
                    className={`right-side${
                        assetTags.length > 0 ? "" : " right-side__no-chart"
                    }`}>
                    {assetTags.length > 0 &&
                        assetTags
                            // .filter((data, index) => index < 1)
                            .map((data, index) => {
                                return (
                                    <Chart
                                        key={index}
                                        t={t}
                                        data={data}
                                        length={assetTags.length}
                                        start_date={filter.start_date}
                                        end_date={filter.end_date}
                                        getAssetTags={getAssetTags}
                                    />
                                );
                            })}
                </div>
            </div>
        </div>
    );
};

export default SpindleConditionOverview;
