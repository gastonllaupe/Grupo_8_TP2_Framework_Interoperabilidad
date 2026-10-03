import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

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

export default function Billing() {
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

        const result: StrapiResponse =
          await response.json();

        setBills(result.data);
      } catch (error) {
        console.error("Error obteniendo bills:", error);

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

  const getStatus = (date?: string) => {
    if (!date) return "Sin fecha";

    const today = new Date();
    const expiration = new Date(`${date}T00:00:00`);

    if (expiration < today) {
      return "Vencida";
    }

    return "Pendiente";
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("es-AR");
  };

  const formatAmount = (amount?: number) => {
    if (amount === undefined) return "-";

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#EEF7FF] p-6 text-[#4D869C] dark:bg-black dark:text-white md:p-10">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="mx-auto w-full max-w-6xl"
      >
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Facturación
          </h1>

          <p className="mt-2 opacity-70">
            Consultá tus facturas y el estado de tus
            pagos.
          </p>
        </div>

        {/* CARD */}

        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-[#3E432E]">

          {/* CARD HEADER */}

          <div className="border-b border-[#CDE8E5] p-6 dark:border-[#616F39]">
            <h2 className="text-xl font-bold">
              Facturas recientes
            </h2>
          </div>

          {/* TABLE */}

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">

              <thead>
                <tr className="border-b border-[#CDE8E5] dark:border-[#616F39]">

                  <th className="w-[35%] px-6 py-4 text-left">
                    Servicio
                  </th>

                  <th className="w-[20%] px-6 py-4 text-left">
                    Vencimiento
                  </th>

                  <th className="w-[20%] px-6 py-4 text-left">
                    Monto
                  </th>

                  <th className="w-[25%] px-6 py-4 text-left">
                    Estado
                  </th>

                </tr>
              </thead>

              <tbody>

                {/* LOADING */}

                {loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center"
                    >
                      Cargando facturas...
                    </td>
                  </tr>
                )}

                {/* ERROR */}

                {!loading && error && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-red-500"
                    >
                      Error: {error}
                    </td>
                  </tr>
                )}

                {/* EMPTY */}

                {!loading &&
                  !error &&
                  bills.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center opacity-70"
                      >
                        No hay facturas.
                      </td>
                    </tr>
                  )}

                {/* BILLS */}

                {!loading &&
                  !error &&
                  bills.map((bill) => {
                    const status = getStatus(
                      bill.expiracy_date
                    );

                    return (
                      <tr
                        key={bill.id}
                        className="border-b border-[#CDE8E5] last:border-0 hover:bg-[#EEF7FF] dark:border-[#616F39] dark:hover:bg-[#353a28]"
                      >

                        {/* SERVICIO */}

                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {bill.name ??
                                `Bill #${bill.id}`}
                            </span>

                            <span className="mt-1 text-xs opacity-50">
                              Factura #
                              {bill.Bill_id ??
                                bill.id}
                            </span>
                          </div>
                        </td>

                        {/* FECHA */}

                        <td className="px-6 py-5">
                          <span className="opacity-70">
                            {formatDate(
                              bill.expiracy_date
                            )}
                          </span>
                        </td>

                        {/* MONTO */}

                        <td className="px-6 py-5">
                          <span className="font-semibold">
                            {formatAmount(
                              bill.amount
                            )}
                          </span>
                        </td>

                        {/* ESTADO */}

                        <td className="px-6 py-5">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              px-3
                              py-1.5
                              text-sm
                              font-medium
                              whitespace-nowrap

                              ${
                                status ===
                                "Pendiente"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : status ===
                                    "Vencida"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                              }
                            `}
                          >
                            {status ===
                              "Pendiente" && (
                              <Clock size={15} />
                            )}

                            {status ===
                              "Vencida" && (
                              <AlertCircle
                                size={15}
                              />
                            )}

                            {status ===
                              "Sin fecha" && (
                              <AlertCircle
                                size={15}
                              />
                            )}

                            {status}
                          </span>

                        </td>

                      </tr>
                    );
                  })}

              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER INFO */}

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-5 shadow-lg dark:bg-[#3E432E]">

          <AlertCircle size={22} />

          <p className="text-sm opacity-70">
            Los datos mostrados corresponden a las
            facturas obtenidas desde el servidor.
          </p>

        </div>
      </motion.div>
    </div>
  );
}