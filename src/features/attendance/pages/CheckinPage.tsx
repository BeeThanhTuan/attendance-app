import { useLocations } from "../hooks/useLocations";
import { useCheckInFlow } from "../hooks/useCheckInFlow";

import AttendanceFlowLayout from "../layouts/AttendanceFlowLayout";

import LocationStep from "../components/steps/LocationStep";
import FaceStep from "../components/steps/FaceStep";
import ConfirmStep from "../components/steps/ConfirmStep";
import Success from "../components/status/Success";

export default function CheckInPage() {
  const flow = useCheckInFlow();
  const { data: locations = [] } = useLocations();

  if (flow.isSuccess) {
    return (
      <Success/>
    );
  }

  return (
    <AttendanceFlowLayout
      title="Chấm công vào"
      currentStep={flow.step}
      steps={[
        "Vị trí",
        "Khuôn mặt",
        "Xác nhận",
      ]}
    >
      {flow.step === 0 && (
        <LocationStep
          locations={locations}
          selectedLocation={flow.location}
          onSelect={flow.setLocation}
          onNext={flow.nextLocation}
        />
      )}

      {flow.step === 1 && (
        <FaceStep
          onBack={flow.back}
          onNext={flow.nextFace}
        />
      )}

      {flow.step === 2 && (
        <ConfirmStep
          mode="check-in"
          location={flow.location}
          latitude={flow.latitude}
          longitude={flow.longitude}
          faceImage={flow.faceImage}
          isSubmitting={flow.isSubmitting}
          error={flow.submitError}
          onBack={flow.back}
          onSubmit={flow.submit}
        />
      )}
    </AttendanceFlowLayout>
  );
}