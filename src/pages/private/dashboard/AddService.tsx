import { motion } from "motion/react";
import {
  Plus,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useServices } from "../../../components/services/useServices";

export default function AddService() {
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const {
    createService,
    loading,
    error,
    success,
  } = useServices();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const serviceCreated = await createService({
      Nombre_del_servicio: serviceName.trim(),
      monto: Number(amount),
      fecha_vencimiento: dueDate,
    });

    if (serviceCreated) {
      setServiceName("");
      setAmount("");
      setDueDate("");
    }
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
        className="mx-auto w-full max-w-2xl"
      >
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Agregar Servicio
          </h1>

          <p className="mt-2 opacity-70">
            Registrá un nuevo servicio en AtomPay.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-lg dark:bg-[#3E432E]"
        >
          <div className="space-y-6">

            {/* NOMBRE */}

            <div>
              <label
                htmlFor="serviceName"
                className="mb-2 block text-sm font-semibold"
              >
                Nombre del servicio
              </label>

              <input
                id="serviceName"
                type="text"
                value={serviceName}
                onChange={(event) =>
                  setServiceName(event.target.value)
                }
                placeholder="Ej: Internet"
                className="w-full rounded-xl border border-[#CDE8E5] bg-white px-4 py-3 outline-none transition focus:border-[#4D869C] dark:border-[#616F39] dark:bg-black"
                required
                disabled={loading}
              />
            </div>

            {/* MONTO */}

            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-semibold"
              >
                Monto
              </label>

              <input
                id="amount"
                type="number"
                min="0"
                step="1"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="Ej: 18500"
                className="w-full rounded-xl border border-[#CDE8E5] bg-white px-4 py-3 outline-none transition focus:border-[#4D869C] dark:border-[#616F39] dark:bg-black"
                required
                disabled={loading}
              />
            </div>

            {/* FECHA */}

            <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block text-sm font-semibold"
              >
                Fecha de vencimiento
              </label>

              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                className="w-full rounded-xl border border-[#CDE8E5] bg-white px-4 py-3 outline-none transition focus:border-[#4D869C] dark:border-[#616F39] dark:bg-black"
                required
                disabled={loading}
              />
            </div>

            {/* ERROR */}

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="flex items-center gap-3 rounded-xl bg-red-100 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
              >
                <AlertCircle
                  size={20}
                  className="shrink-0"
                />

                <span>
                  No se pudo crear el servicio: {error}
                </span>
              </motion.div>
            )}

            {/* SUCCESS */}

            {success && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="flex items-center gap-3 rounded-xl bg-[#CDE8E5] p-4 text-sm text-[#4D869C] dark:bg-[#616F39] dark:text-[#A7D129]"
              >
                <CheckCircle
                  size={20}
                  className="shrink-0"
                />

                <span>
                  Servicio agregado correctamente.
                </span>
              </motion.div>
            )}

            {/* BUTTON */}

            <motion.button
              type="submit"
              whileHover={{
                scale: loading ? 1 : 1.02,
              }}
              whileTap={{
                scale: loading ? 1 : 0.98,
              }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4D869C] px-5 py-3 font-semibold text-white transition hover:bg-[#7AB2B2] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#616F39]"
            >
              <Plus size={20} />

              {loading
                ? "Agregando..."
                : "Agregar servicio"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}