'use client';
import './styled.css';
import { Chart } from 'primereact/chart';
import React, { useEffect, useMemo, useState } from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
type PieChartProps = {
  labels: string[];
  values: number[];
  type?: 'pie' | 'doughnut';
  colors?: string[];
  hoverColors?: string[];
  showLegend?: boolean;
  legendPosition?: 'top' | 'left' | 'bottom' | 'right';
  showPercentOnTooltip?: boolean;
  percentDecimals?: number;
  title?: string;
  className?: string;
  heightPx?: number;
  optionsOverride?: any;
  disableAnimation?: boolean;
  loading?: boolean;
  emptyState?: React.ReactNode;
  titleStyle?: React.CSSProperties;
};
const normalizeStatus = (raw: string): string => {
  const s = raw.trim().toUpperCase();
  if (s === 'ABERTA' || s === 'ABERTAS') return 'ABERTA';
  if (s === 'PENDENTE' || s === 'PENDENTES') return 'PENDENTE';
  if (s === 'AUTORIZADA' || s === 'AUTORIZADAS') return 'AUTORIZADA';
  if (s === 'REJEITADA' || s === 'REJEITADAS') return 'REJEITADA';
  if (s === 'CANCELADA' || s === 'CANCELADAS') return 'CANCELADA';
  if (s === 'PROCESSANDO' || s === 'EM PROCESSAMENTO') return 'PROCESSANDO';
  return s;
};
const getStatusColor = (status: string): string => {
  switch (normalizeStatus(status)) {
    case 'ABERTA':
      return '#3B82F6';
    case 'PENDENTE':
      return '#F59E0B';
    case 'PROCESSANDO':
      return '#8B5CF6';
    case 'AUTORIZADA':
      return '#10B981';
    case 'REJEITADA':
      return '#FB7185';
    case 'CANCELADA':
      return '#F43F5E';
    default:
      return '#6B7280';
  }
};
const getStatusHoverColor = (status: string): string => {
  switch (normalizeStatus(status)) {
    case 'ABERTA':
      return '#60A5FA';
    case 'PENDENTE':
      return '#FBBF24';
    case 'PROCESSANDO':
      return '#A78BFA';
    case 'AUTORIZADA':
      return '#34D399';
    case 'REJEITADA':
      return '#F87171';
    case 'CANCELADA':
      return '#F43F5E';
    default:
      return '#9CA3AF';
  }
};
export default function PieChart({
  labels,
  values,
  type = 'pie',
  colors,
  hoverColors,
  showLegend = true,
  legendPosition = 'top',
  showPercentOnTooltip = true,
  percentDecimals = 1,
  title,
  titleStyle,
  className,
  heightPx,
  optionsOverride,
  disableAnimation = false,
  loading = false,
  emptyState,
}: PieChartProps) {
  const [chartData, setChartData] = useState<any>({});
  const [chartOptions, setChartOptions] = useState<any>({});
  const palette = useMemo(() => {
    if (colors && colors.length) {
      const base = colors;
      const hovers =
        hoverColors && hoverColors.length
          ? hoverColors
          : base.map(c =>
            c.startsWith('#') && (c.length === 7 || c.length === 4)
              ? `${c}cc`
              : c
          );

      return { base, hovers };
    }
    const normalized = labels.map(normalizeStatus);
    const supported = new Set([
      'ABERTA',
      'PENDENTE',
      'PROCESSANDO',
      'AUTORIZADA',
      'REJEITADA',
      'CANCELADA',
    ]);
    const isStatusChart = normalized.every(s => supported.has(s));
    if (isStatusChart) {
      const base = labels.map(lbl => getStatusColor(lbl));
      const hovers = labels.map(lbl => getStatusHoverColor(lbl));
      return { base, hovers };
    }
    const fallback = [
      '#3B82F6',
      '#10B981',
      '#06B6D4',
      '#F59E0B',
      '#8B5CF6',
      '#EF4444',
      '#84CC16',
      '#F97316',
      '#22C55E',
      '#F43F5E',
    ];
    const base = fallback;
    const hovers = base.map(c =>
      c.startsWith('#') && (c.length === 7 || c.length === 4)
        ? `${c}cc`
        : c
    );
    return { base, hovers };
  }, [labels, colors, hoverColors]);
  const filteredData = useMemo(() => {
    const items = labels.map((label, index) => {
      const raw = values[index];
      const val = Number.isFinite(raw as any) ? Number(raw) : 0;
      return {
        label,
        value: val,
        color: palette.base[index % palette.base.length],
        hoverColor: palette.hovers[index % palette.hovers.length],
      };
    });
    const filteredItems = items.filter(item => item.value > 0);
    const total = filteredItems.reduce((acc, item) => acc + item.value, 0);
    return {
      labels: filteredItems.map(i => i.label),
      values: filteredItems.map(i => i.value),
      colors: filteredItems.map(i => i.color),
      hoverColors: filteredItems.map(i => i.hoverColor),
      total,
    };
  }, [labels, values, palette]);
  const isEmpty = !filteredData.values.length || filteredData.total === 0;
  useEffect(() => {
    const datasets = [
      {
        data: filteredData.values,
        backgroundColor: filteredData.colors,
        hoverBackgroundColor: filteredData.hoverColors,
        borderWidth: 0,
      },
    ];
    setChartData({ labels: filteredData.labels, datasets });
    const options: any = {
      responsive: true,
      maintainAspectRatio: true,
      animation: disableAnimation ? false : undefined,
      plugins: {
        legend: {
          display: showLegend,
          position: legendPosition,
          labels: { usePointStyle: true },
        },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const label = ctx.label ?? '';
              const val = Number(ctx.parsed) ?? 0;
              if (!showPercentOnTooltip || filteredData.total === 0) {
                return `${label}: ${val}`;
              }
              const pct = ((val / filteredData.total) * 100).toFixed(
                percentDecimals
              );
              return `${label}: ${val} (${pct}%)`;
            },
          },
        },
        datalabels: {
          color: '#ffffff',
          font: {
            weight: 'bold' as const,
            size: 11,
          },
          formatter: (value: number) => {
            if (!filteredData.total || value <= 0) return '';
            const pct = ((value / filteredData.total) * 100).toFixed(
              percentDecimals
            );
            return `${value} (${pct}%)`;
          },
        },
      },
      cutout: type === 'doughnut' ? '55%' : undefined,
    };
    setChartOptions({ ...options, ...(optionsOverride ?? {}) });
  }, [
    filteredData,
    showLegend,
    legendPosition,
    showPercentOnTooltip,
    percentDecimals,
    type,
    disableAnimation,
    optionsOverride,
  ]);

  if (loading) {
    return (
      <div
        className={`card flex items-center justify-center ${className ?? ''}`}
        style={{ minHeight: heightPx ?? 240 }}
      >
        <span className="pi pi-spin pi-spinner mr-2" />
        Carregando...
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className={`card ${className ?? ''}`}>
        {title && (
          <div
            className="mb-5 font-medium"
            style={{
              textAlign: 'center',
              fontSize: '20px',
              fontFamily: 'Poppins, sans-serif',
              ...(titleStyle ?? {}),
            }}
          >
            {title}
          </div>
        )}
        {emptyState ?? (
          <div className="chart-title">
            <i className="pi pi-folder-open" style={{ fontSize: '60px' }} />
            <span>Sem dados para exibir</span>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={`card ${className ?? ''}`}>
      {title && (
        <div
          className="mb-5 font-medium"
          style={{
            textAlign: 'center',
            fontSize: '20px',
            fontFamily: 'Poppins, sans-serif',
            ...(titleStyle ?? {}),
          }}
        >
          {title}
        </div>
      )}
      <div
        className="flex flex-col items-center justify-center"
        style={{
          width: 400,
          height: 300,
          margin: '0 auto',
        }}
      >
        <Chart
          type={type}
          data={chartData}
          options={{
            ...chartOptions,
            maintainAspectRatio: false,
          }}
          plugins={[ChartDataLabels]}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
