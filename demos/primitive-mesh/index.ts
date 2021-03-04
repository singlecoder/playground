import { OrbitControl } from "@oasis-engine/controls";
import {
  Camera,
  PrimitiveMesh,
  MeshRenderer,
  SystemInfo,
  WebGLEngine,
  Script,
  Entity,
  BlinnPhongMaterial,
  Texture2D,
  AssetType,
  DirectLight,
  Vector3,
  Material,
  Mesh
} from "oasis-engine";

class RotateScript extends Script {
  constructor(entity: Entity) {
    super(entity);
  }

  onUpdate() {
    this.entity.transform.rotate(0.5, 0.6, 0);
  }
}

// Create engine object
const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

// Create camera
const cameraEntity = rootEntity.createChild("Camera");
cameraEntity.transform.setPosition(0, 0, 15);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

// Create direct light
const lightEntity = rootEntity.createChild("DirectLight");
const light = lightEntity.addComponent(DirectLight);
light.color.setValue(1, 1, 1, 1);
light.intensity = 0.3;

function generatePrimitiveEntity(type: string, position: Vector3, material: Material, mesh: Mesh) {
  const entity = rootEntity.createChild(type);
  entity.transform.setPosition(position.x, position.y, position.z);
  entity.addComponent(RotateScript);
  const renderer = entity.addComponent(MeshRenderer);
  renderer.mesh = mesh;
  renderer.setMaterial(material);

  return entity;
}

engine.resourceManager
  .load<Texture2D>({
    url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*ArCHTbfVPXUAAAAAAAAAAAAAARQnAQ",
    type: AssetType.Texture2D
  })
  .then((texture) => {
    const distanceX = 2.5;
    const distanceY = 2.5;
    const tempPos = new Vector3();

    // Create material
    const material = new BlinnPhongMaterial(engine);
    material.emissiveTexture = texture;
    material.emissiveColor.setValue(1, 1, 1, 1);

    for (let i = 0; i < 3; ++i) {
      const posX = (i - 1) * distanceX;

      // Create cuboid
      tempPos.setValue(posX, distanceY * 1.5, 0);
      generatePrimitiveEntity("cuboid", tempPos, material, PrimitiveMesh.createCuboid(engine));

      // Create sphere
      tempPos.setValue(posX, distanceY * 0.5, 0);
      generatePrimitiveEntity("sphere", tempPos, material, PrimitiveMesh.createSphere(engine));

      // Create plane
      tempPos.setValue(posX, -distanceY * 0.5, 0);
      generatePrimitiveEntity("plane", tempPos, material, PrimitiveMesh.createPlane(engine));

      // Create cylinder
      tempPos.setValue(posX, -distanceY * 1.5, 0);
      generatePrimitiveEntity("plane", tempPos, material, PrimitiveMesh.createCylinder(engine));
    }
  });

engine.run();
