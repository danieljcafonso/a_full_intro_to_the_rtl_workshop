import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "../context/AuthContext";

const customRender = (ui, { ...options } = {}) => {
  const queryClient = new QueryClient({
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
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  };
  return render(ui, { wrapper: CombinedProviders, ...options });
};

export * from "@testing-library/react";
export { customRender as render };
