import React from "react";
import { ReactComponent as LanguageIcon } from "../../svg/language-icon.svg";
import "./style.scss";

const LanguageButton = (props) => {
    let { onClick, isEnglish, isLogin } = props;

    return (
        <div
            className={`reusable-language-button reusable-language-button__${
                isLogin ? "login-page" : "all-page"
            }`}
            onClick={onClick}>
            <LanguageIcon
                className={`language-icon language-icon__${
                    isLogin ? "login-page" : "all-page"
                }`}
            />
            <p>{isEnglish ? `English` : `中文`}</p>
        </div>
    );
};

export default LanguageButton;
