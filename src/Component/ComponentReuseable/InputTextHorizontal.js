import React from "react";
import "./style.scss";

const InputTextHorizontal = (props) => {
    let {
        labelWidth,
        inputWidth,
        name,
        label,
        value,
        onChange,
        isRequired,
        isLogin,
        isDisabled,
        color,
    } = props;

    return (
        <div className='reusable-input-horizontal'>
            {label ? (
                <label
                    className='reusable-input-horizontal__label'
                    style={ { width: labelWidth ? labelWidth  : null ,color : color? color : null} }
                   
                    >
                      
                    {isRequired ? `${label}*:` : `${label}:`}
                </label>
            ) : null}
            <input
                className='reusable-input-horizontal__input'
                type='text'
                name={name}
                value={value}
                required={isRequired}
                onChange={onChange}
                disabled={isDisabled}
                style={{
                    width: inputWidth || "100px",
                }}
            />
        </div>
    );
};

export default InputTextHorizontal;
