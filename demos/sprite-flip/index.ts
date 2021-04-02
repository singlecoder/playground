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
    // Display normal
    const spriteEntity = rootEntity.createChild("spriteFlip");
    spriteEntity.transform.setPosition(-15, 0, 0);
    const spriteRenderer = spriteEntity.addComponent(SpriteRenderer);
    spriteRenderer.sprite = new Sprite(engine, texture);

    // Display flip x
    const flipXSpriteEntity = spriteEntity.clone();
    rootEntity.addChild(flipXSpriteEntity);
    flipXSpriteEntity.transform.setPosition(-5, 0, 0);
    flipXSpriteEntity.getComponent(SpriteRenderer).flipX = true;

    // Display flip y
    const flipYSpriteEntity = spriteEntity.clone();
    rootEntity.addChild(flipYSpriteEntity);
    flipYSpriteEntity.transform.setPosition(5, 0, 0);
    flipYSpriteEntity.getComponent(SpriteRenderer).flipY = true;

    // Display flip x and y
    const flipSpriteEntity = spriteEntity.clone();
    rootEntity.addChild(flipSpriteEntity);
    flipSpriteEntity.transform.setPosition(15, 0, 0);
    const flipSpriteRenderer = flipSpriteEntity.getComponent(SpriteRenderer);
    flipSpriteRenderer.flipX = true;
    flipSpriteRenderer.flipY = true;
  });

engine.run();
