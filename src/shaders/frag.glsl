precision mediump float;

uniform sampler2D uDataTexture;
varying vec2 vUv;

void main() {
  vec4 texel = texture2D(uDataTexture, vUv);

  gl_FragColor = texel;
}