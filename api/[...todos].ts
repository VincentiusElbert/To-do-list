import { createServer } from "../server";

// Reuse a single Express instance across invocations
const app = createServer();

export default function handler(req: any, res: any) {
  // Delegate to Express (supports both /api/todos and plain /todos via mounted apps)
  (app as any)(req, res);
}
