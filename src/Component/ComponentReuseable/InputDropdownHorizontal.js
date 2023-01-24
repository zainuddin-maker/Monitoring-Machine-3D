import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowIcon } from "../../svg/arrow-icon.svg";
import loading from "../../gif/loading-1.gif";
import "./style.scss";


const InputDropdownHorizontal = (props) => {
    const [onClick, setOnClick] = useState(false);
    const [input, setInput] = useState("");
    const { t } = useTranslation();
    let {
        labelWidth,
        inputWidth,
        name,
        label,
        value,
        options,
        isRequired,
        isDisabled,
        noEmptyOption,
        onChange,
        onSelect,
        islocation,
        isLoading,
        trans,
    } = props;

    return (
        <div className='reusable-input-horizontal'>
            {label ? (
                <label
                    className='reusable-input-horizontal__label'
                    style={{
                        width: labelWidth ? labelWidth : "",
                        paddingLeft: islocation ? "20px" : "",
                        display: islocation ? "inline" : "",
                        fontWeight: islocation ? "normal" : "",
                    }}>
                    {isRequired ? `${label}*:` : `${label}:`}
                </label>
            ) : null}
            <div
                className='reusable-input-horizontal__dropdown'
                onClick={() => setOnClick(!onClick)}
                onMouseLeave={() => setOnClick(false)}>
                {isLoading && (
                    <div className='reusable-input-horizontal__loading'>
                        <img src={loading} alt='loading' />
                    </div>
                )}
                <input
                    className={`reusable-input-horizontal__input${
                        isDisabled || isLoading
                            ? " reusable-input-horizontal__input--disabled"
                            : ""
                    }`}
                    type='text'
                    value={value}
                    required={isRequired}
                    disabled
                    readOnly
                    style={{
                        width:
                            options.length > 0 ? "auto" : inputWidth || "100px",
                    }}
                />
                <div
                    className={`reusable-input-horizontal__dropdown__bg${
                        isDisabled || isLoading
                            ? " reusable-input-horizontal__dropdown__bg--disabled"
                            : ""
                    }`}>
                    <ArrowIcon className='reusable-input-horizontal__dropdown__bg__icon' />
                </div>
                {onClick && !isDisabled && (
                    <ul
                        className={`reusable-input-horizontal__dropdown__value-list reusable-input-horizontal__dropdown__value-list__open`}>
                        {!noEmptyOption && (
                            <li
                                onClick={(e) => {
                                    let event = {
                                        name: name,
                                        value: e.target.dataset.name,
                                    };

                                    setOnClick(!onClick);
                                    onSelect(event);
                                }}
                                data-name=''
                                value={""}></li>
                        )}
                        {options.map((item) => (
                            <li
                                onClick={(e) => {
                                    let event = {
                                        name: name,
                                        value: e.target.dataset.name,
                                    };

                                    setOnClick(!onClick);
                                    onSelect(event);
                                }}
                                value={item.id ? item.id : item}
                                data-name={item.id ? item.id : item}
                                key={`${name}_${item.id ? item.id : item}`}>
                                {trans
                                    ? item.name
                                        ? t(trans + item.name)
                                        : t(trans + item)
                                    : item.name
                                    ? item.name
                                    : item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default InputDropdownHorizontal;
