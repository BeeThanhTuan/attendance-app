import Webcam from "react-webcam";
import FaceOverlay from "./FaceOverlay";

interface Props {
  webcamRef: React.RefObject<Webcam | null>;
  detected: boolean;
}

export default function FaceCamera({ webcamRef, detected}: Props) {
  return (
    <div className="relative h-full w-full">
      <Webcam
        ref={webcamRef}
        mirrored
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: "user",
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <FaceOverlay
        detected={detected}
        message={
          detected
            ? "Đã phát hiện khuôn mặt"
            : "Đưa khuôn mặt vào khung"
        }
      />
    </div>
  );
}