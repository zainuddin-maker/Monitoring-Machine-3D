import {
    ModalContainer,
    InputTextVertical,
    InputPasswordVertical,
    UploadImage,
} from "../../../ComponentReuseable";
import "./style.scss";
import { ReactComponent as EditIcon } from "../../../../svg/edit-profile-icon.svg";
import { InputTextHorizontal } from "../../../ComponentReuseable";
import { InputDropdownHorizontal } from "../../../ComponentReuseable";
import { PaginationStyle2 } from "../../../ComponentReuseable";
import { InputTextAreaHorizantal } from "../../../ComponentReuseable";
import { Table } from "../../../ComponentReuseable";

import exitButton from "../../../../svg/exit-button.svg";
import upladIcon from "../../../../svg/upload-icon.svg";

import { useState } from "react";
const factoryDummy = ["Factory 1", "Factory 2"];

const ModalDeleteTable = (props) => {
    // [
    //     { no: 1, brand: "0", model: "0", machine_no: "0", type: "0" },
    //     { no: "1", brand: "0", model: "0", machine_no: "0", type: "0" },
    //     { no: "1", brand: "0", model: "0", machine_no: "0", type: "0" }
    // ]

    const { isShowing, hide, t } = props;

    const header = {
        no: {
            width: "110px",
            name: t("content.shop_floor_overview.asset_list.content.no"),
        },
        brand: {
            width: "90px",
            name: t("content.shop_floor_overview.asset_list.content.brand"),
        },
        model: {
            width: "150px",
            name: t("content.shop_floor_overview.asset_list.content.model"),
        },
        machine_no: {
            width: "110px",
            name: t(
                "content.shop_floor_overview.asset_list.content.machine_no"
            ),
        },
        type: {
            width: "150px",
            name: t("content.shop_floor_overview.asset_list.content.type"),
        },
    };

    const body = new Array(3).fill({}).map((item, index) => {
        return { no: "1", brand: "0", model: "0", machine_no: "0", type: "0" };
    });
    const [isEdit, setIsEdit] = useState(false);
    const [input, setInput] = useState({
        username: "taicang",
        job_number: "job number",
        email: "taicang@domain.com",
        password: "password",
    });

    const [isIsformation, setIsInformation] = useState(true);

    const [filter, setFilter] = useState({
        factory: "",
        shop_floor: "",
        type: "",
        machine_no: "",
        // start_date: today,
        // end_date: today,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(10);
    const firstPage = () => {
        setCurrentPage(1);
    };
    const lastPage = () => {
        setCurrentPage(totalPage);
    };
    const nextPage = () => {
        if (currentPage < totalPage) {
            setCurrentPage((prev) => prev + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <ModalContainer
            width={"380px"}
            // title={"Machine information"}
            isShowing={isShowing}
            hide={hide}
            // submitName={isEdit ? t("profile.content.update") : undefined}
            // submitName={isIsformation ? "Update Machine" : undefined}
            formId={""}
            // showRequired={true}
            onSubmit={() => hide()}
            showRequired={false}
            // isProfile
            children={
                <div>
                    <div>
                        This operation will delete the selected machines
                        informations. Are you sure you want to continue?
                        
                    </div>
                </div>
            }
        />
    );
};

export default ModalDeleteTable;
