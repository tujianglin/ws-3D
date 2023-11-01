<script lang="tsx">
import { defineComponent, onMounted, ref, reactive, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import TWEEN from '@tweenjs/tween.js'
import { Button, Popover, InputNumber } from 'ant-design-vue'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'

export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>()
    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let renderer: THREE.WebGLRenderer
    let controls: OrbitControls
    let modal: THREE.Group
    // let cameraDistance
    const rotate = ref(false)
    const zoom = ref(1)
    const position = reactive({
      x: 0,
      y: 20,
      z: 30,
    })

    const positions = [
      {
        name: '主视图',
        target: {
          x: 0,
          y: 20,
          z: 30,
        },
      },
      {
        name: '背视图',
        target: {
          x: 0,
          y: 20,
          z: -30,
        },
      },
      {
        name: '右视图',
        target: {
          x: 50,
          y: 10,
          z: 0,
        },
      },
      {
        name: '左视图',
        target: {
          x: -50,
          y: 10,
          z: 0,
        },
      },
      {
        name: '俯视图',
        target: {
          x: -50,
          y: 32,
          z: 0,
        },
      },
      {
        name: '底视图',
        target: {
          x: -50,
          y: -32,
          z: 0,
        },
      },
    ]

    watch(position, (val) => {
      const tween = new TWEEN.Tween(camera.position).to(val, 1000)
      tween.start()
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
      camera = new THREE.PerspectiveCamera(50, container.value.clientWidth / container.value.clientHeight)
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
    const initModal = () => {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('./draco/')
      const loader = new GLTFLoader()
      loader.setDRACOLoader(dracoLoader)
      loader.load('./002.gltf', (gltf) => {
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
      })
    }
    const render = () => {
      requestAnimationFrame(render)
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
      const tween = new TWEEN.Tween(camera.position).to(positions[0].target, 1000)
      tween.start()
    }
    const showView = (position) => {
      const tween = new TWEEN.Tween(camera.position).to(position, 1000)
      tween.start()
      zoom.value = 1
      const tween1 = new TWEEN.Tween(modal.scale).to({ x: zoom.value, y: zoom.value, z: zoom.value }, 1000)
      tween1.start()
    }
    /* 放大 */
    const zoomUp = () => {
      zoom.value += 0.2
      const tween = new TWEEN.Tween(modal.scale).to({ x: zoom.value, y: zoom.value, z: zoom.value }, 1000)
      tween.start()
    }
    const zoomDown = () => {
      if (zoom.value >= 0.21) {
        zoom.value -= 0.2
        const tween = new TWEEN.Tween(modal.scale).to({ x: zoom.value, y: zoom.value, z: zoom.value }, 1000)
        tween.start()
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
