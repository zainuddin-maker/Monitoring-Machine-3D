import React from "react";
import { ReactComponent as PagingFirst } from "../../svg/paging-first.svg";
import { ReactComponent as PagingPrev } from "../../svg/paging-prev.svg";
import { ReactComponent as PagingNext } from "../../svg/paging-next.svg";
import { ReactComponent as PagingLast } from "../../svg/paging-last.svg";
import { useState, useEffect } from "react";
import "./style.scss";

const PaginationStyle2 = (props) => {
    let {
        firstPage,
        lastPage,
        nextPage,
        prevPage,
        currentPageNumber,
        lastPageNumber,
        validateInput,
    } = props;
    const [input, setInput] = useState(currentPageNumber);

    const handlePage = (e) => {
        let { value } = e.target;
        const checkNumber = /^\d+$/;

        if (value !== "" && !checkNumber.test(value)) {
            value = "";
            alert("must number!");
        }
        if (value > lastPageNumber) {
            value = "";
            alert("must less than total page!");
        }

        setInput(value);
    };

    useEffect(() => {
        setInput(currentPageNumber);
    }, [currentPageNumber]);

    return (
        <div className='reusable-pagination-style-2'>
            <div
                className='reusable-pagination-style-2__icon-container__coloring'
                onClick={() => firstPage()}>
                <PagingFirst
                    className='reusable-pagination-style-2__icon-coloring'
                    alt='paging-first'
                    width={"34px"}
                />
            </div>

            <div className='reusable-pagination-style-2__icon-number'>
                <div
                    className='reusable-pagination-style-2__icon-container'
                    onClick={() => prevPage()}>
                    <PagingPrev
                        className='reusable-pagination-style-2__icon'
                        alt='paging-prev'
                    />
                </div>
                <div className='reusable-pagination-style-2__number'>
                    <input
                        type='text'
                        className='reusable-pagination-style-2__number-value'
                        name='input'
                        value={input}
                        onChange={handlePage}
                        onKeyDown={(e) => {
                            if (
                                (e.key === "Enter" || e.key === "Tab") &&
                                validateInput
                            ) {
                                if (
                                    e.target.value === "" ||
                                    e.target.value === "0"
                                ) {
                                    setInput(currentPageNumber);
                                }
                                validateInput(e);
                                e.target.blur();
                            }
                        }}
                    />
                    <span className='reusable-pagination-style-2__total-page'>{`/ ${lastPageNumber}`}</span>

                    {/* <p className='reusable-pagination-style-2__number-value'>
                        /{lastPageNumber}
                    </p> */}
                </div>
                <div
                    className='reusable-pagination-style-2__icon-container'
                    onClick={() => nextPage()}>
                    <PagingNext
                        className='reusable-pagination-style-2__icon'
                        alt='paging-next'
                    />
                </div>
            </div>
            <div
                className='reusable-pagination-style-2__icon-container__coloring'
                onClick={() => lastPage()}>
                <PagingLast
                    className='reusable-pagination-style-2__icon-coloring'
                    alt='paging-last'
                />
            </div>
        </div>
    );
};

export default PaginationStyle2;
