precision highp float;

uniform sampler2D uDataTexture;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

const vec4 bitSh = vec4(256. * 256. * 256., 256. * 256., 256., 1.);
const vec4 bitMsk = vec4(0., vec3(1. / 256.0));
const vec4 bitShifts = vec4(1.) / bitSh;

vec4 pack(float value) {
  vec4 comp = fract(value * bitSh);
  comp -= comp.xxyz * bitMsk;
  return comp;
}

float unpack(vec4 color) {
  return dot(color, bitShifts);
}

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float getParticleVelocity(float particleIndex) {
  vec2 uv = vec2(1.0, particleIndex / uResolution.y);
  vec4 texel = texture2D(uDataTexture, uv);

  return unpack(texel);
}

float getParticlePosition(float particleIndex) {
  vec2 uv = vec2(0.0, particleIndex / uResolution.y);
  vec4 texel = texture2D(uDataTexture, uv);

  return unpack(texel);
}

void main() {
  vec2 texCoord = floor(uResolution * vUv);
  float particleIndex = texCoord.y;

  float currentParticleVelocity = getParticleVelocity(particleIndex);

  if(texCoord.x == 0.0) {// current position is stored in first pixel
    float currentParticlePosition = getParticlePosition(particleIndex);
    currentParticlePosition += currentParticleVelocity;

    currentParticlePosition = clamp(currentParticlePosition, -1.0, 1.0);

    gl_FragColor = pack(currentParticlePosition);

  } else if(texCoord.x == 1.0) { // velocity value is stored in second pixel
    float random = (rand(vec2(particleIndex, uTime)) * 2.0) - 1.0;

    currentParticleVelocity += random * 0.001; // just add a random value to the velocity
    currentParticleVelocity = clamp(currentParticleVelocity, -1.0, 1.0);

    gl_FragColor = pack(currentParticleVelocity);
  }
}