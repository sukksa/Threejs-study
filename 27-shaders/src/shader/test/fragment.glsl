precision mediump float;

uniform vec3 uColor;
// 声明一个 uniform sampler2D，用于表示可以在片段着色器中采样的纹理
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;

void main() {
    // 第一个参数是纹理，第二个参数是在纹理的哪个位置着色也就是uv坐标
    vec4 textrueColor = texture2D(uTexture, vUv);
    // textrueColor.rgb *= vElevation * 2.0 + 0.5; // [0.3, 0.7]

    // gl_FragColor = vec4(uColor, 1.0);

    gl_FragColor = vec4(textrueColor);
    // gl_FragColor = vec4(vUv, 1.0, 1.0);
}