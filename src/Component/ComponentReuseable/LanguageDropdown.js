import React, { useState } from "react";
import { ReactComponent as LanguageIcon } from "../../svg/language-icon.svg";
import { ReactComponent as DownArrow } from "../../svg/arrow-down.svg";
import "./style.scss";

const LanguageDropdown = (props) => {
    let { onClick, isEnglish, isLogin } = props;
    const [isShow, setIsShow] = useState(false);

    return (
        <div className={`reusable-language-dropdown`}>
            <div className='language-dropdown'>
                <div className='language'>
                    <span>{isEnglish ? `EN` : `ZH`}</span>
                    {isShow && (
                        <span
                            className='list'
                            onClick={() => {
                                onClick();
                                setIsShow(false);
                            }}>
                            {isEnglish ? `ZH` : `EN`}
                        </span>
                    )}
                </div>
                <DownArrow
                    className={`language-icon language-icon`}
                    onClick={() => setIsShow((prev) => !prev)}
                />
            </div>
        </div>
    );
};

export default LanguageDropdown;
