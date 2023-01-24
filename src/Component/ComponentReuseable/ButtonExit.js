import React from "react";
import exitButton from "../../svg/exit-button.svg";
import "./style.scss";

const ButtonExit = (props) => {
    let { hide } = props;

    return (
        <img
            className='reusable-button--exit'
            src={exitButton}
            alt='exit-button'
            onClick={() => {
                hide();
            }}
        />
    );
};

export default ButtonExit;
