import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "../context/AuthContext";
import { SnackbarProvider } from "notistack";

const customRender = (ui, { ...options } = {}) => {
  const queryClient = new QueryClient({
    logger: {
      log: console.log,
      warn: console.warn,
      error: process.env.NODE_ENV === "test" ? () => {} : console.error,
    },
    defaultOptions: {
      queries: {
        retry: 0,
        staleTime: Infinity,
      },
    },
  });

  const CombinedProviders = ({ children }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <AuthProvider>{children}</AuthProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    );
  };
  return render(ui, { wrapper: CombinedProviders, ...options });
};

export * from "@testing-library/react";
export { customRender as render };
