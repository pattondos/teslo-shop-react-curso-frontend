import { RouterProvider } from "react-router"
import { appRouter } from "./router/app.router"

import { QueryClientProvider, QueryClient, useQuery } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import type { PropsWithChildren } from "react"
import { CustomFullScreenLoading } from "./components/custom/CustomFullScreenLoading"
import { useAuthStore } from "./auth/store/auth.store"

const queryClient= new QueryClient();

const CheckAuthProvider = ( {children}: PropsWithChildren) => {
    const { checkAuthStatus } = useAuthStore();
    
    const { isLoading } = useQuery({
        queryKey: ['auth'],
        queryFn: checkAuthStatus,
        retry: false,
        refetchInterval: 1000 * 60 * 1.5,
        refetchOnWindowFocus: true,
    });

    if(isLoading) return <CustomFullScreenLoading />

    return children;
};

export const TesloShopApp = () => {

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />

            {/* cUSTOM PROVIDER */}
            <CheckAuthProvider>
                <RouterProvider router={appRouter} /> 
            </CheckAuthProvider>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default TesloShopApp;
