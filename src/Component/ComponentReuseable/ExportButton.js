import { ReactComponent as ExportIcon } from "../../svg/save-icon.svg";
import { useTranslation } from "react-i18next";
import loadingButton from "../../gif/loading-1.gif";
import "./style.scss";

const ExportButton = ({ isLoading, onClick }) => {
    const { t } = useTranslation();
    return (
        <div
            className='reusable-export-button'
            onClick={isLoading ? null : onClick}
            style={isLoading ? { cursor: "default" } : { cursor: "pointer" }}>
            {isLoading ? (
                <div className='reusable-button__loading'>
                    <img src={loadingButton} alt='loading-button' />
                </div>
            ) : (
                <>
                    <ExportIcon />
                    <span>{t("export.export")}</span>
                </>
            )}
        </div>
    );
};

export default ExportButton;
