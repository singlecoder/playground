import { OrbitControl } from "@oasis-engine/controls";
import {
  AssetType,
  Camera,
  Entity,
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
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*iMy1Sq0XlVMAAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    },
    {
      // Sprite texture
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*nmWVS7nKt1QAAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    },
    {
      // Mask texture
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*qyhFT5Un5AgAAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    }
  ])
  .then((textures: Texture2D[]) => {
    const pos = new Vector3();
    const scale = new Vector3();
    // Create sprite.
    const sprite0 = new Sprite(engine, textures[0]);
    const sprite1 = new Sprite(engine, textures[1]);
    const sprite2 = new Sprite(engine, textures[2]);
    // Create origin sprite entity
    const spriteEntity = rootEntity.createChild("Sprite");
    // Create origin mask entity
    const maskEntity = rootEntity.createChild("Mask");

    // Show sprite inside mask.
    pos.setValue(-5, 0, 0);
    scale.setValue(2, 2, 2);
    addSprite(
      spriteEntity.clone(),
      pos,
      scale,
      sprite0,
      SpriteMaskInteraction.VisibleInsideMask,
      SpriteMaskLayer.Layer0
    );
    scale.setValue(1, 1, 1);
    addMask(maskEntity.clone(), pos, scale, sprite2, SpriteMaskLayer.Layer0);
    // Show sprite outside mask.
    pos.setValue(5, 0, 0);
    scale.setValue(5.5, 5.5, 5.5);
    addSprite(
      spriteEntity.clone(),
      pos,
      scale,
      sprite1,
      SpriteMaskInteraction.VisibleOutsideMask,
      SpriteMaskLayer.Layer1
    );
    scale.setValue(3, 3, 3);
    addSprite(spriteEntity.clone(), pos, scale, sprite0, SpriteMaskInteraction.None, SpriteMaskLayer.Layer1);
    pos.setValue(4.5, -0.2, 0);
    scale.setValue(1.5, 1.5, 1.5);
    addMask(maskEntity.clone(), pos, scale, sprite2, SpriteMaskLayer.Layer1);
  });

engine.run();

function addSprite(
  entity: Entity,
  pos: Vector3,
  scale: Vector3,
  sprite: Sprite,
  maskInteraction: SpriteMaskInteraction,
  maskLayer: number
): void {
  rootEntity.addChild(entity);
  const { transform } = entity;
  transform.position = pos;
  transform.scale = scale;
  const renderer = entity.addComponent(SpriteRenderer);
  renderer.sprite = sprite;
  renderer.maskInteraction = maskInteraction;
  renderer.maskLayer = maskLayer;
}

function addMask(entity: Entity, pos: Vector3, scale: Vector3, sprite: Sprite, influenceLayers: number): void {
  rootEntity.addChild(entity);
  const { transform } = entity;
  transform.position = pos;
  transform.scale = scale;
  const mask = entity.addComponent(SpriteMask);
  mask.sprite = sprite;
  mask.influenceLayers = influenceLayers;
}
