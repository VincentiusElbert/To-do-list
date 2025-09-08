import { QueryClient } from "@tanstack/react-query";

// Singleton QueryClient to be reused across the app and any nested providers
export const queryClient = new QueryClient();
