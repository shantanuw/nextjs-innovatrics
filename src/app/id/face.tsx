import type {
  CallbackImage,
  FaceCallback,
} from '@innovatrics/dot-face-auto-capture';
import React, { useEffect, useState } from 'react';

import { useToast } from '@/context/ToastContext';
import FaceCamera from '@/pages/id/FaceCamera';
import apiRequest from '@/service/ApiService';

interface Props {
  onPhotoTaken: FaceCallback;
  onError: (error: Error) => void;
  onBackClick: () => void;
}

function FaceAutoCapture({ onError }: Props) {
  const { showToast } = useToast();
  const [data, setData] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>();

  const handlePhotoTaken = <T,>(imageData: CallbackImage<T>) => {
    const imageUrl = URL.createObjectURL(imageData.image);
    setPhotoUrl(imageUrl);
  };

  function blobToBase64(blob: any) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  const handleFaceCapturePhotoTaken: FaceCallback = async (
    imageData,
    _content,
  ) => {
    handlePhotoTaken(imageData);
  };

  const uploadSelfie = async (imageBase64String: string) => {
    setData('Loading...');

    try {
      const uploadResponse = await apiRequest<string>(
        'POST',
        '/selfie',
        showToast,
        {
          body: {
            image: imageBase64String,
          },
        },
      );
      setData(uploadResponse);
    } catch (error) {
      showToast('Failed to upload image', 'failure');
    }
  };

  useEffect(() => {
    if (photoUrl) {
      fetch(photoUrl as string)
        .then((res) => res.blob())
        .then(blobToBase64)
        .then((finalResult: any) => {
          setData(finalResult as string);
          uploadSelfie(finalResult as string);
        });
    }
  }, [photoUrl]);

  return (
    <>
      <h2>Face auto capture</h2>
      <div className="relative max-w-[900px]">
        <FaceCamera
          cameraFacing="user"
          onPhotoTaken={handleFaceCapturePhotoTaken}
          onError={onError}
        />
        {photoUrl && <img alt="Web component result" src={photoUrl} />}
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export default FaceAutoCapture;
