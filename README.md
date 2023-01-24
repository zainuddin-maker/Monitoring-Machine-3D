<!-- # Taichang Development

1. Make sure branch master always up to date
2. Create new branch if you want to develop this application
3. If you want to merge, please merge with other developer -->

<h1 align="center"  style="font-weight:bold;" >
  <br>
  <!-- <a href="http://www.amitmerchant.com/electron-markdownify"><img src="https://raw.githubusercontent.com/amitmerchant1990/electron-markdownify/master/app/img/markdownify.png" alt="Markdownify" width="200"></a> -->
  <br>
  Monitoring Asset Condition with 3D and Chart
  <br>
</h1>

> Data input from thingworx application .

<!-- <h4 align="center">A minimal Markdown Editor desktop app built on top of <a target="_blank">Electron</a>.</h4> -->

![Chat Preview](https://github.com/zainuddin-maker/Monitoring-Machine-3D/blob/master/Page1.PNG?raw=true)

<!-- ![screenshot](https://github.com/zainuddin-maker/Export-Excel-to-Json/blob/master/Convert_excel_to_JSON.mp4?raw=true) -->

This application is used to display machines in 3D, monitor machine status, and monitor alarms from machines.for making the API, use a Query that is made by myself for this Project


## Usage example

<table>
<tr>
<td>


This website has 3 important pages, each page has its own function.


for the first page , it is used for an overview of the machine looks like below :


![Chat Preview](https://github.com/zainuddin-maker/Monitoring-Machine-3D/blob/master/Page1.PNG?raw=true)

https://user-images.githubusercontent.com/60869820/214246106-d869cc68-815a-4e07-aa69-001c04b467d6.mp4

There are several functions and API (with PostgreSQL Query) including:
1. Adding Assets  ( 5 Query)
2. Editing Assets. ( 6 Query )
3. Delete Assets (1 Query )
4. 3D view for each asset ( 
can walk around the field in 3D , 2 Query  )
5. List of assets ( 2 Query )




For page 2 it is used to monitor the state of the status of each asset, looks like below: 

![Chat Preview](https://github.com/zainuddin-maker/Monitoring-Machine-3D/blob/master/Page2.PNG?raw=true)

There are several functions and API (with PostgreSQL Query) including:

1. Filter Search Assets ( 5 Query )
2. Detailed Info from the Asset (1 Query )
3. Chart of Asset status (Timeline chart and Bar Stack Chart with 1 Query ) 
4. Export Status Data ( 1 Query  )


For page 3 it is used to monitor alarms from each asset, the page 3 display is like the image below:

![Chat Preview](https://github.com/zainuddin-maker/Monitoring-Machine-3D/blob/master/Page3.PNG?raw=true)

There are several functions and API (with PostgreSQL Query) including:

1. Filter Search Assets ( 5 Query )
2. Alarm Log  ( 3 Query  )
3. Top 5 Occurence by ( Critical Alarm & Warning Alarm with 2 Query  ) 
4. Export Alarm (1 Query )
5. Alarm Guidline ( 1 Query  )
6. Top 10 Error Code ( 1 Query )
7. Alarm Trend Chart ( 1 Query )
7. Alarm Status Chart ( 1 Query )

</td>
</tr>
</table>

## Built with


-   [D3.js](https://d3js.org/) - D3.js is a JavaScript library for manipulating documents based on data.
-   [html](https://www.w3schools.com/html/) - HTML is the standard markup language for Web pages.
-   [css](https://www.w3schools.com/css/) - CSS is the language we use to style an HTML document

