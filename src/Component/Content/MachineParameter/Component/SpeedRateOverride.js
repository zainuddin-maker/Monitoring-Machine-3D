import { useEffect, useRef } from "react";
import { RadialGauge } from "canvas-gauges";

const SpeedRateOverride = (props) => {
    const { value, unit } = props;
    const speedRateOverrideRef = useRef();
    const speedRateOverride = useRef();

    useEffect(() => {
        speedRateOverride.current = new RadialGauge({
            renderTo: speedRateOverrideRef.current,
            width: 190,
            height: 190,
            units: "",
            minValue: 50,
            fontNumbersSize: 25,
            maxValue: 200,
            majorTicks: [
                "50",
                "65",
                "80",
                "95",
                "110",
                "125",
                "140",
                "155",
                "170",
                "185",
                "200",
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
        speedRateOverride.current.value = value;
        speedRateOverride.current.update();
    }, [value]);

    return (
        <>
            <canvas ref={speedRateOverrideRef}></canvas>
            <div className='speedo-value'>
                <span className='value'>
                    {value ? value + " " + unit : "-"}
                </span>
            </div>
        </>
    );
};

export default SpeedRateOverride;
