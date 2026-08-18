import FaceRegistrationFlow from "../components/FaceRegistrationFlow";

export default function FaceRegistrationPage() {
  return (
    <FaceRegistrationFlow
      mode="register"
      title="Đăng ký khuôn mặt"
      successDescription="Khuôn mặt đã được đăng ký thành công."
    />
  );
}