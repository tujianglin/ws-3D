<script lang="tsx">
import { defineComponent, onMounted } from 'vue'
import { Button, Popover } from 'ant-design-vue'
import { Editor, signleEditor } from '/@/editor'
import { positions } from '/@/data'
import { InitModel } from '/@/editor/initModel'
import TWEEN from '@tweenjs/tween.js'

export default defineComponent({
  setup() {
    let editor: Editor
    onMounted(() => {
      editor = new signleEditor()
      new InitModel()
    })
    const handleRotate = () => {
      editor.controls.autoRotate = !editor.controls.autoRotate
      editor.rotate = editor.controls.autoRotate
    }
    const handleReset = () => {
      editor.controls.autoRotate = false
      editor.rotate = editor.controls.autoRotate
      editor.zoom = 1
      new TWEEN.Tween(editor.camera.position).to(positions[0].target, 1000).start()
      new TWEEN.Tween(editor.model.scale).to({ x: editor.zoom, y: editor.zoom, z: editor.zoom }, 1000).start()
    }
    const showView = (position) => {
      new TWEEN.Tween(editor.camera.position).to(position, 1000).start()
      editor.zoom = 1
      new TWEEN.Tween(editor.model.scale).to({ x: editor.zoom, y: editor.zoom, z: editor.zoom }, 1000).start()
    }
    const zoomUp = () => {
      editor.zoom += 0.2
      new TWEEN.Tween(editor.model.scale).to({ x: editor.zoom, y: editor.zoom, z: editor.zoom }, 1000).start()
    }
    const zoomDown = () => {
      if (editor.zoom >= 0.21) {
        editor.zoom -= 0.2
        new TWEEN.Tween(editor.model.scale).to({ x: editor.zoom, y: editor.zoom, z: editor.zoom }, 1000).start()
      }
    }
    return () => (
      <div class='container'>
        <div id='editor'></div>
        <div class='actions'>
          <Button onClick={handleRotate}>{editor?.rotate ? '停止' : '旋转'}</Button>
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

  #editor {
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
