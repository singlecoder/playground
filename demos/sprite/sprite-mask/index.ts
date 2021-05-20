import { OrbitControl } from "@oasis-engine/controls";
import {
  AssetType,
  Camera,
  Entity,
  Script,
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
      // Mask texture
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*qyhFT5Un5AgAAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    },
    {
      // Mask texture
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*pgrpQIneqSUAAAAAAAAAAAAAARQnAQ",
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
    scale.setValue(3, 3, 3);
    addSprite(
      spriteEntity.clone(),
      pos,
      scale,
      sprite0,
      SpriteMaskInteraction.VisibleInsideMask,
      SpriteMaskLayer.Layer0
    );
    addMask(maskEntity.clone(), pos, sprite1, SpriteMaskLayer.Layer0, "scale");

    // Show sprite outside mask.
    pos.setValue(5, 0, 0);
    scale.setValue(3, 3, 3);
    addSprite(
      spriteEntity.clone(),
      pos,
      scale,
      sprite0,
      SpriteMaskInteraction.VisibleOutsideMask,
      SpriteMaskLayer.Layer1
    );
    addMask(maskEntity.clone(), pos, sprite2, SpriteMaskLayer.Layer1);
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

function addMask(entity: Entity, pos: Vector3, sprite: Sprite, influenceLayers: number, aniType: String = ""): void {
  rootEntity.addChild(entity);
  entity.transform.position = pos;
  const mask = entity.addComponent(SpriteMask);
  mask.sprite = sprite;
  mask.influenceLayers = influenceLayers;

  if (aniType === "scale") {
    entity.addComponent(ScaleScript);
  } else {
    entity.addComponent(RotationScript);
  }
}

class ScaleScript extends Script {
  private _curScale: number = 1.0;
  private _scaleSpeed: number = 0.01;

  /**
   * The main loop, called frame by frame.
   * @param deltaTime - The deltaTime when the script update.
   */
  onUpdate(deltaTime: number): void {
    let curScale = this._curScale;

    if (curScale >= 2) {
      this._scaleSpeed = -0.01;
    } else if (curScale <= 0) {
      this._scaleSpeed = 0.01;
    }

    curScale += this._scaleSpeed;
    this._curScale = curScale;
    this.entity.transform.setScale(curScale, curScale, curScale);
  }
}

class RotationScript extends Script {
  private _curRotation: number = 0.0;
  private _rotationSpeed: number = 0.5;

  /**
   * The main loop, called frame by frame.
   * @param deltaTime - The deltaTime when the script update.
   */
  onUpdate(deltaTime: number): void {
    this._curRotation += this._rotationSpeed;
    this.entity.transform.setRotation(0, 0, this._curRotation);
  }
}
