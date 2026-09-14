import { TimeSeriesChart } from "./components/TimeSeriesChart/TimeSeriesChart";
import { exampleSeries } from "./data/exampleData";

function App() {
  return (
    <main>
      <TimeSeriesChart series={exampleSeries} />
    </main>
  );
}

export default App;
