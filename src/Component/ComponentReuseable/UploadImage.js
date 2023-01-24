import React from "react";
import PlusIcon from "../../svg/plus-icon.svg";
import DefaultProfileImage from "../../svg/default-profile-image.svg";
import DefaultAssetImage from "../../svg/default-asset-image.svg";
import "./style.scss";

const UploadImage = (props) => {
    let {
        photoProfile,
        setPhotoProfile,
        onRemoveRequest,
        handleImage,
        width,
        isProfile,
        editable,
    } = props;

    return (
        <div
            className='reusable-upload-image'
            style={width ? { width: width } : {}}>
            <div className='reusable-upload-image__image-content'>
                <img
                    className={`reusable-upload-image__image-preview${
                        isProfile ? "-profile" : ""
                    }`}
                    style={
                        width
                            ? {
                                  width: width,
                                  height: width,
                              }
                            : {}
                    }
                    src={
                        photoProfile
                            ? photoProfile
                            : isProfile
                            ? DefaultProfileImage
                            : DefaultAssetImage
                    }
                    alt='profile-pic'
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = isProfile
                            ? DefaultProfileImage
                            : DefaultAssetImage;
                    }}
                />
            </div>
            {editable && (
                <>
                    <label htmlFor='add-image'>
                        <img
                            className='reusable-upload-image__image-add'
                            src={PlusIcon}
                            alt='add-image-icon'
                        />
                    </label>
                    <input
                        type='file'
                        id='add-image'
                        name='profile-pic'
                        accept='image/*'
                        onChange={handleImage}
                        style={{ display: "none" }}
                    />
                </>
            )}
        </div>
    );
};

export default UploadImage;
