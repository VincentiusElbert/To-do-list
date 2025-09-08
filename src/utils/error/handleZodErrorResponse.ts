import { Response } from "express";
import { ZodError } from "zod";

export function handleZodErrorResponse(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    const issues = error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return res.status(400).json({ error: "ValidationError", issues });
  }
  return res.status(500).json({ error: "InternalServerError" });
}
