import { Routes, Route } from "react-router-dom";
import MachineStatus from "./Content/MachineStatus/MachineStatus.index";
import MachineParameter from "./Content/MachineParameter/MachineParameter.index";
import SpindleConditionOverview from "./Content/SpindleCondition/SpindleConditionOverview.index";
import PageNotFound from "./Content/PageNotFound/PageNotFound.index";
import { Navigate } from "react-router-dom";
import "./style.scss";
import MachineUtilization from "./Content/MachineUtilization/MachineUtilization.index";
import MachineAlarmStatus from "./Content/MachineAlarmStatus/MachineAlarmStatus.index";
import ShopFloor from "./Content/ShopFloor/ShopFloor.index";
import { useState, useEffect } from "react";

const Content = (props) => {
    const { t, i18n, location } = props;
    const [selectedAsset, setSelectedAsset] = useState({
        factory: "",
        shop_floor: "",
        machine_type: "",
        machine_model: "",
        machine_number: "",
    });

    const contents = [
        {
            path: "/shop_floor_overview",
            content: <ShopFloor t={t} />,
        },
        {
            path: "/machine_status_overview",
            content: (
                <MachineStatus t={t} setSelectedAsset={setSelectedAsset} />
            ),
        },
        {
            path: "/machine_utilization",
            content: <MachineUtilization t={t} />,
        },
        {
            path: "/machine_alarm_status",
            content: <MachineAlarmStatus t={t} i18n={i18n} />,
        },
        {
            path: "/machine_parameter_overview",
            content: (
                <MachineParameter
                    t={t}
                    i18n={i18n}
                    selectedAsset={selectedAsset}
                />
            ),
        },
        {
            path: "/spindle_condition",
            content: <SpindleConditionOverview t={t} />,
        },
    ];

    useEffect(() => {
        if (!location.pathname.includes("machine_parameter_overview")) {
            setSelectedAsset((prev) => {
                prev.factory = "";
                prev.shop_floor = "";
                prev.machine_type = "";
                prev.machine_model = "";
                prev.machine_number = "";
                return { ...prev };
            });
        }
    }, [location]);

    return (
        <div className='content'>
            <Routes>
                <Route
                    path='/'
                    element={
                        <Navigate
                            replace
                            to='/shop_floor_overview'
                            state={window.location.pathname}
                        />
                    }
                />
                {contents.map((content, index) => (
                    <Route
                        key={index}
                        path={content.path}
                        element={content.content}
                    />
                ))}
                <Route path='*' element={<PageNotFound t={t} />} />
            </Routes>
        </div>
    );
};

export default Content;
