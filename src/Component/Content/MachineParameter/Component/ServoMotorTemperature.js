import ReactApexChart from "react-apexcharts";

const ServoMotorTemperature = (props) => {
    const { temperature } = props;

    const optionsX = {
        chart: {
            animations: {
                enabled: false,
            },
            type: "bar",
            stacked: true,
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                columnWidth: "100%",
                barHeight: "20%",
                borderRadius: 5,
                colors: {
                    backgroundBarColors: ["#DCE7F3"],
                    backgroundBarOpacity: 0.8,
                    backgroundBarRadius: 5,
                },
            },
        },
        colors: ["#2372BB"],
        title: {
            floating: true,
            offsetX: -10,
            offsetY: -5,
            text: `X: ${temperature.tempX ? temperature.tempX : 0}°C`,
        },
        tooltip: {
            enabled: false,
        },
        xaxis: {
            categories: ["Process 1"],
        },
        yaxis: {
            max: 100,
            min: 0,
        },
        fill: {
            opacity: 1,
        },
    };

    const optionsY = {
        chart: {
            animations: {
                enabled: false,
            },
            type: "bar",
            stacked: true,
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                columnWidth: "100%",
                barHeight: "20%",
                borderRadius: 5,
                colors: {
                    backgroundBarColors: ["#DCE7F3"],
                    backgroundBarOpacity: 0.8,
                    backgroundBarRadius: 5,
                },
            },
        },
        colors: ["#FFB71B"],
        title: {
            floating: true,
            offsetX: -10,
            offsetY: -5,
            text: `Y: ${temperature.tempY ? temperature.tempY : 0}°C`,
        },
        tooltip: {
            enabled: false,
        },
        yaxis: {
            max: 100,
        },
        fill: {
            opacity: 1,
        },
    };
    const optionsZ = {
        chart: {
            animations: {
                enabled: false,
            },
            type: "bar",
            stacked: true,
            sparkline: {
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                columnWidth: "100%",
                barHeight: "20%",
                borderRadius: 5,
                colors: {
                    backgroundBarColors: ["#DCE7F3"],
                    backgroundBarOpacity: 0.8,
                    backgroundBarRadius: 5,
                },
            },
        },
        colors: ["#FF3F25"],
        title: {
            floating: true,
            offsetX: -10,
            offsetY: -5,
            text: `Z: ${temperature.tempZ ? temperature.tempZ : 0}°C`,
        },
        tooltip: {
            enabled: false,
        },
        yaxis: {
            max: 100,
        },
        fill: {
            opacity: 1,
        },
    };
    return (
        typeof window !== "undefined" && (
            <>
                <ReactApexChart
                    options={optionsX}
                    series={[
                        {
                            data: [temperature.tempX ? temperature.tempX : 0],
                        },
                    ]}
                    type='bar'
                    // width={"95%"}
                    height={50}
                />
                <ReactApexChart
                    options={optionsY}
                    series={[
                        {
                            data: [temperature.tempY ? temperature.tempY : 0],
                        },
                    ]}
                    type='bar'
                    // width={"95%"}
                    height={50}
                />
                <ReactApexChart
                    options={optionsZ}
                    series={[
                        {
                            data: [temperature.tempZ ? temperature.tempZ : 0],
                        },
                    ]}
                    type='bar'
                    // width={"95%"}
                    height={50}
                />
            </>
        )
    );
};

export default ServoMotorTemperature;
