import {
    ModalContainer,
    InputTextVertical,
    InputPasswordVertical,
    UploadImage,
    LoadingData,
} from "../../ComponentReuseable/index";
import "./style.scss";
import { ReactComponent as EditIcon } from "../../../svg/edit-profile-icon.svg";
import { ReactComponent as ReverseEditIcon } from "../../../svg/reverseedit.svg";
import jeruk from "../../../images/jeruk.jpg";
import DefaultProfileImage from "../../../svg/default-profile-image.svg";
import { getUserDetails, getToken } from "../../ComponentReuseable/TokenParse";
import { encode } from "js-base64";
import { toast } from "react-toastify";
import axios from "axios";
import { ReturnHostBackend } from "../../ComponentReuseable/BackendHost";
import { useState, useEffect } from "react";

const Profile = (props) => {
    const { isShowing, hide, t } = props;

    const [initialData, setInitialData] = useState({
        profile_image: null,
        username: "",
        email: "",
        job_number: "",
    });
    const [isEdit, setIsEdit] = useState(false);
    const [isResetPass, setIsResetPass] = useState(false);
    const [input, setInput] = useState({
        profile_image: null,
        image_file: null,
        image_path: "",
        username: "",
        email: "",
        job_number: "",
        password: "",
        new_password: "",
        confirm_new_password: "",
    });
    const [profilePicUrl, setProfilePicUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    // const [progressBarUpload, setProgressBarUpload] = useState();

    const handleProfilePicUpload = (e) => {
        let { files } = e.target;

        if (files.length > 0) {
            let file = e.target.files[0];

            const reader = new FileReader();

            reader.addEventListener(
                "load",
                () => {
                    // Set the uploaded image file to the state
                    // setInput((prevState) => {
                    //     return { ...prevState, profile_image: file };
                    // });
                    setInput((prev) => {
                        prev.image_file = file;
                        prev.image_path =
                            "/filerepository/CAD-IT/uploadFileFromAPI/users/photo/" +
                            file.lastModified +
                            file.name.replace(/\s/g, "");
                        return { ...prev };
                    });

                    // Set the displayed profile pic to the uploaded file
                    setProfilePicUrl(reader.result);
                },
                false
            );

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const validateNewPassword = (password) => {
        let regex =
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,72}$/;
        return regex.test(password);
    };

    const validateEmail = (email) => {
        let regex =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    };

    const getUserDetail = async () => {
        const user_id = getUserDetails().userId;
        const config = {
            method: "get",
            url:
                ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                `${process.env.REACT_APP_GET_PROFILE_DETAILS}/${user_id}`,
            headers: {
                authorization: getToken(),
            },
        };
        try {
            const result = await axios(config);
            if (result.data) {
                let { email, phone_number, image } = result.data;
                setInitialData({
                    profile_image: image
                        ? ReturnHostBackend(
                              process.env.REACT_APP_BACKEND_NODELINX
                          ) + image
                        : null,
                    image_file: image
                        ? ReturnHostBackend(
                              process.env.REACT_APP_BACKEND_NODELINX
                          ) + image
                        : null,
                    username: getUserDetails().username,
                    image_path: image,
                    email: email,
                    job_number: phone_number,
                });

                setInput({
                    profile_image: null,
                    image_file: null,
                    image_path: image,
                    username: getUserDetails().username,
                    email: email,
                    job_number: phone_number,
                    password: "",
                    new_password: "",
                    confirm_new_password: "",
                });
                setProfilePicUrl(
                    image
                        ? ReturnHostBackend(
                              process.env.REACT_APP_BACKEND_NODELINX
                          ) + image
                        : null
                );

                const updateUserDetailsLocalStorage = {
                    ...getUserDetails(),
                    image: image,
                };

                localStorage.setItem(
                    "user_details",
                    encode(JSON.stringify(updateUserDetailsLocalStorage))
                );
            } else {
                setInitialData({
                    profile_image: null,
                    image_file: null,
                    image_path: "",
                    username: "",
                    email: "",
                    job_number: "",
                });

                setInput({
                    profile_image: null,
                    image_file: null,
                    image_path: "",
                    username: "",
                    email: "",
                    job_number: "",
                    password: "",
                    new_password: "",
                    confirm_new_password: "",
                });
                setProfilePicUrl(null);

                toast.error(t("toast.failed_to_get_user_details"), {
                    toastId: "failed-to-get-user-details",
                });
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data);
            } else {
                toast.error(t("toast.failed_to_get_user_details"), {
                    toastId: "failed-to-get-user-details",
                });
            }
            setInitialData({
                profile_image: null,
                username: "",
                email: "",
                job_number: "",
            });

            setInput({
                profile_image: null,
                username: "",
                email: "",
                job_number: "",
                password: "",
                new_password: "",
                confirm_new_password: "",
            });
            setProfilePicUrl(null);
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "pathFile",
            "users/photo/" + file.lastModified + file.name.replace(/\s/g, "")
        );

        let config = {
            method: "POST",
            url:
                ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                process.env.REACT_APP_IMAGE_UPLOAD,
            headers: {
                authorization: getToken(),
            },
            data: formData,
        };
        try {
            await axios(config);
        } catch (e) {
            toast.error(t("toast.failed_to_upload_image"), {
                toastId: "failed-upload-image",
            });
        }
    };

    const deleteImage = async (file) => {
        const formData = new FormData();
        formData.append(
            "path",
            "users/photo/" + file.split("/")[file.split("/").length - 1]
        );

        let config = {
            method: "DELETE",
            url:
                ReturnHostBackend(process.env.REACT_APP_BACKEND_NODELINX) +
                process.env.REACT_APP_IMAGE_UPLOAD,
            headers: {
                authorization: getToken(),
            },
            data: formData,
        };
        try {
            await axios(config);
        } catch (e) {
            toast.error(t("toast.failed_to_delete_image"), {
                toastId: "failed-delete-image",
            });
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let email = "";
        // console.log(input);
        if (input.email) {
            if (validateEmail(input.email)) {
                email = input.email;
            } else {
                toast.error(t("toast.validate_email"), {
                    toastId: "validate-email",
                });
                setIsLoading(false);
                return;
            }
        }
        if (input.image_file) {
            uploadImage(input.image_file);
            deleteImage(getUserDetails().image);
        }

        const formData = new FormData();
        formData.append("user_id", getUserDetails().userId);
        formData.append(
            "phone_number",
            input.job_number ? input.job_number : ""
        );
        formData.append("email", email);
        formData.append("image", input.image_path ? input.image_path : "");

        const config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_UPDATE_PROFILE,
            data: formData,
            headers: {
                authorization: getToken(),
            },
        };
        try {
            let result = await axios(config);
            let newData = getUserDetails();
            newData.image = input.image_path;
            localStorage.setItem(
                "user_details",
                encode(JSON.stringify(newData))
            );
            toast.success(t("toast.successfully_update_profile"), {
                toastId: "successfully-update-profile",
            });
            setIsLoading(false);
            getUserDetail();
            setIsEdit(false);
            hide();
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.toString());
            } else {
                toast.error(err.toString());
            }
            setIsLoading(false);
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        // Set isLoading to TRUE
        setIsLoading(true);

        let new_password = null;
        if (input.new_password !== "") {
            if (
                validateNewPassword(input.new_password) &&
                input.confirm_new_password !== input.new_password
            ) {
                toast.error(t("toast.incorrect_confirm_password"), {
                    toastId: "incorrect-confirm-password",
                });
                setIsLoading(false);
                return;
            } else if (validateNewPassword(input.new_password)) {
                new_password = input.new_password;
            } else {
                toast.error(t("toast.password_length"), {
                    toastId: "password-length",
                });
                setIsLoading(false);
                return;
            }
        }

        const formData = new FormData();
        formData.append("username", getUserDetails().username);
        formData.append("old_password", input.password);
        formData.append("new_password", new_password);

        const config = {
            method: "post",
            url:
                ReturnHostBackend(process.env.REACT_APP_JDBC) +
                process.env.REACT_APP_RESET_PASSWORD,
            data: formData,
            headers: {
                authorization: getToken(),
            },
        };
        try {
            let result = await axios(config);
            if (result.data && result.data.data.length > 0) {
                toast.success(t("toast.successfully_reset_password"), {
                    toastId: "successfully-reset-password",
                });
                setTimeout(() => {
                    localStorage.removeItem("isLogin");
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(t("toast.wrong_old_password"), {
                    toastId: "wrong-old-password",
                });
            }
            setIsLoading(false);

            // hide();
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.toString());
            } else {
                toast.error(err.toString());
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUserDetail();
    }, []);

    return (
        <ModalContainer
            width={"350px"}
            title={
                isResetPass
                    ? t("profile.header.reset_password")
                    : t("profile.header.personal_information")
            }
            isShowing={isShowing}
            hide={() => {
                hide();
                setIsEdit(false);
                setIsResetPass(false);
                getUserDetail();
            }}
            submitName={isEdit ? t("profile.content.update") : undefined}
            formId={isResetPass ? "reset-pass-form" : "update-profile-form"}
            onSubmit={isResetPass ? resetPassword : updateProfile}
            showRequired={false}
            isDisabled={isResetPass && input.confirm_new_password == ""}
            isProfile
            children={
                <div className='profile-modal'>
                    <LoadingData isLoading={isLoadingData} />
                    {!isEdit ? (
                        <EditIcon
                            className='edit-profile-icon'
                            onClick={() => setIsEdit(true)}
                        />
                    ) : (
                        <ReverseEditIcon
                            className='edit-profile-icon'
                            onClick={
                                !isResetPass
                                    ? () => {
                                          setIsEdit(false);
                                          setInput((prev) => {
                                              prev.username =
                                                  initialData.username;
                                              prev.email = initialData.email;
                                              prev.job_number =
                                                  initialData.job_number;
                                              return { ...prev };
                                          });
                                          setProfilePicUrl(
                                              initialData.image_file
                                                  ? ReturnHostBackend(
                                                        process.env
                                                            .REACT_APP_BACKEND_NODELINX
                                                    ) + initialData.image_path
                                                  : null
                                          );
                                      }
                                    : () => {
                                          setIsResetPass(false);
                                          setInput((prev) => {
                                              prev.password = "";
                                              prev.new_password = "";
                                              prev.confirm_new_password = "";
                                              return { ...prev };
                                          });
                                      }
                            }
                        />
                    )}
                    {!isResetPass && (
                        <form
                            id='update-profile-form'
                            className='form'
                            onSubmit={updateProfile}>
                            <div className='top-side'>
                                <UploadImage
                                    width='130px'
                                    photoProfile={
                                        profilePicUrl === null
                                            ? DefaultProfileImage
                                            : profilePicUrl
                                    }
                                    setPhotoProfile={""}
                                    onRemoveRequest={""}
                                    handleImage={handleProfilePicUpload}
                                    isProfile
                                    editable={isEdit}
                                />
                            </div>
                            <div
                                className='bottom-side'
                                style={
                                    !isEdit ? { paddingBottom: "30px" } : {}
                                }>
                                <InputTextVertical
                                    name='username'
                                    label={t("profile.content.username")}
                                    value={input.username}
                                    onChange={handleChange}
                                    isProfile
                                    isDisabled={true}
                                />
                                <InputTextVertical
                                    name='job_number'
                                    label={t("profile.content.job_number")}
                                    value={input.job_number}
                                    onChange={handleChange}
                                    isProfile
                                    isDisabled={!isEdit}
                                />
                                <InputTextVertical
                                    name='email'
                                    label={t("profile.content.email")}
                                    value={input.email}
                                    onChange={handleChange}
                                    isProfile
                                    isDisabled={!isEdit}
                                />
                                {/* <InputPasswordVertical
                                name='password'
                                label={t("profile.content.password")}
                                value={input.password}
                                onChange={handleChange}
                                isProfile
                                isRequired={true}
                                isDisabled={!isEdit}
                            />
                            {isEdit ? (
                                <>
                                    <InputPasswordVertical
                                        name='new_password'
                                        label={t(
                                            "profile.content.new_password"
                                        )}
                                        value={input.new_password}
                                        onChange={handleChange}
                                        isProfile
                                        isRequired={false}
                                    />
                                    <InputPasswordVertical
                                        name='confirm_new_password'
                                        label={t(
                                            "profile.content.confirm_new_password"
                                        )}
                                        value={input.confirm_new_password}
                                        onChange={handleChange}
                                        isProfile
                                        isRequired={input.new_password}
                                    />
                                </>
                            ) : null} */}
                                {isEdit && (
                                    <span onClick={() => setIsResetPass(true)}>
                                        {t("profile.content.reset_password")}
                                    </span>
                                )}
                            </div>
                        </form>
                    )}
                    {isResetPass && (
                        <form
                            id='reset-pass-form'
                            className='form'
                            onSubmit={resetPassword}>
                            <div className='top-side'></div>
                            <div
                                className='bottom-side'
                                style={{ paddingBottom: "30px" }}>
                                <InputPasswordVertical
                                    name='password'
                                    label={t("profile.content.password")}
                                    value={input.password}
                                    onChange={handleChange}
                                    isProfile
                                    isRequired={true}
                                    isDisabled={!isEdit}
                                />
                                <InputPasswordVertical
                                    name='new_password'
                                    label={t("profile.content.new_password")}
                                    value={input.new_password}
                                    onChange={handleChange}
                                    isProfile
                                />
                                <InputPasswordVertical
                                    name='confirm_new_password'
                                    label={t(
                                        "profile.content.confirm_new_password"
                                    )}
                                    value={input.confirm_new_password}
                                    onChange={handleChange}
                                    isProfile
                                    isRequired={input.new_password}
                                    isDisabled={input.new_password === ""}
                                />
                            </div>
                        </form>
                    )}
                </div>
            }
        />
    );
};

export default Profile;
