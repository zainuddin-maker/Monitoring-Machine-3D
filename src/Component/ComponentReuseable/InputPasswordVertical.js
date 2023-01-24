import React, { useState } from "react";
import ShowPass from "../../svg/show-pass-icon.svg";
import HidePass from "../../svg/hide-pass-icon.svg";
import ClearIcon from "../../svg/clear-icon.svg";
import Check from "../../svg/checkbox-check.svg";
import UnCheck from "../../svg/checkbox-uncheck.svg";
import { useTranslation } from "react-i18next";
import "./style.scss";

const InputPasswordVertical = (props) => {
    let {
        width,
        name,
        label,
        value,
        onChange,
        isRequired,
        isDisabled,
        isLogin,
        isProfile,
        placeholder,
        onClear,
    } = props;

    isRequired = isRequired ? true : false;
    isDisabled = isDisabled ? true : false;
    isLogin = isLogin ? true : false;

    const [isVisible, setVisibility] = useState(false);
    const toggleVisibility = () => {
        setVisibility((prevState) => !prevState);
    };
    const { t } = useTranslation();

    return (
        <div
            className='reusable-input-vertical'
            style={width ? { width: width } : {}}>
            {label && (
                <label className={"reusable-input-vertical__label"}>
                    {isRequired ? `${label}*` : label}
                </label>
            )}
            {isLogin ? (
                <div className='reusable-input-vertical__login'>
                    <div className='reusable-input-vertical__password'>
                        <input
                            className={
                                isDisabled
                                    ? "reusable-input-vertical__input reusable-input-vertical__input--login reusable-input-vertical__input--disabled"
                                    : "reusable-input-vertical__input reusable-input-vertical__input--login"
                            }
                            type={isVisible ? "text" : "password"}
                            // style={
                            //     value && value !== ""
                            //         ? { paddingRight: "40px" }
                            //         : {}
                            // }
                            name={name}
                            value={value}
                            required={isRequired}
                            disabled={isDisabled}
                            onChange={onChange}
                            placeholder={placeholder}
                            autoComplete={true}
                        />
                        {value && value !== "" && (
                            <img
                                className='reusable-input-vertical__password__clear-icon'
                                src={ClearIcon}
                                alt='clear-icon'
                                onClick={() => {
                                    onClear();
                                }}
                            />
                        )}
                    </div>
                    <div className='checkbox'>
                        <img
                            className='checkbox__icon'
                            src={isVisible ? Check : UnCheck}
                            alt='eye-icon'
                            onClick={() => {
                                toggleVisibility();
                            }}
                        />
                        <span>{t("login.display_password")}</span>
                    </div>
                </div>
            ) : (
                <div className='reusable-input-vertical__password'>
                    <input
                        className={
                            isDisabled
                                ? isProfile
                                    ? "reusable-input-vertical__input reusable-input-vertical__input--profile reusable-input-vertical__input--disabled"
                                    : "reusable-input-vertical__input reusable-input-vertical__input--disabled"
                                : isProfile
                                ? "reusable-input-vertical__input reusable-input-vertical__input--profile"
                                : "reusable-input-vertical__input"
                        }
                        type={isVisible ? "text" : "password"}
                        name={name}
                        value={value}
                        required={isRequired}
                        disabled={isDisabled}
                        onChange={onChange}
                    />
                    <img
                        className='reusable-input-vertical__password__eye-icon'
                        src={isVisible ? ShowPass : HidePass}
                        alt='eye-icon'
                        onClick={() => {
                            toggleVisibility();
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default InputPasswordVertical;
