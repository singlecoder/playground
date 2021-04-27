import { OrbitControl } from "@oasis-engine/controls";
import {
  AssetType,
  Camera,
  Sprite,
  SpriteMask,
  SpriteMaskInteraction,
  SpriteMaskLayer,
  SpriteRenderer,
  SystemInfo,
  Texture2D,
  Vector3,
  WebGLEngine
} from "oasis-engine";

// Create engine object
const engine = new WebGLEngine("o3-demo", { stencil: true });
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
  .load([
    {
      // Sprite texture
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*L2GNRLWn9EAAAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    },
    {
      // Mask texture
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*DzLQSLyoJiMAAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    }
  ])
  .then((textures: Texture2D[]) => {
    // Create origin sprite entity.
    const spriteEntity = rootEntity.createChild("Sprite");
    const renderer = spriteEntity.addComponent(SpriteRenderer);
    renderer.sprite = new Sprite(engine, textures[0]);
    renderer.maskInteraction = SpriteMaskInteraction.VisibleOutsideMask;
    renderer.maskLayer = SpriteMaskLayer.Layer1;

    const cloneSprite = spriteEntity.clone();
    cloneSprite.parent = rootEntity;
    cloneSprite.transform.setPosition(0, -5, 0);
    const renderer1 = cloneSprite.getComponent(SpriteRenderer);
    renderer1.maskInteraction = SpriteMaskInteraction.VisibleInsideMask;
    renderer1.maskLayer = SpriteMaskLayer.Layer0;

    const maskEntity = rootEntity.createChild("SpriteMask");
    // maskEntity.transform.setScale(1, 5, 5);
    const mask = maskEntity.addComponent(SpriteMask);
    mask.sprite = new Sprite(engine, textures[1]);
    mask.influenceLayers = SpriteMaskLayer.Layer1;

    const maskEntity1 = rootEntity.createChild("SpriteMask1");
    maskEntity1.transform.setPosition(0, -5, 0);
    const mask1 = maskEntity1.addComponent(SpriteMask);
    mask1.sprite = new Sprite(engine, textures[1]);
    mask1.influenceLayers = SpriteMaskLayer.Layer0;

    const maskEntity2 = rootEntity.createChild("SpriteMask2");
    // maskEntity.transform.setScale(1, 5, 5);
    maskEntity2.transform.setPosition(1, 0, 0);
    const mask2 = maskEntity2.addComponent(SpriteMask);
    mask2.sprite = new Sprite(engine, textures[1]);
    mask2.influenceLayers = SpriteMaskLayer.Layer1;
  });

engine.run();
