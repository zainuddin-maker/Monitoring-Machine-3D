// System library imports
import React from "react";

// Style imports
import "./style.scss";

import loadingButton from "../../gif/loading_button.gif";

const InputTextAreaHorizantal = (props) => {
    // Destructure props
    let {
        labelWidth,
        height,
        inputWidth,
        name,
        label,
        value,
        onChange,
        isRequired,
        isDisabled,
        isLogin,
        isLoading,
    } = props;

    // Normalize boolean value to true or false (handle null or undefined value)
    isRequired = isRequired ? true : false;
    isDisabled = isDisabled ? true : false;
    isLogin = isLogin ? true : false;

    return (
        <div
            className='reusable-input-horizontal-textarea'
            // style={width ? { width: width } : {}}
            >
              {label ? (
                <label
                    className='reusable-input-horizontal-textarea__label'
                    style={labelWidth ? { width: labelWidth } : {}}>
                    {isRequired ? `${label}*:` : `${label}:`}
                </label>
            ) : null}
            <div className='reusable-button__loading'>
                <textarea
                    className='reusable-input-horizontal-textarea__input'
                    name={name}
                    value={value}
                    required={isRequired}
                    disabled={isDisabled}
                    onChange={onChange}
                    style ={{ height : height ? height : "" , width : inputWidth ? inputWidth : "" }}
                    // style={height ? { height: height } : {} ,  width ? {width :inputWidth  } : {width :"100px"}   }
                />
                {isLoading && <img src={loadingButton} alt='loading-button' />}
            </div>
        </div>
    );
};

export default InputTextAreaHorizantal;
