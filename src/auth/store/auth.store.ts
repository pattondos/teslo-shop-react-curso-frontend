import type { User } from '@/interfaces/user.interface'
import { create } from 'zustand'
import { loginAction } from '../actions/login.action'
import { checkAuthAction } from '../actions/check-auth.action';

type AuthStatus = 'authenticated' | 'non-authenticated' | 'checking';

type AuthState = {
    user: User | null;
    token: string | null;
    authStatus: AuthStatus;

    isAdmin: () => boolean;

    login: ( email: string, password: string ) => Promise<boolean>;
    logout: () => void;
    checkAuthStatus: () => Promise<boolean>;

}

export const useAuthStore = create<AuthState>()((set, get) => ({

    user: null,
    token: null,
    authStatus: 'checking',

    isAdmin: () => {
        const role = get().user?.roles ?? [];

        return role.includes('admin');
    },
 
    login: async (email: string, password: string ) => {
        try {
            const data = await loginAction(email, password);
    
            localStorage.setItem('token', data.token);
            set({ user: data.user, token: data.token, authStatus:'authenticated' });
            
            return true;
        } catch (error) {
            set({ user: null, token: null, authStatus: 'non-authenticated' });
            localStorage.removeItem('token');
            console.log(error)
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, authStatus:'non-authenticated' });
    },

    checkAuthStatus: async() => {
        try {
            const { user, token } = await checkAuthAction();
            set({
                user,
                token,
                authStatus: 'authenticated'
            });
            return true;

        } catch (error) {
            console.error(error);
            set({
                user: undefined,
                token: undefined,
                authStatus: 'non-authenticated'
            });

            return false;
        }
    }

}))
