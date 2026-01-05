export default function Sparkline({
    data,
    width = 120,
    height = 32,
  }: {
    data: number[];
    width?: number;
    height?: number;
  }) {
    const max = Math.max(...data, 1);
    const step = width / (data.length - 1 || 1);
    const pts = data
      .map((v, i) => `${i * step},${height - (v / max) * height}`)
      .join(" ");
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke="rgba(2,132,199,.35)"
          strokeWidth="3"
          points={pts}
        />
        <polyline
          fill="none"
          stroke="rgb(2,132,199)"
          strokeWidth="2"
          points={pts}
        />
      </svg>
    );
  }