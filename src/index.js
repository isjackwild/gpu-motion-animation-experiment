import { resizeCanvasToDisplaySize, setDefaultTextureColor } from "twgl.js";
import DrawProgram from "./draw-program";
import ComputeMotionProgram from "./compute-motion-program";

let drawProgram, computeMotionProgram;

// set to true to render the data texture to the screen
const RENDER_DATA_TEXTURE_TO_SCREEN = false;

const render = () => {
  computeMotionProgram.render(RENDER_DATA_TEXTURE_TO_SCREEN);

  if (!RENDER_DATA_TEXTURE_TO_SCREEN) {
    drawProgram.setDataTexture(computeMotionProgram.getDataTexture());
    drawProgram.render();
  }
};

const update = () => {};

const animate = () => {
  update();
  render();
  requestAnimationFrame(animate);
};

const kickIt = () => {
  const canvas = document.getElementsByTagName("canvas")[0];
  const options = {
    antialias: false,
    alpha: false,
    depth: false,
    powerPreference: "high-performance",
  };
  const gl =
    typeof WebGL2RenderingContext !== "undefined"
      ? canvas.getContext("webgl2", options)
      : canvas.getContext("webgl", options);

  setDefaultTextureColor([0, 0, 0, 1]);
  resizeCanvasToDisplaySize(canvas, window.devicePixelRatio);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.DEPTH_TEST);

  computeMotionProgram = ComputeMotionProgram(gl);
  drawProgram = DrawProgram(gl);
  drawProgram.setDataTexture(computeMotionProgram.getDataTexture());

  animate();
};

if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", kickIt);
} else {
  window.attachEvent("onload", kickIt);
}
