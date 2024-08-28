// src/hooks/useUserHooks.ts
import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import apiClient from '@/lib/apiClient';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import {
  ConfirmRegistrationRequest,
  ConfirmRegistrationResponse,
  ConfirmResetPasswordRequest,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RegisterUserRequest,
  RegisterUserResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/types/datatypes';

export const useRegisterUser = (): UseMutationResult<
  RegisterUserResponse,
  unknown,
  RegisterUserRequest
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: RegisterUserRequest) =>
      apiClient.post<RegisterUserResponse>('/api/v1/register', data).then((response) => response.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
      },
      onError: (error) => {
        console.error('Error during registration:', error);
      },
    }
  );
};

export const useConfirmRegistration = (): UseMutationResult<
  ConfirmRegistrationResponse,
  unknown,
  ConfirmRegistrationRequest
> => {
  return useMutation(
    (data: ConfirmRegistrationRequest) => {
      return apiClient
        .post<ConfirmRegistrationResponse>('/api/v1/register/confirm', data)
        .then((response) => response.data)
        .catch((error) => {
          console.error('API Error:', error.response?.status, error.response?.data);
          throw error;
        });
    },
    {
      onSuccess: (data) => {
        console.log('Registration confirmed successfully:', data);
      },
      onError: (error: any) => {
        console.error('Error during confirmation:', error.message);
        console.error('Error details:', error.response?.data);
      },
    }
  );
};

export const useLoginUser = (): UseMutationResult<LoginResponse, unknown, LoginRequest> => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: LoginRequest) => {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (!result?.ok) {
        throw new Error('Failed to sign in');
      }

      const session = await getSession();
      if (!session?.user) {
        throw new Error('Failed to get user session');
      }

      return {
        accessToken: session.accessToken!,
        userId: session.user.id!,
        email: session.user.email!,
        role: session.user.role!,
      };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
      },
      onError: (error: any) => {
        console.error('Error during login:', error.message);
      },
    }
  );
};

export const useLogoutUser = (): UseMutationResult<void, unknown, LogoutRequest> => {
  return useMutation(
    (data: LogoutRequest) =>
      apiClient.post('/api/v1/logout', { token: data.token }).then((response) => {
        signOut({ redirect: false });
        return response.data;
      }),
    {
      onSuccess: () => {
        console.log('Logged out successfully');
      },
      onError: (error: any) => {
        console.error('Error during logout:', error.message);
      },
    }
  );
};

export const saveEmailToBackend = async (email: string) => {
  return await apiClient.post('/api/v1/save-email', { email });
};

export const useRequestPasswordReset = (): UseMutationResult<
  ResetPasswordResponse,
  unknown,
  ResetPasswordRequest
> => {
  return useMutation(
    (data: ResetPasswordRequest) => {
      return apiClient
        .post<ResetPasswordResponse>('/api/v1/reset-password/request', data)
        .then((response) => response.data)
        .catch((error) => {
          console.error('API Error during password reset request:', error.response?.status, error.response?.data);
          throw error;
        });
    },
    {
      onSuccess: (data) => {
        console.log('Password reset email sent successfully:', data);
      },
      onError: (error: any) => {
        console.error('Error during password reset request:', error.message);
        console.error('Error details:', error.response?.data);
      },
    }
  );
};

export const useConfirmPasswordReset = (): UseMutationResult<
  ResetPasswordResponse,
  unknown,
  ConfirmResetPasswordRequest
> => {
  return useMutation(
    (data: ConfirmResetPasswordRequest) => {
      return apiClient.post<ResetPasswordResponse>('/api/v1/reset-password/confirm', data)
      .then((response) => response.data)
      .catch((error) => {
        console.error('API Error during password reset confirmation:', error.response?.status, error.response?.data);
        throw error;
      });
    },
    {
      onSuccess: (data) => {
        console.log('Password reset confirmed successfully:', data);
      },
      onError: (error: any) => {
        console.error('Error during password reset confirmation:', error.message);
        console.error('Error details:', error.response?.data);
      }
    }
  )
}

export const useUser = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const loggedIn = status === 'authenticated';
  return {
    session,
    loading,
    loggedIn,
  };
};
