import { useEffect, useRef } from "react";
import { RadialGauge } from "canvas-gauges";

const ActualFeedRate = (props) => {
    const { value, unit } = props;
    const actualFeedRateRef = useRef();
    const actualFeedRate = useRef();

    useEffect(() => {
        actualFeedRate.current = new RadialGauge({
            renderTo: actualFeedRateRef.current,
            width: 195,
            height: 195,
            startAngle: 90,
            ticksAngle: 180,
            units: "",
            minValue: 0,
            fontNumbersSize: 18,
            maxValue: 10000,
            majorTicks: [
                "0",
                "1000",
                "2000",
                "3000",
                "4000",
                "5000",
                "6000",
                "7000",
                "8000",
                "9000",
                "10000",
            ],
            minorTicks: 5,
            strokeTicks: false,
            colorMajorTicks: "#10226B",
            borderOuterWidth: 20,
            colorMinorTicks: "#549ABF",
            highlights: [],
            colorPlate: "transparent", // kaya backgroundnya
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
            // colorNeedleCircleInner: "#10226B",
            needleCircleSize: 20,
            needleCircleOuter: true,
            needleCircleInner: true,
            animationDuration: 700,
            animationRule: "linear",
            valueBox: false,
        }).draw();
    }, []);

    useEffect(() => {
        actualFeedRate.current.value = value;
        actualFeedRate.current.update();
    }, [value]);

    return (
        <>
            <div className='speedometer'>
                <canvas ref={actualFeedRateRef}></canvas>
            </div>
            <div className='speedo-value'>
                <span className='value'>
                    {value ? value + " " + unit : "-"}{" "}
                </span>
            </div>
        </>
    );
};

export default ActualFeedRate;
