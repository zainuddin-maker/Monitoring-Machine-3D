import ReactApexChart from "react-apexcharts";
import { ReactComponent as EditIcon } from "../../../../svg/edit-icon.svg";
import {
    useModal,
    ModalContainer,
    generateDateGMT8,
    LoadingData,
} from "../../../ComponentReuseable/index";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ReturnHostBackend } from "../../../ComponentReuseable/BackendHost";
import { getToken } from "../../../ComponentReuseable/TokenParse";
import "./style.scss";

const Chart = (props) => {
    const { getAssetTags, t, length, data, start_date, end_date } = props;

    const requestInterval = 5000;

    const [realTime, setRealTime] = useState(false);
    const [nowCondition, setNowCondition] = useState(false);
    const [loading, setLoading] = useState({
        chart: false,
        info: false,
        chartLatest: false,
        infoLatest: false,
    });
    const { isShowing: isShowing, toggle: modal } = useModal();
    const today = new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
        .toISOString()
        .slice(0, 10);
    const [lineChart, setLineChart] = useState([]);
    const [chartColors, setChartColors] = useState([]);
    const tagName = data.tag_name
        ? data.tag_name.split("-")[1].toLowerCase().split(" ").join("_")
        : "";
    const [latestValue, setLatestValue] = useState(null);
    const [input, setInput] = useState({
        high: 0,
        low: 0,
    });

    const options = {
        chart: {
            animations: {
                enabled: false,
            },
            type: "line",
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        // colors: chartColors ? chartColors : null,
        stroke: {
            curve: "straight",
            width: 2,
        },
        toolbar: {
            show: false,
        },
        grid: {
            show: true,
            borderColor: "#AEC4DA",
            strokeDashArray: 0,
            position: "back",
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
            row: {
                colors: undefined,
                opacity: 0.5,
            },
            column: {
                colors: undefined,
                opacity: 0.5,
            },
            padding: {
                top: -20,
                right: -20,
                bottom: -10,
                left: -5,
            },
        },
        xaxis: {
            axisBorder: {
                show: true,
                offsetY: 5,
                color: "#0E2C5F",
                height: 1,
            },
            axisTicks: {
                show: false,
            },
            type: "datetime",
            min: new Date(new Date(start_date).setHours(0, 0, 0)).getTime(),
            max: new Date(new Date(end_date).setHours(23, 30)).getTime(),
            tickAmount: 4, // interval you want
            labels: {
                datetimeUTC: false,
                show: true,
                offsetY: -5,
            },
            tooltip: {
                enabled: false,
            },
        },
        yaxis: {
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: true,
                offsetX: -12,
            },
            tooltip: {
                enabled: false,
            },
        },
        annotations: {
            yaxis: [
                {
                    y: data.min || 0,
                    strokeDashArray: 0,
                    borderColor: "#B43C22",
                    fillColor: "transparent",
                },
                {
                    y: data.max || 0,
                    strokeDashArray: 0,
                    borderColor: "#B43C22",
                    fillColor: "transparent",
                },
            ],
        },
    };

    const getChart = async () => {
        setLoading((prev) => ({ ...prev, chart: true }));
        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                process.env
                    .REACT_APP_SPINDLE_CONDITION_GET_SPINDLE_CONDITION_CHART,
            headers: {
                authorization: getToken(),
            },
            data: {
                tag_id: data.tag_id,
                start_date: start_date ? start_date : today,
                end_date: end_date ? end_date : today,
                min: data.min,
                max: data.max,
            },
        };
        try {
            const result = await axios(config);

            let prevSeries = [];
            if (result.data) {
                let colors = [];
                const chart = result.data;
                if (chart.length > 0) {
                    chart.map((data, index) => {
                        prevSeries.push({
                            x: generateDateGMT8(new Date(data.x)),
                            y: data.y,
                            // color: "#D41616",
                            // borderColor: "#D41616",
                            fillColor: data.fillColor,
                        });
                        colors.push(data.fillColor);
                    });
                    setNowCondition(chart[chart.length - 1].fillColor);
                    setLatestValue(chart[chart.length - 1].y);
                } else {
                    setLatestValue(null);
                }

                setRealTime(true);
                setLoading((prev) => ({ ...prev, chart: false }));
                setLineChart(prevSeries);
                setChartColors(colors);
                // console.log(chartColors);
            } else {
                toast.error("Cannot get chart data", {
                    toastId: "cannot-get-chart-data",
                });
                setRealTime(false);
                setLoading((prev) => ({ ...prev, chart: false }));
                setLineChart([]);
            }
        } catch (e) {
            // console.error(e);
            toast.error("Cannot get chart data", {
                toastId: "cannot-get-chart-data",
            });
            setRealTime(false);
            setLoading((prev) => ({ ...prev, chart: false }));
            setLineChart([]);
        }
    };

    const getLatestData = async () => {
        const loadingTimeout = setTimeout(() => {
            setLoading((prev) => {
                prev.chartLatest = true;
                return { ...prev };
            });
        }, 10000);
        let config = {
            method: "GET",
            url:
                ReturnHostBackend(process.env.REACT_APP_RAW_DATA) +
                process.env.REACT_APP_SPINDLE_CONDITION_LATEST +
                `/${data.asset_number}/${data.tag_name}`,
            headers: {
                authorization: getToken(),
            },
        };
        try {
            const result = await axios(config);
            let prevSeries = [];
            let color = [];
            if (result.data) {
                const value = result.data[0];

                if (
                    value.tagValue !== "" &&
                    generateDateGMT8(new Date(value.timestamp)).getTime() >=
                        generateDateGMT8(new Date()).getTime() &&
                    !value.tagValue.includes("known")
                ) {
                    prevSeries.push({
                        x: generateDateGMT8(new Date(value.timestamp)),
                        y: value.tagValue,
                        fillColor:
                            value.tagValue <= data.min ||
                            value.tagValue >= data.max
                                ? "#D41616"
                                : "#2372BB",
                    });
                    color.push(
                        value.tagValue <= data.min || value.tagValue >= data.max
                            ? "#D41616"
                            : "#2372BB"
                    );
                    setLineChart((prevState) => [...prevState, ...prevSeries]);
                    setChartColors((prev) => [...prev, ...color]);
                    // setLineChart(prevSeries);
                    setLatestValue(value.tagValue);
                    setNowCondition(
                        data.min || data.max
                            ? value.tagValue <= data.min ||
                              value.tagValue >= data.max
                                ? "#D41616"
                                : "#2372BB"
                            : "#2372BB"
                    );
                }
            }
            clearTimeout(loadingTimeout);
            setTimeout(() => {
                setLoading((prev) => ({
                    ...prev,
                    chartLatest: false,
                }));
            }, 500);
        } catch (e) {
            // console.error(e);
            toast.error("Cannot get chart data", {
                toastId: "cannot-get-chart-data",
            });
            clearTimeout(loadingTimeout);
            setTimeout(() => {
                setLoading((prev) => ({
                    ...prev,
                    chartLatest: false,
                }));
            }, 500);
        }
    };

    const handleValue = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("tag_name", data.tag_name);
        formData.append("machine_number", data.asset_number);
        formData.append("high", input.high !== "" ? input.high : null);
        formData.append("low", input.low !== "" ? input.low : null);
        const config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env
                    .REACT_APP_SPINDLE_CONDITION_UPSERT_CONFIGURATION_CHART,
            data: formData,
            headers: {
                authorization: getToken(),
            },
        };
        axios(config)
            .then((response) => {
                if (response.data.data) {
                    toast.success("Chart Configuration Updated", {
                        toastId: "update",
                    });
                }
                getChart();
                getAssetTags();

                modal();
            })
            .catch((err) => {
                // console.log(err);
                toast.error(
                    "Cannot update chart configutation: " + err.message,
                    { toastId: "update" }
                );
            });
    };

    const onClear = () => {
        setInput((prev) => {
            prev.high = data.max;
            prev.low = data.min;
            return { ...prev };
        });
    };

    useEffect(() => {
        getChart(); //setLineChart
    }, [data, start_date, end_date]);

    useEffect(() => {
        let interval = null;
        if (data.asset_number && data.tag_name) {
            if (realTime) {
                const fetchData = async () => {
                    try {
                        await getLatestData();
                    } catch (error) {
                        // ////console.log(error);
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
        }
    }, [data, realTime]);

    useEffect(() => {
        if (data !== undefined) {
            let dataValue = data;
            dataValue.low = data.min ? data.min : "";
            dataValue.high = data.max ? data.max : "";
            setInput(dataValue);
        }
    }, [data]);

    return (
        <div className='chart-content'>
            <LoadingData
                isLoading={loading.chartLatest || loading.chart}
                useAltBackground={false}
                size={"80px"}
            />
            <div className='content'>
                <div className='chart-condition'>
                    <div className='condition-name'>
                        <span
                            style={
                                nowCondition === "#D41616"
                                    ? { color: nowCondition }
                                    : {}
                            }>
                            {t("content.spindle_condition.chart." + tagName)}
                        </span>
                        <EditIcon className='icon' onClick={() => modal()} />
                    </div>
                    <div className='condition-value'>
                        <div
                            className='value-1'
                            style={
                                nowCondition === "#D41616"
                                    ? {
                                          color: "#ffffff",
                                          backgroundColor: nowCondition,
                                      }
                                    : {}
                            }>
                            <span>
                                {t("content.spindle_condition.chart.value")}
                            </span>
                            <div className='value'>
                                <span>{latestValue ? latestValue : "-"}</span>
                                <span>{data.unit ? data.unit : "-"}</span>
                            </div>
                        </div>
                        <div
                            className='value-2'
                            style={
                                nowCondition === "#D41616"
                                    ? {
                                          color: "#ffffff",
                                          backgroundColor: nowCondition,
                                      }
                                    : {}
                            }>
                            <div className='high'>
                                <span>
                                    {t("content.spindle_condition.chart.high") +
                                        ":"}
                                </span>
                                <span>{input.max ? input.max : "-"}</span>
                            </div>
                            <div className='low'>
                                <span>
                                    {t("content.spindle_condition.chart.low") +
                                        ":"}
                                </span>
                                <span>{input.min ? input.min : "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='chart-chart'>
                    {/* <div className='start-border'></div> */}
                    {typeof window !== "undefined" && (
                        <ReactApexChart
                            height={"80%"}
                            width={"100%"}
                            type='line'
                            options={options}
                            series={[
                                {
                                    name: "Main",
                                    data: lineChart,
                                },
                            ]}
                        />
                    )}
                    {/* <div className='end-border'></div> */}
                </div>
                <ModalContainer
                    width='360px'
                    title={t(
                        "content.spindle_condition.pop_up.header.actual_spindle_speed"
                    )}
                    isShowing={isShowing}
                    hide={() => {
                        modal();
                        onClear();
                    }}
                    submitName={t(
                        "content.spindle_condition.pop_up.content.update"
                    )}
                    level={2}
                    onSubmit={handleValue}
                    clearName={t(
                        "content.spindle_condition.pop_up.content.cancel"
                    )}
                    onClear={() => {
                        modal();
                        onClear();
                    }}
                    children={
                        <div className='high-low-threshold'>
                            <form id='accessForm' onSubmit={handleValue}>
                                <div className='high-threshold'>
                                    <div className='name'>
                                        {t(
                                            "content.spindle_condition.pop_up.content.high"
                                        ) + ":"}
                                    </div>
                                    <div className='value'>
                                        <input
                                            type='number'
                                            min={0}
                                            value={input.high}
                                            onChange={(e) =>
                                                setInput((prev) => {
                                                    prev.high = e.target.value;
                                                    return { ...prev };
                                                })
                                            }
                                        />
                                        <label>
                                            {data.unit ? data.unit : "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className='low-threshold'>
                                    <div className='name'>
                                        {t(
                                            "content.spindle_condition.pop_up.content.low"
                                        ) + ":"}
                                    </div>
                                    <div className='value'>
                                        <input
                                            type='number'
                                            min={0}
                                            value={input.low}
                                            onChange={(e) =>
                                                setInput((prev) => {
                                                    prev.low = e.target.value;
                                                    return { ...prev };
                                                })
                                            }
                                        />
                                        <label>
                                            {data.unit ? data.unit : "-"}
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default Chart;
