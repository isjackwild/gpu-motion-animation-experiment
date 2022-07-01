precision highp float;

uniform sampler2D uDataTexture;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float getParticleVelocity(float particleIndex) {
  vec2 uv = vec2(1.0, particleIndex / uResolution.y);
  vec4 texel = texture2D(uDataTexture, uv);

  return texel.r;
}

float getParticlePosition(float particleIndex) {
  vec2 uv = vec2(0.0, particleIndex / uResolution.y);
  vec4 texel = texture2D(uDataTexture, uv);

  return texel.r;
}

void main() {
  vec2 texCoord = floor(uResolution * vUv);
  float particleIndex = texCoord.y;

  float value;

  if(texCoord.x == 0.0) {// current position is stored in first pixel
    value = getParticlePosition(particleIndex);
    value += getParticleVelocity(particleIndex);
  } else if(texCoord.x == 1.0) { // velocity value is stored in second pixel
    float random = (rand(vec2(particleIndex, uTime)) * 2.0) - 1.0;

    value = getParticleVelocity(particleIndex) + random * 0.01; // just add a random value to the velocity
  }

  gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
}