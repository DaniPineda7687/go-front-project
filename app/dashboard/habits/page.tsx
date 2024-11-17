'use client'
import { useState } from 'react';
import StatsSummary from '../components/StatsSummary';
import ProgressChart from '../components/ProgressChart';

const HabitsPage = () => {
  // Estado inicial para las estadísticas
  const [statsData, setStatsData] = useState([
    { label: 'Total de Sesiones', value: 5 },
    { label: 'Peso Máximo Levantado', value: '50 kg' },
    { label: 'Total de Repeticiones', value: 75 },
  ]);

  // Estado inicial para los datos de los gráficos
  const [barChartData, setBarChartData] = useState([
    { exercise: 'Press Banca', weight: 50 },
    { exercise: 'Sentadilla', weight: 45 },
    { exercise: 'Peso Muerto', weight: 55 },
  ]);

  const [lineChartData, setLineChartData] = useState([
    { date: '2024-11-01', repetitions: 30 },
    { date: '2024-11-05', repetitions: 35 },
    { date: '2024-11-10', repetitions: 40 },
  ]);

  const [areaChartData, setAreaChartData] = useState([
    { date: '2024-11-01', weight: 10 },
    { date: '2024-11-05', weight: 20 },
    { date: '2024-11-10', weight: 30 },
    { date: '2024-11-15', weight: 50 },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center py-4">
        <h1 className="text-3xl font-bold text-gray-800">Progreso de Ejercicios</h1>
      </header>

      <main>
        {/* Resumen de Estadísticas */}
        <StatsSummary stats={statsData} />

        {/* Gráfico 1: Peso Levantado por Ejercicio */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 text-center mt-8">Peso Levantado por Ejercicio</h2>
          <ProgressChart data={barChartData} type="bar" />
        </section>

        {/* Gráfico 2: Repeticiones por Sesión */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 text-center mt-8">Repeticiones por Sesión</h2>
          <ProgressChart data={lineChartData} type="line" />
        </section>

        {/* Gráfico 3: Progresión del Peso Máximo */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 text-center mt-8">Progresión del Peso Máximo</h2>
          <ProgressChart data={areaChartData} type="area" />
        </section>
      </main>
    </div>
  );
};

export default HabitsPage;
