// Export all services from a single entry point
export { authService } from './authService';
export { clientService } from './clientService';
export { kridiService } from './kridiService';
export { storeService } from './storeService';
export { userService } from './userService';
export { apiClient, tokenManager } from './api';

// Export types
export type { LoginCredentials, RegisterData, AuthResponse } from './authService';
export type { Client, ClientBalance, ClientWithBalance } from './clientService';
export type { KridiEntry } from './kridiService';
export type { Store, CreateStoreData, UpdateStoreData } from './storeService';
export type { User, CreateUserData, UpdateUserData } from './userService';