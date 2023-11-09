<script lang="tsx">
import { defineComponent, onMounted, ref, reactive, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import TWEEN from '@tweenjs/tween.js'
import { Button, Popover, InputNumber } from 'ant-design-vue'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { useWebSocket } from '@vueuse/core'
import { positions, bindBone } from './data/index'
import { wsMove, wsRotate, wsShowOrHide, wsStatus } from './data/handler'
import { assign } from 'lodash-es'
export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>()
    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let renderer: THREE.WebGLRenderer
    let controls: OrbitControls
    let modal: THREE.Group
    const rotate = ref(false)
    const zoom = ref(1)
    const position = reactive({
      x: 0,
      y: 20,
      z: 30,
    })

    const { data, send, status } = useWebSocket('ws://192.168.1.40:1711/ws')
    watch(
      data,
      (val) => {
        const { Contents, Result } = JSON.parse(val)
        switch (Result) {
          // 初始化
          case 'SceneInit':
            Contents.map((i) => {
              const node = scene.getObjectByName(i.number)
              const bind: any = bindBone.find((j) => i.number === j.label)?.value
              if (node) {
                if (bind) {
                  // 移动
                  if (i.position) {
                    if (i.position === '0') return
                    bind.value = i.position
                    wsMove(bind, scene)
                  }
                  // 旋转
                  if (i.rotation) {
                    if (i.rotation === '0') return
                    bind.value = i.rotation
                    wsRotate(bind, scene)
                  }
                }
                // 状态
                if (i.status) {
                  i.value = i.status
                  wsStatus(i, scene)
                }
              }
            })
            break
          // 动作
          case 'actions':
            console.log(Contents)

            Contents.map((i) => {
              const bind: any = bindBone.find((j) => i.number === j.label)?.value
              if (bind) {
                i = assign(i, { axis: bind.axis })
              }
              switch (i.type) {
                case '移动':
                  wsMove(i, scene)
                  break
                case '机器人旋转':
                  wsRotate(i, scene)
                  break
                case '显示':
                  wsShowOrHide(i, scene, true)
                  break
                case '隐藏':
                  wsShowOrHide(i, scene, false)
                  break
                case '状态':
                  wsStatus(i, scene)
                  break
                case '开门':
                  const node = scene.getObjectByName(i.number)
                  console.log(node)
                  break
                default:
                  break
              }
            })
            break
          // 镜头比例缩放
          case 'WillScaleTheScene':
            Contents.map((i) => {
              camera.fov = +i.size
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
    const handleMove = () => {}
    watch(position, (val) => {
      new TWEEN.Tween(camera.position).to(val, 1000).start()
    })
    /* 初始化场景 */
    const initScene = () => {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x152940)
    }
    const initLight = () => {
      // 室内光
      const pmremGenerator = new THREE.PMREMGenerator(renderer)
      const room = new RoomEnvironment()
      scene.environment = pmremGenerator.fromScene(room, 0.04).texture
      scene.background = new THREE.Color(0x152940)
    }
    /* 初始化相机 */
    const initCamera = () => {
      camera = new THREE.PerspectiveCamera(60, container.value.clientWidth / container.value.clientHeight)
      camera.position.set(position.x, position.y, position.z)
      scene.add(camera)
    }
    /* 初始化渲染 */
    const initRenderer = () => {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(container.value.clientWidth, container.value.clientHeight)
      container.value.appendChild(renderer.domElement)
    }

    const initControls = () => {
      // 控制
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = false
      controls.screenSpacePanning = false // 定义平移时如何平移相机的位置 控制不上下移动
    }
    const initModal = async () => {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('./draco/')
      const loader = new GLTFLoader()
      loader.setDRACOLoader(dracoLoader)
      const gltf = await loader.loadAsync('./001.glb')
      modal = gltf.scene
      // camera = gltf.cameras[0] as THREE.PerspectiveCamera
      // const boundingBox = new THREE.Box3().setFromObject(modal)
      // const size = new THREE.Vector3()
      // boundingBox.getSize(size)
      // const center = new THREE.Vector3()
      // boundingBox.getCenter(center)
      // modal.position.sub(center)
      // const maxDimension = Math.max(size.x, size.y, size.z)
      // cameraDistance = maxDimension / (2 * Math.tan((Math.PI * camera.fov) / 360))
      // camera.position.z = cameraDistance
      scene.add(modal)
      if (status.value === 'OPEN') {
        send(JSON.stringify({ Result: 'SceneInit' }))
      }
    }
    const render = () => {
      requestAnimationFrame(render)
      camera.updateProjectionMatrix()
      camera?.updateMatrixWorld()
      TWEEN.update()
      controls.update()
      renderer.render(scene, camera)
    }
    window.addEventListener('resize', () => {
      renderer?.setSize(container.value.clientWidth, container.value.clientHeight)
      render()
    })
    onMounted(() => {
      initScene()
      initCamera()
      initRenderer()
      initControls()
      initModal()
      initLight()
      render()
    })

    const handleRotate = () => {
      controls.autoRotate = !controls.autoRotate
      rotate.value = controls.autoRotate
    }
    /* 复原 */
    const handleReset = () => {
      controls.autoRotate = false
      rotate.value = controls.autoRotate
      new TWEEN.Tween(camera.position).to(positions[0].target, 1000).start()
    }
    const showView = (position) => {
      new TWEEN.Tween(camera.position).to(position, 1000).start()
      zoom.value = 1
      new TWEEN.Tween(modal.scale).to({ x: zoom.value, y: zoom.value, z: zoom.value }, 1000).start()
    }
    /* 放大 */
    const zoomUp = () => {
      zoom.value += 0.2
      new TWEEN.Tween(modal.scale).to({ x: zoom.value, y: zoom.value, z: zoom.value }, 1000).start()
    }
    const zoomDown = () => {
      if (zoom.value >= 0.21) {
        zoom.value -= 0.2
        new TWEEN.Tween(modal.scale).to({ x: zoom.value, y: zoom.value, z: zoom.value }, 1000).start()
      }
    }
    return () => (
      <div class='container'>
        <div class='three' ref={container}></div>
        <div class='actions'>
          <Button onClick={handleRotate}>{rotate.value ? '停止' : '旋转'}</Button>
          <Button onClick={handleReset}>复原</Button>
          <Popover
            v-slots={{
              content: () => (
                <>
                  {positions.map((i) => (
                    <Button onClick={() => showView(i.target)}>{i.name}</Button>
                  ))}
                </>
              ),
            }}
          >
            <Button>视角</Button>
          </Popover>
          <Button onClick={zoomUp}>放大</Button>
          <Button onClick={zoomDown}>缩小</Button>
          <Button onClick={handleMove}>移动</Button>
          <div>
            <InputNumber v-model:value={position.x} step={1}></InputNumber>
            <InputNumber v-model:value={position.y} step={1}></InputNumber>
            <InputNumber v-model:value={position.z} step={1}></InputNumber>
          </div>
        </div>
      </div>
    )
  },
})
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;

  .three {
    width: 100%;
    height: 100%;
  }
  .actions {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
