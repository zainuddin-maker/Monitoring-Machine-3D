import "./scss/App.scss";
import Header from "./Component/Header";
import Sidebar from "./Component/Sidebar";
import Content from "./Component/Content";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Component/Login/Login.index";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import { useIdleTimer } from "react-idle-timer";
import { ReturnHostBackend } from "./Component/ComponentReuseable/BackendHost";
import {
    getToken,
    getUserDetails,
    getPassword,
} from "./Component/ComponentReuseable/TokenParse";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
import { encode, decode } from "js-base64";
import { generateDateGMT8 } from "./Component/ComponentReuseable";

const App = () => {
    toast.configure();
    const location = useLocation();
    const cookies = new Cookies();
    const { t, i18n } = useTranslation();
    const [isEnglish, setIsEnglish] = useState(true);
    const [idleTimer, setIdleTimer] = useState(undefined);

    useEffect(() => {
        if (!localStorage.getItem("i18nextLng")) {
            localStorage.setItem("i18nextLng", "en");
            setIsEnglish(true);
        } else {
            if (localStorage.getItem("i18nextLng") === "en") {
                setIsEnglish(true);
            } else {
                setIsEnglish(false);
            }
        }
    }, []);

    useEffect(() => {
        if (isEnglish) {
            localStorage.setItem("i18nextLng", "en");
            i18n.changeLanguage("en");
        } else {
            localStorage.setItem("i18nextLng", "zh");
            i18n.changeLanguage("zh");
        }
    }, [isEnglish, i18n]);

    const login = async (e) => {
        try {
            e.preventDefault();
            let config = {
                method: "post",
                url:
                    ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                    process.env.REACT_APP_LOGIN,
                data: {
                    username: decode(cookies.get("username")),
                    password: decode(cookies.get("password")),
                    application_name: "Taichang",
                },
            };

            const result = await axios(config);

            localStorage.setItem("token", encode(result.data.token));
            window.location.reload();
        } catch (error) {
            if (error.response) {
                toast.error(
                    t(
                        "toast." +
                            error.response.data
                                .toLowerCase()
                                .split(" ")
                                .join("_")
                    ),
                    { toastId: "error-login" }
                );
            } else {
                toast.error(t("toast.app_under_maintenance"), {
                    toastId: "error-login",
                });
            }
        }
    };

    // useEffect(() => {
    //     try {
    //         const config = {
    //             method: "post",
    //             url:
    //                 ReturnHostBackend(process.env.REACT_APP_SERVICES) +
    //                 process.env.REACT_APP_CHECK_CONNCECTION,
    //             headers: {},
    //         };
    //         axios(config);
    //     } catch (e) {
    //         if (
    //             localStorage.getItem("remember_device") &&
    //             localStorage.getItem("remember_device") === "true"
    //         ) {
    //             login();
    //         } else {
    //             localStorage.clear();
    //             window.location.reload();
    //         }
    //     }
    // }, []);

    useEffect(() => {
        const intervalLogin = setInterval(async () => {
            try {
                const currentHour = generateDateGMT8(new Date()).getHours();
                if (parseInt(currentHour) >= 6 && parseInt(currentHour) <= 8) {
                    const config = {
                        method: "post",
                        url:
                            ReturnHostBackend(
                                process.env.REACT_APP_BACKEND_NODELINX
                            ) + process.env.REACT_APP_LOGIN,
                        data: {
                            username: getPassword().username,
                            password: getPassword().password,
                            application_name: "Taichang",
                        },
                    };

                    const result = await axios(config);
                    localStorage.setItem("token", encode(result.data.token));
                }
            } catch (e) {}
        }, 1000 * 60 * 60 * 1);
        return () => clearInterval(intervalLogin);
    }, []);

    useEffect(async () => {
        try {
            if (getToken()) {
                const config = {
                    method: "post",
                    url:
                        ReturnHostBackend(process.env.REACT_APP_SERVICES) +
                        process.env.REACT_APP_CHECK_AUTO_LOGOUT,
                    headers: {
                        authorization: getToken(),
                    },
                };

                const result = await axios(config);

                const ug_list_auto_logout = result.data;
                const userGroupName = getUserDetails().userGroupName || [];

                let found = false;
                let newIdleTimer = undefined;

                ug_list_auto_logout.forEach((data) => {
                    if (userGroupName.find((e) => e === data.user_group_name)) {
                        found = true;
                        newIdleTimer = data.idle_timer;
                        return;
                    }
                });

                if (found) {
                    if (
                        localStorage.getItem("remember_device") &&
                        localStorage.getItem("remember_device") === "false"
                    ) {
                        setIdleTimer(newIdleTimer);
                    } else {
                        setIdleTimer(undefined);
                    }
                } else {
                    setIdleTimer(undefined);
                }
            }
        } catch (e) {
            setIdleTimer(undefined);
        }
    }, [getToken()]);

    const handleOnIdle = () => {
        if (getToken()) {
            if (idleTimer !== undefined) {
                localStorage.clear();
                window.location.reload();
            }
        }
    };

    const handleOnActive = (event) => {
        // console.log("user is active", event);
        // console.log("time remaining", getRemainingTime());
    };

    const handleOnAction = (event) => {
        // console.log("user is active", event);
        // console.log("time remaining", getRemainingTime());
    };

    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: idleTimer,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        onAction: handleOnAction,
        debounce: 500,
    });

    return (
        <div className='app'>
            <ToastContainer
                position='top-center'
                autoClose={3000}
                limit={2}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {!localStorage.getItem("isLogin") ? (
                <Routes>
                    <Route
                        path='*'
                        element={
                            <Navigate
                                replace
                                to='/login'
                                state={window.location.pathname}
                            />
                        }
                    />
                    <Route
                        path='/login'
                        element={
                            <Login
                                t={t}
                                i18n={i18n}
                                isEnglish={isEnglish}
                                setIsEnglish={setIsEnglish}
                                oldPath={location.state}
                            />
                        }
                    />
                </Routes>
            ) : (
                <Routes>
                    <Route
                        path='*'
                        element={
                            <div className='app-split-sidebar-with-others'>
                                <Sidebar location={location.pathname} t={t} />
                                <div className='app-split-header-content'>
                                    <div className='app-header'>
                                        <Header
                                            location={location.pathname}
                                            t={t}
                                            i18n={i18n}
                                            isEnglish={isEnglish}
                                            setIsEnglish={setIsEnglish}
                                        />
                                    </div>
                                    <div className='app-content'>
                                        <Content
                                            location={location}
                                            t={t}
                                            i18n={i18n}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            )}
        </div>
    );
};

export default App;
