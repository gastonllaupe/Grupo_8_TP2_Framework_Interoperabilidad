import { useEffect, useState } from "react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Bill {
  id: number;
  documentId?: string;
  Bill_id?: string;
  name?: string;
  amount?: number;
  expiracy_date?: string;
}

interface StrapiResponse {
  data: Bill[];
}

export function Bills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch(
          "http://localhost:1337/api/bills"
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const result: StrapiResponse = await response.json();

        setBills(result.data);
      } catch (error) {
        console.error("Error obteniendo Bills:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Error desconocido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return (
      <tr>
        <td
          colSpan={4}
          className="px-6 py-10 text-center opacity-70"
        >
          Cargando facturas...
        </td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr>
        <td
          colSpan={4}
          className="px-6 py-10 text-center text-red-500"
        >
          Error: {error}
        </td>
      </tr>
    );
  }

  if (bills.length === 0) {
    return (
      <tr>
        <td
          colSpan={4}
          className="px-6 py-10 text-center opacity-70"
        >
          No hay facturas.
        </td>
      </tr>
    );
  }

  const getStatus = (expirationDate?: string) => {
    if (!expirationDate) {
      return "Sin fecha";
    }

    const today = new Date();
    const expiration = new Date(expirationDate);

    return expiration < today ? "Vencida" : "Pendiente";
  };

  return (
    <>
      {bills.map((bill) => {
        const status = getStatus(bill.expiracy_date);

        return (
          <tr
            key={bill.id}
            className="border-b border-[#CDE8E5] transition-colors hover:bg-[#EEF7FF] last:border-0 dark:border-[#616F39] dark:hover:bg-[#353a28]"
          >
            {/* Servicio */}
            <td className="px-6 py-5">
              <div className="flex flex-col">
                <span className="font-semibold">
                  {bill.name ?? `Bill #${bill.id}`}
                </span>

                <span className="mt-1 text-xs opacity-50">
                  Factura #{bill.Bill_id ?? bill.id}
                </span>
              </div>
            </td>

            {/* Fecha */}
            <td className="px-6 py-5 opacity-70">
              {bill.expiracy_date
                ? new Date(
                    `${bill.expiracy_date}T00:00:00`
                  ).toLocaleDateString("es-AR")
                : "-"}
            </td>

            {/* Monto */}
            <td className="px-6 py-5 font-semibold">
              {bill.amount !== undefined
                ? new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  }).format(bill.amount)
                : "-"}
            </td>

            {/* Estado */}
            <td className="px-6 py-5">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
                  status === "Pendiente"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : status === "Vencida"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {status === "Pendiente" && (
                  <Clock size={15} />
                )}

                {status === "Vencida" && (
                  <AlertCircle size={15} />
                )}

                {status === "Sin fecha" && (
                  <AlertCircle size={15} />
                )}

                {status}
              </span>
            </td>
          </tr>
        );
      })}
    </>
  );
}