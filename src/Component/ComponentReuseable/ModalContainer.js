import React from "react";
import ReactDOM from "react-dom";
import ButtonExit from "./ButtonExit";
import ButtonClear from "./ButtonClear";
import ButtonSubmit from "./ButtonSubmit";
import "./style.scss";

const ModalContainer = (props) => {
    let {
        children,
        width,
        level,
        isShowing,
        hide,
        title,
        formId,
        submitName,
        onSubmit,
        clearName,
        onClear,
        isDisabled,
        showRequired,
        isProfile,
        isDelete,
    } = props;

    return isShowing
        ? ReactDOM.createPortal(
              <React.Fragment>
                  <div
                      className='reusable-modal-overlay'
                      style={level ? { zIndex: `${1020 + 20 * level}` } : {}}
                  />
                  <div
                      className='reusable-modal-wrapper'
                      style={
                          level ? { zIndex: `${1020 + 20 * level + 10}` } : {}
                      }>
                      <div
                          style={{
                              position: "absolute",
                              height: "100%",
                              width: "100%",
                          }}
                          onClick={hide}
                      />
                      <div
                          className='reusable-modal'
                          style={level ? { zIndex: `${99 + level}` } : {}}>
                          {title ? (
                              <div
                                  className={
                                      isProfile
                                          ? "reusable-modal__title reusable-modal__title--profile"
                                          : "reusable-modal__title"
                                  }>
                                  <span>{title}</span>
                                  <ButtonExit hide={hide} />
                              </div>
                          ) : null}
                          <div
                              className='reusable-modal__content'
                              style={width ? { width: width } : {}}>
                              {children}
                              {showRequired ? (
                                  <div className='reusable-modal__content__required-legend'>
                                      *Required
                                  </div>
                              ) : null}
                          </div>
                          {(submitName !== undefined ||
                              clearName !== undefined) && (
                              <div className='reusable-modal__button-container'>
                                  {submitName !== undefined &&
                                  (formId !== undefined ||
                                      onSubmit !== undefined) ? (
                                      <ButtonSubmit
                                          name={submitName}
                                          formId={formId}
                                          onSubmit={onSubmit}
                                          isDisabled={isDisabled}
                                          isProfile={isProfile}
                                          isDelete={isDelete}
                                      />
                                  ) : null}
                                  {clearName !== undefined &&
                                  onClear !== undefined ? (
                                      <ButtonClear
                                          name={clearName}
                                          onClear={onClear}
                                          isDelete={isDelete}
                                      />
                                  ) : null}
                              </div>
                          )}
                      </div>
                  </div>
              </React.Fragment>,
              document.body
          )
        : null;
};

export default ModalContainer;
