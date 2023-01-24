import "./style.scss";
import {
    InputDropdownHorizontal,
    PaginationStyle2,
    InputDateHorizontal,
    ExportButton,
    AlarmGuidelineButton,
    UploadImage,
    SearchBar,
    InputTextHorizontal,
    Table,
} from "../../ComponentReuseable/index";
import { ReactComponent as IconLineBar } from "../../../svg/linebaricon.svg";
import { ReactComponent as IconLineBarAfter } from "../../../svg/linebariconafter.svg";
import Card from "./Component/Card";
import { ReactComponent as IconTimelineBar } from "../../../svg/timelinebaricon.svg";
import { ReactComponent as IconTimelineBarAfter } from "../../../svg/timelinebariconafter.svg";
import { ReactComponent as ChartType2 } from "../../../svg/chart-type-2.svg";
import { useState, useEffect } from "react";
import { ReactComponent as StatusIcon } from "../../../svg/status.svg";
import ReactApexChart from "react-apexcharts";
import { ReturnHostBackend } from "../../ComponentReuseable/BackendHost";
import axios from "axios";
import { getToken } from "../../ComponentReuseable/TokenParse";
import { toast } from "react-toastify";
import useModal from "../../ComponentReuseable/useModal";
import ModalGuidlines from "./Component/ModalGuidlines";
import Tooltip from "../../ComponentReuseable/Tooltip";
import LoadingData from "../../ComponentReuseable/LoadingData";
import { exportCSVFile } from "../../ComponentReuseable/ExportFunction";
import { getLimitTableDCIM } from "../../ComponentReuseable/Functions";
import { TextDecoder } from "text-decoding";
import { type } from "@testing-library/user-event/dist/type";
const factoryDummy = ["Factory 1", "Factory 2"];
const shopFloorDummy = ["Shoop Floor 1", "Shoop Floor 2"];
const typeDummy = ["Type 1", "Type 2"];
const machineNoDummy = ["Machine No 1", "Machine No 2"];
const parameterDummy = ["Parameter 1", "Parameter 2"];
const limittable = 4;
const statusDummy = [
    {
        status: "Critical Alarm",
        total: 0,
        timetotal: "00:00:00",
    },
    {
        status: "Warning Alarm",
        total: 0,
        timetotal: "00:00:00",
    },
    {
        status: "Disconnected",
        total: 0,
        timetotal: "00:00:00",
    },
    {
        status: "No Alarm",
        total: 0,
        timetotal: "00:00:00",
    },
    {
        status: "Emergency",
        total: 0,
        timetotal: "00:00:00",
    },
];

const dummyseriesline = [
    {
        name: "critical",
        data: [
            10, 41, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0,
        ],
    },
    {
        name: "warning",
        data: [
            25, 70, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0,
        ],
    },
    {
        name: "disconnected",
        data: [
            15, 25, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0,
        ],
    },
    {
        name: "noalarm",
        data: [
            35, 20, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0,
        ],
    },
    {
        name: "emergency",
        data: [
            35, 20, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0,
        ],
    },
];

const dummyseriestopoccurency = [
    {
        data: [0, 0, 0, 0, 0],
    },
];

const dummyoptionsoccurency = {
    fill: {
        type: "gradient",
        gradient: {
            shade: "dark",
            gradientToColors: ["#B3140A"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100],
        },
    },
    chart: {
        animations: {
            enabled: false,
        },
        type: "bar",
        height: 350,
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
    },
    colors: ["#FF4A4A"],
    plotOptions: {
        bar: {
            // columnWidth: '100%',
            horizontal: true,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 5,
        colors: ["#fff"],
    },
    grid: {
        xaxis: {
            lines: {
                show: true,
            },
        },
    },

    xaxis: {
        categories: ["", "", "", "", ""],
        labels: {
            formatter: function(val) {
              //   if(typeof(val) !== "string" ){
                  return Math.floor(val);
              //   }
              //   else {
              //     return (val)
              //   }
              
            }
          }
      
    },
    yaxis: {
        labels: {
          formatter: function(val) {
              if(typeof(val) !== "string" ){
                return Math.floor(val);
              }
              else {
                return (val)
              }
            
          }
        }
      }
};

const dummyoptionsoccurencysecond = {
    fill: {
        type: "gradient",
        gradient: {
            shade: "dark",
            gradientToColors: ["#DA620A"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100],
        },
    },
    chart: {
        animations: {
            enabled: false,
        },
        type: "bar",
        height: 350,
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
    },
    colors: ["#FEB324"],
    plotOptions: {
        bar: {
            // columnWidth: '100%',
            horizontal: true,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 5,
        colors: ["#fff"],
    },
    grid: {
        xaxis: {
            lines: {
                show: true,
            },
        },
    },

    xaxis: {
        categories: ["", "", "", "", ""],
        labels: {
            formatter: function(val) {
              //   if(typeof(val) !== "string" ){
                  return Math.floor(val);
              //   }
              //   else {
              //     return (val)
              //   }
              
            }
          }
      
    },
    yaxis: {
        labels: {
          formatter: function(val) {
              if(typeof(val) !== "string" ){
                return Math.floor(val);
              }
              else {
                return (val)
              }
            
          }
        }
      }
  
};

const dummyseriestoperrorcode = [
    {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
];

const dummyoptionserrorcode = {
    chart: {
        animations: {
            enabled: false,
        },
        height: 350,
        type: "bar",
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
    },
    colors: ["#FFB425"],
    plotOptions: {
        bar: {
            columnWidth: "40%",
            distributed: true,
        },
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false,
    },
    xaxis: {
        categories: ["", "", "", "", "", "", "", "", "", ""],
        labels: {
            style: {
                colors: ["#000000"],
                fontSize: "12px",
            },
        },
    },
    yaxis: [
        {
          labels: {
            formatter: function(val) {
              return val.toFixed(0);
            }
          }
        }
      ]
};

const MachineAlarmStatus = (props) => {
    const { t } = props;

    const dummyseries = [];

    const dummyoptionsline = {
        colors: ["#FF3F25", "#FFA800", "#AEBECD", "#44CB4C", "#C91212"],
        chart: {
            animations: {
                enabled: false,
            },
            //   height: 350,
            type: "line",
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
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "straight",
        },
        legend: {
            show: false,
        },
        grid: {
            row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5,
            },
        },
        xaxis: {
            categories: ["2021.11.10", "2021.11.11", "2021.11.12"],
        },
        yaxis: {
            show: true,

            tickAmount: 5,
            min: 0,
            max: 100,
        },
        // tooltip: {
        //     custom: (opts) => {
        //         const condition = opts.w.globals.seriesNames[opts.seriesIndex];
        //         return `<div class="chart-tooltip">

        //              <div>${opts.w.globals.labels[opts.dataPointIndex]} </div>
        //         <div>${t(
        //             "content.machine_alarm_status.alarm_trend_status_chart.content." +
        //                 condition
        //         )} (${opts.series[opts.seriesIndex][opts.dataPointIndex]})</div>
        //         <div>`;
        //     },
        //     followCursor: true,
        // },
    };

    const dummyoptions = {
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
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: "100%",
                rangeBarGroupRows: true,
            },
        },
        colors: [
            (params) => {
                const values = params.seriesIndex;
                const state = params.w.globals.seriesNames[values];
                return state === "noalarm" || state === "Good"
                    ? "#0DC540"
                    : state === "warning"
                    ? "#FFB71B"
                    : state === "critical" || state === "DOWN"
                    ? "#FF3F25"
                    : state === "disconnected"
                    ? "#A6AFB8"
                    : state === "emergency"
                    ? "#C91212"
                    : "#51414C";
            },
        ],
        fill: {
            type: "solid",
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
            min: new Date("2022-03-09").getTime(),
            max: new Date("2022-03-15").getTime(),

            tickAmount: 24,
            tickPlacement: "on",
            labels: {
                showDuplicates: false,
                show: true,
                style: {
                    colors: ["black"],
                    fontSize: "12px",

                    fontWeight: 500,
                    // cssClass: "apexcharts-xaxis-label",
                },
                datetimeUTC: false,
                format: "dd/MM/yyyy",

                // "HH:mm" "dd/MM/yyyy"
            },
        },
        legend: {
            show: false,
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
            <div>  ${t(
                "content.machine_alarm_status.alarm_trend_status_chart.content." +
                    condition
            )}</div>
            <div>`;
            },
        },
    };
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
        start_date: today,
        end_date: today,
        // 2022-03-16
    });

    const [isLoading, setIsLoading] = useState({
        data: false,
        factory: false,
        shop_floor: false,
        machine_type: false,
        machine_number: false,
    });

    const [factory, setFactory] = useState([]);
    const [shopFloor, setShopFloor] = useState([]);
    const [machineType, setMachineType] = useState([]);
    const [machineModel, setMachineModel] = useState([]);
    const [machineNumber, setMachineNumber] = useState([]);
    const [typecode, setTypecode] = useState([]);
    const [codelist, setCodelist] = useState([]);

    const [parameter, setParameter] = useState({
        type: "",
        parameter: "",
    });
    const [chartType, setChartType] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(10);
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(12);

    const [optionsoccurencycritical, Setoptionsoccurencycritical] = useState(
        dummyoptionsoccurency
    );
    const [seriestopoccurencycritical, Setseriestopoccurencycritical] =
        useState(dummyseriestopoccurency);

    const [optionsoccurencywarning, Setoptionsoccurencywarning] = useState(
        dummyoptionsoccurencysecond
    );
    const [seriestopoccurencywarning, Setseriestopoccurencywarning] = useState(
        dummyseriestopoccurency
    );

    const [seriestoperrorcode, Setseriestoperrorcode] = useState(
        dummyseriestoperrorcode
    );

    const [optionstoperrorcode, Setoptionstoperrorcode] = useState(
        dummyoptionserrorcode
    );

    const [optionstrendseriesline, Setoptionstrendseriesline] =
        useState(dummyoptionsline);

    const [seriestrendseriesline, Setseriestrendseriesline] =
        useState(dummyseriesline);

    const [seriestrendtimeline, Setseriestrendtimeline] = useState(dummyseries);
    const [optionstrendtimeline, Setoptionstrendtimeline] =
        useState(dummyoptions);
    const [countcritical, setCountCritical] = useState(0);

    const [countwarning, setCountwarning] = useState(0);

    const [countemergency, setCountemergency] = useState(0);

    const [datapersen, setDatapersen] = useState(statusDummy);

    const { isShowing: isShowingGuidlines, toggle: showingGuidlines } =
        useModal();

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

            case "Critical Alarm":
                return "#FF3F25";

            case "Warning Alarm":
                return "#FFA800";

            case "Disconnected":
                return "#AEBECD";

            case "No Alarm":
                return "#44CB4C";
            case "Emergency":
                return "#C91212";

            default:
                return "#8899AB";
        }
    };

    const handleChangeSearch = (value) => {
        setSearch(value);
    };

    const header = {
        no: {
            width: "40px",
            name: t("content.machine_alarm_status.alarm_log.content.no"),
        },
        // date: {
        //     width: "105px",
        //     name: t("content.machine_alarm_status.alarm_log.content.date"),
        // },
        time_start: {
            width: "95px",
            name: t(
                "content.machine_alarm_status.alarm_log.content.time_start"
            ),
        },
        time_stop: {
            width: "95px",
            name: t("content.machine_alarm_status.alarm_log.content.time_stop"),
        },
        duration: {
            width: "95px",
            name: t("content.machine_alarm_status.alarm_log.content.duration"),
        },
        type: {
            width: "120px",
            name: t("content.machine_alarm_status.alarm_log.content.type"),
        },
        code: {
            width: "70px",
            name: t("content.machine_alarm_status.alarm_log.content.code"),
        },
        alarm_kinds: {
            width: "215px",
            name: t(
                "content.machine_alarm_status.alarm_log.content.alarm_kinds"
            ),
        },
    };

    const [body, setBodyTable] = useState([]);

    // const body = new Array(3).fill({}).map((item, index) => {
    //     return {
    //         no: "",
    //         // date: "",
    //         time_start: "",
    //         time_stop: "",
    //         duration: "",
    //         type: "",
    //         code: "",
    //         alarm_kinds: "",
    //     };
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
                // //////////console.log("getFactoryDropdown");
                // //////////console.log(result.data.data);
                // //////////////console.log(result.data.data[0])
                setFilter((prev) => {
                    prev.factory = result.data.data[0].name;
                    return { ...prev };
                });
                setFactory(result.data.data);
            } else {
                setFactory([]);
            }
        } catch (e) {
            // console.error(e);

            toast.error(
                t(
                    "content.shop_floor_overview.error.ErrorcallingAPItogetfloorsdata"
                ),
                {
                    toastId: "failed-get-factory-data",
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
                setMachineType(result.data.data);
                setFilter((prev) => {
                    prev.machine_type = result.data.data[0].name;
                    return { ...prev };
                });
            } else {
                setMachineType([]);
            }
        } catch (e) {
            // console.error(e);

            // toast.error(
            //     t(
            //         "content.shop_floor_overview.error.Errorgettingfunctionsdata"
            //     ),
            //     {
            //         toastId: "failed-get-machine-type-data",
            //     }
            // );
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
                if (result.data.data[0].name) {
                    setFilter((prev) => {
                        prev.shop_floor = result.data.data[0].name;
                        return { ...prev };
                    });
                }

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
                if (result.data.data[0].name) {
                    setFilter((prev) => {
                        prev.machine_model = result.data.data[0].name;
                        return { ...prev };
                    });
                }
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
    const getMachineNumberDropdown = async () => {
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env
                    .REACT_APP_MACHINE_PARAMETER_OVERVIEW_GET_MACHINE_NUMBER_DROPDOWN_MACHINE,
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
                if (result.data.data[0].name) {
                    setFilter((prev) => {
                        prev.machine_number = result.data.data[0].name;
                        return { ...prev };
                    });
                }
                setMachineNumber(result.data.data);
            } else {
                setMachineNumber([]);
            }
        } catch (e) {
            // console.error(e);

            // toast.error(
            //     t(
            //         "content.shop_floor_overview.error.Failedtogetmachinenumberdata"
            //     ),
            //     {
            //         toastId: "failed-get-machine-number-data",
            //     }
            // );
        }
    };

    const getcountAlarm = async (
        asset_number,
        code,
        type,
        start_date,
        end_date
    ) => {
        setIsLoading((prev) => {
            prev.data = true;
            return { ...prev };
        });

        if (type === "" && code === "") {
            Setoptionsoccurencycritical(dummyoptionsoccurency);
            Setseriestopoccurencycritical(dummyseriestopoccurency);

            Setoptionsoccurencywarning(dummyoptionsoccurencysecond);
            Setseriestopoccurencywarning(dummyseriestopoccurency);

            Setseriestoperrorcode(dummyseriestoperrorcode);
            Setoptionstoperrorcode(dummyoptionserrorcode);

            Setoptionstrendseriesline(dummyoptionsline);

            Setseriestrendseriesline(dummyseriesline);

            Setseriestrendtimeline(dummyseries);
            Setoptionstrendtimeline(dummyoptions);
        }

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

        const limittable = getLimitTableDCIM();
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env.REACT_APP_GET_ALARM_COUNT_v2,
            headers: {
                authorization: getToken(),
            },
            data: {
                types: type,
                codes: code,
                asset_number: asset_number,
                dates: stringdates !== "" ? stringdates.slice(0, -1) : "",
            },
        };
        try {
            const result = await axios(config);
            ////console.log("result.data.data")
            ////console.log(result.data.data)

            if (result.data) {
                setTotal(result.data.data.length);
                if (Math.ceil(result.data.data.length / limittable) === 0) {
                    setTotalPage(1);
                } else {
                    setTotalPage(
                        Math.ceil(result.data.data.length / limittable)
                    );
                }

                //occurency

                let arrayoptions = [];
                let arrayseries = [];

                result.data.fiveoccurencycritical.forEach((data) => {
                    arrayoptions.push(data.code);
                    arrayseries.push(data.count);
                });

                if (arrayoptions.length < 5) {
                    new Array(5 - arrayoptions.length)
                        .fill()
                        .forEach((element) => {
                            arrayseries.push("0");
                            arrayoptions.push("");
                        });
                }

                Setseriestopoccurencycritical((prevState) => [
                    {
                        data: arrayseries,
                    },
                ]);

                Setoptionsoccurencycritical((prevState) => ({
                    ...prevState,
                    xaxis: {
                        ...prevState.type,
                        categories: arrayoptions,
                    },
                }));

                arrayoptions = [];
                arrayseries = [];

                result.data.fiveoccurencywarning.map((data, i) => {
                    arrayoptions.push(data.code);
                    arrayseries.push(data.count);
                });

                if (arrayoptions.length < 5) {
                    new Array(5 - arrayoptions.length)
                        .fill()
                        .forEach((element) => {
                            arrayseries.push("0");
                            arrayoptions.push("");
                        });
                }

                Setseriestopoccurencywarning((prevState) => [
                    {
                        data: arrayseries,
                    },
                ]);

                Setoptionsoccurencywarning((prevState) => ({
                    ...prevState,
                    xaxis: {
                        ...prevState.type,
                        categories: arrayoptions,
                    },
                }));

                arrayoptions = [];
                arrayseries = [];

                result.data.tencodeerror.map((data, i) => {
                    arrayoptions.push(data.code);
                });

                result.data.tencodeerror.map((data, i) => {
                    arrayseries.push(data.count);
                });

                if (arrayoptions.length < 10) {
                    new Array(10 - arrayoptions.length)
                        .fill()
                        .forEach((element) => {
                            arrayseries.push("0");
                            arrayoptions.push("");
                        });
                }

                Setseriestoperrorcode((prevState) => [
                    {
                        data: arrayseries,
                    },
                ]);

                Setoptionstoperrorcode((prevState) => ({
                    ...prevState,
                    xaxis: {
                        ...prevState.type,
                        categories: arrayoptions,
                    },
                }));

                //occurency
                setTypecode(result.data.listtype);
                ////console.log("type")
                ////console.log(type)
                if (type === "") {
                    setCodelist([]);
                    setParameter((prev) => {
                        prev.parameter = "";
                        return { ...prev };
                    });
                } else {
                    setCodelist(result.data.listcode);
                }

                if (type === "" && code === "") {
                    let countcritical = 0;
                    let countwarning = 0;
                    let countemergency = 0;

                    if (start_date === end_date) {
                        const categories = [
                            "00:00",
                            "01:00",
                            "02:00",
                            "03:00",
                            "04:00",
                            "05:00",
                            "06:00",
                            "07:00",
                            "08:00",
                            "09:00",
                            "10:00",
                            "11:00",
                            "12:00",
                            "13:00",
                            "14:00",
                            "15:00",
                            "16:00",
                            "17:00",
                            "18:00",
                            "19:00",
                            "20:00",
                            "21:00",
                            "22:00",
                            "23:00",
                            "24:00",
                        ];

                        const arraydata = [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0,
                        ];

                        const dummyserieslinebar = [
                            {
                                name: "critical",
                                data: arraydata,
                            },
                            {
                                name: "warning",
                                data: arraydata,
                            },
                            {
                                name: "disconnected",
                                data: arraydata,
                            },
                            {
                                name: "noalarm",
                                data: arraydata,
                            },
                            {
                                name: "emergency",
                                data: arraydata,
                            },
                        ];

                        Setoptionstrendseriesline((prevState) => ({
                            ...prevState,
                            xaxis: {
                                ...prevState,
                                categories: categories,
                            },
                        }));

                        if (result.data.data.length > 0) {
                            let count = 0;
                            let countseries = [0, 0, 0, 0, 0];
                            let dummytimeline = [];
                            result.data.data.forEach((element) => {
                                ///timeline

                                if (element.type === "critical") {
                                    countcritical = countcritical + 1;
                                }

                                if (element.type === "warning") {
                                    countwarning = countwarning + 1;
                                }
                                if (element.type === "emergency") {
                                    countemergency = countemergency + 1;
                                }

                                const seriesdummy = {
                                    name: element.type,
                                    data: [
                                        {
                                            x: "Status",
                                            y: [
                                                new Date(
                                                    element.start_date
                                                ).getTime(),
                                                new Date(
                                                    element.end_date
                                                ).getTime(),
                                            ],
                                        },
                                    ],
                                };

                                dummytimeline.push(seriesdummy);

                                let index = dummyserieslinebar.findIndex(
                                    (elementlinebar) =>
                                        elementlinebar.name === element.type
                                );

                                // ////console.log("index :",index)

                                if (index !== -1) {
                                    var start_date = new Date(
                                        element.start_date
                                    );
                                    var end_date = new Date(element.end_date);

                                    if (
                                        start_date.getDate() ===
                                        end_date.getDate()
                                    ) {
                                        var seconds = start_date.getSeconds();
                                        var minutes = start_date.getMinutes();
                                        var hour = start_date.getHours();
                                    } else {
                                        var seconds = 0;
                                        var minutes = 0;
                                        var hour = 0;
                                    }

                                    var secondsend_date = end_date.getSeconds();
                                    var minutesend_date = end_date.getMinutes();
                                    var hourend_date = end_date.getHours();

                                    let arraydataupdate = [
                                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    ];
                                    if (
                                        hourend_date === 23 &&
                                        minutesend_date === 59 &&
                                        secondsend_date === 59
                                    ) {
                                        hourend_date = 24;
                                        minutesend_date = 0;
                                        secondsend_date = 0;
                                    }

                                    if (hourend_date - hour > 1) {
                                        if (minutes === 0 && seconds === 0) {
                                            if (
                                                minutesend_date === 0 &&
                                                secondsend_date === 0
                                            ) {
                                                for (
                                                    let i = 0;
                                                    i < hourend_date - hour + 1;
                                                    i++
                                                ) {
                                                    arraydataupdate[
                                                        hour + i
                                                    ] = 100;
                                                }
                                            } else {
                                                for (
                                                    let i = 0;
                                                    i < hourend_date - hour;
                                                    i++
                                                ) {
                                                    arraydataupdate[
                                                        hour + i
                                                    ] = 100;
                                                }

                                                arraydataupdate[hourend_date] =
                                                    Math.round(
                                                        (minutesend_date * 60 +
                                                            secondsend_date) /
                                                            36
                                                    );
                                            }
                                        } else {
                                            if (
                                                minutesend_date === 0 &&
                                                secondsend_date === 0
                                            ) {
                                                for (
                                                    let i = 1;
                                                    i < hourend_date - hour + 1;
                                                    i++
                                                ) {
                                                    arraydataupdate[
                                                        hour + i
                                                    ] = 100;
                                                }
                                                arraydataupdate[hour] =
                                                    100 -
                                                    Math.round(
                                                        (minutes * 60 +
                                                            seconds) /
                                                            36
                                                    );
                                            } else {
                                                for (
                                                    let i = 1;
                                                    i < hourend_date - hour;
                                                    i++
                                                ) {
                                                    arraydataupdate[
                                                        hour + i
                                                    ] = 100;
                                                }
                                                arraydataupdate[hour] =
                                                    100 -
                                                    Math.round(
                                                        (minutes * 60 +
                                                            seconds) /
                                                            36
                                                    );
                                                arraydataupdate[hourend_date] =
                                                    Math.round(
                                                        (minutesend_date * 60 +
                                                            secondsend_date) /
                                                            36
                                                    );
                                            }
                                        }

                                        dummyserieslinebar[index].data =
                                            arraydataupdate;
                                    }
                                    if (hourend_date - hour === 0) {
                                        arraydataupdate[hour] = Math.round(
                                            (minutesend_date * 60 +
                                                secondsend_date) /
                                                36 -
                                                (minutes * 60 + seconds) / 36
                                        );
                                        dummyserieslinebar[index].data =
                                            arraydataupdate;
                                    }

                                    if (hourend_date - hour === 1) {
                                        arraydataupdate[hour] =
                                            100 -
                                            Math.round(
                                                (minutes * 60 + seconds) / 36
                                            );

                                        arraydataupdate[hourend_date] =
                                            Math.round(
                                                (minutesend_date * 60 +
                                                    secondsend_date) /
                                                    36
                                            );

                                        dummyserieslinebar[index].data =
                                            arraydataupdate;
                                    }

                                    count = Math.round(
                                        hourend_date * 3600 +
                                            minutesend_date * 60 +
                                            secondsend_date -
                                            (hour * 3600 +
                                                minutes * 60 +
                                                seconds)
                                    );

                                    countseries[index] =
                                        countseries[index] + count;
                                }
                            });

                            const tempstatusDummy = [
                                {
                                    status: "Critical Alarm",
                                    total: 0,
                                    timetotal: "00:00:00",
                                },
                                {
                                    status: "Warning Alarm",
                                    total: 0,
                                    timetotal: "00:00:00",
                                },
                                {
                                    status: "Disconnected",
                                    total: 0,
                                    timetotal: "00:00:00",
                                },
                                {
                                    status: "No Alarm",
                                    total: 0,
                                    timetotal: "00:00:00",
                                },
                                {
                                    status: "Emergency",
                                    total: 0,
                                    timetotal: "00:00:00",
                                },
                            ];
                            ////console.log("countseries");
                            ////console.log(countseries);
                            Setseriestrendtimeline(dummytimeline);

                            countseries.forEach((element, i) => {
                                tempstatusDummy[i].total = Math.round(
                                    element / (24 * 36)
                                );
                                tempstatusDummy[i].timetotal =
                                    toHHMMSS(element);
                            });

                            setDatapersen(tempstatusDummy);
                            Setoptionstrendtimeline((prevState) => ({
                                ...prevState,
                                xaxis: {
                                    ...prevState.xaxis,
                                    min: new Date(start_date).setHours(0, 0, 0),
                                    max: new Date(end_date).setHours(
                                        23,
                                        59,
                                        59
                                    ),
                                    labels: {
                                        ...prevState.xaxis.labels,
                                        format: "HH:mm",
                                    },
                                },
                            }));

                            Setseriestrendseriesline(dummyserieslinebar);
                        } else {
                            setDatapersen(statusDummy);
                            Setseriestrendseriesline(dummyserieslinebar);
                        }
                    } else {
                        //forbarline

                        // start_date !== end_date
                        const categories = [];

                        const arraydata = [];

                        var now = new Date(end_date);

                        for (
                            var d = new Date(start_date);
                            d <= now;
                            d.setDate(d.getDate() + 1)
                        ) {
                            categories.push(toYearMMdd(new Date(d)));
                            arraydata.push(0);
                        }

                        const dummyserieslinebar = [
                            {
                                name: "critical",
                                data: arraydata,
                            },
                            {
                                name: "warning",
                                data: arraydata,
                            },
                            {
                                name: "disconnected",
                                data: arraydata,
                            },
                            {
                                name: "noalarm",
                                data: arraydata,
                            },
                            {
                                name: "emergency",
                                data: arraydata,
                            },
                        ];

                        Setoptionstrendseriesline((prevState) => ({
                            ...prevState,
                            xaxis: {
                                ...prevState.type,
                                categories: categories,
                            },
                        }));
                        //////console.log("categories");
                        //////console.log(categories);

                        if (result.data.data.length > 0) {
                            let count = 0;
                            let countseries = [0, 0, 0, 0, 0];

                            let arraydataupdate = new Array(
                                arraydata.length
                            ).fill(0);
                            let arraydataupdate_warning = new Array(
                                arraydata.length
                            ).fill(0);
                            let arraydataupdate_disconected = new Array(
                                arraydata.length
                            ).fill(0);
                            let arraydataupdate_noalarm = new Array(
                                arraydata.length
                            ).fill(0);
                            let arraydataupdate_emergency = new Array(
                                arraydata.length
                            ).fill(0);

                            let dummytimeline = [];

                            result.data.data.forEach((element, i) => {
                                //fortimeline
                                ////////console.log("");
                                ////////console.log("i  ",i);
                                if (element.type === "critical") {
                                    countcritical = countcritical + 1;
                                }

                                if (element.type === "warning") {
                                    countwarning = countwarning + 1;
                                }

                                if (element.type === "emergency") {
                                    countemergency = countemergency + 1;
                                }
                                const seriesdummy = {
                                    name: element.type,
                                    data: [
                                        {
                                            x: "Status",
                                            y: [
                                                new Date(
                                                    element.start_date
                                                ).getTime(),
                                                new Date(
                                                    element.end_date
                                                ).getTime(),
                                            ],
                                        },
                                    ],
                                };

                                dummytimeline.push(seriesdummy);

                                //forbartimeline

                                var start_date = new Date(element.start_date);
                                var end_date = new Date(element.end_date);

                                if (
                                    start_date.getDate() === end_date.getDate()
                                ) {
                                    start_date = new Date(element.start_date);

                                    var seconds = start_date.getSeconds();
                                    var minutes = start_date.getMinutes();
                                    var hour = start_date.getHours();
                                } else {
                                    start_date = new Date(
                                        start_date.setDate(
                                            start_date.getDate() + 1
                                        )
                                    );

                                    var seconds = 0;
                                    var minutes = 0;
                                    var hour = 0;
                                }

                                let indextype = dummyserieslinebar.findIndex(
                                    (elementlinebar) =>
                                        elementlinebar.name === element.type
                                );
                                let index = categories.findIndex(
                                    (elementlinebar) =>
                                        elementlinebar ===
                                        toYearMMddnew(start_date)
                                );

                                var secondsend_date = end_date.getSeconds();
                                var minutesend_date = end_date.getMinutes();
                                var hourend_date = end_date.getHours();
                                //console.log("indextype")
                                //console.log(indextype)

                                if (indextype === 0) {
                                    let count = Math.round(
                                        hourend_date * 3600 +
                                            minutesend_date * 60 +
                                            secondsend_date -
                                            (hour * 3600 +
                                                minutes * 60 +
                                                seconds)
                                    );

                                    arraydataupdate[index] =
                                        arraydataupdate[index] +
                                        Math.round(count / (36 * 24));
                                    dummyserieslinebar[indextype].data =
                                        arraydataupdate;
                                    ////////console.log("count")
                                    ////////console.log( count)

                                    ////////console.log("arraydataupdate")
                                    ////////console.log( arraydataupdate)
                                }

                                if (indextype === 1) {
                                    let count = Math.round(
                                        hourend_date * 3600 +
                                            minutesend_date * 60 +
                                            secondsend_date -
                                            (hour * 3600 +
                                                minutes * 60 +
                                                seconds)
                                    );

                                    arraydataupdate_warning[index] =
                                        arraydataupdate_warning[index] +
                                        Math.round(count / (36 * 24));
                                    dummyserieslinebar[indextype].data =
                                        arraydataupdate_warning;
                                }

                                if (indextype === 2) {
                                    let count = Math.round(
                                        hourend_date * 3600 +
                                            minutesend_date * 60 +
                                            secondsend_date -
                                            (hour * 3600 +
                                                minutes * 60 +
                                                seconds)
                                    );

                                    arraydataupdate_disconected[index] =
                                        arraydataupdate_disconected[index] +
                                        Math.round(count / (36 * 24));
                                    dummyserieslinebar[indextype].data =
                                        arraydataupdate_disconected;
                                }

                                if (indextype === 3) {
                                    let count = Math.round(
                                        hourend_date * 3600 +
                                            minutesend_date * 60 +
                                            secondsend_date -
                                            (hour * 3600 +
                                                minutes * 60 +
                                                seconds)
                                    );

                                    arraydataupdate_noalarm[index] =
                                        arraydataupdate_noalarm[index] +
                                        Math.round(count / (36 * 24));
                                    dummyserieslinebar[indextype].data =
                                        arraydataupdate_noalarm;
                                }

                                if (indextype === 4) {
                                    let count = Math.round(
                                        hourend_date * 3600 +
                                            minutesend_date * 60 +
                                            secondsend_date -
                                            (hour * 3600 +
                                                minutes * 60 +
                                                seconds)
                                    );

                                    arraydataupdate_emergency[index] =
                                        arraydataupdate_emergency[index] +
                                        Math.round(count / (36 * 24));
                                    dummyserieslinebar[indextype].data =
                                        arraydataupdate_emergency;
                                }

                                count = Math.round(
                                    hourend_date * 3600 +
                                        minutesend_date * 60 +
                                        secondsend_date -
                                        (hour * 3600 + minutes * 60 + seconds)
                                );

                                countseries[indextype] =
                                    countseries[indextype] + count;
                            });
                            //////////console.log("dummytimeline")

                            //////////console.log(dummytimeline)

                            Setseriestrendtimeline(dummytimeline);
                            var date = new Date(start_date);

                            // add a day
                            date.setDate(date.getDate() - 1);
                            Setseriestrendtimeline(dummytimeline);
                            Setoptionstrendtimeline((prevState) => ({
                                ...prevState,
                                xaxis: {
                                    ...prevState.xaxis,
                                    min: date.getTime(),
                                    max: new Date(end_date).getTime(),
                                    labels: {
                                        ...prevState.xaxis.labels,
                                        format: "dd/MM/yyyy",
                                    },
                                },
                            }));

                            const tempstatusDummy = [
                                {
                                    status: "Critical Alarm",
                                    total: 0,
                                    timetotal: "00:00:00",
                                },
                                {
                                    status: "Warning Alarm",
                                    total: 0,
                                    timetotal: "00:00:00",
                                },
                                {
                                    status: "Disconnected",
                                    total: 0,
                                    timetotal: "00:00:00",
                                },
                                {
                                    status: "No Alarm",
                                    total: 0,
                                    timetotal: "00:00:00",
                                },
                                {
                                    status: "Emergency",
                                    total: 0,
                                    timetotal: "00:00:00",
                                },
                            ];

                            countseries.forEach((element, i) => {
                                tempstatusDummy[i].total = Math.round(
                                    element / (24 * 36 * arraydata.length)
                                );
                                tempstatusDummy[i].timetotal =
                                    toHHMMSS(element);
                            });

                            setDatapersen(tempstatusDummy);

                            ////////console.log("dummyserieslinebar")
                            ////////console.log(dummyserieslinebar)
                        }

                        Setseriestrendseriesline(dummyserieslinebar);
                    }

                    setCountCritical(countcritical);
                    setCountwarning(countwarning);
                    setCountemergency(countemergency);
                }

                // setBodyTable(arraydatatable);
                // setMachineNumber(result.data.data);
                setIsLoading((prev) => {
                    prev.data = false;
                    return { ...prev };
                });
            } else {
                setIsLoading((prev) => {
                    prev.data = false;
                    return { ...prev };
                });
                setBodyTable([]);
                Setseriestrendtimeline(dummyseries);
            }
        } catch (e) {
            setIsLoading((prev) => {
                prev.data = false;
                return { ...prev };
            });
            // console.error(e);

            toast.error(
                t(
                    "content.shop_floor_overview.error.Failedtogetcountalarmdata"
                ),
                {
                    toastId: "failed-get-count-alarm-data",
                }
            );
        }
    };

    const getListAlarm = async () => {
        setIsLoading((prev) => {
            prev.data = true;
            return { ...prev };
        });

        const limittable = getLimitTableDCIM();
        let stringdates = "";

        var now = new Date(filter.end_date);

        for (
            var d = new Date(filter.start_date);
            d <= now;
            d.setDate(d.getDate() + 1)
        ) {
            stringdates = stringdates + toYearMMdd(new Date(d)) + ",";
        }
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env.REACT_APP_GET_ALARM_LIST_v2,
            headers: {
                authorization: getToken(),
            },
            data: {
                types: parameter.type,
                codes: parameter.parameter,
                asset_number: filter.machine_number,
                limit: limittable,
                page: currentPage,
                dates: stringdates !== "" ? stringdates.slice(0, -1) : "",
            },
        };
        try {
            const result = await axios(config);

            if (result.data) {
                let arraydatatable = [];

                result.data.map((data, i) => {
                    const datatable = {
                        no: i + 1,
                        // date: "",
                        time_start: yyyymmddhhmmss(data.start_date),
                        time_stop: yyyymmddhhmmss(data.end_date),
                        duration: toHHMMSS(data.difference),
                        type:t(
                            "content.machine_alarm_status.alarm_trend_status_chart.content." +
                            data.type
                        ),
                        code: data.code,
                        alarm_kinds:
                            // data.alarm_kinds
                            new TextDecoder("gb18030").decode(
                                new Uint8Array(
                                    toHex(data.alarm_kinds).split(",")
                                )
                            ),
                    };
                    arraydatatable.push(datatable);
                });

                setBodyTable(arraydatatable);
                // setMachineNumber(result.data);
                setIsLoading((prev) => {
                    prev.data = false;
                    return { ...prev };
                });
            } else {
                setIsLoading((prev) => {
                    prev.data = false;
                    return { ...prev };
                });
                setBodyTable([]);
            }
        } catch (e) {
            setIsLoading((prev) => {
                prev.data = false;
                return { ...prev };
            });
            // console.error(e);

            toast.error(
                t("content.shop_floor_overview.error.Failedtogetalarmdata"),
                {
                    toastId: "failed-get-alarm-data",
                }
            );
        }
    };

    const getlisttype = async () => {
        setTypecode([]);
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_GET_ALARM_LIST_TYPE,
            headers: {
                authorization: getToken(),
            },
            data: {
                asset_number: filter.machine_number,
                start_date: filter.start_date,
                end_date: filter.end_date,
            },
        };
        try {
            const result = await axios(config);
            if (result.data) {
                // setTypecode(result.data.data);
            } else {
                setTypecode([]);
            }
        } catch (e) {
            // console.error(e);

            toast.error(
                t("content.shop_floor_overview.error.failedgetlisttypealarm"),
                {
                    toastId: "failed-get-type-alarm-data",
                }
            );
        }
    };

    const getlistcode = async () => {
        setCodelist([]);
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_GET_ALARM_LIST_CODE,
            headers: {
                authorization: getToken(),
            },
            data: {
                asset_number: filter.machine_number,
                start_date: filter.start_date,
                end_date: filter.end_date,
                type: parameter.type,
            },
        };
        try {
            const result = await axios(config);
            if (result.data) {
                setCodelist(result.data.data);
            } else {
                setCodelist([]);
            }
        } catch (e) {
            // console.error(e);

            toast.error(
                t("content.shop_floor_overview.error.failedgetlistcodealarm"),
                {
                    toastId: "failed-get-alarm-data",
                }
            );
        }
    };

    const getTenErrorCode = async () => {
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_GET_ALARM_TEN_ERROR_CODE,
            headers: {
                authorization: getToken(),
            },
            data: {
                asset_number: filter.machine_number,
                start_date: filter.start_date,
                end_date: filter.end_date,
            },
        };
        try {
            const result = await axios(config);

            if (result.data) {
            } else {
                Setseriestoperrorcode(dummyseriestoperrorcode);

                Setoptionstoperrorcode(dummyoptionserrorcode);
            }
        } catch (e) {
            // console.error(e);

            toast.error(
                t("content.shop_floor_overview.error.Failedtogettenerrorcode"),
                {
                    toastId: "failed-get-ten-error-data",
                }
            );
        }
    };

    const getFiveOccurence = async (type, asset_number) => {
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_DATA_HUB) +
                process.env.REACT_APP_GET_ALARM_FIVE_OCCURENCE,
            headers: {
                authorization: getToken(),
            },
            data: {
                type: type,
                asset_number: asset_number,
                start_date: filter.start_date,
                end_date: filter.end_date,
            },
        };
        try {
            const result = await axios(config);
            if (result.data) {
                let arrayoptions = [];
                let arrayseries = [];
                if (type === "critical") {
                } else {
                }
            } else {
                Setoptionsoccurencycritical(dummyoptionsoccurency);
                Setseriestopoccurencycritical(dummyseriestopoccurency);

                Setoptionsoccurencywarning(dummyoptionsoccurencysecond);
                Setseriestopoccurencywarning(dummyseriestopoccurency);
            }
        } catch (e) {
            // console.error(e);

            toast.error(
                t("content.shop_floor_overview.error.Failedtogetoccurencedata"),
                {
                    toastId: "failed-get-occurence-data",
                }
            );
        }
    };

    const exportDataAsset = async (body) => {
        const fileName = `Alarm_[${new Date()
            .toLocaleString("sv-SE")
            .replace(" ", ",")}]_[${
            filter.factory == "" ? "AllFactory" : "Factory " + filter.factory
        }]_[${
            filter.shop_floor == ""
                ? "AllShopfloor"
                : "Shopfloor " + filter.shop_floor
        }]_[${
            filter.machine_type == ""
                ? "AllType"
                : "type " + filter.machine_type
        }]_[${
            filter.machine_model == ""
                ? "AllModel"
                : "model " + filter.machine_model
        }]_[${
            filter.machine_number == ""
                ? "AllAssetNumber"
                : "machine_number " + filter.machine_number
        }]`;
        // const fileName = "data_export_alarm";

        // ////////////console.log(result.data);

        let tempseriestrendtimelinelist = [];
        seriestrendtimeline.forEach((element) => {
            const tempseriestrendtimeline = {
                start: new Date(element.data[0].y[0]).toString(),
                end: new Date(element.data[0].y[1]).toString(),
                value: element.name,
            };

            tempseriestrendtimelinelist.push(tempseriestrendtimeline);
        });

        let listtempseriestopoccurencycritical = [];
        seriestopoccurencycritical[0].data.forEach((element, i) => {
            const tempseriestopoccurencycritical = {
                code: optionsoccurencycritical.xaxis.categories[i],
                sum: element,
                type: "critical",
            };
            listtempseriestopoccurencycritical.push(
                tempseriestopoccurencycritical
            );
        });

        let listseriestopoccurencywarning = [];
        seriestopoccurencywarning[0].data.forEach((element, i) => {
            const tempseriestopoccurencywarning = {
                code: optionsoccurencywarning.xaxis.categories[i],
                sum: element,
                type: "warning",
            };
            listseriestopoccurencywarning.push(tempseriestopoccurencywarning);
        });

        // //////////console.log("seriestoperrorcode")
        // //////////console.log(seriestoperrorcode[0].data)
        // //////////console.log("optionstoperrorcode")
        // //////////console.log(optionstoperrorcode.xaxis.categories)
        let listseriestoperrorcode = [];
        seriestoperrorcode[0].data.forEach((element, i) => {
            const tempseriestoperrorcode = {
                code: optionstoperrorcode.xaxis.categories[i],
                sum: element,
            };
            listseriestoperrorcode.push(tempseriestoperrorcode);
        });

        // //////////console.log("concate")
        // //////////console.log(listtempseriestopoccurencycritical.concat(listseriestopoccurencywarning))
        const dataExport = [
            {
                sheetName: "alarm_log",
                header: [
                    "no",
                    "time_start",
                    "time_stop",
                    "duration",
                    "type",
                    "code",
                    "alarm_kinds",
                ],
                body: body,
            },
            {
                sheetName: "alarm_status",
                header: ["start", "end", "value"],
                body: tempseriestrendtimelinelist,
            },
            {
                sheetName: "top_5_occurence",
                header: ["code", "sum", "type"],
                body: listtempseriestopoccurencycritical.concat(
                    listseriestopoccurencywarning
                ),
            },
            {
                sheetName: "top_10_error_code ",
                header: ["code", "sum"],
                body: listseriestoperrorcode,
            },
        ];
        exportCSVFile(dataExport, fileName);
    };

    useEffect(() => {
        if (filter.machine_type) {
            getMachineModelDropdown();
        }
    }, [filter.machine_type]);
    useEffect(() => {
        getFactoryDropdown();

        // getLimit();
    }, []);

    useEffect(() => {
        if (filter.shop_floor) {
            getMachineTypeDropdown();
        }
    }, [filter.shop_floor]);

    useEffect(() => {
        if (filter.factory) {
            getShopFloorDropdown();
        }
    }, [filter.factory]);

    useEffect(() => {
        if (filter.machine_type && filter.machine_model) {
            getMachineNumberDropdown();
        }
    }, [filter.machine_type, filter.machine_model]);

    useEffect(() => {
        // (async () => {
        //     await

        getListAlarm();
        // await getlisttype();
        // await getlistcode();
        // await getFiveOccurence("critical", filter.machine_number);
        // await getFiveOccurence("warning", filter.machine_number);
        // await getTenErrorCode();
        // })();
    }, [
        filter.machine_number,
        parameter.type,
        parameter.parameter,
        currentPage,
        filter.start_date,
        filter.end_date,
        t
    ]);
    useEffect(() => {
        // (async () => {

        //     await
        getcountAlarm(
            filter.machine_number,
            parameter.parameter,
            parameter.type,
            filter.start_date,
            filter.end_date
        );

        // })();
    }, [
        filter.machine_number,
        parameter.type,
        parameter.parameter,
        filter.start_date,
        filter.end_date,
    ]);

    useEffect(() => {
        // (async () => {

        //     await
        getcountAlarm(
            filter.machine_number,
            "",
            "",
            filter.start_date,
            filter.end_date
        );

        // })();
    }, [filter.machine_number, filter.start_date, filter.end_date]);

    return (
        <div className='machine-alarm-status-container'>
            <div className='machine-alarm-status-filter'>
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
                    noEmptyOption
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
                    noEmptyOption
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
                    noEmptyOption
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
                    isDisabled={filter.machine_type === ""}
                    noEmptyOption
                    isLoading={false}
                />
                <InputDropdownHorizontal
                    inputWidth='150px'
                    name='machine_number'
                    label={t("content.filter.machine_number")}
                    value={filter.machine_number}
                    onSelect={(e) => {
                        setFilter((prev) => {
                            prev.machine_number = e.value;
                            return { ...prev };
                        });
                    }}
                    options={machineNumber}
                    isDisabled={filter.machine_model === ""}
                    isLoading={false}
                    noEmptyOption
                    // noEmptyOption
                />
            </div>
            <div className='machine-alarm-status-filter-date'>
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
                        isDisabled={filter.start_date === today}
                        minDate={
                            filter.start_date !== "" ? filter.start_date : null
                        }
                        maxDate={new Date()}
                    />
                    <InputTextHorizontal
                        inputWidth='50px'
                        name='total'
                        label={t("content.machine_utilization.total")}
                        value={total}
                        // onChange={() => //////////////console.log()}
                        isDisabled
                    />

                    <InputTextHorizontal
                        color='#FF0F00'
                        inputWidth='50px'
                        name='total'
                        label={t(
                            "content.machine_alarm_status.alarm_log.content.Critical"
                        )}
                        value={countcritical}
                        // onChange={() => {//.log()}}
                        isDisabled
                    />

                    <InputTextHorizontal
                        color='#FF9900'
                        inputWidth='50px'
                        name='total'
                        label={t(
                            "content.machine_alarm_status.alarm_log.content.Warning"
                        )}
                        value={countwarning}
                        // onChange={() => {}}
                        isDisabled
                    />

                    <InputTextHorizontal
                        color='#C91212'
                        inputWidth='50px'
                        name='total'
                        label={t(
                            "content.machine_alarm_status.alarm_log.content.Emergency"
                        )}
                        value={countemergency}
                        // onChange={() => {}}
                        isDisabled
                    />
                </div>
                <div className='alarm-export-button'>
                    <Tooltip
                        tooltip={
                            <span className='icon-tooltip'>
                                {t("alarm_guideline")}
                            </span>
                        }>
                        <AlarmGuidelineButton
                            onClick={() => {
                                showingGuidlines();
                            }}
                        />
                    </Tooltip>
                    <ModalGuidlines
                        //  selectedAsset={selectedasset}
                        isShowing={isShowingGuidlines}
                        hide={showingGuidlines}
                        t={t}
                        onSubmit={async () => {
                            // setIsLoading(true);
                            // setIsLoading(false);
                        }}
                    />
                    <Tooltip
                        tooltip={
                            <span className='icon-tooltip'>{t("export.export")}</span>
                        }>
                        <ExportButton
                            onClick={() => {
                                exportDataAsset(body);
                            }}
                        />
                    </Tooltip>
                </div>
            </div>
            <div className='machine-alarm-status-content'>
                <div className='left-side-content'>
                    <div className='alarm-log'>
                        <div className='alarm-log-header'>
                            <div className='title'>
                                {t(
                                    "content.machine_alarm_status.alarm_log.header.alarm_log"
                                )}
                            </div>
                        </div>
                        <div className='alarm-log-content'>
                            <div className='content-filter'>
                                <div className='filter'>
                                    <InputDropdownHorizontal
                                        inputWidth='100px'
                                        name='type'
                                        label={t(
                                            "content.machine_alarm_status.alarm_log.content.type"
                                        )}
                                        value={parameter.type}
                                        onSelect={(e) =>
                                            setParameter((prev) => {
                                                prev.type = e.value;
                                                return { ...prev };
                                            })
                                        }
                                        options={typecode}
                                        isLoading={false}
                                        // noEmptyOption
                                    />
                                </div>
                                <div className='filter'>
                                    <InputDropdownHorizontal
                                        inputWidth='150px'
                                        name='code'
                                        label={t(
                                            "content.machine_alarm_status.alarm_log.content.code"
                                        )}
                                        value={parameter.parameter}
                                        onSelect={(e) =>
                                            setParameter((prev) => {
                                                prev.parameter = e.value;
                                                return { ...prev };
                                            })
                                        }
                                        options={codelist}
                                        isLoading={false}
                                        isDisabled={parameter.type === ""}
                                        // noEmptyOption
                                    />
                                </div>
                            </div>
                            <div className='content-table'>
                                <LoadingData
                                    isLoading={isLoading.data}
                                    useAltBackground={false}
                                    size={"100px"}
                                />
                                <div className='table'>
                                    <Table
                                        header={header}
                                        body={body}
                                        actions={[]}
                                        selectable={false}
                                        onSelect={(selectedItem, index) => {
                                            ////////////////console.log(selectedItem);
                                        }}
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
                    <div className='alarm-trend-status-chart'>
                        <div className='alarm-trend-header'>
                            {chartType === 1 ? (
                                <div className='title'>
                                    {t("chart.AlarmStatusChart")}
                                </div>
                            ) : (
                                <div className='title'>
                                    {t("chart.AlarmTrendChart")}
                                </div>
                            )}

                            <div className='alarm-trend-status-button'>
                                <Tooltip
                                    tooltip={
                                        <span className='icon-tooltip'>
                                            {t("chart.AlarmStatusChart")}
                                        </span>
                                    }>
                                    {chartType === 1 ? (
                                        <IconLineBarAfter
                                            onClick={() => {
                                                setChartType(1);
                                            }}
                                            style={{
                                                height: "20px",
                                                cursor: "pointer",
                                            }}
                                        />
                                    ) : (
                                        <IconLineBar
                                            onClick={() => {
                                                setChartType(1);
                                            }}
                                            style={{
                                                height: "20px",
                                                cursor: "pointer",
                                            }}
                                        />
                                    )}
                                </Tooltip>

                                <Tooltip
                                    tooltip={
                                        <span className='icon-tooltip'>
                                            {t("chart.AlarmTrendChart")}
                                        </span>
                                    }>
                                    {chartType === 2 ? (
                                        <IconTimelineBarAfter
                                            onClick={() => {
                                                setChartType(2);
                                            }}
                                            style={{
                                                height: "20px",
                                                cursor: "pointer",
                                            }}
                                        />
                                    ) : (
                                        <IconTimelineBar
                                            onClick={() => {
                                                setChartType(2);
                                            }}
                                            style={{
                                                height: "20px",
                                                cursor: "pointer",
                                            }}
                                        />
                                    )}
                                </Tooltip>
                            </div>
                        </div>
                        <div className='alarm-trend-content'>
                            <div className='alarm-trend-status'>
                                <div className='machine-status'>
                                    {datapersen.map((stats, i) => (
                                        <div key={i} className='status'>
                                            <StatusIcon
                                                style={{
                                                    fill: getStatusColor(
                                                        stats.status
                                                    ),
                                                }}
                                            />
                                            <p>
                                                {/* {`${t(
                                                    "content.machine_utilization.status." +
                                                        stats.status
                                                )}: ${stats.total}`} */}
                                                {`${
                                                    stats.status ===
                                                    "Critical Alarm"
                                                        ? t(
                                                              "content.machine_alarm_status.alarm_trend_status_chart.content.critical"
                                                          )
                                                        : stats.status ===
                                                          "Warning Alarm"
                                                        ? t(
                                                              "content.machine_alarm_status.alarm_trend_status_chart.content.warning"
                                                          )
                                                        : stats.status ===
                                                          "Disconnected"
                                                        ? t(
                                                              "content.machine_alarm_status.alarm_trend_status_chart.content.disconnected"
                                                          )
                                                        : stats.status ===
                                                          "No Alarm"
                                                        ? t(
                                                              "content.machine_alarm_status.alarm_trend_status_chart.content.noalarm"
                                                          )
                                                        : stats.status ===
                                                          "Emergency"
                                                        ? t(
                                                              "content.machine_alarm_status.alarm_trend_status_chart.content.emergency"
                                                          )
                                                        : ""
                                                } : ${stats.timetotal}  (${
                                                    stats.total
                                                } %)`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='alarm-trend-chart'>
                                {chartType === 1 && (
                                    <ReactApexChart
                                        options={optionstrendseriesline}
                                        series={seriestrendseriesline}
                                        // series={[]}
                                        type='line'
                                        height={"88%"}
                                        width={"99%"}
                                    />
                                )}

                                {chartType === 2 && (
                                    <ReactApexChart
                                        // series={[]}
                                        series={seriestrendtimeline}
                                        options={optionstrendtimeline}
                                        type='rangeBar'
                                        height={"88%"}
                                        width={"99%"}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='padding-machine-alarm'>
                    <div className='right-side-content'>
                        <div className='top-occurence'>
                            <div className='top-occurence-header'>
                                <div className='title'>
                                    {t(
                                        "content.machine_alarm_status.top_5_occurence_by.header.top_5_occurence_by"
                                    )}
                                </div>
                            </div>
                            <div className='top-occurence-content'>
                                <div className='box-alarm-critical-warning'>
                                    <div className='header-alarm-critical-warning'>
                                        {t(
                                            "content.machine_alarm_status.top_5_occurence_by.content.CriticalAlarm"
                                        )}
                                    </div>
                                    <div className='box-critical-warning'>
                                        <ReactApexChart
                                            options={optionsoccurencycritical}
                                            series={seriestopoccurencycritical}
                                            type='bar'
                                            height={"90%"}
                                        />
                                    </div>
                                </div>

                                <div className='box-alarm-critical-warning'>
                                    <div className='header-alarm-critical-warning'>
                                        {t(
                                            "content.machine_alarm_status.top_5_occurence_by.content.WarningAlarm"
                                        )}
                                    </div>
                                    <div className='box-critical-warning'>
                                        <ReactApexChart
                                            options={optionsoccurencywarning}
                                            series={seriestopoccurencywarning}
                                            type='bar'
                                            height={"90%"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='top-error'>
                            <div className='top-error-header'>
                                <div className='title'>
                                    {t(
                                        "content.machine_alarm_status.top_10_error_code.header.top_10_error_code"
                                    )}
                                </div>
                            </div>
                            <div className='top-error-content'>
                                <ReactApexChart
                                    options={optionstoperrorcode}
                                    series={seriestoperrorcode}
                                    type='bar'
                                    height='95%'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MachineAlarmStatus;

var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return (
        [hours, minutes, seconds]
            .map((v) => (v < 10 ? "0" + v : v))
            // .filter((v, i) => v !== "00" || i > 0)
            .join(":")
    );
};

var toYearMMdd = (date) => {
    return new Date(date).toISOString().split("T")[0];
};

var toYearMMddnew = (date) => {
    var dt = new Date(date);

    return `${dt.getFullYear().toString().padStart(4, "0")}-${(
        dt.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`;
};

var yyyymmddhhmmss = (date) => {
    var dt = new Date(date);

    return `${dt.getDate().toString().padStart(2, "0")}-${(dt.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${dt.getFullYear().toString().padStart(4, "0")} ${dt
        .getHours()
        .toString()
        .padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
};

function toHex(str) {
    var result = "";
    var hexvalue = "";
    for (var i = 0; i < str.length; i++) {
        result += "0x" + str.charCodeAt(i).toString(16) + ",";
    }

    if (result !== "") {
        hexvalue = result.slice(0, -1);
    } else {
        hexvalue = result;
    }

    return hexvalue;
}
