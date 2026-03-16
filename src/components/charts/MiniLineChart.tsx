type LineSeries = {
  label: string;
  values: number[];
  color: string;
};

type MiniLineChartProps = {
  title: string;
  series: LineSeries[];
  yLabel?: string;
};

export default function MiniLineChart({ title, series, yLabel }: MiniLineChartProps) {
  const allValues = series.flatMap((item) => item.values);
  const maxValue = Math.max(1, ...allValues);
  const pointCount = Math.max(1, ...series.map((item) => item.values.length));

  const buildPoints = (values: number[]) => {
    if (values.length <= 1) {
      const y = 100 - (values[0] ?? 0) / maxValue * 100;
      return `50,${Number.isFinite(y) ? y : 100}`;
    }
    return values
      .map((value, index) => {
        const x = (index / (values.length - 1)) * 100;
        const y = 100 - (value / maxValue) * 100;
        return `${x},${Number.isFinite(y) ? y : 100}`;
      })
      .join(" ");
  };

  return (
    <div className="rounded-2xl border border-stroke bg-white/70 px-4 py-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
        <span>{title}</span>
        {yLabel && <span>{yLabel}</span>}
      </div>
      <svg viewBox="0 0 100 100" className="mt-3 h-32 w-full">
        <defs>
          <linearGradient id="gridFade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0.12)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.02)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#gridFade)" rx="6" />
        {Array.from({ length: 4 }).map((_, index) => (
          <line
            key={`grid-${index}`}
            x1="0"
            y1={`${(index + 1) * 20}`}
            x2="100"
            y2={`${(index + 1) * 20}`}
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="0.4"
          />
        ))}
        {series.map((item) => (
          <polyline
            key={item.label}
            fill="none"
            stroke={item.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={buildPoints(item.values)}
          />
        ))}
      </svg>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
        {series.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
        {pointCount > 1 && (
          <span className="ml-auto text-[10px] uppercase tracking-[0.3em] text-muted">
            Yearly view
          </span>
        )}
      </div>
    </div>
  );
}
