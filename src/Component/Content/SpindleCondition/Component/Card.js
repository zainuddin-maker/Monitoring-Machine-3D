import "../style.scss";
import { LoadingData } from "../../../ComponentReuseable";

const Card = (props) => {
    const { title, children, isLoading } = props;
    return (
        <div className='card-container'>
            <div className='card-header'>
                <div className='card-title'>{title}</div>
            </div>
            <div className='card-content'>
                <LoadingData
                    isLoading={isLoading}
                    useAltBackground={false}
                    size={"100px"}
                />
                {children}
            </div>
        </div>
    );
};

export default Card;
