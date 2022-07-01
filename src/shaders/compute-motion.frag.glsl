precision highp float;

uniform sampler2D uDataTexture;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

// const vec4 bitSh = vec4(256. * 256. * 256., 256. * 256., 256., 1.);
// const vec4 bitMsk = vec4(0., vec3(1. / 256.0));
// const vec4 bitShifts = vec4(1.) / bitSh;

// vec4 pack(float value) {
//   vec4 comp = fract(value * bitSh);
//   comp -= comp.xxyz * bitMsk;
//   return comp;
// }

// float unpack(vec4 color) {
//   return dot(color, bitShifts);
// }

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 getParticleVelocity(float particleIndex) {
  vec2 uv = vec2(1.0, particleIndex / uResolution.y);
  vec4 texel = texture2D(uDataTexture, uv);

  return (texel.xy - 0.5) * 2.0;
}

vec2 getParticlePosition(float particleIndex) {
  vec2 uv = vec2(0.0, particleIndex / uResolution.y);
  vec4 texel = texture2D(uDataTexture, uv);

  return (texel.xy - 0.5) * 2.0;
}

void main() {
  vec2 texCoord = floor(uResolution * vUv);
  float particleIndex = texCoord.y;

  vec2 currentParticleVelocity = getParticleVelocity(particleIndex);

  if(texCoord.x == 0.0) {// current position is stored in first pixel
    vec2 currentParticlePosition = getParticlePosition(particleIndex);
    currentParticlePosition += currentParticleVelocity;

    currentParticlePosition.x = clamp(currentParticlePosition.x, -1.0, 1.0);
    currentParticlePosition.y = clamp(currentParticlePosition.y, -1.0, 1.0);

    gl_FragColor = vec4((currentParticlePosition + 1.0) / 2.0, 0.0, 1.0);

  } else if(texCoord.x == 1.0) { // velocity value is stored in second pixel
    float randomX = (rand(vec2(particleIndex, uTime)) * 2.0) - 1.0;
    float randomY = (rand(vec2(particleIndex, uTime + 10.0)) * 2.0) - 1.0;

    currentParticleVelocity.x += randomX * 0.01; // just add a random value to the velocity
    currentParticleVelocity.y += randomY * 0.01; // just add a random value to the velocity

    currentParticleVelocity.x = clamp(currentParticleVelocity.x, -1.0, 1.0);
    currentParticleVelocity.y = clamp(currentParticleVelocity.y, -1.0, 1.0);

    gl_FragColor = vec4((currentParticleVelocity + 1.0) / 2.0, 0.0, 1.0);
  }
}