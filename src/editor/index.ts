import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import TWEEN from '@tweenjs/tween.js'
import { signleton } from '/@/utils/singleton'

class Editor {
  container: HTMLElement // 容器
  renderer: THREE.WebGLRenderer // 渲染
  camera: THREE.PerspectiveCamera // 相机
  scene = new THREE.Scene() // 场景
  controls: OrbitControls // 控制器
  composer: EffectComposer // 合成器
  model: THREE.Group
  rotate = false
  zoom = 1
  allStatus = new Map()
  constructor() {
    this.container = document.querySelector('#editor')
    this.initScene()
    this.initCamera()
    this.initRenderer()
    this.initControls()
    this.initLight()
    this.render()
    this.onWindowResize()
  }
  /* 初始化场景 */
  initScene() {}
  /* 初始化相机 */
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(60, this.container.clientWidth / this.container.clientHeight)
    this.camera.position.set(0, 20, 30)
  }
  /* 初始化渲染 */
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.container.appendChild(this.renderer.domElement)
  }
  /* 初始化控制器 */
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = false
    this.controls.screenSpacePanning = false // 定义平移时如何平移相机的位置 控制不上下移动
  }
  /* 初始化灯光 */
  initLight() {
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    const room = new RoomEnvironment()
    this.scene.environment = pmremGenerator.fromScene(room, 0.04).texture
    this.scene.background = new THREE.Color(0x152940)
  }
  /* 呼吸灯 */
  initOutlinePass() {
    this.composer = new EffectComposer(this.renderer)
    let renderScene = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderScene)
    const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader)
    this.composer.addPass(gammaCorrectionShader)
    this.allStatus.forEach((i) => {
      if (!i.color) return
      let outlinePass = new OutlinePass(new THREE.Vector2(this.container.clientWidth, this.container.clientHeight), this.scene, this.camera, [i.node])
      outlinePass.renderToScreen = true
      outlinePass.edgeGlow = 3
      outlinePass.usePatternTexture = false
      outlinePass.edgeThickness = 2
      outlinePass.edgeStrength = 5
      outlinePass.pulsePeriod = 2
      outlinePass.visibleEdgeColor.set(i.color)
      outlinePass.hiddenEdgeColor.set(i.color)
      this.composer.addPass(outlinePass)
    })
  }
  render = () => {
    requestAnimationFrame(this.render)
    this.camera.updateProjectionMatrix()
    this.camera.updateMatrixWorld()
    TWEEN.update()
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
    if (this.composer) {
      this.composer.render()
    }
  }
  onWindowResize() {
    window.addEventListener('resize', () => {
      this.renderer?.setSize(this.container.clientWidth, this.container.clientHeight)
      this.render()
    })
  }
}
const signleEditor = signleton<Editor>(Editor)

export { Editor, signleEditor }
