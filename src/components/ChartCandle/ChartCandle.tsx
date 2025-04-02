import ReactApexChart from 'react-apexcharts'
import { useEffect, useRef, useState } from 'react'

const options = {
  chart: {
    type: 'candlestick' as const,
    height: 350,
    zoom: {
      enabled: false,
    }
  },
  // title: {
  //   text: 'CandleStick Chart',
  //   align: 'left' as const,
  // },
  xaxis: {
    type: 'datetime' as const,
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  }
}

function ChartCandle () {
  const [wsConnected, setWsConnected] = useState<boolean>(false)
  const [btcData, setBtcData] = useState<{x: Date, y: []}[]>([])
  const [ethData, setEthData] = useState<{x: Date, y: []}[]>([])
  const [btcPrice, setBtcPrice] = useState<string>('')
  const [ethPrice, setEthPrice] = useState<string>('')

  const wsConnection = useRef<WebSocket | null>(null)

  useEffect(
    () => {
      const socket = new WebSocket('wss://ws-api.binance.com:443/ws-api/v3')

      socket.addEventListener('open', () => {
        console.log('Socket open')
        setWsConnected(true)
      })

      wsConnection.current = socket
      wsConnection.current.send.bind(socket)

      return () => {
        wsConnection.current = null
        setWsConnected(false)
        socket.close()
      }
    },
    [],
  )

  useEffect(
    () => {
      let interval = null

      if (wsConnection.current && wsConnected) {
        wsConnection.current.addEventListener('message', (e) => {
          const data = JSON.parse(e.data)

          if (data.id === 'btc_price') {
            setBtcPrice(parseFloat(data.result.price).toFixed(2))
          }

          if (data.id === 'eth_price') {
            setEthPrice(parseFloat(data.result.price).toFixed(2))
          }

          if (data.id === 'btc_klines') {
            setBtcData(data.result.map(
              ([, o, h, l, c, , closeTime]: [any, any, any, any, any, any, any]) => {
                return {
                  x: new Date(closeTime),
                  y: [parseFloat(o), parseFloat(h), parseFloat(l), parseFloat(c)],
                }
              }
            ))
          }

          if (data.id === 'eth_klines') {
            setEthData(data.result.map(
              ([, o, h, l, c, , closeTime]: [any, any, any, any, any, any, any]) => {
                return {
                  x: new Date(closeTime),
                  y: [parseFloat(o), parseFloat(h), parseFloat(l), parseFloat(c)],
                }
              }
            ))
          }
        })

        const handleInterval = () => {
          const now = new Date()
          const startTime = new Date(now.getTime() - 3600000)

          wsConnection.current!.send(JSON.stringify({
            id: `btc_klines`,
            method: 'klines',
            params: {
              symbol: 'BTCUSDT',
              interval: '1m',
              startTime: startTime.getTime(),
            },
          }))

          wsConnection.current!.send(JSON.stringify({
            id: `eth_klines`,
            method: 'klines',
            params: {
              symbol: 'ETHUSDT',
              interval: '1m',
              startTime: startTime.getTime(),
            },
          }))

          wsConnection.current!.send(JSON.stringify({
            id: `btc_price`,
            method: 'ticker.price',
            params: { symbol: 'BTCUSDT' },
          }))

          wsConnection.current!.send(JSON.stringify({
            id: `eth_price`,
            method: 'ticker.price',
            params: { symbol: 'ETHUSDT' },
          }))
        }

        wsConnection.current.readyState === wsConnection.current.OPEN && handleInterval()
        interval = setInterval(handleInterval, 10000)
      }

      return () => {
        interval && clearInterval(interval)
      }
    },
    [wsConnected],
  )

  const series: any = [
    [{
      name: 'BTC/USDT',
      data: [],
    }],
    [{
      name: 'ETH/USDT',
      data: [],
    }],
  ]

  series[0][0].data = btcData
  series[1][0].data = ethData

  const option1 = {
    ...options,
    // title: {
    //   text: 'BTC/USDT',
    //   align: 'left' as const,
    // },
  }

  const option2 = {
    ...options,
    // title: {
    //   text: 'ETH/USDT',
    //   align: 'left' as const,
    // },
  }

  return (<>
    <div><b>BTC/USDT:</b> <i>{btcPrice}</i></div>
    <ReactApexChart options={option1} type='candlestick' height={350} series={series[0]} />
    <div><b>ETH/USDT:</b> <i>{ethPrice}</i></div>
    <ReactApexChart options={option2} type='candlestick' height={350} series={series[1]} />
  </>)
}

export default ChartCandle 
