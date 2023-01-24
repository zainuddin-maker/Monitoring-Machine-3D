import { ReactComponent as IconOne } from "../svg/iconOne.svg";
import { ReactComponent as IconTwo } from "../svg/iconTwo.svg";
import { ReactComponent as IconThree } from "../svg/iconThree.svg";
import { ReactComponent as IconFour } from "../svg/iconFour.svg";
import { ReactComponent as IconFive } from "../svg/iconFive.svg";
import { ReactComponent as IconSix } from "../svg/iconSix.svg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "../svg/logo.svg";

const Sidebar = (props) => {
    const { location, t } = props;
    const navigate = useNavigate();

    const sidebarMenus = [
        {
            url: "/shop_floor_overview",
            icon: <IconOne className='menu-icon' />,
            name: "sidebar.menu_name.shop_floor_overview",
        },
        // {
        //     url: "/machine_status_overview",
        //     icon: <IconTwo className='menu-icon' />,
        //     name: "sidebar.menu_name.machine_status_overview",
        // },
        {
            url: "/machine_utilization",
            icon: <IconThree className='menu-icon' />,
            name: "sidebar.menu_name.machine_utilization",
        },
        {
            url: "/machine_alarm_status",
            icon: <IconFour className='menu-icon' />,
            name: "sidebar.menu_name.machine_alarm_status",
        },
        // {
        //     url: "/machine_parameter_overview",
        //     icon: <IconFive className='menu-icon' />,
        //     name: "sidebar.menu_name.machine_parameter_overview",
        // },
        // {
        //     url: "/spindle_condition",
        //     icon: <IconSix className='menu-icon' />,
        //     name: "sidebar.menu_name.spindle_condition",
        // },
    ];

    return (
        <div className='app-split-sidebar-logo'>
            <div
                className='app-logo'
                onClick={() => navigate("/shop_floor_overview")}>
                <img src={Logo} alt='' />
            </div>
            <div className='app-sidebar'>
                <div className='sidebar-menu'>
                    {sidebarMenus.map((menu, i) => (
                        <Link
                            key={i}
                            to={menu.url}
                            className={`menu-list${
                                location === menu.url ? "__active" : ""
                            }`}>
                            <p>{t(menu.name)}</p>
                            {menu.icon}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
