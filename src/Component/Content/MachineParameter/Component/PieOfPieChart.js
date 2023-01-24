import { useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import ReactApexChart from "react-apexcharts";

const PieOfPieChart = (props) => {
    const { t, data } = props;
    // useEffect(() => {
    //     if (data) {
    //         am5.ready(function () {
    //             var root = am5.Root.new("chartdiv");

    //             // Set themes
    //             // https://www.amcharts.com/docs/v5/concepts/themes/
    //             root.setThemes([am5themes_Animated.new(root)]);

    //             var container = root.container.children.push(
    //                 am5.Container.new(root, {
    //                     width: am5.p100,
    //                     height: am5.p100,
    //                     layout: root.horizontalLayout,
    //                 })
    //             );

    //             // Create main chart
    //             // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    //             var chart = container.children.push(
    //                 am5percent.PieChart.new(root, {
    //                     tooltip: am5.Tooltip.new(root, {}),
    //                 })
    //             );

    //             // Create series
    //             // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    //             var series = chart.series.push(
    //                 am5percent.PieSeries.new(root, {
    //                     valueField: "value",
    //                     categoryField: "category",
    //                     alignLabels: false,
    //                 })
    //             );

    //             // series.labels.template.setAll({
    //             //     textType: "circular",
    //             //     radius: 4,
    //             // });
    //             series.ticks.template.set("visible", false);
    //             series.slices.template.set("toggleKey", "none");
    //             series.slices.template.setAll({
    //                 templateField: "settings",
    //                 stroke: 0,
    //             });
    //             series.labels.template.setAll({ visible: false });
    //             // series
    //             //     .get("colors")
    //             //     .set("colors", [
    //             //         am5.color(0x39a847),
    //             //         am5.color(0x1980de),
    //             //         am5.color(0xffb920),
    //             //         am5.color(0xf14e38),
    //             //     ]);
    //             // Create sub chart
    //             // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    //             var subChart = container.children.push(
    //                 am5percent.PieChart.new(root, {
    //                     radius: am5.percent(50),
    //                     tooltip: am5.Tooltip.new(root, {}),
    //                 })
    //             );

    //             // Create sub series
    //             // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    //             var subSeries = subChart.series.push(
    //                 am5percent.PieSeries.new(root, {
    //                     valueField: "value",
    //                     categoryField: "category",
    //                     alignLabels: false,
    //                 })
    //             );
    //             // subSeries
    //             //     .get("colors")
    //             //     .set("colors", [am5.color(0x92a7bc), am5.color(0xffb920)]);
    //             subSeries.slices.template.set("toggleKey", "none");
    //             subSeries.labels.template.setAll({ visible: false });
    //             subSeries.ticks.template.set("visible", false);
    //             subSeries.slices.template.setAll({
    //                 templateField: "settings",
    //                 stroke: 0,
    //             });

    //             subSeries.data.setAll([
    //                 {
    //                     category: "Cutting",
    //                     value: 0,
    //                     settings: {
    //                         fill: am5.color(0xefad2e),
    //                     },
    //                 },
    //                 {
    //                     category: "Non-Cutting",
    //                     value: 0,
    //                     settings: {
    //                         fill: am5.color(0x92a7bc),
    //                     },
    //                 },
    //             ]);
    //             var selectedSlice;

    //             container.events.on("boundschanged", function () {
    //                 root.events.on("frameended", function () {
    //                     updateLines();
    //                 });
    //             });

    //             function updateLines() {
    //                 if (selectedSlice) {
    //                     var startAngle = selectedSlice.get("startAngle");
    //                     var arc = selectedSlice.get("arc");
    //                     var radius = selectedSlice.get("radius");

    //                     var x00 = radius * am5.math.cos(startAngle);
    //                     var y00 = radius * am5.math.sin(startAngle);

    //                     var x10 = radius * am5.math.cos(startAngle + arc);
    //                     var y10 = radius * am5.math.sin(startAngle + arc);

    //                     var subRadius = subSeries.slices
    //                         .getIndex(0)
    //                         .get("radius");
    //                     var x01 = 0;
    //                     var y01 = -subRadius;

    //                     var x11 = 0;
    //                     var y11 = subRadius;

    //                     var point00 = series.toGlobal({ x: x00, y: y00 });
    //                     var point10 = series.toGlobal({ x: x10, y: y10 });

    //                     var point01 = subSeries.toGlobal({ x: x01, y: y01 });
    //                     var point11 = subSeries.toGlobal({ x: x11, y: y11 });

    //                     line0.set("points", [point00, point01]);
    //                     line1.set("points", [point10, point11]);
    //                 }
    //             }

    //             // lines
    //             var line0 = container.children.push(
    //                 am5.Line.new(root, {
    //                     position: "absolute",
    //                     stroke: root.interfaceColors.get("text"),
    //                     strokeDasharray: [2, 2],
    //                 })
    //             );
    //             var line1 = container.children.push(
    //                 am5.Line.new(root, {
    //                     position: "absolute",
    //                     stroke: root.interfaceColors.get("text"),
    //                     strokeDasharray: [2, 2],
    //                 })
    //             );

    //             // Set data
    //             // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    //             series.data.setAll([
    //                 {
    //                     category: "Total Running",
    //                     value: data.runningTime ? data.runningTime : 0,
    //                     subData: [
    //                         {
    //                             category: "Cutting",
    //                             value: data.cuttingTime ? data.cuttingTime : 0,
    //                         },
    //                         {
    //                             category: "Non-Cutting",
    //                             value: data.nonCuttingTime
    //                                 ? data.nonCuttingTime
    //                                 : 0,
    //                         },
    //                     ],
    //                     settings: {
    //                         fill: am5.color(0x39a847),
    //                     },
    //                 },
    //                 {
    //                     category: "Hold Time",
    //                     value: data.holdTime ? data.holdTime : 0,
    //                     subData: [],
    //                     settings: {
    //                         fill: am5.color(0xffb920),
    //                     },
    //                 },
    //                 {
    //                     category: "Idle Time",
    //                     value: data.idleTime ? data.idleTime : 0,
    //                     subData: [],
    //                     settings: {
    //                         fill: am5.color(0x1980de),
    //                     },
    //                 },
    //                 {
    //                     category: "Stop Time",
    //                     value: data.stopTime ? data.stopTime : 0,
    //                     subData: [],
    //                     settings: {
    //                         fill: am5.color(0xf14e38),
    //                     },
    //                 },
    //             ]);

    //             function selectSlice(slice) {
    //                 selectedSlice = slice;
    //                 var dataItem = slice.dataItem;
    //                 var dataContext = dataItem.dataContext;

    //                 if (dataContext) {
    //                     var i = 0;
    //                     subSeries.data.each(function (dataObject) {
    //                         subSeries.data.setIndex(i, dataContext.subData[i]);
    //                         i++;
    //                     });
    //                 }

    //                 var middleAngle =
    //                     slice.get("startAngle") + slice.get("arc") / 2;
    //                 var firstAngle = series.dataItems[0]
    //                     .get("slice")
    //                     .get("startAngle");

    //                 series.slices.getIndex(0);

    //                 series.animate({
    //                     key: "startAngle",
    //                     to: firstAngle - middleAngle,
    //                     duration: 1000,
    //                     easing: am5.ease.out(am5.ease.cubic),
    //                 });
    //                 series.animate({
    //                     key: "endAngle",
    //                     to: firstAngle - middleAngle + 360,
    //                     duration: 1000,
    //                     easing: am5.ease.out(am5.ease.cubic),
    //                 });
    //             }

    //             container.appear(1000, 10);

    //             series.events.on("datavalidated", function () {
    //                 selectSlice(series.slices.getIndex(0));
    //             });
    //         });
    //     }
    // }, [data]);
    const options1 = {
        chart: {
            animations: {
                enabled: false,
            },
            type: "pie",
        },
        dataLabels: {
            enabled: false,
            formatter: function (val) {
                return val + "%";
            },
        },
        legend: {
            show: false,
        },
        stroke: {
            show: false,
            curve: "smooth",
            lineCap: "butt",
            colors: undefined,
            width: 2,
            dashArray: 0,
        },
        labels: [
            t(
                "content.machine_parameter_overview.operating_summary.status.running"
            ),
            t(
                "content.machine_parameter_overview.operating_summary.status.idle"
            ),
            t(
                "content.machine_parameter_overview.operating_summary.status.hold"
            ),
            t(
                "content.machine_parameter_overview.operating_summary.status.stop"
            ),
        ],
        colors: ["#39A847", "#1980DE", "#FFB920", "#F14E38"],
    };
    const options2 = {
        labels: [
            t(
                "content.machine_parameter_overview.operating_summary.status.non_cutting"
            ),
            t(
                "content.machine_parameter_overview.operating_summary.status.cutting"
            ),
        ],
        dataLabels: {
            enabled: false,
        },
        chart: {
            animations: {
                enabled: false,
            },
            type: "pie",
        },
        legend: {
            show: false,
        },
        stroke: {
            show: false,
            curve: "smooth",
            lineCap: "butt",
            colors: undefined,
            width: 2,
            dashArray: 0,
        },
        colors: ["#92A7BC", "#FFB920"],
    };

    return (
        <>
            <div className='left-chart'>
                <ReactApexChart
                    options={options1}
                    series={[
                        data.runningTime ? data.runningTime : 0,
                        data.idleTime ? data.idleTime : 0,
                        data.holdTime ? data.holdTime : 0,
                        data.stopTime ? data.stopTime : 0,
                    ]}
                    type='pie'
                    height={220}
                    width={"100%"}
                />
            </div>
            <div className='right-chart'>
                <ReactApexChart
                    options={options2}
                    series={[
                        data.nonCuttingTime ? data.nonCuttingTime : 0,
                        data.cuttingTime ? data.cuttingTime : 0,
                    ]}
                    type='pie'
                    height={160}
                    width={"100%"}
                />
            </div>
        </>
    );
};

export default PieOfPieChart;
