import React from "react";
import "./style.scss";

const ButtonClear = (props) => {
    let { name, onClear, isDelete } = props;
    return (
        <React.Fragment>
            <button
                className={`reusable-button reusable-button${
                    isDelete ? "--delete-clear" : "--clear"
                }`}
                onClick={() => onClear()}
                type='button'>
                <span>{name}</span>
            </button>
        </React.Fragment>
    );
};

export default ButtonClear;
