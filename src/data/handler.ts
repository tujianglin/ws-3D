import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { statusData } from './index'

/* 移动数据 */
export const wsMove = (i, scene) => {
  const node = scene.getObjectByName(i.number)
  if (node) {
    switch (i.axis) {
      case 'O':
        const [x, y, z] = i?.value.split(',').map((i) => +i)
        new TWEEN.Tween(node.position).to({ x, y, z }, +i.duration * 1000).start()
        break
      case 'X':
        if (i.value.includes('#')) {
          new TWEEN.Tween(node.position).to({ x: i.value.replace(/#/g, '') }, +i.duration * 1000).start()
        } else {
          new TWEEN.Tween(node.position).to({ x: +i.value }, +i.duration * 1000).start()
        }
        break
      case 'Y':
        if (i.value.includes('#')) {
          new TWEEN.Tween(node.position).to({ y: i.value.replace(/#/g, '') }, +i.duration * 1000).start()
        } else {
          new TWEEN.Tween(node.position).to({ y: +i.value }, +i.duration * 1000).start()
        }
        break
      case 'Z':
        if (i.value.includes('#')) {
          new TWEEN.Tween(node.position).to({ z: i.value.replace(/#/g, '') }, +i.duration * 1000).start()
        } else {
          new TWEEN.Tween(node.position).to({ z: +i.value }, +i.duration * 1000).start()
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
    switch (i.axis) {
      case 'O':
        const [x, y, z] = i?.value.split(',').map((i) => +i)
        new TWEEN.Tween(node.rotation).to({ x, y, z }, +i.duration * 1000).start()
        break
      case 'X':
        new TWEEN.Tween(node.rotation).to({ x: THREE.MathUtils.degToRad(+i.value) }, +i.duration * 1000).start()
        break
      case 'Y':
        new TWEEN.Tween(node.rotation).to({ y: THREE.MathUtils.degToRad(+i.value) }, +i.duration * 1000).start()
        break
      case 'Z':
        new TWEEN.Tween(node.rotation).to({ z: THREE.MathUtils.degToRad(+i.value) }, +i.duration * 1000).start()
        break
      default:
        console.log(111)
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
    const target = statusData.find((j) => j.label === i.status)
    if (target.light && child.name.includes(target.light)) {
      child.material = target.value
    }
  })
}
