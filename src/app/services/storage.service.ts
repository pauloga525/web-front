import { Injectable } from '@angular/core';

/**
 * Servicio seguro para acceso a localStorage
 * Maneja errores en navegadores con modo privado y protecciones de privacidad
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly isStorageAvailable: boolean = this.checkStorageAvailable();

  private checkStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene un valor del localStorage
   */
  getItem(key: string): string | null {
    if (!this.isStorageAvailable) {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  /**
   * Establece un valor en localStorage
   */
  setItem(key: string, value: string): void {
    if (!this.isStorageAvailable) {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silenciosamente ignorar errores (modo privado, cuota excedida, etc.)
    }
  }

  /**
   * Elimina un valor del localStorage
   */
  removeItem(key: string): void {
    if (!this.isStorageAvailable) {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch {
      // Silenciosamente ignorar errores
    }
  }

  /**
   * Obtiene un valor parseado como JSON
   */
  getJSON<T>(key: string, defaultValue: T | null = null): T | null {
    const item = this.getItem(key);
    if (!item) {
      return defaultValue;
    }
    try {
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Establece un valor como JSON
   */
  setJSON(key: string, value: unknown): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch {
      // Silenciosamente ignorar errores
    }
  }
}
