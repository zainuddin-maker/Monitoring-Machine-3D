import { ModalContainer } from "../../../ComponentReuseable";
import "./style.scss";
import { Table } from "../../../ComponentReuseable";

import { useState, useEffect } from "react";
import { getToken } from "../../../ComponentReuseable/TokenParse";
import { toast } from "react-toastify";
import axios from "axios";
import { ReturnHostBackend } from "../../../ComponentReuseable/BackendHost";
import { PaginationStyle2 } from "../../../ComponentReuseable";

const ModalGuidlines = (props) => {
    const { isShowing, hide, t, onSubmit, selectedAsset } = props;

    const header = {
        code: {
            width: "110px",
            name: t("content.machine_alarm_status.alarm_log.content.Nocode"),
        },
        description: {
            width: "510px",
            name: t(
                "content.machine_alarm_status.alarm_log.content.Description"
            ),
        },
    };

    const [body, setBodytable] = useState([]);

    const [isLoadingFloor, setIsLoadingFloor] = useState(false);
    const [isLoadingFunction, setIsLoadingFunction] = useState(false);
    const [isLoadingBrand, setIsLoadingBrand] = useState(false);
    const [isLoadingModel, setIsLoadingModel] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRoom, setIsLoadingRoom] = useState(false);
    const [progressBarUpload, setProgressBarUpload] = useState();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [limit, setLimit] = useState(5);
    const firstPage = () => {
        setCurrentPage(1);
    };
    const lastPage = () => {
        setCurrentPage(totalPage);
    };
    const nextPage = () => {
        if (currentPage < totalPage) {
            setCurrentPage((prev) => prev + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const getGuidline = async () => {
        let config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_GET_ALARM_GUIDLINE,
            headers: {
                authorization: getToken(),
            },
            data: { limit: limit, page: currentPage },
        };

        try {
            const result = await axios(config);

        
            if (result.status === 200) {
                let arrayguidline = [];

                result.data.data.forEach((element) => {
                    let descriptionguidline = "";

                    switch (element.description) {
                        case "Parameter switch on":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.Parameterswitchon"
                            );
                            break;
                        case "Power off parameter set":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.Poweroffparameterset"
                            );
                            break;
                        case "I/O error":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.I/Oerror"
                            );
                            break;
                        case "Foreground P/S":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.ForegroundP/S"
                            );
                            break;

                        case "Overtravel,External Data":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.OvertravelExternalData"
                            );
                            break;
                        case "Overheat alarm":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.Overheatalarm"
                            );
                            break;
                        case "Servo alarm":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.Servoalarm"
                            );
                            break;
                        case "Data I/O error":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.DataI/Oerror"
                            );
                            break;

                        case "Macro alarm":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.Macroalarm"
                            );
                            break;
                        case "Spindle alarm":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.Spindlealarm"
                            );
                            break;

                        case "Other alarm (DS)":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.Otheralarm(DS)"
                            );
                            break;

                        case "Alarm concerning malfucntion prevent functions":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.Alarmconcerningmalfucntionpreventfunctions"
                            );
                            break;

                        case "Background P/S":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.BackgroundP/S"
                            );
                            break;

                        case "Syncronized error":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.Syncronizederror"
                            );
                            break;

                        case "(reserved)":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.(reserved)"
                            );
                            break;

                        case "External alarm message":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.Externalalarmmessage"
                            );
                            break;
                        case "PMC error":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.PMCerror"
                            );
                            break;

                        case "Not Used":
                            descriptionguidline = t(
                                "content.machine_alarm_status.alarm_guidline.NotUsed"
                            );
                            break;
                    }

                    arrayguidline.push({
                        code: element.code,
                        code_id: element.code_id,
                        description: descriptionguidline,
                    });
                });

                setBodytable(arrayguidline);
                setTotalPage(Math.ceil(result.data.data.length / limit));
            } else {
                toast.error(
                    t(
                        "content.shop_floor_overview.error.ErrorcallingAPItogetguidlinedata"
                    ),
                    {
                        toastId: "AA_error-get-guidline",
                    }
                );
            }
        } catch (e) {
            // //////console.log(e.message);
            toast.error(
                t(
                    "content.shop_floor_overview.error.ErrorcallingAPItogetguidlinedata"
                ),
                {
                    toastId: "AA_error-get-gudiline_API",
                }
            );
        }
    };
    useEffect(() => {
        getGuidline();
    }, [currentPage, isShowing]);

    // Get Models

    return (
        <ModalContainer
            width={"1000px"}
            title={t(
                "content.machine_alarm_status.alarm_log.content.AlarmGuidlines"
            )}
            isShowing={isShowing}
            hide={() => {
                hide();
            }}
            // onSubmit={handleInputUpdate}
            showRequired={false}
            isProfile
            children={
                <div className='machine-information-modal'>
                    <div className='asset-list-modification'>
                        <div className='content-table'>
                            <div className='table'>
                                <Table
                                    header={header}
                                    body={body}
                                    actions={[]}
                                    actionWidth='30px'
                                    selectable={true}
                                    customCellClassNames={[]}
                                />
                            </div>
                            <div className='pagination'>
                                <PaginationStyle2
                                    firstPage={firstPage}
                                    lastPage={lastPage}
                                    nextPage={nextPage}
                                    prevPage={prevPage}
                                    currentPageNumber={currentPage}
                                    lastPageNumber={
                                        totalPage !== 0 ? totalPage : 1
                                    }
                                    validateInput={(e) => {
                                        if (
                                            e.target.value !== "" &&
                                            e.target.value !== "0"
                                        ) {
                                            setCurrentPage(
                                                parseInt(e.target.value)
                                            );
                                        } else {
                                            setCurrentPage(currentPage);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
        />
    );
};

export default ModalGuidlines;
