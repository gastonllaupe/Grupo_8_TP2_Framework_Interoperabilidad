import { useState } from "react";

export interface Service {
  id: number;
  documentId: string;
  Nombre_del_servicio: string;
  monto: number;
  fecha_vencimiento: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface ServiceInput {
  Nombre_del_servicio: string;
  monto: number;
  fecha_vencimiento: string;
}

interface ServicesResponse {
  data: Service[];
}

interface ServiceResponse {
  data: Service;
}

const API_URL = "http://localhost:1337/api/servicios";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // =========================
  // OBTENER SERVICIOS
  // =========================

  const getServices = async (): Promise<Service[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result: ServicesResponse =
        await response.json();

      setServices(result.data);

      return result.data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error desconocido";

      setError(message);

      return [];
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREAR SERVICIO
  // =========================

  const createService = async (
    service: ServiceInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: service,
        }),
      });

      if (!response.ok) {
        let message = `Error HTTP: ${response.status}`;

        try {
          const errorData = await response.json();

          if (errorData?.error?.message) {
            message = errorData.error.message;
          }
        } catch {
          // La respuesta no contiene JSON.
        }

        throw new Error(message);
      }

      const result: ServiceResponse =
        await response.json();

      setServices((current) => [
        ...current,
        result.data,
      ]);

      setSuccess(true);

      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido"
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // MODIFICAR SERVICIO
  // =========================

  const updateService = async (
    documentId: string,
    service: ServiceInput
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `${API_URL}/${documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: service,
          }),
        }
      );

      if (!response.ok) {
        let message = `Error HTTP: ${response.status}`;

        try {
          const errorData = await response.json();

          if (errorData?.error?.message) {
            message = errorData.error.message;
          }
        } catch {
          // La respuesta no contiene JSON.
        }

        throw new Error(message);
      }

      const result: ServiceResponse =
        await response.json();

      setServices((current) =>
        current.map((currentService) =>
          currentService.documentId === documentId
            ? result.data
            : currentService
        )
      );

      setSuccess(true);

      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido"
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ELIMINAR SERVICIO
  // =========================

  const deleteService = async (
    documentId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `${API_URL}/${documentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let message = `Error HTTP: ${response.status}`;

        try {
          const errorData = await response.json();

          if (errorData?.error?.message) {
            message = errorData.error.message;
          }
        } catch {
          // La respuesta no contiene JSON.
        }

        throw new Error(message);
      }

      setServices((current) =>
        current.filter(
          (service) =>
            service.documentId !== documentId
        )
      );

      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido"
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    loading,
    error,
    success,
    getServices,
    createService,
    updateService,
    deleteService,
  };
}