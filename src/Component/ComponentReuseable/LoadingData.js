// System library imports
import React from "react";

// Image imports
import loadingData from "../../gif/loading-3.gif";

// Style imports
import "./style.scss";

const LoadingData = (props) => {
    // Destructure props
    let {
        size,
        backgroundOffset,
        isLoading,
        useAltBackground,
        useDarkBackground,
    } = props;

    return (
        <React.Fragment>
            {isLoading ? (
                <div
                    className={
                        useAltBackground
                            ? "reusable-loading-data reusable-loading-data--alt-background"
                            : useDarkBackground
                            ? "reusable-loading-data reusable-loading-data--dark-background"
                            : "reusable-loading-data"
                    }
                    style={{
                        height: backgroundOffset
                            ? `calc(100% - ${backgroundOffset})`
                            : null,
                        width: backgroundOffset
                            ? `calc(100% - ${backgroundOffset})`
                            : null,
                    }}>
                    <img
                        className='reusable-loading-data__gif'
                        src={loadingData}
                        alt='loading-data'
                        style={{
                            height: size ? size : "200px",
                            width: size ? size : "200px",
                        }}
                    />
                </div>
            ) : null}
        </React.Fragment>
    );
};

export default LoadingData;
