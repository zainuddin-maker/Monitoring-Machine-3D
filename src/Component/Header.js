import { useEffect, useState } from "react";
import { ReactComponent as NotificationIcon } from "../svg/notification-icon.svg";
import { ReactComponent as LogOutIcon } from "../svg/logout-icon.svg";
import { useModal, LanguageButton } from "./ComponentReuseable/index";
import DefaultProfileImage from "../svg/default-profile-image.svg";
import ProfileModal from "./Content/Profile/Profile.Index";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import dcim_mini_logo from "../images/DCIM_mini.png";
import { useNavigate } from "react-router-dom";
import { generateDateGMT8, TimeNow } from "./ComponentReuseable/index";
import notification_sound from "../sound/notification_sound.mp3";
import { getToken, getUserDetails } from "./ComponentReuseable/TokenParse";
import { ReturnHostBackend } from "./ComponentReuseable/BackendHost";
import { any } from "@amcharts/amcharts5/.internal/core/util/Array";

const Header = (props) => {
    const { location, t, i18n, isEnglish, setIsEnglish } = props;
    const navigate = useNavigate();

    const [notification, setNotification] = useState([]);
    const [countNotification, setCountNotification] = useState({
        total: 0,
        unread_total: 0,
    });
    const [isOpen, setIsOpen] = useState(false);
    const [anyNotif, setAnyNotif] = useState(null);
    const [pageName, setPageName] = useState("shop_floor_overview");
    const { isShowing: isShowingProfileModal, toggle: profileModal } =
        useModal();

    const logout = () => {
        var lng = localStorage.getItem("i18nextLng");
        localStorage.clear();
        localStorage.setItem("i18nextLng", lng);
        window.location.reload();
    };

    useEffect(() => {
        const notificationTimeOut = setTimeout(() => {
            if (anyNotif) {
                setAnyNotif(null);
            }
        }, 10000);
        return () => clearTimeout(notificationTimeOut);
    }, [anyNotif]);

    const [socketIO, setSocketIO] = useState(
        socketIOClient(process.env.REACT_APP_SOCKET_IO_ENDPOINT, {
            rejectUnauthorized: false,
        })
    );

    const isPushNotificationSupported = () => {
        return "serviceWorker" in navigator && "PushManager" in window;
    };

    const askUserPermission = async () => {
        return await Notification.requestPermission();
    };

    const playNotificationSound = () => {
        const audio = new Audio(notification_sound);
        return audio.play();
    };

    const sendNotification = (title, options, url) => {
        navigator.serviceWorker.ready
            .then(() => {
                new Notification(title, options).onclick = (event) => {
                    window.open(url, "Taicang Application");
                };
            })
            .catch(
                (e) => {}
                // //console.log(e.toString())
            );
    };

    const registerServiceWorker = () => {
        return navigator.serviceWorker.register("/sw.js");
    };

    const notifyUser = (title, text, url) => {
        let options = {
            body: text,
            action: [{ action: "open_url", title: "View" }],
            icon: dcim_mini_logo,
        };
        if (!isPushNotificationSupported) {
            alert("This browser does not support push notification");
        } else if (Notification.permission === "granted") {
            registerServiceWorker();
            sendNotification(title, options, url);
        } else if (Notification.permission !== "denied") {
            askUserPermission();
        }
    };

    const updateChangeLogNotification = async () => {
        try {
            let config = {
                method: "post",
                url:
                    ReturnHostBackend(process.env.REACT_APP_JDBC) +
                    process.env.REACT_APP_NOTIFICATION_UPDATE_LOG_NOTIFICATION,
                data: {
                    user_id: getUserDetails().userId,
                    last_read: new Date().toLocaleString("sv-SE"),
                },
                headers: {
                    authorization: getToken(),
                },
            };

            const result = await axios(config);
            getNotification();
        } catch (error) {
            // //console.log(error.toString());
            if (error.response) {
                // //console.log(error.response.data);
            }
        }
    };

    const getNotification = async () => {
        try {
            const createdAt = new Date(
                getUserDetails().createdAt
            ).toLocaleString("sv-SE");

            const userGroupName =
                getUserDetails().userGroupName &&
                getUserDetails().userGroupName.join(",");

            let config = {
                method: "post",
                url:
                    ReturnHostBackend(process.env.REACT_APP_JDBC) +
                    process.env.REACT_APP_NOTIFICATION_GET_NOTIFICATION,
                data: {
                    user_group_name: userGroupName,
                    user_created_at: createdAt,
                    user_id: getUserDetails().userId,
                },
                headers: {
                    authorization: getToken(),
                },
            };

            const result = await axios(config);
            if (result.data.data) {
                const newNotification = result.data.data.map((data) => {
                    let msg = data.message.split(" ");
                    return {
                        isRead: data.is_read,
                        asset_name: msg.shift(),
                        message: msg.join("_").toLowerCase(),
                        userGroup: data.userGroup,
                        category: data.category.toLowerCase(),
                        sub_category: data.sub_category.toLowerCase(),
                        notificationUrl: data.notification_url,
                        timestamp: data.created_at,
                    };
                });
                setNotification(newNotification);

                setCountNotification((prev) => {
                    prev.total = newNotification.length;
                    prev.unread_total = newNotification.filter(
                        (data) => data.isRead === false
                    ).length;
                    return { ...prev };
                });
            } else {
                setNotification([]);
                setCountNotification((prev) => {
                    prev.total = 0;
                    prev.unread_total = 0;
                    return { ...prev };
                });
            }
        } catch (error) {
            // //console.log(error.toString());
            setNotification([]);
            setAnyNotif(null);
            // setCountNotification(0);
            toast.error("Failed to get notification", {
                toastId: "error-notif",
            });
            if (error.response) {
                // //console.log(error.response.data);
            }
        }
    };

    useEffect(() => {
        getNotification();
        setSocketIO(
            socketIOClient(process.env.REACT_APP_SOCKET_IO_ENDPOINT, {
                rejectUnauthorized: false,
            })
        );
        socketIO.on("connect", () => {
            // console.log("Client Connect");
        });

        socketIO.on("disconnect", () => {
            // //console.log("Client Disconnect");
        });

        socketIO.on("TAICANG_NOTIFICATION", (datas) => {
            try {

                const parsed = JSON.parse(datas);

                if (parsed.length > 0) {
                    parsed.forEach((data, index) => {
                        if (
                            data.message !== undefined &&
                            data.notificationUrl !== undefined &&
                            data.userGroup !== undefined &&
                            data.category !== undefined &&
                            data.sub_category !== undefined &&
                            data.isRead !== undefined
                        ) {
                            let userGroupName =
                                getUserDetails().userGroupName || [];
                            let userGroupList = data.userGroup.split(",");

                            let found = false;

                            userGroupList.forEach((data) => {
                                if (userGroupName.find((e) => e === data)) {
                                    found = true;
                                    return;
                                }
                            });

                            if (userGroupList.includes("all") || found) {
                                let newData = data;
                                let msg = data.message.split(" ");
                                newData.timestamp = generateDateGMT8(
                                    new Date()
                                ).toLocaleString();
                                newData.category = data.category.toLowerCase();
                                newData.sub_category =
                                    data.sub_category.toLowerCase();
                                newData.asset_name = msg.shift();
                                newData.message = msg.join("_").toLowerCase();

                                setNotification((prev) =>
                                    prev.length <=
                                    parseInt(
                                        process.env
                                            .REACT_APP_MAX_NOTIFICATION || 30
                                    ) -
                                        1
                                        ? [newData, ...prev]
                                        : [newData, ...prev.slice(0, -1)]
                                );

                                setAnyNotif(newData);
                                setCountNotification((prev) => {
                                    prev.total =
                                        prev.total >=
                                        process.env.REACT_APP_MAX_NOTIFICATION
                                            ? prev.total
                                            : prev.total + 1;
                                    prev.unread_total =
                                        prev.unread_total >=
                                        process.env.REACT_APP_MAX_NOTIFICATION
                                            ? prev.unread_total
                                            : prev.unread_total + 1;
                                    return { ...prev };
                                });
                                if (index === datas.length - 1) {
                                    notifyUser(
                                        `${t(
                                            "notification.category." +
                                                newData.category
                                        )} - ${t(
                                            "notification.sub_category." +
                                                newData.sub_category
                                        )}`,
                                        `${newData.asset_name} ${t(
                                            "notification.message." +
                                                newData.message
                                        )}`,
                                        `${window.location.protocol}//${window.location.host}/${newData.notificationUrl}`
                                    );
                                    playNotificationSound();
                                }
                            }
                        }
                    });
                }
            } catch (e) {}
        });

        if (isPushNotificationSupported()) {
            askUserPermission();
        }

        // stop socket io
        return () => socketIO.disconnect();
    }, []);

    useEffect(() => {
        const newPageName = location.split("/")[1];
        setPageName(newPageName);
    }, [location]);

    return (
        <div className='header-content'>
            <div className='header-title'>
                {i18n.exists("header.title." + pageName)
                    ? t("header.title." + pageName)
                    : t("header.title.not_found")}
            </div>
            <div className='header-menu'>
                <div className='notification-split'>
                    <div className='notification'>
                        <NotificationIcon
                            className='notification-icon'
                            style={
                                countNotification.unread_total > 0 || anyNotif
                                    ? { fill: "#FF3F25" }
                                    : {}
                            }
                            onClick={() => {
                                setIsOpen((prev) => !prev);
                                setAnyNotif(null);
                                updateChangeLogNotification();
                            }}
                        />
                        {isOpen && (
                            <div className='notification-lists'>
                                <div className='notification-list'>
                                    <div className='arrow-up'></div>
                                    <div className='list'>
                                        <div className='header'>
                                            <span>
                                                {t("notification.notification")}
                                            </span>
                                            <span className='total'>
                                                {countNotification.total}
                                            </span>
                                        </div>
                                        <div className='content'>
                                            {notification &&
                                                notification.length > 0 &&
                                                notification.map(
                                                    (data, index) => (
                                                        <div
                                                            className={`notif${
                                                                data.isRead
                                                                    ? " notif__read"
                                                                    : ""
                                                            }`}
                                                            onClick={() => {
                                                                navigate(
                                                                    data.notificationUrl
                                                                );
                                                                setIsOpen(
                                                                    false
                                                                );
                                                            }}
                                                            key={index}>
                                                            <div className='category-timestamp'>
                                                                <span className='category-sub-category'>
                                                                    {`${t(
                                                                        "notification.category." +
                                                                            data.category
                                                                    )} - ${t(
                                                                        "notification.sub_category." +
                                                                            data.sub_category
                                                                    )}`}
                                                                </span>
                                                                <span>
                                                                    {new Date(
                                                                        data.timestamp
                                                                    ).toLocaleString(
                                                                        isEnglish
                                                                            ? "en"
                                                                            : "zh-CN",
                                                                        {
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric",
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                            second: "2-digit",
                                                                            hour12: true,
                                                                        }
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span className='message'>
                                                                {`${
                                                                    data.asset_name
                                                                } ${t(
                                                                    "notification.message." +
                                                                        data.message
                                                                )}`}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <span
                        className={
                            anyNotif
                                ? "notification-detail-any-notif"
                                : "notification-detail"
                        }>
                        {anyNotif
                            ? `${t(
                                  "notification.category." + anyNotif.category
                              )} - ${t(
                                  "notification.sub_category." +
                                      anyNotif.sub_category
                              )} >> ${anyNotif.asset_name} ${t(
                                  "notification.message." + anyNotif.message
                              )}`
                            : null}
                    </span>
                </div>
                <div className='vertical-line' />
                <TimeNow isEnglish={isEnglish} />
                <div className='vertical-line' />
                <div className='profile-split'>
                    <div
                        className='profile-photo'
                        onClick={() => profileModal()}>
                        <img
                            className='profile-photo'
                            src={
                                getUserDetails().image &&
                                getUserDetails().image !== "" &&
                                getUserDetails().image !== "undefined"
                                    ? ReturnHostBackend(
                                          process.env.REACT_APP_BACKEND_NODELINX
                                      ) + getUserDetails().image
                                        ? ReturnHostBackend(
                                              process.env
                                                  .REACT_APP_BACKEND_NODELINX
                                          ) + getUserDetails().image
                                        : DefaultProfileImage
                                    : DefaultProfileImage
                            }
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DefaultProfileImage;
                            }}
                            alt='profile'
                        />
                    </div>
                    <span className='profile-name'>
                        {getUserDetails().username}
                    </span>
                    <LogOutIcon className='logout-icon' onClick={logout} />
                </div>
                <div className='vertical-line' />
                <LanguageButton
                    onClick={() => setIsEnglish(!isEnglish)}
                    isEnglish={isEnglish}
                />
            </div>
            <ProfileModal
                isShowing={isShowingProfileModal}
                hide={profileModal}
                t={t}
            />
        </div>
    );
};

export default Header;
