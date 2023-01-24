import {
    InputTextVertical,
    InputPasswordVertical,
    ButtonSubmit,
    LanguageButton,
    LanguageDropdown,
} from "../ComponentReuseable/index";
import { ReturnHostBackend } from "../ComponentReuseable/BackendHost";
import NodelinxLogo from "../../images/nodelinx-logo.png";
import Logo from "../../images/logo.png";
import PlanetIcon from "../../svg/planet-icon.svg";
import Check from "../../svg/checkbox-check.svg";
import UnCheck from "../../svg/checkbox-uncheck.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { encode, decode } from "js-base64";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const Login = (props) => {
    const { t, isEnglish, setIsEnglish, oldPath } = props;
    const navigate = useNavigate();
    const cookies = new Cookies();
    const initialState = {
        username: "",
        password: "",
    };

    const [input, setInput] = useState(initialState);
    const [isFailed, setIsFailed] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [saveDevice, setSaveDevice] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const login = async (e) => {
        try {
            setLoadingLogin(true);
            setIsFailed(false);
            e.preventDefault();
            let config = {
                method: "post",
                url:
                    ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                    process.env.REACT_APP_LOGIN,
                data: {
                    username: input.username,
                    password: input.password,
                    application_name: "Taichang",
                },
            };

            const result = await axios(config);
            localStorage.setItem("nodelinx_application", "Taichang");
            localStorage.setItem("token", encode(result.data.token));
            localStorage.setItem(
                "refresh",
                encode(
                    JSON.stringify({
                        username: input.username,
                        password: input.password,
                    })
                )
            );
            localStorage.setItem(
                "user_details",
                encode(JSON.stringify(result.data.user_details))
            );
            localStorage.setItem(
                "pageData",
                encode(JSON.stringify(result.data.pageData))
            );

            setLoadingLogin(false);
            localStorage.setItem("isLogin", true);

            localStorage.setItem("remember_device", saveDevice);
            if (saveDevice) {
                cookies.set("username", encode(input.username));
                cookies.set("password", encode(input.password));
            } else {
                cookies.remove("username");
                cookies.remove("password");
            }

            if (oldPath === "/login" || oldPath === "/") {
                navigate("/shop_floor_overview");
            } else {
                navigate(oldPath);
            }
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
            setLoadingLogin(false);
            setIsFailed(true);
        }
    };

    return (
        <div className='main-login'>
            <LanguageDropdown
                onClick={() => setIsEnglish(!isEnglish)}
                isEnglish={isEnglish}
                isLogin
            />
            <div className='login-container'>
                <div className='login-image'>
                    <div className='login-logo'>
                        <div className='welcome'>{t("login.welcome_to")}</div>
                        <img
                            className='login-image'
                            src={NodelinxLogo}
                            alt='nodelinx-logo'
                        />
                    </div>
                </div>
                <div className='vertical-line' />
                <div className='login-form'>
                    <div className='login-content'>
                        {/* <div
                            className={`header${
                                isFailed ? " header__warning" : ""
                            }`}>
                            {t("login.login")}
                        </div> */}
                        <img
                            className='moldfactory-logo'
                            src={Logo}
                            alt='moldfactory-logo'
                        />
                        <img
                            className='planet-icon'
                            src={PlanetIcon}
                            alt='planet-icon'
                        />
                        <form id='login-form' className='form' onSubmit={login}>
                            <div className='login-username-password'>
                                <InputTextVertical
                                    name='username'
                                    value={input.username}
                                    onChange={handleChange}
                                    isLogin={true}
                                    isRequired={true}
                                    placeholder={t("login.username")}
                                    onClear={() =>
                                        setInput((prev) => ({
                                            ...prev,
                                            username: "",
                                        }))
                                    }
                                />
                                <InputPasswordVertical
                                    name='password'
                                    value={input.password}
                                    onChange={handleChange}
                                    isLogin={true}
                                    isRequired={true}
                                    placeholder={t("login.password")}
                                    onClear={() =>
                                        setInput((prev) => ({
                                            ...prev,
                                            password: "",
                                        }))
                                    }
                                />
                            </div>
                            <div className='submit'>
                                {isFailed && (
                                    <span className='login-warning'>
                                        {t("login.warning")}
                                    </span>
                                )}
                                <ButtonSubmit
                                    name={t("login.login")}
                                    formId='login-form'
                                    onSubmit={login}
                                    isLogin
                                    isLoading={loadingLogin}
                                    isFailed={isFailed}
                                />
                            </div>
                        </form>
                        <div className='checkbox'>
                            <img
                                className='checkbox__icon'
                                src={saveDevice ? Check : UnCheck}
                                alt='eye-icon'
                                onClick={() => {
                                    setSaveDevice((prevState) => !prevState);
                                }}
                            />
                            <span>{t("login.remember_device")}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
