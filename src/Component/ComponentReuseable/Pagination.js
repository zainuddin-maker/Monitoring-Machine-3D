import React from "react";
import { ReactComponent as PagingFirst } from "../../svg/paging-first.svg";
import { ReactComponent as PagingPrev } from "../../svg/paging-prev.svg";
import { ReactComponent as PagingNext } from "../../svg/paging-next.svg";
import { ReactComponent as PagingLast } from "../../svg/paging-last.svg";
import "./style.scss";

const Pagination = (props) => {
    let {
        firstPage,
        lastPage,
        nextPage,
        prevPage,
        currentPageNumber,
        lastPageNumber,
    } = props;

    return (
        <div className='reusable-pagination'>
            <div
                className='reusable-pagination__icon-container'
                onClick={() => firstPage()}>
                <PagingFirst
                    className='reusable-pagination__icon'
                    alt='paging-first'
                />
            </div>
            <div
                className='reusable-pagination__icon-container'
                onClick={() => prevPage()}>
                <PagingPrev
                    className='reusable-pagination__icon'
                    alt='paging-prev'
                />
            </div>
            <div className='reusable-pagination__number'>
                <span className='reusable-pagination__number-value'>
                    {currentPageNumber}/{lastPageNumber}
                </span>
            </div>
            <div
                className='reusable-pagination__icon-container'
                onClick={() => nextPage()}>
                <PagingNext
                    className='reusable-pagination__icon'
                    alt='paging-next'
                />
            </div>
            <div
                className='reusable-pagination__icon-container'
                onClick={() => lastPage()}>
                <PagingLast
                    className='reusable-pagination__icon'
                    alt='paging-last'
                />
            </div>
        </div>
    );
};

export default Pagination;
