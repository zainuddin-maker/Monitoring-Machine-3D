import React from "react";
import ClearIcon from "../../svg/clear-icon.svg";
import Check from "../../svg/checkbox-check.svg";
import UnCheck from "../../svg/checkbox-uncheck.svg";
import "./style.scss";

const InputTextVertical = (props) => {
    let {
        width,
        name,
        label,
        value,
        onChange,
        isRequired,
        isLogin,
        isProfile,
        isDisabled,
        placeholder,
        onClear,
    } = props;

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
                <div className='reusable-input-vertical__username'>
                    <input
                        className={
                            isDisabled
                                ? "reusable-input-vertical__input reusable-input-vertical__input--login reusable-input-vertical__input--disabled"
                                : "reusable-input-vertical__input reusable-input-vertical__input--login"
                        }
                        // style={
                        //     value && value !== ""
                        //         ? { paddingRight: "40px" }
                        //         : {}
                        // }
                        type='text'
                        name={name}
                        value={value}
                        required={isRequired}
                        onChange={onChange}
                        disabled={isDisabled}
                        placeholder={placeholder}
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
            ) : (
                <input
                    className={
                        isProfile
                            ? isDisabled
                                ? "reusable-input-vertical__input reusable-input-vertical__input--profile reusable-input-vertical__input--disabled"
                                : "reusable-input-vertical__input reusable-input-vertical__input--profile"
                            : isDisabled
                            ? "reusable-input-vertical__input reusable-input-vertical__input--disabled"
                            : "reusable-input-vertical__input"
                    }
                    type='text'
                    name={name}
                    value={value}
                    required={isRequired}
                    onChange={onChange}
                    disabled={isDisabled}
                />
            )}
        </div>
    );
};

export default InputTextVertical;
