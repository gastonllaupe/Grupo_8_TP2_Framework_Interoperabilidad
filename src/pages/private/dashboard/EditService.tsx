import { motion } from "motion/react";
import {
  Pencil,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useServices } from "../../../components/services/useServices";

export default function EditService() {
  const {
    services,
    loading,
    error,
    success,
    getServices,
    updateService,
    deleteService,
  } = useServices();

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    getServices();
  }, []);

  // =========================
  // FORMATEAR FECHA
  // =========================

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("es-AR");
  };

  // =========================
  // FORMATEAR MONTO
  // =========================

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // =========================
  // ABRIR EDICIÓN
  // =========================

  const handleEdit = (
    documentId: string
  ) => {
    const service = services.find(
      (item) =>
        item.documentId === documentId
    );

    if (!service) return;

    setEditingId(service.documentId);
    setServiceName(
      service.Nombre_del_servicio
    );
    setAmount(String(service.monto));
    setDueDate(
      service.fecha_vencimiento
    );
  };

  // =========================
  // CANCELAR EDICIÓN
  // =========================

  const handleCancelEdit = () => {
    setEditingId(null);
    setServiceName("");
    setAmount("");
    setDueDate("");
  };

  // =========================
  // GUARDAR CAMBIOS
  // =========================

  const handleUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editingId) return;

    const updated = await updateService(
      editingId,
      {
        Nombre_del_servicio:
          serviceName.trim(),
        monto: Number(amount),
        fecha_vencimiento: dueDate,
      }
    );

    if (updated) {
      handleCancelEdit();
    }
  };

  // =========================
  // ELIMINAR
  // =========================

  const handleDelete = async (
    documentId: string,
    name: string
  ) => {
    const confirmed = window.confirm(
      `¿Querés eliminar el servicio "${name}"?`
    );

    if (!confirmed) return;

    setDeletingId(documentId);

    await deleteService(documentId);

    setDeletingId(null);

    if (editingId === documentId) {
      handleCancelEdit();
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
        className="mx-auto w-full max-w-6xl"
      >
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Modificar / Eliminar Servicio
          </h1>

          <p className="mt-2 opacity-70">
            Administrá los servicios que tenés
            registrados.
          </p>
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
            className="mb-6 flex items-center gap-3 rounded-xl bg-red-100 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
          >
            <AlertCircle
              size={20}
              className="shrink-0"
            />

            <span>
              Ocurrió un error: {error}
            </span>
          </motion.div>
        )}

        {/* SUCCESS */}

        {success && !editingId && (
          <motion.div
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 flex items-center gap-3 rounded-xl bg-[#CDE8E5] p-4 text-sm text-[#4D869C] dark:bg-[#616F39] dark:text-[#A7D129]"
          >
            <CheckCircle
              size={20}
              className="shrink-0"
            />

            <span>
              Cambios guardados correctamente.
            </span>
          </motion.div>
        )}

        {/* EDIT FORM */}

        {editingId && (
          <motion.form
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            onSubmit={handleUpdate}
            className="mb-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-[#3E432E]"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Editar servicio
                </h2>

                <p className="mt-1 text-sm opacity-70">
                  Modificá los datos del servicio.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl p-2 transition hover:bg-[#EEF7FF] dark:hover:bg-black/30"
                aria-label="Cancelar edición"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-3">

              {/* NOMBRE */}

              <div>
                <label
                  htmlFor="editServiceName"
                  className="mb-2 block text-sm font-semibold"
                >
                  Nombre del servicio
                </label>

                <input
                  id="editServiceName"
                  type="text"
                  value={serviceName}
                  onChange={(event) =>
                    setServiceName(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#CDE8E5] bg-white px-4 py-3 outline-none transition focus:border-[#4D869C] dark:border-[#616F39] dark:bg-black"
                  required
                  disabled={loading}
                />
              </div>

              {/* MONTO */}

              <div>
                <label
                  htmlFor="editAmount"
                  className="mb-2 block text-sm font-semibold"
                >
                  Monto
                </label>

                <input
                  id="editAmount"
                  type="number"
                  min="0"
                  step="1"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#CDE8E5] bg-white px-4 py-3 outline-none transition focus:border-[#4D869C] dark:border-[#616F39] dark:bg-black"
                  required
                  disabled={loading}
                />
              </div>

              {/* FECHA */}

              <div>
                <label
                  htmlFor="editDueDate"
                  className="mb-2 block text-sm font-semibold"
                >
                  Fecha de vencimiento
                </label>

                <input
                  id="editDueDate"
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#CDE8E5] bg-white px-4 py-3 outline-none transition focus:border-[#4D869C] dark:border-[#616F39] dark:bg-black"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex gap-3">
              <motion.button
                type="submit"
                whileHover={{
                  scale: loading ? 1 : 1.02,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.98,
                }}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4D869C] px-5 py-3 font-semibold text-white transition hover:bg-[#7AB2B2] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#616F39]"
              >
                <CheckCircle size={19} />

                {loading
                  ? "Guardando..."
                  : "Guardar cambios"}
              </motion.button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                className="rounded-xl border border-[#CDE8E5] px-5 py-3 font-semibold transition hover:bg-[#EEF7FF] disabled:opacity-50 dark:border-[#616F39] dark:hover:bg-black/30"
              >
                Cancelar
              </button>
            </div>
          </motion.form>
        )}

        {/* LOADING */}

        {loading && services.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-lg dark:bg-[#3E432E]">
            <p className="opacity-70">
              Cargando servicios...
            </p>
          </div>
        )}

        {/* SERVICES */}

        {!loading && services.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <motion.div
                key={service.documentId}
                layout
                className="rounded-2xl bg-white p-6 shadow-lg dark:bg-[#3E432E]"
              >
                {/* SERVICE INFO */}

                <div className="mb-5">
                  <h2 className="text-xl font-bold">
                    {service.Nombre_del_servicio}
                  </h2>

                  <p className="mt-2 text-2xl font-semibold">
                    {formatAmount(service.monto)}
                  </p>

                  <p className="mt-2 text-sm opacity-70">
                    Vencimiento:{" "}
                    {formatDate(
                      service.fecha_vencimiento
                    )}
                  </p>
                </div>

                {/* ACTIONS */}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(
                        service.documentId
                      )
                    }
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#CDE8E5] px-4 py-3 font-medium transition hover:bg-[#EEF7FF] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#616F39] dark:hover:bg-black/30"
                  >
                    <Pencil size={18} />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        service.documentId,
                        service.Nombre_del_servicio
                      )
                    }
                    disabled={
                      loading ||
                      deletingId ===
                        service.documentId
                    }
                    className="flex items-center justify-center rounded-xl border border-red-200 px-4 py-3 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
                    aria-label={`Eliminar ${service.Nombre_del_servicio}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* EMPTY */}

        {!loading && services.length === 0 && !error && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-lg dark:bg-[#3E432E]">
            <p className="opacity-70">
              No tenés servicios registrados.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}