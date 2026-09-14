import { TimeSeriesChart } from "./components/TimeSeriesChart/TimeSeriesChart";
import { exampleSeries } from "./data/exampleData";

const todayValues = ["0%", "$0", "$0", "0", "0"] as const;

function App() {
  return (
    <main className="board">
      <div className="board__top" />

      <section className="board__body">
        <aside className="board__today" aria-label="Today">
          <div className="board__today-label">Tdy</div>
          {todayValues.map((value, index) => (
            <div key={`${value}-${index}`} className="board__today-value">
              {value}
            </div>
          ))}
          <div className="board__today-empty">—</div>
        </aside>

        <div className="board__chart">
          <TimeSeriesChart series={exampleSeries} />
        </div>

        <button className="board__edit" type="button" aria-label="Chart options">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M12.9 5.6 18.4 11l-9.8 9.8H3.1v-5.5l9.8-9.7Zm7.3-2.3 1.5 1.5c.8.8.8 2 0 2.8l-1.8 1.8-5.5-5.5 1.8-1.8c.8-.8 2-.8 2.8 0Z"
              fill="currentColor"
            />
          </svg>
          <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
            <path d="M2.2 4.2 6 8l3.8-3.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </section>

      <div className="board__bottom" />
    </main>
  );
}

export default App;
