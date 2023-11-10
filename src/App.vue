<script lang="tsx">
import { defineComponent, onMounted, ref, reactive, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import TWEEN from '@tweenjs/tween.js'
import { Button, Popover, InputNumber } from 'ant-design-vue'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
// import { useWebSocket } from '@vueuse/core'
import { positions, bindBone, statusData, wsData } from './data/index'
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
    let composer: EffectComposer
    const allStatus = ref([])
    const rotate = ref(false)
    const zoom = ref(1)
    const position = reactive({
      x: 0,
      y: 20,
      z: 30,
    })

    // const { data, send, status } = useWebSocket('ws://192.168.1.40:1711/ws')
    const customData = ref()
    watch(customData, (val) => {
      const { Contents, Result } = val as any
      switch (Result) {
        // 初始化
        case 'SceneInit':
          const status = []
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
              if (i.status && i.status !== '关机') {
                i.value = i.status
                status.push(i)
              }
            }
          })
          status.map((i) => {
            const node = scene.getObjectByName(i.number) as THREE.Mesh
            node.traverse((child: any) => {
              const target = statusData.find((j) => j.label === i.value)
              if (target.light && child.name.includes(target.light)) {
                allStatus.value.push({
                  node: child,
                  color: target.value,
                })
              }
            })
          })
          initOutlinePass()
          break
        // 动作
        case 'actions':
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
    })
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
      composer = new EffectComposer(renderer)
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
      scene.add(modal)
      // if (status.value === 'OPEN') {
      //   send(JSON.stringify({ Result: 'SceneInit' }))
      // }
      customData.value = wsData
    }
    const initOutlinePass = () => {
      let renderScene = new RenderPass(scene, camera)
      composer.addPass(renderScene)
      const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader)
      composer.addPass(gammaCorrectionShader)
      allStatus.value.map((i) => {
        let outlinePass = new OutlinePass(new THREE.Vector2(container.value.clientWidth, container.value.clientHeight), scene, camera, [i.node])
        outlinePass.renderToScreen = true
        outlinePass.edgeGlow = 1
        outlinePass.usePatternTexture = false
        outlinePass.edgeThickness = 2
        outlinePass.edgeStrength = 5
        outlinePass.pulsePeriod = 2
        outlinePass.visibleEdgeColor.set(i.color)
        outlinePass.hiddenEdgeColor.set(i.color)
        composer.addPass(outlinePass)
      })
    }
    const render = () => {
      requestAnimationFrame(render)
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld()
      TWEEN.update()
      controls.update()
      renderer.render(scene, camera)
      if (composer) {
        composer.render()
      }
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

    const handleStatus = (val) => {
      const node = scene.getObjectByName('DMU-83P-002')
      node.traverse((child: any) => {
        const target = statusData.find((j) => j.label === val)
        if (target.light && child.name.includes(target.light)) {
          alert(JSON.stringify(child))
        }
      })
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
          <Button onClick={() => handleStatus('加工')}>加工</Button>
          <Button onClick={() => handleStatus('报警')}>报警</Button>
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
