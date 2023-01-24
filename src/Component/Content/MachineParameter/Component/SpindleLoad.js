import { useEffect, useRef } from "react";
import { RadialGauge } from "canvas-gauges";

const SpindleLoad = (props) => {
    const { value, unit } = props;
    const spindleLoadRef = useRef();
    const spindleLoad = useRef();

    useEffect(() => {
        spindleLoad.current = new RadialGauge({
            renderTo: spindleLoadRef.current,
            width: 200,
            height: 190,
            startAngle: 90,
            ticksAngle: 180,
            units: "",
            minValue: 0,
            fontNumbersSize: 20,
            maxValue: 240,
            majorTicks: [
                "0",
                "24",
                "48",
                "72",
                "96",
                "120",
                "144",
                "168",
                "192",
                "216",
                "240",
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
        spindleLoad.current.value = value;
        spindleLoad.current.update();
    }, [value]);

    return (
        <>
            <div className='speedometer'>
                <canvas ref={spindleLoadRef}></canvas>
            </div>
            <div className='speedo-value'>
                <span className='value'>
                    {value ? value + " " + unit : "-"}
                </span>
            </div>
        </>
    );
};

export default SpindleLoad;
