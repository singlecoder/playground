import { OrbitControl } from "@oasis-engine/controls";
import * as dat from "dat.gui";
import {
  AssetType,
  BlendFactor,
  BlendOperation,
  Camera,
  CullMode,
  Entity,
  Material,
  RenderQueueType,
  Script,
  Shader,
  Sprite,
  SpriteRenderer,
  SystemInfo,
  Texture2D,
  Vector3,
  WebGLEngine
} from "oasis-engine";

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
  .load<Texture2D>([
    {
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*L2GNRLWn9EAAAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    },
    {
      // Noise texture
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*j2xJQL0e6J4AAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    },
    {
      // Ramp texture
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*ygj3S7sm4hQAAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    }
  ])
  .then((textures) => {
    const texture = textures[0];
    // Create origin sprite entity.
    const spriteEntity = rootEntity.createChild("spriteDissolve");
    spriteEntity.addComponent(SpriteRenderer).sprite = new Sprite(engine, texture);
    spriteEntity.transform.setScale(4, 4, 4);
    const script = spriteEntity.addComponent(AnimateScript);
    // Add custom material
    script.material = addCustomMaterial(spriteEntity, textures[1], textures[2]);
    // Add Data UI
    script.guiData = addDataGUI(script.material, script);
  });

engine.run();

/**
 * Add data GUI.
 */
function addDataGUI(material: Material, animationScript: AnimateScript): any {
  const { shaderData } = material;
  const gui = new dat.GUI();
  const guiData = {
    threshold: 0.0,
    edgeLength: 0.1,
    reset: () => {
      guiData.threshold = 0.0;
      guiData.edgeLength = 0.1;
      shaderData.setFloat("u_threshold", 0.0);
      shaderData.setFloat("u_edgeLength", 0.1);
    },
    pause: function () {
      animationScript.enabled = false;
    },
    resume: function () {
      animationScript.enabled = true;
    }
  };

  gui
    .add(guiData, "threshold", 0.0, 1.0, 0.01)
    .onChange((value: number) => {
      shaderData.setFloat("u_threshold", value);
    })
    .listen();
  gui
    .add(guiData, "edgeLength", 0.0, 0.2, 0.001)
    .onChange((value: number) => {
      shaderData.setFloat("u_edgeLength", value);
    })
    .listen();
  gui.add(guiData, "reset").name("重置");
  gui.add(guiData, "pause").name("暂停动画");
  gui.add(guiData, "resume").name("继续动画");

  return guiData;
}

function addCustomMaterial(entity: Entity, noiseTexture: Texture2D, rampTexture: Texture2D): Material {
  rootEntity.addChild(entity);
  // Create material
  const material = new Material(engine, Shader.find("SpriteDissolve"));
  entity.getComponent(SpriteRenderer).setMaterial(material);
  // Init state
  const target = material.renderState.blendState.targetBlendState;
  target.enabled = true;
  target.sourceColorBlendFactor = BlendFactor.SourceAlpha;
  target.destinationColorBlendFactor = BlendFactor.OneMinusSourceAlpha;
  target.sourceAlphaBlendFactor = BlendFactor.One;
  target.destinationAlphaBlendFactor = BlendFactor.OneMinusSourceAlpha;
  target.colorBlendOperation = target.alphaBlendOperation = BlendOperation.Add;
  material.renderState.depthState.writeEnabled = false;
  material.renderQueueType = RenderQueueType.Transparent;
  material.renderState.rasterState.cullMode = CullMode.Off;
  // Set uniform
  const { shaderData } = material;
  shaderData.setFloat("u_threshold", 0.0);
  shaderData.setFloat("u_edgeLength", 0.1);
  shaderData.setTexture("u_rampTexture", rampTexture);
  shaderData.setTexture("u_noiseTexture", noiseTexture);

  return material;
}

class AnimateScript extends Script {
  guiData: any;
  material: Material;

  /**
   * The main loop, called frame by frame.
   * @param deltaTime - The deltaTime when the script update.
   */
  onUpdate(deltaTime: number): void {
    const { material, guiData } = this;
    const { shaderData } = material;

    // Update gui data
    const threshold = (guiData.threshold = (guiData.threshold + deltaTime * 0.0003) % 1.0);
    // Update material data
    shaderData.setFloat("u_threshold", threshold);
  }
}

// Custom shader
const spriteVertShader = `
  precision highp float;

  uniform mat4 u_VPMat;

  attribute vec3 POSITION;
  attribute vec2 TEXCOORD_0;
  attribute vec4 COLOR_0;

  varying vec4 v_color;
  varying vec2 v_uv;

  void main()
  {
    gl_Position = u_VPMat * vec4(POSITION, 1.0);
    v_color = COLOR_0;
    v_uv = TEXCOORD_0;
  }
`;

const spriteFragmentShader = `
  precision mediump float;
  precision mediump int;

  uniform sampler2D u_texture;
  uniform sampler2D u_noiseTexture;
  uniform sampler2D u_rampTexture;
  uniform float u_threshold;
  uniform float u_edgeLength;

  varying vec2 v_uv;
  varying vec4 v_color;

  vec4 lerp(vec4 a, vec4 b, float w) {
    return a + w * (b - a);
  }

  void main() {
    float r = texture2D(u_noiseTexture, v_uv).r;
    float diff = r - u_threshold;
    if (diff <= 0.0) {
      discard;
    }

    float degree = clamp(0.0, 1.0, diff / u_edgeLength);
    vec4 edgeColor = texture2D(u_rampTexture, vec2(degree, degree));
    vec4 color = texture2D(u_texture, v_uv);
    vec4 finalColor = lerp(edgeColor, color, degree);
    gl_FragColor = vec4(finalColor.rgb, color.a) * v_color;
  }
`;

Shader.create("SpriteDissolve", spriteVertShader, spriteFragmentShader);
