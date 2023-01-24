import "../style.scss";
import Card from "./Card";

import { ReactComponent as Spindle2D } from "../../../../svg/spindle-2d.svg";
import { getToken } from "../../../ComponentReuseable/TokenParse";
import { ReturnHostBackend } from "../../../ComponentReuseable/BackendHost";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { RadialGauge } from "canvas-gauges";

const SpindleCondition = (props) => {
    const { t, machine_number, assetTags } = props;
    const gaugeFeedRateRef = useRef();
    const gaugeFeedRate = useRef();
    const gaugeSpeedRateRef = useRef();
    const gaugeSpeedRate = useRef();

    const [latestValue, setLatestValue] = useState({
        spindle_load: null,
        actual_spindle_speed: null,
        actual_feedrate: null,
        speed_rate_override: null,
        feedrate_override: null,
    });
    const [isRefresh, setIsRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState({
        spindle_condition: false,
    });

    const getLatestTagValue = async (isRealtime) => {
        let loadingTimeout;
        if (isRealtime) {
            loadingTimeout = setTimeout(() => {
                setIsLoading((prev) => {
                    prev.spindle_condition = true;
                    return { ...prev };
                });
            }, 5000);
        } else {
            setIsLoading((prev) => {
                prev.spindle_condition = true;
                return { ...prev };
            });
            setIsRefresh(false);
        }

        let config = {
            method: "GET",
            url:
                ReturnHostBackend(process.env.REACT_APP_RAW_DATA) +
                process.env.REACT_APP_MACHINE_PARAMETER_LATEST +
                `/${machine_number}`,
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
                            latest.tagName.includes(
                                "MachineParameterTags-Speed Override"
                            )
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes(
                                      "MachineParameterTags-Speed Override"
                                  )
                              )[0].tagValue
                            : null;
                    prev.actual_feedrate =
                        tags.filter((latest) =>
                            latest.tagName.includes(
                                "MachineParameterTags-Actual Feedrate"
                            )
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes(
                                      "MachineParameterTags-Actual Feedrate"
                                  )
                              )[0].tagValue
                            : null;
                    prev.feedrate_override =
                        tags.filter((latest) =>
                            latest.tagName.includes(
                                "MachineParameterTags-Feedrate Override"
                            )
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes(
                                      "MachineParameterTags-Feedrate Override"
                                  )
                              )[0].tagValue
                            : null;
                    prev.spindle_load =
                        tags.filter((latest) =>
                            latest.tagName.includes(
                                "MachineParameterTags-Spindle Load"
                            )
                        ).length > 0
                            ? tags.filter((latest) =>
                                  latest.tagName.includes(
                                      "MachineParameterTags-Spindle Load"
                                  )
                              )[0].tagValue
                            : null;

                    return { ...prev };
                });
            } else {
                setLatestValue((prev) => {
                    prev.actual_spindle_speed = null;
                    prev.speed_rate_override = null;
                    prev.actual_feedrate = null;
                    prev.feedrate_override = null;
                    prev.spindle_load = null;

                    return { ...prev };
                });
            }
            if (isRealtime) {
                clearTimeout(loadingTimeout);
                setTimeout(() => {
                    setIsLoading((prev) => ({
                        ...prev,
                        spindle_condition: false,
                    }));
                }, 500);
            } else {
                setIsLoading((prev) => ({
                    ...prev,
                    spindle_condition: false,
                }));
                setIsRefresh(true);
            }
        } catch (e) {
            // console.error(e);
            toast.error("Failed to get spindle condition latest data", {
                toastId: "failed-get-spindle-condition-latest-data",
            });
            if (isRealtime) {
                clearTimeout(loadingTimeout);
                setTimeout(() => {
                    setIsLoading((prev) => ({
                        ...prev,
                        spindle_condition: false,
                    }));
                }, 500);
            } else {
                setIsLoading((prev) => ({
                    ...prev,
                    spindle_condition: false,
                }));
            }
            setLatestValue((prev) => {
                prev.actual_spindle_speed = null;
                prev.speed_rate_override = null;
                prev.actual_feedrate = null;
                prev.feedrate_override = null;
                prev.spindle_load = null;

                return { ...prev };
            });
            setIsRefresh(false);
        }
    };

    useEffect(async () => {
        if (machine_number) {
            await getLatestTagValue();
        }
    }, [machine_number]);

    useEffect(() => {
        let interval = null;
        if (isRefresh) {
            const fetchData = async () => {
                try {
                    await getLatestTagValue(true);
                } catch (error) {}

                if (interval) {
                    interval = setTimeout(fetchData, 1000);
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
    }, [isRefresh]);

    useEffect(() => {
        gaugeSpeedRate.current = new RadialGauge({
            renderTo: gaugeSpeedRateRef.current,
            width: 120,
            height: 120,
            startAngle: 0,
            ticksAngle: 360,
            minValue: 0,
            fontNumbersSize: 25,
            maxValue: 220,
            majorTicks: [
                "0",
                "20",
                "40",
                "60",
                "80",
                "100",
                "120",
                "140",
                "160",
                "180",
                "200",
                "220",
            ],
            minorTicks: 5,
            valueInt: 1,
            valueDec: 0,
            strokeTicks: false,
            colorMajorTicks: "#10226B",
            borderOuterWidth: 20,
            colorMinorTicks: "#549ABF",
            highlights: [],
            colorPlate: "#fff", // kaya backgroundnya
            needle: true,
            colorNeedle: "rgba(17, 79, 130, 0.5)",
            colorNeedleEnd: "rgba(17, 79, 130, 0.5)",
            colorNeedleShadowDown: "rgba(17, 79, 130, 0.2)",
            colorNeedleShadowUp: "rgba(17, 79, 130, 0.2)",
            needleShadow: true,
            needleShadow: false,
            borderShadowWidth: 0,
            borders: false,
            needleType: "arrow",
            needleWidth: 10,

            // colorNeedleCircleInner: "#1d4e77",
            needleCircleSize: 20,
            needleCircleOuter: true,
            needleCircleInner: true,
            animationDuration: 700,
            animationRule: "linear",
            valueBox: false,
        }).draw();
    }, []);

    useEffect(() => {
        gaugeFeedRate.current = new RadialGauge({
            renderTo: gaugeFeedRateRef.current,
            width: 120,
            height: 120,
            startAngle: 0,
            ticksAngle: 360,
            minValue: 0,
            fontNumbersSize: 25,
            maxValue: 220,
            majorTicks: [
                "0",
                "20",
                "40",
                "60",
                "80",
                "100",
                "120",
                "140",
                "160",
                "180",
                "200",
                "220",
            ],
            minorTicks: 5,
            valueInt: 1,
            valueDec: 0,
            strokeTicks: false,
            colorMajorTicks: "#10226B",
            borderOuterWidth: 20,
            colorMinorTicks: "#549ABF",
            highlights: [],
            colorPlate: "#fff", // kaya backgroundnya
            needle: true,
            colorNeedle: "rgba(17, 79, 130, 0.5)",
            colorNeedleEnd: "rgba(17, 79, 130, 0.5)",
            colorNeedleShadowDown: "rgba(17, 79, 130, 0.2)",
            colorNeedleShadowUp: "rgba(17, 79, 130, 0.2)",
            needleShadow: true,
            needleShadow: false,
            borderShadowWidth: 0,
            borders: false,
            needleType: "arrow",
            needleWidth: 10,

            // colorNeedleCircleInner: "#1d4e77",
            needleCircleSize: 20,
            needleCircleOuter: true,
            needleCircleInner: true,
            animationDuration: 700,
            animationRule: "linear",
            valueBox: false,
        }).draw();
    }, []);

    useEffect(() => {
        gaugeFeedRate.current.value =
            latestValue.feedrate_override &&
            !latestValue.feedrate_override.includes("known")
                ? Math.floor(255 - parseInt(latestValue.feedrate_override))
                : null;
        gaugeSpeedRate.current.value =
            latestValue.speed_rate_override &&
            !latestValue.speed_rate_override.includes("known")
                ? latestValue.speed_rate_override
                : null;
        gaugeFeedRate.current.update();
        gaugeSpeedRate.current.update();
    }, [latestValue]);

    return (
        <div className='spindle-condition'>
            <Card
                title={t(
                    "content.spindle_condition.spindle_condition.header.spindle_condition"
                )}
                isLoading={isLoading.spindle_condition}
                children={
                    <div className='spindle-content'>
                        <div className='spindle'>
                            <Spindle2D style={{ width: "300px" }} />
                            <div className='condition condition__spindle-load'>
                                <div className='name'>
                                    {t(
                                        "content.spindle_condition.spindle_condition.content.spindle_load"
                                    )}
                                </div>
                                <div className='value'>
                                    {latestValue.spindle_load &&
                                    !latestValue.spindle_load.includes("known")
                                        ? `${latestValue.spindle_load} ${
                                              assetTags.filter((tag) =>
                                                  tag.tag_name.includes(
                                                      "Spindle Load"
                                                  )
                                              ).length > 0
                                                  ? assetTags.filter((tag) =>
                                                        tag.tag_name.includes(
                                                            "Spindle Load"
                                                        )
                                                    )[0].unit
                                                  : "%"
                                          }`
                                        : "-"}
                                </div>
                            </div>
                            <div className='condition condition__actual-spindle-speed'>
                                <div className='name'>
                                    {t(
                                        "content.spindle_condition.spindle_condition.content.actual_spindle_speed"
                                    )}
                                </div>
                                <div className='value'>
                                    {latestValue.actual_spindle_speed &&
                                    !latestValue.actual_spindle_speed.includes(
                                        "known"
                                    )
                                        ? `${
                                              latestValue.actual_spindle_speed
                                          } ${
                                              assetTags.filter((tag) =>
                                                  tag.tag_name.includes(
                                                      "Actual Spindle Speed"
                                                  )
                                              ).length > 0
                                                  ? assetTags.filter((tag) =>
                                                        tag.tag_name.includes(
                                                            "Actual Spindle Speed"
                                                        )
                                                    )[0].unit
                                                  : "r/min"
                                          }`
                                        : "-"}
                                </div>
                            </div>
                            <div className='condition condition__actual-feed-rate'>
                                <div className='name'>
                                    {t(
                                        "content.spindle_condition.spindle_condition.content.actual_feed_rate"
                                    )}
                                </div>
                                <div className='value'>
                                    {latestValue.actual_feedrate &&
                                    !latestValue.actual_feedrate.includes(
                                        "known"
                                    )
                                        ? `${latestValue.actual_feedrate} ${
                                              assetTags.filter((tag) =>
                                                  tag.tag_name.includes(
                                                      "Actual Feedrate"
                                                  )
                                              ).length > 0
                                                  ? assetTags.filter((tag) =>
                                                        tag.tag_name.includes(
                                                            "Actual Feedrate"
                                                        )
                                                    )[0].unit
                                                  : "mm/min"
                                          }`
                                        : "-"}
                                </div>
                            </div>
                        </div>
                        <div className='speedometer'>
                            <div className='top-side'>
                                {/* <Speedo className='speedometer-chart' /> */}
                                <canvas ref={gaugeSpeedRateRef}></canvas>
                                <div className='speedometer-value'>
                                    <span>
                                        {t(
                                            "content.spindle_condition.spindle_condition.content.speed_rate_override"
                                        )}
                                    </span>
                                    <span>
                                        {latestValue.speed_rate_override &&
                                        !latestValue.speed_rate_override.includes(
                                            "known"
                                        )
                                            ? `${
                                                  latestValue.speed_rate_override
                                              } ${
                                                  assetTags.filter((tag) =>
                                                      tag.tag_name.includes(
                                                          "Speed Override"
                                                      )
                                                  ).length > 0
                                                      ? assetTags.filter(
                                                            (tag) =>
                                                                tag.tag_name.includes(
                                                                    "Speed Override"
                                                                )
                                                        )[0].unit
                                                      : "%"
                                              }`
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                            <div className='bottom-side'>
                                {/* <Speedo className='speedometer-chart' /> */}
                                <canvas ref={gaugeFeedRateRef}></canvas>
                                <div className='speedometer-value'>
                                    <span>
                                        {t(
                                            "content.spindle_condition.spindle_condition.content.feed_rate_override"
                                        )}
                                    </span>
                                    <span>
                                        {latestValue.feedrate_override &&
                                        !latestValue.feedrate_override.includes(
                                            "known"
                                        )
                                            ? `${Math.floor(
                                                  255 -
                                                      parseInt(
                                                          latestValue.feedrate_override
                                                      )
                                              )} ${
                                                  assetTags.filter((tag) =>
                                                      tag.tag_name.includes(
                                                          "Feedrate Override"
                                                      )
                                                  ).length > 0
                                                      ? assetTags.filter(
                                                            (tag) =>
                                                                tag.tag_name.includes(
                                                                    "Feedrate Override"
                                                                )
                                                        )[0].unit
                                                      : "%"
                                              }`
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default SpindleCondition;
