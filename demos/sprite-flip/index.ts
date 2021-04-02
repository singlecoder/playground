import { OrbitControl } from "@oasis-engine/controls";
import { AssetType, Camera, Sprite, SpriteRenderer, SystemInfo, Texture2D, Vector3, WebGLEngine } from "oasis-engine";

// Create engine object
const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

// Create camera
const cameraEntity = rootEntity.createChild("Camera");
cameraEntity.transform.position = new Vector3(0, 0, 50);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

engine.resourceManager
  .load<Texture2D>({
    url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*KjnzTpE8LdAAAAAAAAAAAAAAARQnAQ",
    type: AssetType.Texture2D
  })
  .then((texture) => {
    const sprite = new Sprite(engine, texture);
    for (let i = 0; i < 4; ++i) {
      const spriteEntity = rootEntity.createChild(`sprite_${i}`);
      spriteEntity.transform.setPosition(10 * i - 15, 0, 0);
      const spriteRenderer = spriteEntity.addComponent(SpriteRenderer);
      spriteRenderer.sprite = sprite;

      if (i === 1) {
        // Display flip x
        spriteRenderer.flipX = true;
      } else if (i === 2) {
        // Display flip y
        spriteRenderer.flipY = true;
      } else if (i === 3) {
        // Display flip x and y
        spriteRenderer.flipX = true;
        spriteRenderer.flipY = true;
      }
    }
  });

engine.run();
