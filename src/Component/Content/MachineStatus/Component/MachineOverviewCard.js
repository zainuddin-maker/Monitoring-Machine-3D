import { ReactComponent as AlarmIcon } from "../../../../svg/alarm-icon.svg";
import { ReactComponent as EmergencyAlarm } from "../../../../svg/emergency-alarm.svg";
import DefaultAssetImage from "../../../../svg/default-asset-image.svg";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { ReturnHostBackend } from "../../../ComponentReuseable/BackendHost";
import "./../style.scss";

const MachineOverviewCard = (props) => {
    const { t, data, setSelectedAsset } = props;
    const navigate = useNavigate();

    const options = {
        chart: {
            animations: {
                enabled: false,
            },
        },
        plotOptions: {
            radialBar: {
                startAngle: 0,
                endAngle: 360,
                hollow: {
                    size: "50%",
                },
                dataLabels: {
                    showOn: "always",
                    name: {
                        offsetY: 10,
                        show: true,
                        color: "#000",
                        fontSize: "12px",
                    },
                    value: {
                        offsetY: -23,
                        color: "#000",
                        fontSize: "16px",
                        show: true,
                    },
                },
            },
        },
        stroke: {
            lineCap: "round",
        },
        labels: [
            t(
                "content.machine_status_overview.machine_overview.content.availability"
            ),
        ],
        fill: {
            type: "solid",
            colors: ["#0DC540"],
        },
        grid: {
            padding: {
                top: 5,
                bottom: 0,
            },
        },
    };
    // console.log(data);
    return (
        <div
            className='machine-overview'
            onClick={() => {
                setSelectedAsset((prev) => {
                    prev.factory = data.factory;
                    prev.shop_floor = data.shop_floor;
                    prev.machine_type = data.machine_type;
                    prev.machine_model = data.machine_model;
                    prev.machine_number = data.asset_name;
                    return { ...prev };
                });
                navigate("/machine_parameter_overview");
            }}>
            <div className={`overview-header overview-header__${data.status}`}>
                <div className='machine-name'>{data.asset_name}</div>
                <div className='status-alarm'>
                    <div className='status'>
                        <span>
                            {`${t(
                                `content.machine_status_overview.status.${data.status}`
                            )} ${t("time.time")}:`}
                        </span>
                        <span>
                            {data.total_timestamp ? data.total_timestamp : "-"}
                        </span>
                    </div>
                    <div
                        className={`alarm alarm__${
                            data.condition ? data.condition : "safe"
                        }`}>
                        {data.condition === "emergency" ? (
                            <EmergencyAlarm />
                        ) : (
                            <AlarmIcon />
                        )}
                        <p>
                            {data.condition === "emergency"
                                ? t(
                                      "content.machine_status_overview.status.emergency"
                                  )
                                : data.code
                                ? data.code
                                : t(
                                      "content.machine_status_overview.status.safe"
                                  )}
                        </p>
                    </div>
                </div>
            </div>
            <div className='overview-content'>
                <div className='overview'>
                    <div className='machine-image'>
                        <img
                            className='image-preview'
                            src={
                                data.asset_image !== ""
                                    ? ReturnHostBackend(
                                          process.env.REACT_APP_BACKEND_NODELINX
                                      ) + data.asset_image
                                        ? ReturnHostBackend(
                                              process.env
                                                  .REACT_APP_BACKEND_NODELINX
                                          ) + data.asset_image
                                        : DefaultAssetImage
                                    : DefaultAssetImage
                            }
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DefaultAssetImage;
                            }}
                            alt='machine'
                        />
                    </div>
                    <div className='machine-data'>
                        <div className='data-detail'>
                            <p>
                                {t(
                                    "content.machine_status_overview.machine_overview.content.machine_type"
                                ) + ":"}
                            </p>
                            <span className='data-value'>
                                {data.machine_type}
                            </span>
                        </div>
                        <div className='data-detail'>
                            <p>
                                {t(
                                    "content.machine_status_overview.machine_overview.content.asset_id"
                                ) + ":"}
                            </p>
                            <span className='data-value'>
                                {data.asset_number}
                            </span>
                        </div>
                        <div className='data-detail'>
                            <p>
                                {t(
                                    "content.machine_status_overview.machine_overview.content.location"
                                ) + ":"}
                            </p>
                            <span className='data-value'>{`${t(
                                "content.machine_status_overview.machine_overview.content.factory"
                            )}[${data.factory}] & ${t(
                                "content.machine_status_overview.machine_overview.content.shop_floor"
                            )}[${data.shop_floor}]`}</span>
                        </div>
                    </div>
                    <div className='machine-chart'>
                        {typeof window !== "undefined" && (
                            <ReactApexChart
                                height={180}
                                width={"100%"}
                                type='radialBar'
                                options={options}
                                series={[
                                    data.availability
                                        ? Math.round(data.availability)
                                        : 0,
                                ]}
                            />
                        )}
                    </div>
                </div>
                <div className='content-table'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>{`${t(
                                    "content.machine_status_overview.machine_overview.content.running_time"
                                )} (${t("time.hours")})`}</th>
                                <th>{`${t(
                                    "content.machine_status_overview.machine_overview.content.offline_time"
                                )} (${t("time.hours")})`}</th>
                                <th colSpan='3'>
                                    <div>
                                        <span className='name'>
                                            {t(
                                                "content.machine_status_overview.machine_overview.content.total_alarms"
                                            )}
                                        </span>
                                        <span className='total'>
                                            {data.total_alarms
                                                ? data.total_alarms
                                                : "0"}
                                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span>
                                        {data.running_time
                                            ? data.running_time
                                            : "0"}
                                    </span>
                                </td>
                                <td>
                                    <span>
                                        {data.offline_time
                                            ? data.offline_time
                                            : "0"}
                                    </span>
                                </td>
                                <td>
                                    <AlarmIcon className='icon icon__critical' />
                                    <span className='alarm'>
                                        {data.critical_alarm
                                            ? data.critical_alarm
                                            : "0"}
                                    </span>
                                </td>
                                <td>
                                    <AlarmIcon className='icon icon__warning' />
                                    <span className='alarm'>
                                        {data.warning_alarm
                                            ? data.warning_alarm
                                            : "0"}
                                    </span>
                                </td>
                                <td>
                                    <EmergencyAlarm className='icon' />
                                    <span className='alarm'>
                                        {data.emergency_alarm
                                            ? data.emergency_alarm
                                            : "0"}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MachineOverviewCard;
