import type { AttendanceStatus } from "@/shared/types/attendance";
import type { Role } from "@/shared/types/role";

export interface Profile {
  employee_id: string;
  employee_code: string;
  full_name: string;
  department: string;
  role: Role;
  manager: string | null;
  work_shift: {
    name: string;
    start_time: string;
    end_time: string;
    allow_checkin_before_minutes: number;
  };

  face: {
    registered: boolean;
    avatar_url: string | null;
  };
}



