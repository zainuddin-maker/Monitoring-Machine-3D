import React from "react";
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
    } = props;

    return (
        <div className='reusable-input-horizontal'>
            <label
                className='reusable-input-horizontal__label'
                style={labelWidth ? { width: labelWidth } : {}}>
                {isRequired ? `${label}*:` : `${label}:`}
            </label>
            <div className='reusable-button__loading'>
                <input
                    className={
                        useAltColor
                            ? `reusable-input-horizontal__input reusable-input-horizontal__input--date reusable-input-horizontal__input--alt-color ${
                                  value &&
                                  !hideClearData &&
                                  "reusable-hide-clear-date"
                              }`
                            : `reusable-input-horizontal__input reusable-input-horizontal__input--date ${
                                  value &&
                                  !hideClearData &&
                                  "reusable-hide-clear-date"
                              }`
                    }
                    type='date'
                    name={name}
                    value={value}
                    required={isRequired}
                    disabled={isDisabled}
                    onChange={onChange}
                    style={
                        inputWidth ? { width: inputWidth } : { width: "auto" }
                    }
                />
                {/* {isLoading && <img src={loadingButton} alt='loading-button' />} */}
            </div>
        </div>
    );
};

export default InputDateHorizontal;
