import React, { useState } from "react";
import axios from "axios";

const FileUpload: React.FC = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            const response = await axios.post("http://localhost:8000/uploadfiles/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setMessage(`アップロード成功: ${response.data.filenames}`);
        } catch (error) {
            console.error("Upload error:", error);
            setMessage("アップロードに失敗しました。");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <h2>複数ファイルアップロード</h2>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "アップロード中..." : "アップロード"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;
