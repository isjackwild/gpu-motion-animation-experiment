import {
  createProgramInfo,
  bindFramebufferInfo,
  drawBufferInfo,
  createBufferInfoFromArrays,
  setBuffersAndAttributes,
  setUniforms,
  createTexture,
} from "twgl.js";

import vert from "./shaders/vert.glsl";
import frag from "./shaders/frag.glsl";

const DrawProgram = (gl) => {
  const programInfo = createProgramInfo(gl, [vert, frag]);
  const arrays = {
    position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
  }; // a unit quad
  const bufferInfo = createBufferInfoFromArrays(gl, arrays);

  const uniforms = {
    uDataTexture: null,
  };

  const setDataTexture = (texture) => {
    uniforms.uDataTexture = texture;
  };

  const render = () => {
    gl.useProgram(programInfo.program);
    bindFramebufferInfo(gl, null); // output to screen
    setUniforms(programInfo, uniforms);
    setBuffersAndAttributes(gl, programInfo, bufferInfo);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
  };

  return { render, setDataTexture };
};

export default DrawProgram;
