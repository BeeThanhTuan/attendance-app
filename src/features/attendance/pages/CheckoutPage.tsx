import {Loader2} from "lucide-react";
import { useLocations } from "../hooks/useLocations";
import { useCheckOutFlow } from "../hooks/useCheckOutFlow";

import AttendanceFlowLayout from "../layouts/AttendanceFlowLayout";
import LocationStep from "../components/steps/LocationStep";
import FaceStep from "../components/steps/FaceStep";
import ConfirmStep from "../components/steps/ConfirmStep";
import Success from "../components/status/Success";

export default function CheckOutPage() {
  const flow = useCheckOutFlow();
  const { data: locations = [] } = useLocations();

  if (flow.isSuccess) {
    return (
      <Success />
    );
  }

  if (flow.isLoadingData) {
    return (
      <div className="flex h-dvh items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
          <Loader2 className="size-5 animate-spin text-primary" />
          Đang tải dữ liệu chấm công...
        </div>
      </div>
    );
  }

  return (
    <AttendanceFlowLayout
      title="Chấm công ra"
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
          disableSelector={true}
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
          mode="check-out"
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
