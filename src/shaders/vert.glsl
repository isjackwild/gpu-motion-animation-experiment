precision highp float;

attribute vec4 position;
varying vec2 vUv;

void main() {
  vUv = vec2((position.x + 1.0) / 2.0, (position.y + 1.0) / 2.0);

  gl_Position = position;
}