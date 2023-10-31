<script lang="tsx">
import { defineComponent, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import TWEEN from '@tweenjs/tween.js'
import { Button, Popover } from 'ant-design-vue'

export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>()
    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let renderer: THREE.WebGLRenderer
    let controls: OrbitControls
    let modal: THREE.Group
    let cameraDistance
    const rotate = ref(false)
    /* 初始化场景 */
    const initScene = () => {
      scene = new THREE.Scene()
    }
    /* 初始化相机 */
    const initCamera = () => {
      camera = new THREE.PerspectiveCamera(60, container.value.clientWidth / container.value.clientHeight)
      scene.add(camera)
    }
    const initLight = () => {
      // 室内光
      const pmremGenerator = new THREE.PMREMGenerator(renderer)
      const room = new RoomEnvironment()
      scene.environment = pmremGenerator.fromScene(room, 0.04).texture
      scene.background = new THREE.Color(0x152940)
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
      loader.load('./demo/002.gltf', (gltf) => {
        modal = gltf.scene
        const boundingBox = new THREE.Box3().setFromObject(modal)
        const size = new THREE.Vector3()
        boundingBox.getSize(size)
        const center = new THREE.Vector3()
        boundingBox.getCenter(center)
        modal.position.sub(center)
        const maxDimension = Math.max(size.x, size.y, size.z)
        cameraDistance = maxDimension / (2 * Math.tan((Math.PI * camera.fov) / 360))
        camera.position.z = cameraDistance
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
      initLight()
      initModal()
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
      const tween = new TWEEN.Tween(camera.position).to({ x: 0, y: 0, z: cameraDistance }, 1000)
      tween.start()
    }
    const showView = (position) => {
      const tween = new TWEEN.Tween(camera.position).to(position, 1000)
      tween.start()
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
                  <div>
                    <Button onClick={() => showView({ x: 0, y: 0, z: cameraDistance })}>主视图</Button>
                    <Button onClick={() => showView({ x: 0, y: 0, z: -cameraDistance })}>背视图</Button>
                    <Button onClick={() => showView({ x: 0, y: cameraDistance, z: 0 })}>顶视图</Button>
                  </div>
                  <div>
                    <Button onClick={() => showView({ x: 0, y: -cameraDistance, z: 0 })}>底视图</Button>
                    <Button onClick={() => showView({ x: -cameraDistance, y: 0, z: 0 })}>左视图</Button>
                    <Button onClick={() => showView({ x: cameraDistance, y: 0, z: 0 })}>右视图</Button>
                  </div>
                </>
              ),
            }}
          >
            <Button>视角</Button>
          </Popover>
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
