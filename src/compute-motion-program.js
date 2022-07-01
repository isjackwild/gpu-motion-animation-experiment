import {
  createProgramInfo,
  bindFramebufferInfo,
  drawBufferInfo,
  createBufferInfoFromArrays,
  setBuffersAndAttributes,
  createFramebufferInfo,
  setUniforms,
  createTexture,
} from "twgl.js";

import vert from "./shaders/vert.glsl";
import frag from "./shaders/compute-motion.frag.glsl";

const PARTICLES = 1;

const ComputeMotionProgram = (gl) => {
  let pingPongIndex = 0;
  const frameBufferInfos = [
    createFramebufferInfo(gl, null, 2 + 2, PARTICLES),
    createFramebufferInfo(gl, null, 2 + 2, PARTICLES),
  ];

  const programInfo = createProgramInfo(gl, [vert, frag]);
  const arrays = {
    position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
  }; // a unit quad
  const bufferInfo = createBufferInfoFromArrays(gl, arrays);

  const uniforms = {
    uDataTexture: createTexture(gl, { width: 1, height: 1 }),
    uFirstFrame: 1,
  };

  const doPingPongBuffers = () => {
    pingPongIndex++;
  };

  const getThisFrameBufferInfo = () => {
    return frameBufferInfos[pingPongIndex % 2];
  };

  const getDataTexture = () => {
    return getThisFrameBufferInfo().attachments[0];
  };

  const render = () => {
    gl.useProgram(programInfo.program);

    setBuffersAndAttributes(gl, programInfo, bufferInfo);
    setUniforms(programInfo, uniforms);

    // render to data texture
    bindFramebufferInfo(gl, getThisFrameBufferInfo());
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);

    uniforms.uDataTexture = getDataTexture();
    doPingPongBuffers();
  };

  return { render, getDataTexture };
};

export default ComputeMotionProgram;
