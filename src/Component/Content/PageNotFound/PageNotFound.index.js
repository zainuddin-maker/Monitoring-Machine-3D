import React from "react";

import "./style.scss";

const NotFound = (props) => {
    const { t } = props;
    return (
        <div className='content-page-not-found-desktop'>
            <div>
                <span className='page-not-found-number'>404</span>
                <span className='page-not-found-value'>
                    {t("not_found.short_detail")}
                </span>
                <span className='page-not-found-description'>
                    {t("not_found.long_detail")}
                </span>
            </div>
        </div>
    );
};

export default NotFound;
