import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Company, KYCDocument } from '../types';

interface AppState {
  user: User | null;
  currentStep: string;
  kycDocuments: KYCDocument[];
  isLoading: boolean;
  error: string | null;
  demoMode: boolean;
  language: 'en' | 'dz';
  theme: 'light' | 'dark';
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CURRENT_STEP'; payload: string }
  | { type: 'ADD_KYC_DOCUMENT'; payload: KYCDocument }
  | { type: 'UPDATE_KYC_DOCUMENT'; payload: { id: string; updates: Partial<KYCDocument> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_DEMO_MODE' }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'dz' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'RESET_APPLICATION' };

const initialState: AppState = {
  user: null,
  currentStep: 'welcome',
  kycDocuments: [],
  isLoading: false,
  error: null,
  demoMode: false,
  language: 'en',
  theme: 'light',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'ADD_KYC_DOCUMENT':
      return { ...state, kycDocuments: [...state.kycDocuments, action.payload] };
    case 'UPDATE_KYC_DOCUMENT':
      return {
        ...state,
        kycDocuments: state.kycDocuments.map(doc =>
          doc.id === action.payload.id ? { ...doc, ...action.payload.updates } : doc
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_DEMO_MODE':
      return { ...state, demoMode: !state.demoMode };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'RESET_APPLICATION':
      return { ...initialState, demoMode: state.demoMode, language: state.language, theme: state.theme };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('bhutan_user');
    const savedTheme = localStorage.getItem('bhutan_theme') as 'light' | 'dark' | null;
    const savedLanguage = localStorage.getItem('bhutan_language') as 'en' | 'dz' | null;
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        console.error('Failed to load user from localStorage:', error);
      }
    }

    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }

    if (savedLanguage) {
      dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
    }
  }, []);

  useEffect(() => {
    // Save user to localStorage when user changes
    if (state.user) {
      localStorage.setItem('bhutan_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('bhutan_user');
    }
  }, [state.user]);

  useEffect(() => {
    // Save theme to localStorage and apply to document
    localStorage.setItem('bhutan_theme', state.theme);
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('bhutan_language', state.language);
  }, [state.language]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};