import type { HTMLFacetUiElement } from '@innovatrics/dot-auto-capture-ui/ui/src/types/face';
import type {
  FaceCameraProps,
  HTMLFaceCaptureElement,
} from '@innovatrics/dot-face-auto-capture';
import { useEffect, useRef } from 'react';

const FaceCamera = (props: FaceCameraProps) => {
  const ref = useRef<HTMLFaceCaptureElement | null>(null);
  const refUi = useRef<HTMLFacetUiElement | null>(null);

  useEffect(() => {
    import('@innovatrics/dot-face-auto-capture')
      .then(() => {
        const element = ref.current;

        if (element) {
          element.cameraOptions = props;
        }
      })
      .then(() => {
        import('@innovatrics/dot-auto-capture-ui/face').then(() => {
          const element = refUi.current;

          if (element) {
            element.props = props;
          }
        });
      });
  });

  return (
    <>
      <x-dot-face-auto-capture ref={ref} id="x-dot-face-auto-capture" />
      <x-dot-face-auto-capture-ui ref={refUi} id="x-dot-face-auto-capture-ui" />
    </>
  );
};

export default FaceCamera;
