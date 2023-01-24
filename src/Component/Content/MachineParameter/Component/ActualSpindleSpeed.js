import { useEffect, useRef } from "react";
import { RadialGauge } from "canvas-gauges";

const ActualSpindleSpeed = (props) => {
    const { value, unit } = props;
    const actualSpindleSpeedRef = useRef();
    const actualSpindleSpeed = useRef();

    useEffect(() => {
        actualSpindleSpeed.current = new RadialGauge({
            renderTo: actualSpindleSpeedRef.current,
            width: 190,
            height: 190,
            units: "",
            minValue: 0,
            fontNumbersSize: 20,
            maxValue: 24000,
            majorTicks: [
                "0",
                "2400",
                "4800",
                "7200",
                "9600",
                "12000",
                "14400",
                "16800",
                "19200",
                "21600",
                "24000",
            ],
            minorTicks: 5,
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
        actualSpindleSpeed.current.value = value;
        actualSpindleSpeed.current.update();
    }, [value]);

    return (
        <>
            <canvas ref={actualSpindleSpeedRef}></canvas>
            <div className='speedo-value'>
                <span className='value'>
                    {value ? value + " " + unit : "-"}
                </span>
            </div>
        </>
    );
};

export default ActualSpindleSpeed;
