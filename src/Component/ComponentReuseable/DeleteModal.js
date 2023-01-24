import React from "react";
import { ReactComponent as TrashIcon } from "../../svg/trash-icon.svg";
import ModalContainer from "./ModalContainer";
import "./style.scss";

const DeleteModal = (props) => {
    let { isShowing, hide, onDelete, isLoading, level, t } = props;

    return isShowing ? (
        <ModalContainer
            width='400px'
            isShowing={isShowing}
            hide={hide}
            submitName={"Yes"}
            onSubmit={onDelete}
            clearName={"No"}
            onClear={() => hide()}
            isLoading={isLoading}
            level={level ? level : 1}
            isDelete>
            <div className='reusable-modal-delete'>
                <TrashIcon className='trash-icon' />
                <span>
                    {t(
                        "content.shop_floor_overview.error.Thisoperationwilldeletetheselectedmachinesinformations"
                    )}
                </span>
                <span>
                    {t(
                        "content.shop_floor_overview.error.Areyousurewanttocontinue?"
                    )}
                </span>
            </div>
        </ModalContainer>
    ) : null;
};

export default DeleteModal;
