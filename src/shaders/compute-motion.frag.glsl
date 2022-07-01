precision highp float;

uniform sampler2D uDataTexture;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float getParticleSpeed(float particleIndex) {
  vec2 uv = vec2(1.0, particleIndex / uResolution.y);
  vec4 texel = texture2D(uDataTexture, uv);

  return texel.r;
}

float getParticleValue(float particleIndex) {
  vec2 uv = vec2(0.0, particleIndex / uResolution.y);
  vec4 texel = texture2D(uDataTexture, uv);

  return texel.r;
}

void main() {
  vec2 texCoord = floor(uResolution * vUv);
  float particleIndex = texCoord.y;

  float value;

  if(texCoord.x == 0.0) {// current value is stored in first pixel
    value = getParticleValue(particleIndex);
    value += getParticleSpeed(particleIndex);
    value = clamp(value, 0.0, 1.0);
  } else if(texCoord.x == 1.0) { // speed value is stored in second pixel
    float random = (rand(vec2(particleIndex, uTime)) * 2.0) - 1.0;

    value = getParticleSpeed(particleIndex) + random * 0.01; // just add a random value to the speed
  }

  gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
}