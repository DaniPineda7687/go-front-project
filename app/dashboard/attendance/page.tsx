'use client';

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importar idioma español
import { get, post, del } from "@/lib/api";
import { useLoader } from "@/context/LoaderContext";
import {useAlert} from "@/context/AlertContext";
dayjs.locale("es"); // Configurar Day.js para español

const GymAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [showPopup, setShowPopup] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { showLoader, hideLoader } = useLoader();
    const { showAlert } = useAlert();
  const fetchAttendances = async () => {
    showLoader();
    try {
      const result = await get("/attendance/get");
      setAttendance(result.data);
    } catch (error:any) {
      console.error("Error al cargar las asistencias:", error);
      showAlert(
        error?.response?.data || "Ocurrió un error al guardar la rutina."
      , "error");
    }finally{
        hideLoader();
        }

  };

  const handleAttendance = async () => {
    showLoader();
    try {
      const newAttendance = {
        date: dayjs(selectedDate).format("YYYY-MM-DDTHH:mm:ssZ"),
      };
      await post("/attendance/add", newAttendance);
      showAlert("Asistencia registrada con éxito", "success");
      fetchAttendances();
      setShowPopup(false);
    } catch (error:any) {
      console.error("Error al registrar la asistencia:", error);
      showAlert(
        error?.response?.data || "Ocurrió un error al guardar la rutina."
      , "error");

    }finally{
        hideLoader();
        }
  };

  const handleDeleteAttendance = async () => {
    showLoader();
    try {
      const entry = attendance.find((entry: any) =>
        dayjs(entry.date).format("YYYY-MM-DD") === selectedDate
      );
      if (!entry) return;

      await del("/attendance/del", { attendance_id: entry._id });
      showAlert("Asistencia eliminada con éxito", "success");
      fetchAttendances();
      setShowPopup(false);
    } catch (error:any) {
      console.error("Error al eliminar la asistencia:", error);
      showAlert(
        error?.response?.data || "Ocurrió un error al guardar la rutina."
      , "error");
    }finally{
        hideLoader();
        }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    const isDayRegistered = attendance.some(
      (entry: any) => dayjs(entry.date).format("YYYY-MM-DD") === date
    );
    setIsRegistered(isDayRegistered);
    setShowPopup(true);
  };

  const renderCalendar = () => {
    const daysInMonth = dayjs(selectedDate).daysInMonth();
    const startOfMonth = dayjs(selectedDate).startOf("month");
    const dayOfWeekOffset = startOfMonth.day();
    const calendarDays = [];

    for (let i = 0; i < dayOfWeekOffset; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }

    for (let i = 0; i < daysInMonth; i++) {
      const date = startOfMonth.add(i, "day").format("YYYY-MM-DD");
      const isActive = attendance.some((entry: any) =>
        dayjs(entry.date).format("YYYY-MM-DD") === date
      );

      calendarDays.push(
        <button
          key={date}
          className={`p-2 w-10 h-10 rounded-md ${
            isActive ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700"
          } hover:bg-gray-200`}
          onClick={() => handleDayClick(date)}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div>
        <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-600 mb-2">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
            <div key={day} className="w-10 h-10">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{calendarDays}</div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-6">Registro de Asistencia</h1>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() =>
              setSelectedDate(dayjs(selectedDate).subtract(1, "month").format("YYYY-MM-DD"))
            }
            className="text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            &lt; Mes Anterior
          </button>
          <h2 className="text-lg font-semibold text-gray-700">
            {dayjs(selectedDate).format("MMMM YYYY")}
          </h2>
          <button
            onClick={() =>
              setSelectedDate(dayjs(selectedDate).add(1, "month").format("YYYY-MM-DD"))
            }
            className="text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            Mes Siguiente &gt;
          </button>
        </div>
        {renderCalendar()}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {isRegistered
                ? "Eliminar asistencia"
                : "Registrar asistencia"}
            </h3>
            <p className="text-gray-600 mb-6">
              {dayjs(selectedDate).format("DD MMMM YYYY")}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              {isRegistered ? (
                <button
                  onClick={handleDeleteAttendance}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              ) : (
                <button
                  onClick={handleAttendance}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Registrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymAttendance;
