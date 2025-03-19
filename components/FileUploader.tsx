import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import Image from "next/image";

type FileUploaderProps = {
  fieldChange: (FILE: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [file, setFile] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <Image width={200} height={200} src={fileUrl} alt="file" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">click or drag photo to replace.</p>
        </>
      ) : (
        <div className="w-full h-full  items-center flex flex-col justify-center">
          <Image
            src="/file-upload.svg"
            alt="upload"
            width={96}
            height={77}
          />
          <h3 className="base -medium text-light-2 mb-2 mt-6">
            drag and drop here
          </h3>
          <h3 className="text-light-4 small-regular mb-6">SVG,JPG,PNG</h3>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
