import { useTranslation } from "react-i18next";
import "../style.scss";
import { ReactComponent as ChartType1 } from "../../../../svg/chart-type-1.svg";

const CharttypeoneButton = ({ onClick ,chartType }) => {
    const { t } = useTranslation();
    return (
           <div
           className={`type-1${
               chartType === 1 ? " type-1__active" : ""
           }`}
           onClick={() => onClick()}>
           <ChartType1 />
       </div>
    );
};

export default CharttypeoneButton;
