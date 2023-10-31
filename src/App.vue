<script lang="tsx">
import { defineComponent, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import TWEEN from '@tweenjs/tween.js'

export default defineComponent({
  setup() {
    const container = ref<HTMLDivElement>()
    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let renderer: THREE.WebGLRenderer
    let controls: OrbitControls
    let modal: THREE.Group
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
      controls.update()
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
        const cameraDistance = maxDimension / (2 * Math.tan((Math.PI * camera.fov) / 360))
        camera.position.z = cameraDistance
        scene.add(modal)
      })
    }
    const render = () => {
      requestAnimationFrame(render)
      camera?.updateMatrixWorld()
      TWEEN.update()
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
    return () => <div class='container' ref={container}></div>
  },
})
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
