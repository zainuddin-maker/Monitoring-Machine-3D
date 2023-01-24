import "../style.scss";

const Card = (props) => {
    const { title, children } = props;
    return (
        <div className='card-container'>
            <div className='card-header'>
                <div className='card-title'>{title}</div>
            </div>
            <div className='card-content'>{children}</div>
        </div>
    );
};

export default Card;
