import ModalContainer from "./ModalContainer";
import useModal from "./useModal";
import InputTextVertical from "./InputTextVertical";
import InputTextHorizontal from "./InputTextHorizontal";
import InputDropdownHorizontal from "./InputDropdownHorizontal";
import InputDateHorizontal from "./InputDateHorizontal";
import SearchBar from "./SearchBar";
import InputPasswordVertical from "./InputPasswordVertical";
import Table from "./Table";
import Pagination from "./Pagination";
import ExportButton from "./ExportButton";
import ButtonExit from "./ButtonExit";
import AlarmGuidelineButton from "./AlarmGuidelineButton";
import PaginationStyle2 from "./PaginationStyle2";
import UploadImage from "./UploadImage";
import profileIcon from "../images/jeruk.jpg";
import { useState } from "react";
import "./test.scss";

const Content = () => {
    const { isShowing: isShowing, toggle: modal } = useModal();
    const { isShowing: isShowingModal1, toggle: modal1 } = useModal();
    const [textValue, setTextValue] = useState("placeholder");
    const [input, setInput] = useState("dua");

    const onChange = () => {};
    return (
        <div
            className='content'
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "300px",
                }}>
                <div
                    style={{ cursor: "pointer", display: "flex", gap: "10px" }}>
                    <span onClick={() => modal()}>Modal</span>
                    <span onClick={() => modal1()}>Modal 1</span>
                </div>
                <InputTextVertical
                    width='100%'
                    name='test'
                    label='Test Label'
                    value={textValue}
                    onChange={() => onChange()}
                    isRequired={true}
                    // isLogin={true}
                />
                <InputTextHorizontal
                    // labelWidth='120px'
                    inputWidth='200px'
                    name='test'
                    label='Test Label'
                    value={textValue}
                    onChange={() => onChange()}
                    isRequired={true}
                    // isLogin={true}
                />
                <InputTextHorizontal
                    // labelWidth='100px'
                    inputWidth='200px'
                    name='test'
                    label='Test'
                    value={textValue}
                    onChange={() => onChange()}
                    isRequired={false}
                    // isLogin={true}
                />
                <InputDropdownHorizontal
                    // labelWidth='100px'
                    inputWidth='200px'
                    name='input'
                    label='Floor'
                    value={input}
                    options={["satu", "dua", "tiga"]}
                    onChange={(e) => e}
                    inputWidth='200px'
                    isLoading={false}
                />
                <InputDateHorizontal
                    // labelWidth='100px'
                    inputWidth='200px'
                    name='testDate'
                    label='Date'
                    value={new Date()}
                    onChange={() => onChange()}
                />
                <SearchBar
                    name='testSearch'
                    label='Search'
                    // labelWidth='100px'
                    inputWidth='200px'
                    value={""}
                    search={(item) => {
                        // setSearchValue(item);
                        item;
                    }}
                    searchContent={() => {
                        console.log("Searching...");
                    }}
                />
                <InputPasswordVertical
                    width='100%'
                    name='password'
                    label='Password'
                    value={"password"}
                    onChange={onChange}
                    isRequired={true}
                />
                <ExportButton />
                <AlarmGuidelineButton />
                <div style={{ display: "flex", gap: "20px" }}>
                    <UploadImage
                        width='150px'
                        photoProfile={profileIcon}
                        setPhotoProfile={""}
                        onRemoveRequest={""}
                        handleImage={""}
                        isProfile
                    />
                    <UploadImage
                        width='150px'
                        photoProfile={null}
                        setPhotoProfile={""}
                        onRemoveRequest={""}
                        handleImage={""}
                    />
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    gap: "10px",
                }}>
                <Table />
                <Pagination
                    firstPage={() => {}}
                    lastPage={() => {}}
                    nextPage={() => {}}
                    prevPage={() => {}}
                    currentPageNumber={1}
                    lastPageNumber={10}
                />
                <PaginationStyle2
                    firstPage={() => {}}
                    lastPage={() => {}}
                    nextPage={() => {}}
                    prevPage={() => {}}
                    currentPageNumber={1}
                    lastPageNumber={10}
                />
            </div>
            <ModalContainer
                width='200px'
                title={"title"}
                isShowing={isShowing}
                hide={modal}
                submitName={"submitName"}
                level={2}
                // onSubmit={() => onSubmit()}
                clearName={"Clear"}
                // onClear={() => onClear()}
                showRequired={false}
            />
            <ModalContainer
                width={"400px"}
                title={"Machine Information"}
                isShowing={isShowingModal1}
                hide={modal1}
                submitName={"Add Machine"}
                formId={"addRack"}
                showRequired={true}
                // onSubmit={() => onSubmit()}
                clearName={"Reset"}
                onClear={"onClear"}
                showRequired={false}
                children={
                    <div className='modal-test'>
                        <div className='left-side'>
                            <UploadImage
                                width='150px'
                                // photoProfile={profileIcon}
                                setPhotoProfile={""}
                                onRemoveRequest={""}
                                handleImage={""}
                            />
                        </div>
                        <div className='right-side'>
                            <InputTextHorizontal
                                labelWidth='100px'
                                inputWidth='100%'
                                name='test'
                                label='No'
                                value={textValue}
                                onChange={() => onChange()}
                                // isLogin={true}
                            />
                            <InputDropdownHorizontal
                                labelWidth='100px'
                                inputWidth='100%'
                                name='floor'
                                label='Floor'
                                value={"dua"}
                                options={["satu", "dua", "tiga"]}
                                onChange={() => onChange()}
                                isLoading={false}
                            />
                            <InputTextHorizontal
                                labelWidth='100px'
                                inputWidth='100%'
                                name='test'
                                label='Model'
                                value={textValue}
                                onChange={() => onChange()}
                                // isLogin={true}
                            />
                            <InputTextHorizontal
                                labelWidth='100px'
                                inputWidth='100%'
                                name='test'
                                label='Asset ID'
                                value={textValue}
                                onChange={() => onChange()}
                                // isLogin={true}
                            />
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default Content;
