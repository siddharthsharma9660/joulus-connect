import {
    useValue,
    useClockValue,
    Canvas,
    Circle,
    Group,
    Path,
    Skia,
    rect,
    rrect,
    useComputedValue,
    SweepGradient,
  } from '@shopify/react-native-skia'
  
  import { line } from 'd3'
  import React, { useEffect } from 'react'
  
  const Wave = ({ size = 256, progress = 90 }) => {
    const r = size / 2
    const padding = size / 30
    const outerCircleRadius = r - padding / 2
    const innerCircleSize = size - padding * 2
    const frequency = 1
    const amplitude = 25
    const seaWaveFrequency = 0.8 // Adjusted sea wave frequency
    const seaWaveAmplitude = 15 // Adjusted sea wave amplitude
    const verticalOffset = useValue(100)
    const clock = useClockValue()
  
    useEffect(() => {
      verticalOffset.current = (1 - progress / 100) * innerCircleSize
    }, [progress, size, innerCircleSize])
  
    const createAnimatedPath = (phase = 20) => {
      const d3Points = Array.from({ length: size }).map((_, i) => {
        const angle = (i / size) * (Math.PI * 2 * frequency) + phase
        return [i, (Math.sin(angle) * amplitude) / 4 + verticalOffset.current]
      })
      const lineGenerator = line()
      const wavePath = lineGenerator(d3Points)
      return `${wavePath} L ${size}, ${size} ${0}, ${size} Z`
    }
  
    const createSeaWavePath = (phase = 1000) => {
      const d3Points = Array.from({ length: size }).map((_, i) => {
        const angle = (i / size) * (Math.PI * frequency) + phase
        return [i, (Math.sin(angle) * amplitude) / 2 + verticalOffset.current]
      })
      const lineGenerator = line()
      const seaWavePath = lineGenerator(d3Points)
      return `${seaWavePath} L ${size}, ${size} ${0}, ${size} Z`
    }
  
    const animatedPath = useComputedValue(() => {
      const current = (clock.current / 300) % 200
      const start = Skia.Path.MakeFromSVGString(createAnimatedPath(current))
      const end = Skia.Path.MakeFromSVGString(createAnimatedPath(current * 1))
  
      return start.interpolate(end, 0.5)
    }, [clock, progress, size])
  
    const animatedSeaWavePath = useComputedValue(() => {
      const current = (clock.current / 350) % 200
      const start = Skia.Path.MakeFromSVGString(createSeaWavePath(current))
      const end = Skia.Path.MakeFromSVGString(createSeaWavePath(current * 1))
  
      return start.interpolate(end, 0.5)
    }, [clock, progress, size])
  
    const roundedRectangle = rrect(
      rect(padding + 5, padding + 5, innerCircleSize - 10, innerCircleSize - 10),
      r,
      r
    )
    const center = { x: size, y: size }
  
    return (
      <Canvas style={{ width: size, height: size }}>
        <Circle
          cx={r}
          cy={r}
          r={outerCircleRadius * 0.9}
          style="stroke"
          strokeWidth={padding - 4}
          color="#777272"
        />
        <SweepGradient
          c={center}
          colors={[
            '#118615',
            'rgba(17, 134, 21, 1)',
            '#118615',
            'rgba(17, 134, 21, 1)',
          ]}
        />
        <Circle
          cx={r}
          cy={r}
          r={outerCircleRadius}
          style="stroke"
          strokeWidth={padding - 1}
          // color="#15C31B"
        />
        <Group clip={roundedRectangle}>
          <Path
            path={animatedSeaWavePath}
            color="rgba(17, 134, 21, 1)"
            opacity={0.8}
          />
          <Path path={animatedPath} color="#118615" opacity={0.7} />
        </Group>
      </Canvas>
    )
  }
  
  export default Wave
  