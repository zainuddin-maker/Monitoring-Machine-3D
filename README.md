<!-- # Taichang Development

1. Make sure branch master always up to date
2. Create new branch if you want to develop this application
3. If you want to merge, please merge with other developer -->

<h1 align="center"  style="font-weight:bold;" >
  <br>
  <!-- <a href="http://www.amitmerchant.com/electron-markdownify"><img src="https://raw.githubusercontent.com/amitmerchant1990/electron-markdownify/master/app/img/markdownify.png" alt="Markdownify" width="200"></a> -->
  <br>
  Notification Realtime
  <br>
</h1>

> Data input from thingworx application .

<!-- <h4 align="center">A minimal Markdown Editor desktop app built on top of <a target="_blank">Electron</a>.</h4> -->

![Chat Preview](https://github.com/zainuddin-maker/Bar-Group-Stack-Chart-with-Line-Chart/blob/master/App.PNG?raw=true)

<!-- ![screenshot](https://github.com/zainuddin-maker/Export-Excel-to-Json/blob/master/Convert_excel_to_JSON.mp4?raw=true) -->

This application is used to manage data to become a chart that has several types, the displayed chart has a choice of 1 y axis or 2 y axis, stack bar or regular bar, or make data in the form of a line chart.

## Example Data

-   List Select Type

        [
            {
            value: "yAxisLeft_noLegend",
            text: "yAxisLeft_noLegend",
            },
            {
            value: "yAxisLeft_Legend",
            text: "yAxisLeft_Legend",
            },
            {
            value: "yAxisLeft_Legendinright",
            text: "yAxisLeft_Legendinright",
            },
            {
            value: "doubleYaxis_noLegend",
            text: "doubleYaxis_noLegend",
            },
            {
            value: "doubleYaxis_Legend",
            text: "doubleYaxis_Legend",
            },
            {
            value: "yAxisLeft_noLegend_threshold",
            text: "yAxisLeft_noLegend_threshold",
            },
        ]

-   Configuration Y Axis

        [
            {
                tick_range: 100,
                miny: 0,
                maxy: 1000,
                orientation: "left",
                text: "Active Energy-MWh",
            },
            {
                tick_range: 100,
                miny: 0,
                maxy: 1500,
                orientation: "right",
                text: "Boxes-xMWh",
            },
            {
                tick_range: 0,
                miny: 0,
                maxy: 0,
                orientation: "bottom",
                text: "Bottom(m/h)",
            },
        ]

-   Configuration List Stack

        [
            {
                list_type: "type3",
            },
            {
                list_type: "type1,type3,type2",
            },
            {
                list_type: "type2,type1",
            },
        ]

- Data Stack Group

        [
            {
                Category: "Waiting for internal trucs",
                type2: 450,
                type8: 300,
                type3: 120,
                line1: 300,
                line2: 160,
                line3: 360,
            },
            {
                Category: "P2",
                type1: 400,
                type2: 100,
                type3: 200,
                line1: 400,
                line2: 20,
                line3: 36,
            },
            {
                Category: "P3",
                type1: 400,
                type2: 100,
                type3: 200,
                line1: 200,
                line2: 320,
                line3: 60,
            },
            {
                Category: "P4",
                type1: 400,
                type2: 100,
                type3: 200,
                line1: 100,
                line2: 220,
                line3: 260,
            },
            {
                Category: "P5",
                type1: 400,
                type2: 100,
                type3: 200,
                line1: 500,
                line2: 120,
                line3: 560,
            },
            {
                Category: "P54",
                type1: 400,
                type2: 100,
                type3: 200,
                line1: 500,
                line2: 120,
                line3: 560,
            },
            {
                Category: "P53",
                type1: 400,
                type2: 100,
                type3: 200,
                line1: 500,
                line2: 120,
                line3: 560,
            },
            {
                Category: "P52",
                type1: 400,
                type2: 100,
                type3: 200,
                line1: 500,
                line2: 120,
                line3: 560,
            },
            {
                Category: "P51",
                type1: 400,
                type2: 100,
                type3: 200,
                line1: 500,
                line2: 120,
                line3: 560,
            },
        ]

## Usage example

<table>
<tr>
<td>

This application will automatically make data in the form of the type that has been selected, so there are 6 different views for each data.


Each bar and line chart can be hovered, then displays data info on the x axis.

![Chat Preview](https://github.com/zainuddin-maker/Bar-Group-Stack-Chart-with-Line-Chart/blob/master/hoverapp.PNG?raw=true)

</td>
</tr>
</table>

## Built with

-   [D3.js](https://d3js.org/) - D3.js is a JavaScript library for manipulating documents based on data.
-   [html](https://www.w3schools.com/html/) - HTML is the standard markup language for Web pages.
-   [css](https://www.w3schools.com/css/) - CSS is the language we use to style an HTML document

