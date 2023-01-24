import React from "react";
import CalendarIcon from "../../svg/calendar-icon.svg";
import CustomCalendar from "./CustomCalendar";
import { useState } from "react";

import "./style.scss";

const InputDateHorizontal = (props) => {
    let {
        labelWidth,
        inputWidth,
        name,
        label,
        value,
        onChange,
        isRequired,
        isDisabled,
        useAltColor,
        clearData,
        hideClearData,
        minDate,
        maxDate,
    } = props;

    const [isShow, setIsShow] = useState(false);

    return (
        <div className='reusable-input-horizontal'>
            <label
                className='reusable-input-horizontal__label'
                style={labelWidth ? { width: labelWidth } : {}}>
                {isRequired ? `${label}*:` : `${label}:`}
            </label>
            <div
                className={`reusable-button__date${
                    isDisabled ? " reusable-button__date--disabled" : ""
                }`}>
                <input
                    className={`reusable-input-horizontal__input reusable-input-horizontal__input--date${
                        isDisabled
                            ? " reusable-input-horizontal__input--disabled"
                            : ""
                    }`}
                    type='date'
                    name={name}
                    value={value}
                    required={isRequired}
                    disabled={isDisabled}
                    onChange={(e) => onChange(e.target.value)}
                    style={
                        inputWidth ? { width: inputWidth } : { width: "auto" }
                    }
                />
                <img
                    src={CalendarIcon}
                    alt='calendar-icon'
                    onClick={
                        !isDisabled ? () => setIsShow((prev) => !prev) : null
                    }
                />
                {isShow && (
                    <CustomCalendar
                        onChange={onChange}
                        value={value}
                        hide={() => setIsShow(false)}
                        minDate={minDate}
                        maxDate={maxDate}
                    />
                )}
                {/* {isLoading && <img src={loadingButton} alt='loading-button' />} */}
            </div>
        </div>
    );
};

export default InputDateHorizontal;
