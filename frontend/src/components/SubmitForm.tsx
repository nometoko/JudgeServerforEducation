import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SubmitForm: React.FC = () => {
    const navigate = useNavigate();

    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = event.target.files;
        if (!files || files.length === 0) {
            return;
        }
        if (!checkFileType(files)) {
            event.target.value = "";
            return;
        }
        setFiles(event.target.files);
    };

    const handleUpload = async () => {
        if (!files || files.length === 0) {
            setMessage("ファイルを選択してください。");
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);  // "files" はFastAPIの引数と一致
        }


        setUploading(true);
        setMessage("");

        try {
            const authUserName = localStorage.getItem("authUserName");
            const response = await axios.post("http://localhost:8000/handler/receiveFiles/" + authUserName + "/1", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            const submissionId = response.data;
            navigate(`/submission/${submissionId}`);
        } catch (error) {
            console.error("Upload error:", error);
            setMessage("アップロードに失敗しました。");
        } finally {
            setUploading(false);
        }
    };

    const checkFileType = (files: FileList): boolean => {
        for (let i = 0; i < files.length; i++) {
            // get file extension
            const extension = files[i].name.split(".").pop();
            if (files[i].name != "Makefile" && extension != "c" && extension != "h") {
                alert("Invalid file type. Please select .c, .h, or Makefile");
                return false;
            }
        }
        return true;
    };

    return (
        <div>
            <h2>複数ファイルアップロード</h2>
            <input type="file" accept="text/**" multiple onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "アップロード中..." : "アップロード"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SubmitForm;
