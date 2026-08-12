import FaceRegistrationFlow from "../components/FaceRegistrationFlow";

export default function FaceReRegistrationPage() {
  return (
    <FaceRegistrationFlow
      mode="register"
      title="Đăng ký lại khuôn mặt"
      successDescription="Khuôn mặt đã được cập nhật thành công."
    />
  );
}