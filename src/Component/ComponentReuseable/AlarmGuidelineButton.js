import { ReactComponent as NoteIcon } from "../../svg/note-icon.svg";
import { useTranslation } from "react-i18next";
import "./style.scss";

const AlarmGuidelineButton = ({ onClick }) => {
    const { t } = useTranslation();
    return (
        <div className='reusable-alarm-button' onClick={() => onClick()}>
            <NoteIcon />
            <span>{t("alarm_guideline")}</span>
        </div>
    );
};

export default AlarmGuidelineButton;
