import Calendar from "react-calendar";
import { ReactComponent as PagingPrev } from "../../svg/paging-prev.svg";
import { ReactComponent as PagingNext } from "../../svg/paging-next.svg";
import { ReactComponent as ArrowIcon } from "../../svg/arrow-icon.svg";
import { useEffect, useState } from "react";
import { useTranslation, initReactI18next } from "react-i18next";
import "./calendar.scss";

const CustomCalendar = (props) => {
    const { value, onChange, hide, minDate, maxDate } = props;
    const { t } = useTranslation();
    const [onClickMonth, setOnClickMonth] = useState(false);
    const [onClickYear, setOnClickYear] = useState(false);
    const [months] = useState([
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
    ]);
    const [years, setYears] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(
        value !== "" ? new Date(value).getMonth() : new Date().getMonth()
    );
    const [selectedYear, setSelectedYear] = useState(
        value !== "" ? new Date(value).getFullYear() : new Date().getFullYear()
    );
    useEffect(() => {
        let year = [];
        for (let i = selectedYear - 3; i <= selectedYear + 3; i++) {
            year.push(i);
        }
        setYears(year);
    }, [selectedYear]);

    return (
        <div className='calendar'>
            <div className='calendar-header'>
                <span
                    onClick={() => {
                        onChange(
                            new Date(
                                new Date().getTime() -
                                    new Date().getTimezoneOffset() * 60000
                            )
                                .toISOString()
                                .slice(0, 10)
                        );
                        hide();
                    }}>
                    {t("time.today")}
                </span>
                <div className='month-year-input'>
                    <div
                        className='month-year-input__dropdown'
                        onClick={() => setOnClickMonth((prev) => !prev)}
                        onMouseLeave={() => setOnClickMonth(false)}>
                        <span className='month-year-input__value--month'>
                            {t(`date.month.${months[selectedMonth]}`)}
                        </span>
                        <div className='month-year-input__dropdown__bg'>
                            <ArrowIcon className='month-year-input__dropdown__bg__icon' />
                        </div>
                        {onClickMonth && (
                            <ul
                                className={`month-year-input__dropdown__value-list month-year-input__dropdown__value-list__open`}
                                onClick={() =>
                                    setOnClickMonth((prev) => !prev)
                                }>
                                {months.map((month, i) => (
                                    <li
                                        style={
                                            parseInt(selectedMonth) === i
                                                ? { backgroundColor: "#438acb" }
                                                : {}
                                        }
                                        onClick={(e) => {
                                            setSelectedMonth(
                                                e.target.dataset.name
                                            );
                                            setOnClickMonth((prev) => !prev);
                                        }}
                                        value={month}
                                        data-name={i}
                                        key={month}>
                                        {t(`date.month.${month}`)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div
                        className='month-year-input__dropdown'
                        onClick={() => setOnClickYear((prev) => !prev)}
                        onMouseLeave={() => setOnClickYear(false)}>
                        <span className='month-year-input__value--year'>
                            {selectedYear}
                        </span>
                        <div className='month-year-input__dropdown__bg'>
                            <ArrowIcon className='month-year-input__dropdown__bg__icon' />
                        </div>
                        {onClickYear && (
                            <ul
                                className={`month-year-input__dropdown__value-list month-year-input__dropdown__value-list__open`}
                                onClick={() => setOnClickYear((prev) => !prev)}>
                                {years.map((year, i) => (
                                    <li
                                        style={
                                            parseInt(selectedYear) === year
                                                ? { backgroundColor: "#438acb" }
                                                : {}
                                        }
                                        onClick={(e) => {
                                            setSelectedYear(
                                                e.target.dataset.name
                                            );
                                            setOnClickYear((prev) => !prev);
                                        }}
                                        value={year}
                                        data-name={year}
                                        key={year}>
                                        {year}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            <div className='calendar-content'>
                <Calendar
                    activeStartDate={
                        new Date(
                            new Date(
                                new Date().setMonth(selectedMonth)
                            ).setFullYear(selectedYear)
                        )
                    }
                    onChange={(e) => {
                        onChange(
                            new Date(
                                new Date(e).getTime() -
                                    new Date(e).getTimezoneOffset() * 60000
                            )
                                .toISOString()
                                .slice(0, 10)
                        );
                        hide();
                    }}
                    value={value !== "" ? new Date(value) : null}
                    // selectRange={true}
                    // showNavigation={false}
                    prevLabel={<PagingPrev className='prev' />}
                    nextLabel={<PagingNext className='next' />}
                    calendarType='US'
                    formatShortWeekday={(locale, date) =>
                        ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][
                            date.getDay()
                        ]
                    }
                    onActiveStartDateChange={({
                        action,
                        activeStartDate,
                        value,
                        view,
                    }) => {
                        setSelectedMonth(activeStartDate.getMonth());
                        setSelectedYear(activeStartDate.getFullYear());
                    }}
                    minDate={minDate ? new Date(minDate) : null}
                    maxDate={maxDate ? new Date(maxDate) : null}
                />
            </div>
        </div>
    );
};

export default CustomCalendar;
