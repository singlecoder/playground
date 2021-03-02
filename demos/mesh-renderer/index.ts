import { OrbitControl } from "@oasis-engine/controls";
import {
  BlinnPhongMaterial,
  Camera,
  PrimitiveMesh,
  MeshRenderer,
  SystemInfo,
  Vector3,
  WebGLEngine
} from "oasis-engine";

//-- create engine object
const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

//-- create camera
const cameraEntity = rootEntity.createChild("camera_entity");
cameraEntity.transform.position = new Vector3(0, 0, 50);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

//-- Create cuboid
const cuboidEntity = rootEntity.createChild("cuboid");
cuboidEntity.transform.setPosition(-5, 5, 0);
cuboidEntity.transform.rotate(30, 10, 80);
const cuboidRenderer = cuboidEntity.addComponent(MeshRenderer);
const cuboidMaterial = new BlinnPhongMaterial(engine);
cuboidMaterial.emissiveColor.setValue(1, 0, 0, 1);
cuboidRenderer.mesh = PrimitiveMesh.createCuboid(engine, 3, 3, 3);
cuboidRenderer.setMaterial(cuboidMaterial);

//-- Create sphere
const sphereEntity = rootEntity.createChild("sphere");
sphereEntity.transform.setPosition(5, 5, 0);
const sphereRenderer = sphereEntity.addComponent(MeshRenderer);
const sphereMaterial = new BlinnPhongMaterial(engine);
sphereMaterial.emissiveColor.setValue(0, 1, 0, 1);
sphereRenderer.mesh = PrimitiveMesh.createSphere(engine, 3);
sphereRenderer.setMaterial(sphereMaterial);

//-- Create plane
const planeEntity = rootEntity.createChild("plane");
planeEntity.transform.setPosition(-5, -5, 0);
const planeRenderer = planeEntity.addComponent(MeshRenderer);
const planeMaterial = new BlinnPhongMaterial(engine);
planeMaterial.emissiveColor.setValue(0, 0, 1, 1);
planeRenderer.mesh = PrimitiveMesh.createPlane(engine, 3, 3);
planeRenderer.setMaterial(planeMaterial);

//-- Create cylinder
const cylinderEntity = rootEntity.createChild("cylinder");
cylinderEntity.transform.setPosition(5, -5, 0);
const cylinderRenderer = cylinderEntity.addComponent(MeshRenderer);
const cylinderMaterial = new BlinnPhongMaterial(engine);
cylinderMaterial.emissiveColor.setValue(1, 1, 1, 1);
cylinderRenderer.mesh = PrimitiveMesh.createCylinder(engine, 1, 5);
cylinderRenderer.setMaterial(cylinderMaterial);

engine.run();
