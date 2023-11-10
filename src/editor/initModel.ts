import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useWebSocket } from '@vueuse/core'
import { signleEditor } from './index'
import { watch } from 'vue'
import { bindBone } from '/@/data'
import { wsMove, wsRotate, wsShowOrHide, wsStatus } from './handler'
import { assign } from 'lodash-es'

export class InitModel extends signleEditor {
  constructor() {
    super()
    this.initModel()
  }
  initModel = async () => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    const gltf = await loader.loadAsync('./001.glb')
    this.model = gltf.scene
    this.scene.add(this.model)
    this.handleData()
  }
  handleData = () => {
    const { data, send, status } = useWebSocket('ws://192.168.1.40:1711/ws')
    watch(status, (val) => {
      if (val === 'OPEN') {
        send(JSON.stringify({ Result: 'SceneInit' }))
      }
    })
    watch(
      data,
      (val) => {
        const { Contents, Result } = JSON.parse(val)
        switch (Result) {
          case 'SceneInit':
            this.initModelData(Contents)
            break
          case 'actions':
            this.actionModelData(Contents)
            break
          case 'WillScaleTheScene':
            Contents.map((i) => {
              this.camera.fov = +i.size
            })
            break
          default:
            break
        }
      },
      {
        deep: true,
      }
    )
  }
  /* 初始化模型数据 */
  initModelData = (data: any[]) => {
    data.map((i) => {
      const node = this.scene.getObjectByName(i.number)
      if (node) {
        const bind: any = bindBone.find((j) => i.number === j.label)?.value
        if (bind) {
          // 移动
          if (i.position) {
            if (i.position === '0') return
            bind.value = i.position
            wsMove(bind)
          }
          // 旋转
          if (i.rotation) {
            if (i.rotation === '0') return
            bind.value = i.rotation
            wsRotate(bind)
          }
        }
        // 状态
        if (i.status && i.status !== '关机') {
          i.value = i.status
          wsStatus(i)
        }
      }
    })
  }
  /* 模型动作数据 */
  actionModelData = (data: any[]) => {
    data.map((i) => {
      const bind: any = bindBone.find((j) => i.number === j.label)?.value
      if (bind) {
        i = assign(i, { axis: bind.axis })
      }
      switch (i.type) {
        case '移动':
          wsMove(i)
          break
        case '机器人旋转':
          wsRotate(i)
          break
        case '显示':
          wsShowOrHide(i, true)
          break
        case '隐藏':
          wsShowOrHide(i, false)
          break
        case '状态':
          wsStatus(i)
          break
        case '开门':
          const node = this.scene.getObjectByName(i.number)
          console.log(node)
          break
        default:
          break
      }
    })
  }
}
