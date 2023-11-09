import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { statusData } from './index'

/* 移动数据 */
export const wsMove = (i, scene) => {
  const node = scene.getObjectByName(i.number)
  if (node) {
    const duration = i.duration ? +i.duration * 1000 : 1000
    switch (i.axis) {
      case 'O':
        const [x, y, z] = i?.value.split(',').map((i) => +i)
        new TWEEN.Tween(node.position).to({ x, y, z }, duration).start()
        break
      case 'X':
        if (i.value.includes('#')) {
          new TWEEN.Tween(node.position).to({ x: i.value.replace(/#/g, '') }, duration).start()
        } else {
          new TWEEN.Tween(node.position).to({ x: +i.value }, duration).start()
        }
        break
      case 'Y':
        if (i.value.includes('#')) {
          new TWEEN.Tween(node.position).to({ y: i.value.replace(/#/g, '') }, duration).start()
        } else {
          new TWEEN.Tween(node.position).to({ y: +i.value }, duration).start()
        }
        break
      case 'Z':
        if (i.value.includes('#')) {
          new TWEEN.Tween(node.position).to({ z: i.value.replace(/#/g, '') }, duration).start()
        } else {
          new TWEEN.Tween(node.position).to({ z: +i.value }, duration).start()
        }
        break
      default:
        break
    }
  }
}
/* 旋转数据 */
export const wsRotate = (i, scene) => {
  const node = scene.getObjectByName(i.number)
  if (node) {
    const duration = i.duration ? +i.duration * 1000 : 1000
    const value = THREE.MathUtils.degToRad(+i.value)
    switch (i.axis) {
      case 'O':
        const [x, y, z] = i?.value.split(',').map((i) => +i)
        new TWEEN.Tween(node.rotation).to({ x, y, z }, duration).start()
        break
      case 'X':
        new TWEEN.Tween(node.rotation).to({ x: value }, duration).start()
        break
      case 'Y':
        new TWEEN.Tween(node.rotation).to({ y: value }, duration).start()
        break
      case 'Z':
        new TWEEN.Tween(node.rotation).to({ z: value }, duration).start()
        break
      default:
        break
    }
  }
}

/* 显示隐藏 */
export const wsShowOrHide = (i, scene, bool) => {
  const node = scene.getObjectByName(i.number)
  if (node) {
    node.visible = bool
  }
}

/* 设备状态 */
export const wsStatus = (i, scene) => {
  const node = scene.getObjectByName(i.number)
  node.traverse((child: any) => {
    const target = statusData.find((j) => j.label === i.value)
    if (target.light && child.name.includes(target.light)) {
      child.material = target.value
    }
  })
}
