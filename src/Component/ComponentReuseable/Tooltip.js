import React, { useState } from "react";
import ReactDOM from "react-dom";

const Tooltip = ({ tooltip, children }) => {
    const [showTooltip, setShowTooltip] = useState({
        show: false,
        x: "0px",
        y: "0px",
    });

    const onMouseEnter = (e) => {
        setShowTooltip((prev) => ({
            ...prev,
            show: true,
        }));
    };
    const onMouseLeave = (e) => {
        setShowTooltip((prev) => ({
            ...prev,
            show: false,
        }));
    };

    const onMouseMove = (e) => {
        let windowWidth = window.innerWidth;

        setShowTooltip((prev) => ({
            ...prev,
            x:
                e.clientX + 30 <= windowWidth
                    ? e.clientX + "px"
                    : e.clientX - 30 + "px",
            y: e.clientY - 30 + "px",
        }));
    };

    return (
        <React.Fragment>
            <div
                onMouseEnter={onMouseEnter}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}>
                {children}
            </div>
            {showTooltip.show &&
                ReactDOM.createPortal(
                    <div
                        style={{
                            top: showTooltip.y,
                            left: showTooltip.x,
                        }}
                        className='reuseable-tooltip-content-location'>
                        <div className='reuseable-tooltip-content-relative'>
                            <div className='reuseable-tooltip-content'>
                                {tooltip}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </React.Fragment>
    );
};

export default Tooltip;
