export const positions = [
  {
    name: '主视图',
    target: { x: 0, y: 20, z: 30 },
  },
  {
    name: '背视图',
    target: { x: 0, y: 20, z: -30 },
  },
  {
    name: '右视图',
    target: { x: 50, y: 10, z: 0 },
  },
  {
    name: '左视图',
    target: { x: -50, y: 10, z: 0 },
  },
  {
    name: '俯视图',
    target: { x: -50, y: 32, z: 0 },
  },
  {
    name: '底视图',
    target: { x: -50, y: -32, z: 0 },
  },
]

export const moveData = [
  {
    number: 'A1-1',
    rotation: '90',
  },
]

export const bindBone = [
  { label: 'A7', value: { number: 'A7', axis: 'X', type: '移动' } },
  { label: 'A2', value: { number: 'A2', axis: 'X', type: '机器人旋转' } },
  { label: 'A3', value: { number: 'A3', axis: 'X', type: '机器人旋转' } },
  { label: 'A4', value: { number: 'A4', axis: 'Z', type: '机器人旋转' } },
  { label: 'A5', value: { number: 'A5', axis: 'X', type: '机器人旋转' } },
  { label: 'A6', value: { number: 'A6', axis: 'Z', type: '机器人旋转' } },
  { label: 'A1', value: { number: 'A1', axis: 'Y', type: '机器人旋转' } },
  { label: 'A7-1', value: { number: 'A7-1', axis: 'X', type: '移动' } },
  { label: 'A2-1', value: { number: 'A2-1', axis: 'X', type: '机器人旋转' } },
  { label: 'A3-1', value: { number: 'A3-1', axis: 'X', type: '机器人旋转' } },
  { label: 'A4-1', value: { number: 'A4-1', axis: 'Z', type: '机器人旋转' } },
  { label: 'A5-1', value: { number: 'A5-1', axis: 'X', type: '机器人旋转' } },
  { label: 'A6-1', value: { number: 'A6-1', axis: 'Z', type: '机器人旋转' } },
  { label: 'A1-1', value: { number: 'A1-1', axis: 'Y', type: '机器人旋转' } },
]

export const statusData = [
  {
    label: '关机',
    value: '',
    light: '',
  },
  {
    label: '报警',
    value: '#ff0000',
    light: '三色灯红',
  },
  {
    label: '加工',
    value: '#00ff00',
    light: '三色灯绿',
  },
  {
    label: '空闲',
    value: '#ffff00',
    light: '三色灯黄',
  },
]
