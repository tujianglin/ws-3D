import * as THREE from 'three'

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
    number: 'A7',
    type: '移动',
    axis: 'X',
    duration: '0.5',
    value: '1111',
  },
]

export const statusData = [
  {
    label: '关机',
    value: '',
    light: '',
  },
  {
    label: '报警',
    value: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    light: '三色灯红',
  },
  {
    label: '加工',
    value: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    light: '三色灯绿',
  },
  {
    label: '空闲',
    value: new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    light: '三色灯黄',
  },
]

export const wsData = {
  Result: 'SceneInit',
  Contents: [
    {
      number: 'DMU-80FD',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'DMU-83P-001',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'DMU-83P-002',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'DMU-83P-003',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'DMU-83P-004',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: '油机立车1',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: '油机立车2',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: '油机立车3',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: '油机立车4',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: '搬运机器人',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: '装卸站001',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: '装卸站002',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: '装卸站003',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW001',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW002',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW003',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW004',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW005',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW006',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW007',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW008',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW009',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW010',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW011',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW012',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW013',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW014',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW015',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW016',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW017',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW018',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW019',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW020',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW021',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW022',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW024',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW023',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW025',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW026',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW027',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW028',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW030',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW029',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW031',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW032',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW033',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW034',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW036',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'KW035',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'DMU-83P-001',
      position: '',
      rotation: '',
      status: '报警',
    },
    {
      number: 'DMU-83P-002',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'DMU-83P-003',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'DMU-83PD',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'DMU前门',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'DMU前门-001',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'DMU前门-002',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'DMU前门-003',
      position: '',
      rotation: '',
      status: '关机',
    },
    {
      number: 'A7',
      position: '0',
    },
    {
      number: 'A2',
      rotation: '0',
    },
    {
      number: 'A3',
      rotation: '0',
    },
    {
      number: 'A4',
      rotation: '0',
    },
    {
      number: 'A5',
      rotation: '0',
    },
    {
      number: 'A6',
      rotation: '0',
    },
    {
      number: 'A1',
      rotation: '0',
    },
    {
      number: 'A7-1',
      position: '0',
    },
    {
      number: 'A2-1',
      rotation: '0',
    },
    {
      number: 'A3-1',
      rotation: '0',
    },
    {
      number: 'A4-1',
      rotation: '0',
    },
    {
      number: 'A5-1',
      rotation: '0',
    },
    {
      number: 'A6-1',
      rotation: '0',
    },
    {
      number: 'A1-1',
      rotation: '0',
    },
    {
      number: 'AGV下',
      position: '0,0,0',
      rotation: '0,0,0',
      status: '关机',
    },
    {
      number: 'AGV上',
      position: '0,0,0',
      rotation: '0,0,0',
      status: '关机',
    },
  ],
}
