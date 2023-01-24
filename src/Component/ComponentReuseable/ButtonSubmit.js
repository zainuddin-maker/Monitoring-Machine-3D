import React from "react";
import loadingButton from "../../gif/loading-1.gif";
import "./style.scss";

const ButtonSubmit = (props) => {
    let {
        name,
        formId,
        onSubmit,
        isLogin,
        isProfile,
        isDelete,
        isLoading,
        isDisabled,
        isFailed,
    } = props;
    isLogin = isLogin ? true : false;

    return (
        <React.Fragment>
            {isLoading ? (
                <button
                    className={
                        isLogin
                            ? "reusable-button reusable-button--submit__login reusable-button--submit__login__disabled"
                            : "reusable-button reusable-button--submit__login reusable-button--submit__login__disabled"
                    }
                    type='button'>
                    <div className='reusable-button__loading'>
                        <img src={loadingButton} alt='loading-button' />
                    </div>
                </button>
            ) : isLogin ? (
                <button
                    className={
                        isLoading || isDisabled
                            ? "reusable-button reusable-button--submit__login reusable-button--submit__login__disabled"
                            : "reusable-button reusable-button--submit__login"
                    }
                    onClick={formId ? () => {} : onSubmit}
                    type={isLoading || isDisabled ? "button" : "submit"}
                    form={formId}
                    style={isFailed ? { backgroundColor: "#D41616" } : {}}>
                    <span>{name}</span>
                </button>
            ) : (
                <button
                    className={
                        isLoading || isDisabled
                            ? isProfile
                                ? "reusable-button reusable-button--submit reusable-button--submit__profile reusable-button__disabled"
                                : isDelete
                                ? "reusable-button reusable-button--delete-submit reusable-button__disabled"
                                : "reusable-button reusable-button--submit reusable-button__disabled"
                            : isProfile
                            ? "reusable-button reusable-button--submit reusable-button--submit__profile"
                            : isDelete
                            ? "reusable-button reusable-button--delete-submit"
                            : "reusable-button reusable-button--submit"
                    }
                    onClick={formId ? () => {} : onSubmit}
                    type={isLoading || isDisabled ? "button" : "submit"}
                    form={formId}>
                    <span>{name}</span>
                </button>
            )}
        </React.Fragment>
    );
};

export default ButtonSubmit;
