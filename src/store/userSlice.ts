import { createSlice, createAsyncThunk, PayloadAction, AnyAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { authService } from '../api/services/auth.service';
import { User, AuthResponse } from '../api/types';
import { RootState } from './index';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  access: string | null;
  refresh: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  access: localStorage.getItem('token'),
  refresh: localStorage.getItem('refresh'),
};

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  'user/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }: { rejectWithValue: (value: string) => void }
  ) => {
    try {
      const res: AuthResponse = await authService.login(email, password);
      localStorage.setItem('token', res.access);
      localStorage.setItem('refresh', res.refresh);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.detail || 'Ошибка авторизации');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'user/fetchCurrentUser',
  async (
    _: void,
    { rejectWithValue }: { rejectWithValue: (value: string) => void }
  ) => {
    try {
      return await authService.getCurrentUser();
    } catch (err: any) {
      return rejectWithValue('Ошибка загрузки пользователя');
    }
  }
);

export const refresh = createAsyncThunk<
  string,
  void,
  { state: RootState; rejectValue: string }
>(
  'user/refresh',
  async (
    _: void,
    { getState, rejectWithValue }: { getState: () => RootState; rejectWithValue: (value: string) => void }
  ) => {
    try {
      const state = getState();
      const refreshToken = state.user.refresh || localStorage.getItem('refresh');
      if (!refreshToken) throw new Error('Нет refresh токена');
      const res = await authService.refreshToken(refreshToken);
      localStorage.setItem('token', res.access);
      return res.access;
    } catch (err) {
      return rejectWithValue('Ошибка обновления токена');
    }
  }
);

export const logout = createAsyncThunk<
  null,
  void
>('user/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh');
  return null;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
    builder
      .addCase(login.pending, (state: UserState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state: UserState, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.error = null;
      })
      .addCase(login.rejected, (state: UserState, action: AnyAction) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(fetchCurrentUser.pending, (state: UserState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state: UserState, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state: UserState, action: AnyAction) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(refresh.fulfilled, (state: UserState, action: PayloadAction<string>) => {
        state.access = action.payload;
      })
      .addCase(logout.fulfilled, (state: UserState) => {
        state.user = null;
        state.isAuthenticated = false;
        state.access = null;
        state.refresh = null;
        state.error = null;
      });
  },
});

export default userSlice.reducer; 