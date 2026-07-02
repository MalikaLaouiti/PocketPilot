import React from 'react'
import { Box, Text, VStack, useColorMode, Skeleton, useTheme } from '@chakra-ui/react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export interface ChartDataPoint {
  name?: string
  label?: string
  value?: number
  depenseTotale?: number
  revenue?: number
  savings?: number
  savingsRate?: String
  [key: string]: any
}

interface ChartPlaceholderProps {
  title: string
  type: 'line' | 'pie' | 'bar'
  data: ChartDataPoint[]
  height?: string
  loading?: boolean
  colors?: string[]
  xAxisKey?: string
  dataKey?: string
  showLegend?: boolean
  showGrid?: boolean
  onChartClick?: (data: any) => void
  transformData?: (data: ChartDataPoint[]) => ChartDataPoint[]
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({
  title,
  type,
  data,
  height = '300px',
  loading = false,
  colors,
  xAxisKey = 'name',
  dataKey = 'value',
  showLegend = true,
  showGrid = true,
  onChartClick,
  transformData,
}) => {
  const { colorMode } = useColorMode()
  const theme = useTheme()

  // Default colors using your theme
  const defaultColors = [
    theme.colors.brand[400],
    theme.colors.success[400],
    theme.colors.brand[300],
    theme.colors.success[300],
    theme.colors.brand[200],
    theme.colors.success[200],
    theme.colors.brand[500],
    theme.colors.success[500],
  ]

  const chartColors = colors || defaultColors

  // Transform data if needed
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return []
    return transformData ? transformData(data) : data
  }, [data, transformData])

  const getChartColor = () => {
    return {
      stroke: colorMode === 'dark' ? theme.colors.brand[300] : theme.colors.brand[500],
      fill: colorMode === 'dark' ? theme.colors.brand[300] : theme.colors.brand[500],
      grid: colorMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(22,23,111,0.1)',
      text: colorMode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(22,23,111,0.6)',
    }
  }

  // Helper to get the right key for display
  const getDisplayKey = (item: ChartDataPoint) => {
    return item.name || item.label || 'value'
  }

  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }


  const renderChart = () => {
    if (loading) {
      return (
        <VStack flex="1" justify="center" align="center" spacing="4" width="100%">
          <Skeleton 
            height="200px" 
            width="100%" 
            borderRadius="8px" 
            startColor={colorMode === 'dark' ? 'brand.900' : 'brand.50'}
            endColor={colorMode === 'dark' ? 'brand.800' : 'brand.100'}
          />
          <Skeleton 
            height="20px" 
            width="200px" 
            startColor={colorMode === 'dark' ? 'brand.900' : 'brand.50'}
            endColor={colorMode === 'dark' ? 'brand.800' : 'brand.100'}
          />
        </VStack>
      )
    }

    if (!processedData || processedData.length === 0) {
      return (
        <VStack
          flex="1"
          justify="center"
          align="center"
          spacing="2"
          bg={colorMode === 'dark' ? 'brand.900' : 'brand.50'}
          borderRadius="10px"
          opacity={0.7}
        >
          <Text fontSize="3xl">📊</Text>
          <Text 
            fontSize="sm" 
            fontWeight="600" 
            color={colorMode === 'dark' ? 'brand.300' : 'brand.600'}
          >
            Aucune donnée disponible
          </Text>
        </VStack>
      )
    }

    const chartColor = getChartColor()
    const displayKey = getDisplayKey(processedData[0])

    // Custom tooltip styles using your theme
    const customTooltipStyle = {
      backgroundColor: colorMode === 'dark' ? '#0E1038' : '#F8FAFD',
      borderColor: colorMode === 'dark' ? 'rgba(75, 165, 237, 0.3)' : 'rgba(22, 23, 111, 0.1)',
      borderRadius: '12px',
      border: `1px solid ${colorMode === 'dark' ? 'rgba(75, 165, 237, 0.3)' : 'rgba(22, 23, 111, 0.1)'}`,
      boxShadow: colorMode === 'dark' 
        ? '0 8px 32px rgba(0,0,0,0.4)' 
        : '0 8px 32px rgba(22,23,111,0.1)',
      padding: '12px 16px',
    }

    const customLabelStyle = {
      color: colorMode === 'dark' ? '#FFFFFF' : '#16176F',
      fontWeight: 600,
    }

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processedData}
              onClick={onChartClick}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={chartColor.grid}
                  opacity={0.5}
                />
              )}
              <XAxis 
                dataKey={xAxisKey || displayKey} 
                tick={{ 
                  fontSize: 11, 
                  fill: chartColor.text,
                  fontWeight: 500,
                }}
                tickLine={{ stroke: chartColor.grid }}
                axisLine={{ stroke: chartColor.grid }}
              />
              <YAxis 
                tick={{ 
                  fontSize: 11, 
                  fill: chartColor.text,
                  fontWeight: 500,
                }}
                tickLine={{ stroke: chartColor.grid }}
                axisLine={{ stroke: chartColor.grid }}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${value/1000}k`
                  return value
                }}
              />
              <Tooltip 
                contentStyle={customTooltipStyle}
                labelStyle={customLabelStyle}
                formatter={(value: any) => {
                  if (typeof value === 'number') {
                    if (dataKey === 'savingsRate' || title.includes('taux') || title.includes('performance')) {
                      return [`${value}%`, 'Taux']
                    }
                    return [formatCurrency(value), 'Montant']
                  }
                  return [value, '']
                }}
              />
              {showLegend && (
                <Legend 
                  wrapperStyle={{ 
                    color: colorMode === 'dark' ? '#FFFFFF' : '#16176F',
                    fontSize: '12px',
                    fontWeight: 500,
                    paddingTop: '10px',
                  }} 
                />
              )}
              <Line
                type="monotone"
                dataKey={dataKey || 'depenseTotale'}
                stroke={chartColor.stroke}
                strokeWidth={3}
                dot={{ 
                  fill: chartColor.fill, 
                  r: 4,
                  strokeWidth: 2,
                  stroke: colorMode === 'dark' ? '#0E1038' : '#F8FAFD',
                }}
                activeDot={{ 
                  r: 6,
                  strokeWidth: 2,
                  stroke: colorMode === 'dark' ? '#4BA5ED' : '#16176F',
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                dataKey={dataKey || 'depenseTotale'}
                nameKey={xAxisKey || displayKey}
                cx="50%"
                cy="50%"
                labelLine={{
                  stroke: colorMode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(22,23,111,0.3)',
                }}
                label={({ name, percent }) => `${name}: ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
              >
                {processedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={chartColors[index % chartColors.length]}
                    onClick={() => onChartClick?.(entry)}
                    stroke={colorMode === 'dark' ? '#0E1038' : '#F8FAFD'}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={customTooltipStyle}
                labelStyle={customLabelStyle}
                formatter={(value: any) => {
                  if (typeof value === 'number') {
                    return [formatCurrency(value), 'Montant']
                  }
                  return [value, '']
                }}
              />
              {showLegend && (
                <Legend 
                  wrapperStyle={{ 
                    color: colorMode === 'dark' ? '#FFFFFF' : '#16176F',
                    fontSize: '12px',
                    fontWeight: 500,
                    paddingTop: '10px',
                  }} 
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              onClick={onChartClick}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={chartColor.grid}
                  opacity={0.5}
                />
              )}
              <XAxis 
                dataKey={xAxisKey || displayKey} 
                tick={{ 
                  fontSize: 11, 
                  fill: chartColor.text,
                  fontWeight: 500,
                }}
                tickLine={{ stroke: chartColor.grid }}
                axisLine={{ stroke: chartColor.grid }}
              />
              <YAxis 
                tick={{ 
                  fontSize: 11, 
                  fill: chartColor.text,
                  fontWeight: 500,
                }}
                tickLine={{ stroke: chartColor.grid }}
                axisLine={{ stroke: chartColor.grid }}
                tickFormatter={(value) => {
                  if (value >= 1000) return `${value/1000}k`
                  return value
                }}
              />
              <Tooltip 
                contentStyle={customTooltipStyle}
                labelStyle={customLabelStyle}
                formatter={(value: any) => {
                  if (typeof value === 'number') {
                    return [formatCurrency(value), 'Montant']
                  }
                  return [value, '']
                }}
              />
              {showLegend && (
                <Legend 
                  wrapperStyle={{ 
                    color: colorMode === 'dark' ? '#FFFFFF' : '#16176F',
                    fontSize: '12px',
                    fontWeight: 500,
                    paddingTop: '10px',
                  }} 
                />
              )}
              <Bar
                dataKey={dataKey || 'depenseTotale'}
                fill={chartColor.fill}
                radius={[4, 4, 0, 0]}
                onClick={(data) => onChartClick?.(data)}
              />
            </BarChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <Box
      bg={colorMode === 'dark' ? 'brand.900' : 'white'}
      p="6"
      borderRadius="14px"
      boxShadow={colorMode === 'dark' 
        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(22, 23, 111, 0.06)'}
      border="1px solid"
      borderColor={colorMode === 'dark' ? 'brand.800' : 'brand.100'}
      h={height}
      display="flex"
      flexDirection="column"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: colorMode === 'dark' 
          ? '0 4px 16px rgba(0, 0, 0, 0.4)'
          : '0 4px 16px rgba(22, 23, 111, 0.1)',
        borderColor: colorMode === 'dark' ? 'brand.700' : 'brand.200',
      }}
    >
      <Text 
        fontSize="sm" 
        fontWeight="700" 
        mb="4" 
        color={colorMode === 'dark' ? 'white' : 'brand.900'}
        letterSpacing="-0.3px"
      >
        {title}
        {loading && (
          <Text as="span" fontSize="xs" ml="2" color={colorMode === 'dark' ? 'brand.400' : 'brand.400'}>
            Chargement...
          </Text>
        )}
        {!loading && processedData.length > 0 && (
          <Text as="span" fontSize="xs" ml="2" color={colorMode === 'dark' ? 'brand.400' : 'brand.400'} fontWeight="400">
            ({processedData.length} points)
          </Text>
        )}
      </Text>

      <Box flex="1" minH="0">
        {renderChart()}
      </Box>
    </Box>
  )
}