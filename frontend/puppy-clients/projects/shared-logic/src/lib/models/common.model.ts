/**
 * Common API Response types
 */

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Gender Entity
 */
export interface Gender {
  id: string;
  name: string;
  description?: string;
}

/**
 * Kind Entity (Pet Type)
 */
export interface Kind {
  id: string;
  name: string;
  description?: string;
}

/**
 * Race Entity
 */
export interface Race {
  id: string;
  name: string;
  kindId: string;
}
