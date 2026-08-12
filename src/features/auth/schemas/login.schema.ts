import { z } from "zod";

export const loginSchema = z.object({
  employee_code: z
    .string()
    .min(1, "Vui lòng nhập mã nhân viên"),

  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu"),
});

export type LoginForm = z.infer<typeof loginSchema>;