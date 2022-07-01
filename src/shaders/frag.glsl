precision mediump float;

uniform sampler2D uDataTexture;

void main() {
  vec4 texel = texture2D(uDataTexture, vec2(0.0, 0.0));

  gl_FragColor = texel;
}