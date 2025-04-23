uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
// 高度
varying float vElevation;

void main() {
  // 通过波浪的高度(y)混合颜色，高度越高，多使用uDepthColor，反之多使用uSurfaceColor
  // 因为 vElevation的取值[-0.2, 0.2]，所以需要乘以一个系数，来控制颜色的混合程度
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 color = mix(uSurfaceColor, uDepthColor, mixStrength);

  gl_FragColor = vec4(color, 1.0);
}