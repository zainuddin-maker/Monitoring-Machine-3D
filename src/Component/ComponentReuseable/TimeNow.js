import { useEffect, useState } from "react";
import { ReactComponent as DateIcon } from "../../svg/date-icon.svg";

const TimeNow = (props) => {
    const { isEnglish } = props;

    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const dateInterval = setInterval(() => setDate(new Date()), 1000);

        return () => clearInterval(dateInterval);
    }, []);

    return (
        <div className='date-split'>
            <DateIcon />
            <div className='date'>
                <span>
                    {date.toLocaleString(isEnglish ? "en" : "zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
                <span>
                    {date.toLocaleString(isEnglish ? "en" : "zh-CN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                    })}
                </span>
            </div>
        </div>
    );
};

export default TimeNow;
