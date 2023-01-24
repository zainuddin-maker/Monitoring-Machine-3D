import React from "react";
import searchIcon from "../../svg/search-icon.svg";
import "./style.scss";

const SearchBar = (props) => {
    let {
        name,
        value,
        search,
        searchContent,
        labelWidth,
        label,
        inputWidth,
        placeholder,
    } = props;

    return (
        <div className='reusable-search'>
            {label ? (
                <label
                    className='reusable-search__label'
                    style={labelWidth ? { width: labelWidth } : {}}>
                    {`${label}:`}
                </label>
            ) : null}
            <div className='reusable-button__loading'>
                <input
                    className='reusable-search__bar'
                    type='text'
                    placeholder={placeholder}
                    name={name}
                    value={value}
                    onChange={(e) => search(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            searchContent();
                        }
                    }}
                    onBlur={() => {
                        searchContent();
                    }}
                    style={{
                        width: inputWidth || "100px",
                    }}
                />
            </div>
            <img
                className='reusable-search__icon'
                src={searchIcon}
                alt='search-icon'
            />
        </div>
    );
};

export default SearchBar;
