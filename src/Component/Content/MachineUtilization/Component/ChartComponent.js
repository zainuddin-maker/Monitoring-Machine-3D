import "../style.scss";
import ReactApexChart from "react-apexcharts";
import { useEffect } from "react";
import { ReturnHostBackend } from "../../../ComponentReuseable/BackendHost";
import { getToken } from "../../../ComponentReuseable/TokenParse";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { ReactComponent as StatusIcon } from "../../../../svg/status.svg";

import { ReactComponent as ChartType1 } from "../../../../svg/chart-type-1.svg";
import { ReactComponent as ChartType2 } from "../../../../svg/chart-type-2.svg";
import { LoadingData } from "../../../ComponentReuseable";
import { Tooltip } from "../../../ComponentReuseable";
import CharttypeoneButton from "./CharttypeoneButton";
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

const generateDateGMT8 = (date) => {
    const dateInput = date;
    dateInput.setTime(
        dateInput.getTime() + dateInput.getTimezoneOffset() * 60 * 1000
    );
    dateInput.setTime(dateInput.getTime() + 8 * 60 * 60 * 1000);
    return dateInput;
};

const statusDummy = [
    {
        status: "running",
        total: 0,
        timetotal: "00:00:00",
        totalintimestamp: 0,
    },
    {
        status: "idle",
        total: 0,
        timetotal: "00:00:00",
        totalintimestamp: 0,
    },
    {
        status: "hold",
        total: 0,
        timetotal: "00:00:00",
        totalintimestamp: 0,
    },
    {
        status: "stop",
        total: 0,
        timetotal: "00:00:00",
        totalintimestamp: 0,
    },
    {
        status: "offline",
        total: 0,
        timetotal: "00:00:00",
        totalintimestamp: 0,
    },
];

const chartTypedummydummy = [
    {
        data: [2, 1, 1, 1],
    },
];

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
const ChartComponent = (props) => {
    const { asset_id, start_date, end_date, currentPage, t, asset_number } =
        props;
    const today = new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
    );
    const requestInterval = 5000;
    const [filter, setFilter] = useState({
        // factory: "",
        // shop_floor: "",
        // machine_type: "",
        // machine_number: "",
        // start_date: today,
        // end_date: today,

        date: new Date(2022, 3, 10),
    });

    const arraydata = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
    ];

    const barseriesdummy = [
        {
            name: "offline",
            data: arraydata,
        },
        {
            name: "stop",
            data: arraydata,
        },
        {
            name: "hold",
            data: arraydata,
        },
        {
            name: "idle",
            data: arraydata,
        },
        {
            name: "running",
            data: arraydata,
        },
    ];
    const baroptionsdummy = {
        colors: ["#A7AFB8", "#FF3F25", "#FFB515", "#26A2CD", "#44C548"],
        chart: {
            animations: {
                enabled: false,
            },
            type: "bar",
            height: 350,
            stacked: true,
            // stackType: "100%",
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
                columnWidth: "30%",
            },
        },
        dataLabels: {
            enabled: false,
        },

        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: "bottom",
                        offsetX: -10,
                        offsetY: 0,
                    },
                },
            },
        ],

        yaxis: {
            show: true,
            // showAlways: true,
            // showForNullSeries: true,
            // seriesName: undefined,
            // opposite: false,
            // reversed: false,
            // logarithmic: false,
            // logBase: 10,
            tickAmount: 5,
            min: 0,
            max: 100,
        },
        xaxis: {
            categories: [
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
            ],
        },

        fill: {
            opacity: 1,
        },
        legend: {
            show: false,
        },
        tooltip: {
            custom: (opts) => {
                const condition = opts.w.globals.seriesNames[opts.seriesIndex];
                return `<div class="chart-tooltip">
           
                     <div>${opts.w.globals.labels[opts.dataPointIndex]} </div>
                <div>${t("content.machine_utilization.status." + condition)} (${
                    opts.series[opts.seriesIndex][opts.dataPointIndex]
                })</div>
                <div>`;
            },
        },
    };

    const dummyseries = [];

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
                return state === "running"
                    ? "#0DC540"
                    : state === "idle"
                    ? "#3A95EB"
                    : state === "hold"
                    ? "#FFD600"
                    : state === "stop" || state === "DOWN"
                    ? "#FF3F25"
                    : state === null
                    ? ""
                    : "#A6AFB8";
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
            // min: new Date("2022-03-09").getTime(),
            // max: new Date("2022-03-15").getTime(),

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
                <div>${t(
                    "content.machine_utilization.status." + condition
                )}</div>
                <div>`;
            },
        },
    };
    const [loading, setLoading] = useState({
        chart: false,
        info: false,
        chartLatest: false,
        infoLatest: false,
    });

    const [lineChart, setLineChart] = useState({
        series: [],
        options: dummyoptions,
    });

    const [seriestrendtimeline, Setseriestrendtimeline] = useState(dummyseries);
    const [optionstrendtimeline, Setoptionstrendtimeline] =
        useState(dummyoptions);
    const [optionstrendseriesline, Setoptionstrendseriesline] =
        useState(baroptionsdummy);

    const [seriestrendseriesline, Setseriestrendseriesline] =
        useState(barseriesdummy);
    const [datapersen, setDatapersen] = useState(statusDummy);

    const [chartType, setChartType] = useState(1);

    const [realTime, setRealTime] = useState(false);
    const getChartData = async (asset_id, start_date, end_date) => {
        Setseriestrendtimeline(dummyseries);
        Setoptionstrendtimeline(dummyoptions);
        Setoptionstrendseriesline(baroptionsdummy);

        Setseriestrendseriesline(barseriesdummy);
        setDatapersen(statusDummy);

        setLoading((prev) => ({ ...prev, chart: true }));
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
        

        console.log("data bro bro")
        console.log(data)
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
            // //////console.log("result.data", asset_id)
            // //////console.log(result.data)
            if (result.data) {
                let arrayresult = [];

                if (start_date === end_date) {
                    let categories = [
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

                    let arraydata = [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0,
                    ];

                    let dummyserieslinebar = [
                        {
                            name: "offline",
                            data: arraydata,
                        },
                        {
                            name: "stop",
                            data: arraydata,
                        },
                        {
                            name: "hold",
                            data: arraydata,
                        },
                        {
                            name: "idle",
                            data: arraydata,
                        },
                        {
                            name: "running",
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

                    let count = 0;
                    let countseries = [0, 0, 0, 0, 0];
                    let dummytimeline = [];

                    let arraydataupdate = [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0,
                    ];

                    let arraydataupdate_down = new Array(arraydata.length).fill(
                        0
                    );
                    let arraydataupdate_stop = new Array(arraydata.length).fill(
                        0
                    );
                    let arraydataupdate_hold = new Array(arraydata.length).fill(
                        0
                    );
                    let arraydataupdate_idle = new Array(arraydata.length).fill(
                        0
                    );
                    let arraydataupdate_running = new Array(
                        arraydata.length
                    ).fill(0);

                    result.data.forEach((element, i) => {
                        let index = dummyserieslinebar.findIndex(
                            (elementlinebar) =>
                                elementlinebar.name === element.tag_value
                        );

                        if (index !== -1) {
                            // if (asset_id ===1026){
                            //     //////console.log(index)
                            // }

                            var start_date = new Date(element.start_date);
                            var end_date = new Date(element.end_date);

                            var seconds = start_date.getSeconds();
                            var minutes = start_date.getMinutes();
                            var hour = start_date.getHours();

                            var secondsend_date = end_date.getSeconds();
                            var minutesend_date = end_date.getMinutes();
                            var hourend_date = end_date.getHours();

                            ////////////console.log("start_date", start_date);
                            ////////////console.log("end_date", end_date);

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
                                            if (index === 0) {
                                                arraydataupdate_down[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_down;
                                            }
                                            if (index === 1) {
                                                arraydataupdate_stop[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_down;
                                            }

                                            if (index === 2) {
                                                arraydataupdate_hold[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_down;
                                            }

                                            if (index === 3) {
                                                arraydataupdate_idle[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_down;
                                            }
                                            if (index === 4) {
                                                arraydataupdate_running[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_down;
                                            }
                                        }
                                    } else {
                                        for (
                                            let i = 0;
                                            i < hourend_date - hour;
                                            i++
                                        ) {
                                            if (index === 0) {
                                                arraydataupdate_down[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_down;
                                            }
                                            if (index === 1) {
                                                arraydataupdate_stop[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_stop;
                                            }

                                            if (index === 2) {
                                                arraydataupdate_hold[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_hold;
                                            }

                                            if (index === 3) {
                                                arraydataupdate_idle[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_idle;
                                            }
                                            if (index === 4) {
                                                arraydataupdate_running[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_running;
                                            }
                                        }

                                        if (index === 0) {
                                            arraydataupdate_down[hourend_date] =
                                                arraydataupdate_down[
                                                    hourend_date
                                                ] +
                                                Math.round(
                                                    (minutesend_date * 60 +
                                                        secondsend_date) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_down;
                                        }
                                        if (index === 1) {
                                            arraydataupdate_stop[hourend_date] =
                                                arraydataupdate_stop[
                                                    hourend_date
                                                ] +
                                                Math.round(
                                                    (minutesend_date * 60 +
                                                        secondsend_date) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_stop;
                                        }

                                        if (index === 2) {
                                            arraydataupdate_hold[hourend_date] =
                                                arraydataupdate_hold[
                                                    hourend_date
                                                ] +
                                                Math.round(
                                                    (minutesend_date * 60 +
                                                        secondsend_date) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_hold;
                                        }

                                        if (index === 3) {
                                            arraydataupdate_idle[hourend_date] =
                                                arraydataupdate_idle[
                                                    hourend_date
                                                ] +
                                                Math.round(
                                                    (minutesend_date * 60 +
                                                        secondsend_date) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_idle;
                                        }
                                        if (index === 4) {
                                            arraydataupdate_running[
                                                hourend_date
                                            ] =
                                                arraydataupdate_running[
                                                    hourend_date
                                                ] +
                                                Math.round(
                                                    (minutesend_date * 60 +
                                                        secondsend_date) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_running;
                                        }
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
                                            if (index === 0) {
                                                arraydataupdate_down[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_down;
                                            }
                                            if (index === 1) {
                                                arraydataupdate_stop[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_stop;
                                            }

                                            if (index === 2) {
                                                arraydataupdate_hold[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_hold;
                                            }

                                            if (index === 3) {
                                                arraydataupdate_idle[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_idle;
                                            }
                                            if (index === 4) {
                                                arraydataupdate_running[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_running;
                                            }
                                        }

                                        if (index === 0) {
                                            arraydataupdate_down[hour] =
                                                arraydataupdate_down[hour] +
                                                100 -
                                                Math.round(
                                                    (minutes * 60 + seconds) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_down;
                                        }
                                        if (index === 1) {
                                            arraydataupdate_stop[hour] =
                                                arraydataupdate_stop[hour] +
                                                100 -
                                                Math.round(
                                                    (minutes * 60 + seconds) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_stop;
                                        }

                                        if (index === 2) {
                                            arraydataupdate_hold[hour] =
                                                arraydataupdate_hold[hour] +
                                                100 -
                                                Math.round(
                                                    (minutes * 60 + seconds) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_hold;
                                        }

                                        if (index === 3) {
                                            arraydataupdate_idle[hour] =
                                                arraydataupdate_idle[hour] +
                                                100 -
                                                Math.round(
                                                    (minutes * 60 + seconds) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_idle;
                                        }
                                        if (index === 4) {
                                            arraydataupdate_running[hour] =
                                                arraydataupdate_running[hour] +
                                                100 -
                                                Math.round(
                                                    (minutes * 60 + seconds) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_running;
                                        }
                                    } else {
                                        for (
                                            let i = 1;
                                            i < hourend_date - hour;
                                            i++
                                        ) {
                                            // arraydataupdate[hour + i] = 100;
                                            if (index === 0) {
                                                arraydataupdate_down[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_down;
                                            }
                                            if (index === 1) {
                                                arraydataupdate_stop[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_stop;
                                            }

                                            if (index === 2) {
                                                arraydataupdate_hold[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_hold;
                                            }

                                            if (index === 3) {
                                                arraydataupdate_idle[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_idle;
                                            }
                                            if (index === 4) {
                                                arraydataupdate_running[
                                                    hour + i
                                                ] = 100;
                                                arraydataupdate =
                                                    arraydataupdate_running;
                                            }
                                        }
                                        // arraydataupdate[hour] =
                                        //     100 -
                                        //     Math.round(
                                        //         (minutes * 60 + seconds) / 36
                                        //     );

                                        if (index === 0) {
                                            arraydataupdate_down[hour] =
                                                arraydataupdate_down[hour] +
                                                100 -
                                                Math.round(
                                                    (minutes * 60 + seconds) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_down;
                                        }
                                        if (index === 1) {
                                            arraydataupdate_stop[hour] =
                                                arraydataupdate_stop[hour] +
                                                100 -
                                                Math.round(
                                                    (minutes * 60 + seconds) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_stop;
                                        }

                                        if (index === 2) {
                                            arraydataupdate_hold[hour] =
                                                arraydataupdate_hold[hour] +
                                                100 -
                                                Math.round(
                                                    (minutes * 60 + seconds) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_hold;
                                        }

                                        if (index === 3) {
                                            arraydataupdate_idle[hour] =
                                                arraydataupdate_idle[hour] +
                                                100 -
                                                Math.round(
                                                    (minutes * 60 + seconds) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_idle;
                                        }
                                        if (index === 4) {
                                            arraydataupdate_running[hour] =
                                                arraydataupdate_running[hour] +
                                                100 -
                                                Math.round(
                                                    (minutes * 60 + seconds) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_running;
                                        }
                                        // arraydataupdate[hourend_date] =
                                        //     Math.round(
                                        //         (minutesend_date * 60 +
                                        //             secondsend_date) /
                                        //             36
                                        //     );

                                        if (index === 0) {
                                            arraydataupdate_down[hourend_date] =
                                                arraydataupdate_down[
                                                    hourend_date
                                                ] +
                                                Math.round(
                                                    (minutesend_date * 60 +
                                                        secondsend_date) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_down;
                                        }
                                        if (index === 1) {
                                            arraydataupdate_stop[hourend_date] =
                                                arraydataupdate_stop[
                                                    hourend_date
                                                ] +
                                                Math.round(
                                                    (minutesend_date * 60 +
                                                        secondsend_date) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_stop;
                                        }

                                        if (index === 2) {
                                            arraydataupdate_hold[hourend_date] =
                                                arraydataupdate_hold[
                                                    hourend_date
                                                ] +
                                                Math.round(
                                                    (minutesend_date * 60 +
                                                        secondsend_date) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_hold;
                                        }

                                        if (index === 3) {
                                            arraydataupdate_idle[hourend_date] =
                                                arraydataupdate_idle[
                                                    hourend_date
                                                ] +
                                                Math.round(
                                                    (minutesend_date * 60 +
                                                        secondsend_date) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_idle;
                                        }
                                        if (index === 4) {
                                            arraydataupdate_running[
                                                hourend_date
                                            ] =
                                                arraydataupdate_running[
                                                    hourend_date
                                                ] +
                                                Math.round(
                                                    (minutesend_date * 60 +
                                                        secondsend_date) /
                                                        36
                                                );
                                            arraydataupdate =
                                                arraydataupdate_running;
                                        }
                                    }
                                }

                                dummyserieslinebar[index].data =
                                    arraydataupdate;
                            }
                            if (hourend_date - hour === 0) {
                                if (index === 0) {
                                    arraydataupdate_down[hour] =
                                        arraydataupdate_down[hour] +
                                        Math.round(
                                            (minutesend_date * 60 +
                                                secondsend_date) /
                                                36 -
                                                (minutes * 60 + seconds) / 36
                                        );
                                    dummyserieslinebar[index].data =
                                        arraydataupdate_down;
                                }
                                if (index === 1) {
                                    arraydataupdate_stop[hour] =
                                        arraydataupdate_stop[hour] +
                                        Math.round(
                                            (minutesend_date * 60 +
                                                secondsend_date) /
                                                36 -
                                                (minutes * 60 + seconds) / 36
                                        );
                                    dummyserieslinebar[index].data =
                                        arraydataupdate_stop;
                                }

                                if (index === 2) {
                                    arraydataupdate_hold[hour] =
                                        arraydataupdate_hold[hour] +
                                        Math.round(
                                            (minutesend_date * 60 +
                                                secondsend_date) /
                                                36 -
                                                (minutes * 60 + seconds) / 36
                                        );
                                    dummyserieslinebar[index].data =
                                        arraydataupdate_hold;
                                }

                                if (index === 3) {
                                    arraydataupdate_idle[hour] =
                                        arraydataupdate_idle[hour] +
                                        Math.round(
                                            (minutesend_date * 60 +
                                                secondsend_date) /
                                                36 -
                                                (minutes * 60 + seconds) / 36
                                        );
                                    dummyserieslinebar[index].data =
                                        arraydataupdate_idle;
                                }
                                if (index === 4) {
                                    arraydataupdate_running[hour] =
                                        arraydataupdate_running[hour] +
                                        Math.round(
                                            (minutesend_date * 60 +
                                                secondsend_date) /
                                                36 -
                                                (minutes * 60 + seconds) / 36
                                        );
                                    dummyserieslinebar[index].data =
                                        arraydataupdate_running;
                                }
                            }

                            if (hourend_date - hour === 1) {
                                if (index === 0) {
                                    arraydataupdate_down[hour] =
                                        arraydataupdate_down[hour] +
                                        100 -
                                        Math.round(
                                            (minutes * 60 + seconds) / 36
                                        );

                                    arraydataupdate_down[hourend_date] =
                                        arraydataupdate_down[hourend_date] +
                                        Math.round(
                                            (minutesend_date * 60 +
                                                secondsend_date) /
                                                36
                                        );

                                    arraydataupdate = arraydataupdate_down;
                                }
                                if (index === 1) {
                                    arraydataupdate_stop[hour] =
                                        arraydataupdate_stop[hour] +
                                        100 -
                                        Math.round(
                                            (minutes * 60 + seconds) / 36
                                        );

                                    arraydataupdate_stop[hourend_date] =
                                        arraydataupdate_stop[hourend_date] +
                                        Math.round(
                                            (minutesend_date * 60 +
                                                secondsend_date) /
                                                36
                                        );

                                    arraydataupdate = arraydataupdate_stop;
                                }

                                if (index === 2) {
                                    arraydataupdate_hold[hour] =
                                        arraydataupdate_hold[hour] +
                                        100 -
                                        Math.round(
                                            (minutes * 60 + seconds) / 36
                                        );

                                    arraydataupdate_hold[hourend_date] =
                                        arraydataupdate_hold[hourend_date] +
                                        Math.round(
                                            (minutesend_date * 60 +
                                                secondsend_date) /
                                                36
                                        );

                                    arraydataupdate = arraydataupdate_hold;
                                }

                                if (index === 3) {
                                    arraydataupdate_idle[hour] =
                                        arraydataupdate_idle[hour] +
                                        100 -
                                        Math.round(
                                            (minutes * 60 + seconds) / 36
                                        );

                                    arraydataupdate_idle[hourend_date] =
                                        arraydataupdate_idle[hourend_date] +
                                        Math.round(
                                            (minutesend_date * 60 +
                                                secondsend_date) /
                                                36
                                        );

                                    arraydataupdate = arraydataupdate_idle;
                                }
                                if (index === 4) {
                                    arraydataupdate_running[hour] =
                                        arraydataupdate_running[hour] +
                                        100 -
                                        Math.round(
                                            (minutes * 60 + seconds) / 36
                                        );

                                    arraydataupdate_running[hourend_date] =
                                        arraydataupdate_running[hourend_date] +
                                        Math.round(
                                            (minutesend_date * 60 +
                                                secondsend_date) /
                                                36
                                        );

                                    arraydataupdate = arraydataupdate_running;
                                }

                                dummyserieslinebar[index].data =
                                    arraydataupdate;
                            }

                            count = Math.round(
                                hourend_date * 3600 +
                                    minutesend_date * 60 +
                                    secondsend_date -
                                    (hour * 3600 + minutes * 60 + seconds)
                            );

                            countseries[index] = countseries[index] + count;
                        }

                        const seriesdummy = {
                            name: element.tag_value,
                            data: [
                                {
                                    x: "Status",
                                    y: [
                                        new Date(element.start_date).getTime(),
                                        new Date(element.end_date).getTime(),
                                    ],
                                },
                            ],
                        };

                        dummytimeline.push(seriesdummy);
                    });

                    const tempstatusDummy = [
                        {
                            status: "running",
                            total: 0,
                            timetotal: "00:00:00",
                            totalintimestamp: 0,
                        },
                        {
                            status: "idle",
                            total: 0,
                            timetotal: "00:00:00",
                            totalintimestamp: 0,
                        },
                        {
                            status: "hold",
                            total: 0,
                            timetotal: "00:00:00",
                            totalintimestamp: 0,
                        },
                        {
                            status: "stop",
                            total: 0,
                            timetotal: "00:00:00",
                            totalintimestamp: 0,
                        },
                        {
                            status: "offline",
                            total: 0,
                            timetotal: "00:00:00",
                            totalintimestamp: 0,
                        },
                    ];
                    ////////////console.log("countseries");
                    ////////////console.log(countseries);
                    countseries.forEach((element, i) => {
                        tempstatusDummy[countseries.length - 1 - i].total =
                            Math.round(element / (24 * 36));
                        tempstatusDummy[countseries.length - 1 - i].timetotal =
                            toHHMMSS(element);

                        tempstatusDummy[
                            countseries.length - 1 - i
                        ].totalintimestamp = element;
                    });

                    setDatapersen(tempstatusDummy);

                    if (asset_id === 1026) {
                        //////console.log(dummyserieslinebar);
                        //////console.log("");
                    }
                    Setseriestrendseriesline(dummyserieslinebar);

                    // if (asset_id ===1026){
                    //     //////console.log("dummytimeline ",asset_id)
                    //     //////console.log(dummytimeline)
                    // }

                    Setseriestrendtimeline(dummytimeline);
                    Setoptionstrendtimeline((prevState) => ({
                        ...prevState,
                        xaxis: {
                            ...prevState.xaxis,
                            min: new Date(start_date).setHours(0, 0, 0),
                            max: new Date(end_date).setHours(23, 59, 59),
                            labels: {
                                ...prevState.xaxis.labels,
                                format: "HH:mm",
                            },
                        },
                    }));
                } else {
                    // start_date === end_date

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
                            name: "offline",
                            data: arraydata,
                        },
                        {
                            name: "stop",
                            data: arraydata,
                        },
                        {
                            name: "hold",
                            data: arraydata,
                        },
                        {
                            name: "idle",
                            data: arraydata,
                        },
                        {
                            name: "running",
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

                    //timeline

                    let dummytimeline = [];

                    let count = 0;
                    let countseries = new Array(dummyserieslinebar.length).fill(
                        0
                    );

                    let arraydataupdate_down = new Array(arraydata.length).fill(
                        0
                    );
                    let arraydataupdate_stop = new Array(arraydata.length).fill(
                        0
                    );
                    let arraydataupdate_hold = new Array(arraydata.length).fill(
                        0
                    );
                    let arraydataupdate_idle = new Array(arraydata.length).fill(
                        0
                    );
                    let arraydataupdate_running = new Array(
                        arraydata.length
                    ).fill(0);
                    result.data.forEach((element) => {
                        var start_date = new Date(element.start_date);
                        var end_date = new Date(element.end_date);

                        let indextype = dummyserieslinebar.findIndex(
                            (elementlinebar) =>
                                elementlinebar.name === element.tag_value
                        );
                        let index = categories.findIndex(
                            (elementlinebar) =>
                                elementlinebar ===
                                element.start_date.slice(0, 10)
                        );

                        var seconds = start_date.getSeconds();
                        var minutes = start_date.getMinutes();
                        var hour = start_date.getHours();

                        var secondsend_date = end_date.getSeconds();
                        var minutesend_date = end_date.getMinutes();
                        var hourend_date = end_date.getHours();

                        if (indextype === 0) {
                            let count = Math.round(
                                hourend_date * 3600 +
                                    minutesend_date * 60 +
                                    secondsend_date -
                                    (hour * 3600 + minutes * 60 + seconds)
                            );

                            arraydataupdate_down[index] =
                                arraydataupdate_down[index] +
                                Math.round(count / (36 * 24));
                            dummyserieslinebar[indextype].data =
                                arraydataupdate_down;
                        }
                        if (indextype === 1) {
                            let count = Math.round(
                                hourend_date * 3600 +
                                    minutesend_date * 60 +
                                    secondsend_date -
                                    (hour * 3600 + minutes * 60 + seconds)
                            );

                            arraydataupdate_stop[index] =
                                arraydataupdate_stop[index] +
                                Math.round(count / (36 * 24));
                            dummyserieslinebar[indextype].data =
                                arraydataupdate_stop;
                        }

                        if (indextype === 2) {
                            let count = Math.round(
                                hourend_date * 3600 +
                                    minutesend_date * 60 +
                                    secondsend_date -
                                    (hour * 3600 + minutes * 60 + seconds)
                            );

                            arraydataupdate_hold[index] =
                                arraydataupdate_hold[index] +
                                Math.round(count / (36 * 24));
                            dummyserieslinebar[indextype].data =
                                arraydataupdate_hold;
                        }
                        if (indextype === 3) {
                            let count = Math.round(
                                hourend_date * 3600 +
                                    minutesend_date * 60 +
                                    secondsend_date -
                                    (hour * 3600 + minutes * 60 + seconds)
                            );

                            arraydataupdate_idle[index] =
                                arraydataupdate_idle[index] +
                                Math.round(count / (36 * 24));
                            dummyserieslinebar[indextype].data =
                                arraydataupdate_idle;
                        }
                        if (indextype === 4) {
                            let count = Math.round(
                                hourend_date * 3600 +
                                    minutesend_date * 60 +
                                    secondsend_date -
                                    (hour * 3600 + minutes * 60 + seconds)
                            );

                            arraydataupdate_running[index] =
                                arraydataupdate_running[index] +
                                Math.round(count / (36 * 24));
                            dummyserieslinebar[indextype].data =
                                arraydataupdate_running;
                        }

                        count = Math.round(
                            hourend_date * 3600 +
                                minutesend_date * 60 +
                                secondsend_date -
                                (hour * 3600 + minutes * 60 + seconds)
                        );

                        ////////////console.log(count , indextype)

                        countseries[indextype] = countseries[indextype] + count;

                        const seriesdummy = {
                            name: element.tag_value,
                            data: [
                                {
                                    x: "Status",
                                    y: [
                                        new Date(element.start_date).getTime(),
                                        new Date(element.end_date).getTime(),
                                    ],
                                },
                            ],
                        };

                        dummytimeline.push(seriesdummy);
                    });

                    const tempstatusDummy = [
                        {
                            status: "running",
                            total: 0,
                            timetotal: "00:00:00",
                            totalintimestamp: 0,
                        },
                        {
                            status: "idle",
                            total: 0,
                            timetotal: "00:00:00",
                            totalintimestamp: 0,
                        },
                        {
                            status: "hold",
                            total: 0,
                            timetotal: "00:00:00",
                            totalintimestamp: 0,
                        },
                        {
                            status: "stop",
                            total: 0,
                            timetotal: "00:00:00",
                            totalintimestamp: 0,
                        },
                        {
                            status: "offline",
                            total: 0,
                            timetotal: "00:00:00",
                            totalintimestamp: 0,
                        },
                    ];
                    ////////////console.log("countseries")
                    ////////////console.log(countseries)

                    countseries.forEach((element, i) => {
                        tempstatusDummy[countseries.length - 1 - i].total =
                            Math.round(element / (24 * 36 * arraydata.length));
                        tempstatusDummy[countseries.length - 1 - i].timetotal =
                            toHHMMSS(element);
                        tempstatusDummy[
                            countseries.length - 1 - i
                        ].totalintimestamp = element;
                    });

                    setDatapersen(tempstatusDummy);

                    Setseriestrendseriesline(dummyserieslinebar);
                    // ////////////console.log("dummytimeline");
                    // ////////////console.log(dummytimeline);
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
                }

                setRealTime(true);
                setLoading((prev) => ({ ...prev, chart: false }));
            } else {
                setRealTime(false);
                Setseriestrendtimeline([]);
                setLoading((prev) => ({ ...prev, chart: false }));
                // setFactory([]);
            }
        } catch (e) {
            // console.error(e);

            Setseriestrendtimeline([]);
            setRealTime(false);

            toast.error(
                t("content.shop_floor_overview.error.Failedtogetchartdata"),
                {
                    toastId: "failed-get-chart-data",
                }
            );
            setLoading((prev) => ({ ...prev, chart: false }));
        }
    };

    useEffect(() => {
        setChartType(1);
        setDatapersen(statusDummy);
        getChartData(asset_id, start_date, end_date);
    }, [currentPage, asset_id, start_date, end_date]);

    useEffect(() => {
        let interval = null;

        if (realTime && (start_date === today || end_date === today)) {
            const getLatestChart = async () => {
                const loadingTimeout = setTimeout(() => {
                    setLoading((prev) => {
                        prev.chartLatest = true;

                        prev.infoLatest = true;
                        return { ...prev };
                    });
                }, 10000);

                const config = {
                    method: "get",
                    url:
                        ReturnHostBackend(process.env.REACT_APP_RAW_DATA) +
                        process.env.REACT_APP_MONITORING_LATEST +
                        `/${asset_number}/${"MachineConditionTags-Automatic Operation"}`,
                    headers: {
                        authorization: getToken(),
                    },
                };

                axios(config)
                    .then((response) => {
                        if (response.data.length > 0) {
                            let dummytimeline = seriestrendtimeline;
                            // let dummyserieslinebar =   seriestrendseriesline

                            ////////console.log("response.data[0]")
                            ////////console.log(response.data[0])
                            const arraytemp = response.data[0];
                            // const arraytemp = {
                            //     tagName:
                            //         "MachineConditionTags-Automatic Operation",
                            //     timestamp: "2022/03/30, 16:07:28",
                            //     tagValue: "3",
                            //     tagQuality: "0",
                            // };

                            const selectvalue = [
                                "idle",
                                "stop",
                                "hold",
                                "running",
                                "offline",
                            ];
                            if (
                                arraytemp.timestamp !== "" &&
                                arraytemp.tagValue !== ""
                            ) {
                                if (start_date === end_date) {
                                    //////////console.log("start_date === end_date");
                                    const arraydata = [
                                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                    ];

                                    // const dummyserieslinebar =   seriestrendseriesline
                                    const dummyserieslinebar = [
                                        {
                                            name: "offline",
                                            data: seriestrendseriesline[0].data,
                                        },
                                        {
                                            name: "stop",
                                            data: seriestrendseriesline[1].data,
                                        },
                                        {
                                            name: "hold",
                                            data: seriestrendseriesline[2].data,
                                        },
                                        {
                                            name: "idle",
                                            data: seriestrendseriesline[3].data,
                                        },
                                        {
                                            name: "running",
                                            data: seriestrendseriesline[4].data,
                                        },
                                    ];

                                    const namestatus = selectvalue[
                                        parseInt(arraytemp.tagValue)
                                    ]
                                        ? selectvalue[
                                              parseInt(arraytemp.tagValue)
                                          ]
                                        : "offline";
                                    let index = dummyserieslinebar.findIndex(
                                        (elementlinebar) =>
                                            elementlinebar.name === namestatus
                                    );

                                    var start_date = new Date();
                                    var end_date = new Date();
                                    if (index !== -1) {
                                        if (dummytimeline.length > 0) {
                                            if (
                                                dummytimeline[
                                                    dummytimeline.length - 1
                                                ].data[0].y[1] !==
                                                    new Date(
                                                        arraytemp.timestamp
                                                    ).getTime() &&
                                                dummytimeline[
                                                    dummytimeline.length - 1
                                                ].data[0].y[1] <
                                                    new Date(
                                                        arraytemp.timestamp
                                                    ).getTime()
                                            ) {
                                                //////////console.log("pertama");

                                                start_date = new Date(
                                                    dummytimeline[
                                                        dummytimeline.length - 1
                                                    ].data[0].y[1]
                                                );
                                                end_date = new Date(
                                                    arraytemp.timestamp
                                                );
                                            }
                                        } else {
                                            //////////console.log("kedua");
                                            const firsttime = new Date(
                                                arraytemp.timestamp
                                            );
                                            firsttime.setHours(0);
                                            firsttime.setMinutes(0);
                                            firsttime.setSeconds(0);

                                            start_date = firsttime;

                                            end_date = new Date(
                                                arraytemp.timestamp
                                            );
                                        }

                                        var seconds = start_date.getSeconds();
                                        var minutes = start_date.getMinutes();
                                        var hour = start_date.getHours();

                                        var secondsend_date =
                                            end_date.getSeconds();
                                        var minutesend_date =
                                            end_date.getMinutes();
                                        var hourend_date = end_date.getHours();

                                        let arraydataupdate = [
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                            0,
                                        ];

                                        let count = 0;

                                        if (
                                            start_date.getTime() !==
                                            end_date.getTime()
                                        ) {
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
                                                if (
                                                    minutes === 0 &&
                                                    seconds === 0
                                                ) {
                                                    if (
                                                        minutesend_date === 0 &&
                                                        secondsend_date === 0
                                                    ) {
                                                        for (
                                                            let i = 0;
                                                            i <
                                                            hourend_date -
                                                                hour +
                                                                1;
                                                            i++
                                                        ) {
                                                            arraydataupdate[
                                                                hour + i
                                                            ] = 100;
                                                        }
                                                    } else {
                                                        for (
                                                            let i = 0;
                                                            i <
                                                            hourend_date - hour;
                                                            i++
                                                        ) {
                                                            arraydataupdate[
                                                                hour + i
                                                            ] = 100;
                                                        }

                                                        arraydataupdate[
                                                            hourend_date
                                                        ] = Math.round(
                                                            (minutesend_date *
                                                                60 +
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
                                                            i <
                                                            hourend_date -
                                                                hour +
                                                                1;
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
                                                            i <
                                                            hourend_date - hour;
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
                                                        arraydataupdate[
                                                            hourend_date
                                                        ] = Math.round(
                                                            (minutesend_date *
                                                                60 +
                                                                secondsend_date) /
                                                                36
                                                        );
                                                    }
                                                }

                                                dummyserieslinebar[index].data =
                                                    arraydataupdate;
                                            }
                                            if (hourend_date - hour === 0) {
                                                arraydataupdate[hour] =
                                                    Math.round(
                                                        (minutesend_date * 60 +
                                                            secondsend_date) /
                                                            36 -
                                                            (minutes * 60 +
                                                                seconds) /
                                                                36
                                                    );
                                                dummyserieslinebar[index].data =
                                                    arraydataupdate;
                                            }

                                            if (hourend_date - hour === 1) {
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

                                            const tempstatusDummy = datapersen;

                                            tempstatusDummy[
                                                tempstatusDummy.length -
                                                    1 -
                                                    index
                                            ].total = Math.round(
                                                (tempstatusDummy[
                                                    tempstatusDummy.length -
                                                        1 -
                                                        index
                                                ].totalintimestamp +
                                                    count) /
                                                    (24 * 36)
                                            );
                                            tempstatusDummy[
                                                tempstatusDummy.length -
                                                    1 -
                                                    index
                                            ].timetotal = toHHMMSS(
                                                tempstatusDummy[
                                                    tempstatusDummy.length -
                                                        1 -
                                                        index
                                                ].totalintimestamp + count
                                            );

                                            setDatapersen((prevdatapersen) => [
                                                ...tempstatusDummy,
                                            ]);

                                            Setseriestrendseriesline(
                                                (prevseries) => [
                                                    ...dummyserieslinebar,
                                                ]
                                            );
                                        }
                                    }

                                    if (dummytimeline.length > 0) {
                                        if (
                                            dummytimeline[
                                                dummytimeline.length - 1
                                            ].data[0].y[1] !==
                                                new Date(
                                                    arraytemp.timestamp
                                                ).getTime() &&
                                            dummytimeline[
                                                dummytimeline.length - 1
                                            ].data[0].y[1] <
                                                new Date(
                                                    arraytemp.timestamp
                                                ).getTime()
                                        ) {
                                            //////////console.log("update");
                                            const seriesdummy = {
                                                name: selectvalue[
                                                    parseInt(arraytemp.tagValue)
                                                ]
                                                    ? selectvalue[
                                                          parseInt(
                                                              arraytemp.tagValue
                                                          )
                                                      ]
                                                    : "offline",
                                                data: [
                                                    {
                                                        x: "Status",
                                                        y: [
                                                            dummytimeline[
                                                                dummytimeline.length -
                                                                    1
                                                            ].data[0].y[1],
                                                            new Date(
                                                                arraytemp.timestamp
                                                            ).getTime(),
                                                        ],
                                                    },
                                                ],
                                            };

                                            dummytimeline.push(seriesdummy);
                                            // Setseriestrendtimeline(dummytimeline)
                                        }
                                    } else {
                                        const firsttime = new Date(
                                            arraytemp.timestamp
                                        );
                                        firsttime.setHours(0);
                                        firsttime.setMinutes(0);
                                        firsttime.setSeconds(0);
                                        //////////console.log("firsttime");
                                        //////////console.log(firsttime);
                                        const seriesdummy = {
                                            name: selectvalue[
                                                parseInt(arraytemp.tagValue)
                                            ]
                                                ? selectvalue[
                                                      parseInt(
                                                          arraytemp.tagValue
                                                      )
                                                  ]
                                                : "offline",
                                            data: [
                                                {
                                                    x: "Status",
                                                    y: [
                                                        new Date(
                                                            firsttime
                                                        ).getTime(),
                                                        new Date(
                                                            arraytemp.timestamp
                                                        ).getTime(),
                                                    ],
                                                },
                                            ],
                                        };

                                        dummytimeline.push(seriesdummy);
                                    }

                                    Setseriestrendtimeline((prevseries) => [
                                        ...prevseries,
                                        ...dummytimeline,
                                    ]);
                                } else {
                                    //////////console.log("start_date !== end_date");
                                    if (dummytimeline.length > 0) {
                                        if (
                                            dummytimeline[
                                                dummytimeline.length - 1
                                            ].data[0].y[1] !==
                                            new Date(
                                                arraytemp.timestamp
                                            ).getTime()
                                        ) {
                                            //////////console.log("update");
                                            const seriesdummy = {
                                                name: selectvalue[
                                                    parseInt(arraytemp.tagValue)
                                                ]
                                                    ? selectvalue[
                                                          parseInt(
                                                              arraytemp.tagValue
                                                          )
                                                      ]
                                                    : "offline",
                                                data: [
                                                    {
                                                        x: "Status",
                                                        y: [
                                                            dummytimeline[
                                                                dummytimeline.length -
                                                                    1
                                                            ].data[0].y[1],
                                                            new Date(
                                                                arraytemp.timestamp
                                                            ).getTime(),
                                                        ],
                                                    },
                                                ],
                                            };

                                            dummytimeline.push(seriesdummy);
                                            // Setseriestrendtimeline(dummytimeline)
                                        }
                                    } else {
                                        const firsttime = new Date(
                                            arraytemp.timestamp
                                        );
                                        firsttime.setHours(0);
                                        firsttime.setMinutes(0);
                                        firsttime.setSeconds(0);
                                        const seriesdummy = {
                                            name: selectvalue[
                                                parseInt(arraytemp.tagValue)
                                            ]
                                                ? selectvalue[
                                                      parseInt(
                                                          arraytemp.tagValue
                                                      )
                                                  ]
                                                : "offline",
                                            data: [
                                                {
                                                    x: "Status",
                                                    y: [
                                                        new Date(
                                                            firsttime
                                                        ).getTime(),
                                                        new Date(
                                                            arraytemp.timestamp
                                                        ).getTime(),
                                                    ],
                                                },
                                            ],
                                        };

                                        dummytimeline.push(seriesdummy);
                                    }

                                    Setseriestrendtimeline((prevseries) => [
                                        ...prevseries,
                                        ...dummytimeline,
                                    ]);
                                }
                            }

                            //////////console.log("");
                            //////////console.log("");
                        }
                        clearTimeout(loadingTimeout);
                        setTimeout(() => {
                            setLoading((prev) => ({
                                ...prev,
                                chartLatest: false,
                                infoLatest: false,
                            }));
                        }, 500);
                    })
                    .catch((err) => {
                        ////////////console.log(err);
                        clearTimeout(loadingTimeout);
                        setTimeout(() => {
                            setLoading((prev) => ({
                                ...prev,
                                chartLatest: false,
                                infoLatest: false,
                            }));
                        }, 500);

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
    }, [asset_number, realTime]);
    //realTime
    // tag, date, tag_name, realTime, dummySeries[0].data

    return (
        <div className='padding-machine-chart'>
            <div className='machine-chart'>
                <LoadingData
                    isLoading={loading.chart}
                    useAltBackground={false}
                    size={"80px"}
                    // backgroundOffset={"700px"}
                />
                <div className='machine-status-chart-type'>
                    <div className='machine-status'>
                        {datapersen.map((stats, i) => (
                            <div key={i} className='status'>
                                <StatusIcon
                                    style={{
                                        fill: getStatusColor(stats.status),
                                    }}
                                />
                                <p>
                                    {`${t(
                                        "content.machine_utilization.status." +
                                            stats.status
                                    )} : ${stats.timetotal}  (${
                                        stats.total
                                    } %)`}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className='machine-chart-type'>
                        <Tooltip
                            tooltip={
                                <span className='icon-tooltip'>
                                    {t("chart.Continuously")}
                                </span>
                            }>
                            <CharttypeoneButton
                                onClick={() => {
                                    chartType === 2 && setChartType(1);
                                }}
                                chartType={chartType}
                            />
                        </Tooltip>

                        <Tooltip
                            tooltip={
                                <span className='icon-tooltip'>
                                    {t("chart.Hourly")}
                                </span>
                            }>
                            <div
                                className={`type-2${
                                    chartType === 2 ? " type-2__active" : ""
                                }`}
                                onClick={() => {
                                    chartType === 1 && setChartType(2);
                                }}>
                                <ChartType2 />
                            </div>
                        </Tooltip>
                    </div>
                </div>
                <div className='chart'>
                    {chartType === 1 && (
                        <ReactApexChart
                            series={seriestrendtimeline}
                            options={optionstrendtimeline}
                            type='rangeBar'
                            height='130px'
                        />
                    )}

                    {chartType === 2 && (
                        <ReactApexChart
                            series={seriestrendseriesline}
                            options={optionstrendseriesline}
                            type='bar'
                            height='130px'
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

var toYearMMdd = (date) => {
    return new Date(date).toISOString().split("T")[0];
};

var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return [hours, minutes, seconds]
        .map((v) => (v < 10 ? "0" + v : v))
        .join(":");
};

export default ChartComponent;
