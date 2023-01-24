// System library imports
import React, { useState, useEffect } from "react";

// Style imports
import "./style.scss";

const TableCheckable = (props) => {
    // Destructure props
    let {
        index,
        checkedItemIndex,
        setCheckedItemIndex,
        row,
        onChecked,
        mainCheck,
        selectAll,
        setSelectAll,
        body,
    } = props;

    return (
        <React.Fragment>
            {mainCheck ? (
                <input
                    type='radio'
                    name={`radio-checkAll`}
                    onChange={() => {}}
                    onClick={() => {
                        let checked = [];
                        setSelectAll(!selectAll);
                        if (!selectAll) {
                            body.map((item, itemIndex) => {
                                checked.push(itemIndex);
                                document.getElementById(
                                    `id-${itemIndex}`
                                ).checked = true;
                            });
                        } else {
                            body.map((item, itemIndex) => {
                                document.getElementById(
                                    `id-${itemIndex}`
                                ).checked = false;
                            });
                        }
                        setCheckedItemIndex(checked);
                        onChecked(checked);
                    }}
                    checked={selectAll}
                />
            ) : (
                <input
                    id={`id-${index}`}
                    type='radio'
                    name={`radio-${index}`}
                    value={index}
                    onClick={(e) => {
                        let checked = checkedItemIndex;

                        let indexof = checked.indexOf(parseInt(e.target.value));

                        if (indexof !== -1) {
                            // checked[indexof] = index;
                            document.getElementById(
                                `id-${e.target.value}`
                            ).checked = false;
                            checked.splice(indexof, 1);
                            setSelectAll(false);
                        } else {
                            checked.push(parseInt(e.target.value));
                        }
                        setCheckedItemIndex(checked);
                        onChecked(checked);
                    }}
                />
            )}
        </React.Fragment>
    );
};

export default TableCheckable;
