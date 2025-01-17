import { useEffect, useState } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";

interface ContactImageProps {
  imageUrl?: string;
  showActions?: boolean;
  onlyPreview?: boolean;
  onChange?: (imageUrl: string) => void;
}

const ContactImage: React.FC<ContactImageProps> = ({ imageUrl, showActions, onlyPreview, onChange }) => {
  const [currentImgUrl, setCurrentImgUrl] = useState(imageUrl);

  useEffect(() => {
    setCurrentImgUrl(imageUrl);
  }, [imageUrl]);

  const imageEditClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    document.getElementById('file-upload')?.click();
  }

  const onImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        const newImgUrl = `https://placehold.co/600x400/blue/white?text=${selectedFile.name}`;
        setCurrentImgUrl(newImgUrl);
        onChange?.(newImgUrl);
      }
    }
  }

  const imageRemoveHandler = () => {
    setCurrentImgUrl('');
    onChange?.('');
  }

  const getImageView = () => {
    if (currentImgUrl) {
      return (
        <img
          src={currentImgUrl}
          alt="avatar"
          className="rounded-2xl w-56 h-56 object-cover self-center"
        />
      )
    } else if (onlyPreview) {
      return (
        <div className="rounded-2xl w-56 h-56 object-cover self-center">
          <UserCircleIcon className="text-gray-400" />
        </div>
      )
    } else {
      return (
        <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
            <div className="mt-4 flex text-sm/6 text-gray-600 gap-">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={onImageUpload}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="mt-2 text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col w-full gap-4">
      {getImageView()}
      {showActions && (
        <div className="flex gap-2 self-center">
          <button
            type="button"
            className="w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 sm:mt-0"
            onClick={imageEditClickHandler}
          >
            Edit
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={onImageUpload}
            />
          </button>
          {currentImgUrl ? (
            <button
              type="button"
              className="w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 sm:mt-0"
              onClick={imageRemoveHandler}
            >
              Remove
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}
export default ContactImage;