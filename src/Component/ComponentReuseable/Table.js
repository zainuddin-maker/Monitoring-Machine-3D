// System library imports
import React, { useState, useEffect } from "react";

// Custom library imports
import TableAction from "./TableAction";
import TableCheckable from "./TableCheckable";

// Style imports
import "./style.scss";

const Table = (props) => {
    // Destructure props
    let {
        header,
        body,
        actions,
        actionWidth,
        selectable,
        onSelect,
        customCellClassNames,
        checkable,
        onChecked,
        changeTable
    } = props;

    // Normalize boolean value to true or false (handle null or undefined value)
    selectable = selectable ? true : false;
    checkable = checkable ? true : false;

    // Handle if actions props is not given
    if (!actions) {
        actions = [];
    }

    // Handle if onChecked props is not given
    if (!onChecked) {
        onChecked = () => {};
    }

    // Handle if onSelect props is not given
    if (!onSelect) {
        onSelect = () => {};
    }

    // Handle if customCellClassNames props is not given
    if (!customCellClassNames) {
        customCellClassNames = {};
    }

    // States
    const [tableHeader, setTableHeader] = useState([]);
    const [tableBody, setTableBody] = useState([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState(
        body.length > 0 ? 0 : null
    );
    const [checkedItemIndex, setCheckedItemIndex] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Side-effects
    // Convert the header props into a table header
    useEffect(() => {
        if (Object.keys(header).length > 0) {
            let headerValues = Object.values(header).filter(
                (head) => head.name !== "Changes"
            );
            if (actions.length > 0) {
                headerValues.push({ width: actionWidth || "100px", name: "" });
            }
            if (checkable) {
                headerValues.unshift({ width: "40px", name: "checked" });
            }

            setTableHeader(headerValues);
        }
    }, [header, actions, checkable, setTableHeader]);

    // Convert the body props into a table body
    useEffect(() => {
        // Convert the header object into array of the object's keys
        // Assumption: the object key is all string, so insertion order is the same as input

        let headerKeys = Object.keys(header);

        // Convert the body array into array of array
        // Assumption: the object key is all string, so insertion order is the same as input
        const normalizeBody = (row, index) => {
            // Get current row keys and values
            let bodyKeys = Object.keys(row);
            let bodyValues = Object.values(row);

            // Sort the keys and values based on headerKeys
            let sortedValues = [];

            for (let key of headerKeys) {
                // Search for value of the current key
                let bodyIndex = bodyKeys.indexOf(key);
                let value = bodyValues[bodyIndex];

                // Check if current key has a customClassName
                if (Object.keys(customCellClassNames).includes(key)) {
                    let valueClassNamePairs = customCellClassNames[key];

                    // Check if it match a value-className pair
                    let foundMatchedIndex = valueClassNamePairs.findIndex(
                        (item) => item.value === value
                    );

                    if (foundMatchedIndex !== -1) {
                        value = {
                            value: value,
                            className:
                                valueClassNamePairs[foundMatchedIndex]
                                    .className,
                        };
                    }
                }

                // Push the value to the sortedValues array
                sortedValues.push(value);
            }

            // Concatenate actions if exists
            if (actions.length > 0) {
                // Generate TableAction array
                let tableActions = actions.map((actionItem, actionIndex) => {
                    if (actionItem.checkFunction) {
                        if (actionItem.checkFunction(row, index)) {
                            return (
                                <TableAction
                                    key={`action-${index}-${actionIndex}`}
                                    index={actionIndex}
                                    row={row}
                                    iconSrc={actionItem.iconSrc}
                                    Src={actionItem.src || null}
                                    onClick={() => {
                                        actionItem.onClick(row, index);
                                    }}
                                />
                            );
                        } else {
                            return (
                                <div
                                    className='reusable-table__action-icon--empty'
                                    key={`action-${index}-${actionIndex}`}></div>
                            );
                        }
                    } else {
                        return (
                            <TableAction
                                key={`action-${index}-${actionIndex}`}
                                index={actionIndex}
                                iconSrc={actionItem.iconSrc}
                                Src={actionItem.src || null}
                                onClick={() => {
                                    actionItem.onClick(row, index);
                                }}
                                row={row}
                            />
                        );
                    }
                });

                sortedValues.push(
                    <div className='reusable-table__actions-container'>
                        {tableActions}
                    </div>
                );
            }

            if (checkable) {
                sortedValues.unshift(
                    <TableCheckable
                        index={index}
                        checkedItemIndex={checkedItemIndex}
                        setCheckedItemIndex={setCheckedItemIndex}
                        onChecked={onChecked}
                        setSelectAll={setSelectAll}
                    />
                );
            }

            return sortedValues;
        };

        if (body.length > 0) {
            setTableBody(body.map(normalizeBody));
        } else {
            setTableBody([]);
        }
    }, [
        header,
        body,
        actions,
        checkable,
        setTableBody,
        checkedItemIndex,
        setCheckedItemIndex,
        customCellClassNames,
    ]);

    // useEffect(() => {
    //     if (body.length > 0) {
    //         //    Set default selected item index
    //         setSelectedItemIndex(0);
    //         onSelect(body[0], 0);
    //     }
    // }, [body.length]);

    // Functions
    // Map header array into header columns
    const mapHeader = (col, index) => (
        <th
            key={`headerCol-${index}`}
            style={{
                width: col.width ? col.width : null,
                minWidth: col.width ? col.width : null,
            }}>
            {typeof col === "string" ? (
                col
            ) : col.name !== "checked" ? (
                col.name
            ) : (
                <TableCheckable
                    checkedItemIndex={checkedItemIndex}
                    setCheckedItemIndex={setCheckedItemIndex}
                    selectAll={selectAll}
                    setSelectAll={setSelectAll}
                    onChecked={onChecked}
                    body={body}
                    mainCheck
                />
            )}
        </th>
    );

    // Map body array into table rows
    const mapBodyRow = (row, index) => (
        <tr
            key={`bodyRow-${index}`}
            className={
                selectable && index === selectedItemIndex
                    ? "reusable-table__row--selected"
                    : ""
            }
            onClick={() => {
                if (selectable) {
                    setSelectedItemIndex(index);
                    onSelect(body[index], index);
                }
            }}>
            {row.map(mapBodyCell)}
        </tr>
    );

    // Map a row into a cell
    const mapBodyCell = (cell, index, data) => {
        let coba = data[data.length - 1];
        let coba2 = coba.length > 0 ? coba.includes(index) : false;
        // Check if the cell is an object with a custom className
        if (typeof cell === "object" && cell !== null && cell.className) {
            return (
                <td
                    key={`bodyRowCol-${index}`}
                    className={`${cell.className} bold-column`}
                    style={
                        selectable
                            ? { cursor: "pointer" }
                            : { cursor: "default" }
                    }>
                    {cell.value}
                </td>
            );
        } else {
            if (!Array.isArray(cell)) {
                return (
                    <td
                        className={typeof cell === "object" ? "is-action" : ""}
                        key={`bodyRowCol-${index}`}
                        style={
                            selectable
                                ? coba2
                                    ? { cursor: "pointer", fontWeight: "bold" }
                                    : { cursor: "pointer" }
                                : coba2
                                ? { cursor: "default", fontWeight: "bold" }
                                : { cursor: "default" }
                        }>
                        {cell}
                    </td>
                );
            }
        }
    };

    return (
        <div className='reusable-table-container' id='limit-table'>
            <table className='reusable-table'>
                <thead>
                    <tr>{tableHeader.map(mapHeader)}</tr>
                </thead>
                <tbody>
                    {tableBody.length > 0 && tableBody.map(mapBodyRow)}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
