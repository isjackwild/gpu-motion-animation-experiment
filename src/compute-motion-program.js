import {
  createProgramInfo,
  bindFramebufferInfo,
  drawBufferInfo,
  createBufferInfoFromArrays,
  setBuffersAndAttributes,
  createFramebufferInfo,
  setUniforms,
  createTexture,
  setTextureParameters,
} from "twgl.js";

import vert from "./shaders/vert.glsl";
import frag from "./shaders/compute-motion.frag.glsl";

const PARTICLES = 100;
const COMPONENTS = 1 + 1; // 1D position + 1D velocity

const ComputeMotionProgram = (gl) => {
  let pingPongIndex = 0;
  const frameBufferInfos = [
    createFramebufferInfo(gl, null, COMPONENTS, PARTICLES),
    createFramebufferInfo(gl, null, COMPONENTS, PARTICLES),
  ];
  // make sure to set the filters and wrapping params for the frame buffer attachments
  frameBufferInfos.forEach((fbo) => {
    setTextureParameters(gl, fbo.attachments[0], {
      mag: gl.NEAREST,
      wrap: gl.CLAMP_TO_EDGE,
    });
  });

  const programInfo = createProgramInfo(gl, [vert, frag]);
  const arrays = {
    position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
  }; // a unit quad
  const bufferInfo = createBufferInfoFromArrays(gl, arrays);

  const initDataTextureSrc = [];
  for (let i = 0; i < PARTICLES; i++) {
    initDataTextureSrc.push(0, 0, 0, 0); // particle position;
    initDataTextureSrc.push(0, 0, 0, 0); // particle velocity;
  }
  const uniforms = {
    // init with a data texture we make ourselves
    uDataTexture: createTexture(gl, {
      width: COMPONENTS,
      height: PARTICLES,
      wrap: gl.CLAMP_TO_EDGE,
      min: gl.NEAREST,
      mag: gl.NEAREST,
      src: initDataTextureSrc,
    }),
    uResolution: [COMPONENTS, PARTICLES],
    uTime: 0,
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

  const render = (renderToScreen = false) => {
    gl.useProgram(programInfo.program);

    setBuffersAndAttributes(gl, programInfo, bufferInfo);
    setUniforms(programInfo, uniforms);

    bindFramebufferInfo(gl, getThisFrameBufferInfo());
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);

    if (renderToScreen) {
      bindFramebufferInfo(gl, null);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);
    }

    // set the data texture we just drew to as the input data texture, and then ping pong buffers
    uniforms.uDataTexture = getDataTexture();
    uniforms.uTime += 1;
    doPingPongBuffers();
  };

  return { render, getDataTexture };
};

export default ComputeMotionProgram;
