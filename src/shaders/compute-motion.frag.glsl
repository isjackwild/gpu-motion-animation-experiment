precision mediump float;

uniform sampler2D uDataTexture;

void main() {
  vec4 texel = texture2D(uDataTexture, vec2(0.5, 0.5));
  texel.r += 0.1;
  texel.r = clamp(texel.r, 0.0, 1.0);

  gl_FragColor = texel;
}