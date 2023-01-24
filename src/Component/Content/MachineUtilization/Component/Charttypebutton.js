// import { ReactComponent as NoteIcon } from "../../svg/note-icon.svg";
import { useTranslation } from "react-i18next";
import "../style.scss";
import { ReactComponent as ChartType2 } from "../../../../svg/chart-type-2.svg";
const CharttypetwoButton = ({ onClick ,chartType }) => {
    const { t } = useTranslation();
    return (
        // <div className='reusable-alarm-button' onClick={() => onClick()}>
        //     <NoteIcon />
        //     <span>{t("alarm_guideline")}</span>
        // </div>
           <div
           className={`type-2${
            chartType === 2 ? " type-2__active" : ""
        }`}
           onClick={() => onClick()}>
           <ChartType2 />
       </div>
    );
};

export default CharttypeoneButton;
