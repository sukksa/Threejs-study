#define PI 3.1415926535897932384626433832795 
varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}

void main() {
    //  // pattern 3
    // float strength = vUv.x; 

    //  // pattern 4
    // float strength = vUv.y;

    // // pattern 5
    // float strength = 1.0 - vUv.y;

    // // pattern 6
    // float strength = vUv.y * 10.0;

    // // pattern 7
    // float strength = mod(vUv.y * 10.0, 1.0);

    // // pattern 8
    // float strength = mod(vUv.y * 10.0, 1.0);
    // // if 会影响性能
    // /*if(strength < 0.5) {
    //     strength = 0.0;
    // } else {
    //     strength = 1.0;
    // } 

    // strength = strength < 0.5 ? 0.0 : 1.0; // 三元运算符
    // */
    // strength = step(0.5, strength); // 超过阈值0.5，返回1.0，否则返回0.0

    // // pattern 9
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);

    // // pattern 10
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));

    // pattern 11
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0)); 

    // // pattern 12
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0)); // 只能看到交点处

    // pattern 13
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0)); 

    // pattern 14
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0, 1.0)); 
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0));
    // barY *= step(0.8, mod(vUv.x * 10.0, 1.0)); 
    // float strength = barX + barY;

    // pattern 15
    // float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0, 1.0));
    // barY *= step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // float strength = barX + barY;

     // pattern 16
    // float strength = abs(vUv.x - 0.5);

     // pattern 17
     // 水平方向和垂直方向的最小值
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

     // pattern 18
     // 水平方向和垂直方向的最大值
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // pattern 19
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // strength = step(0.2, strength);

    // pattern 20
    // 1 减去 step 相当于取反, 两个正方形的交集
    // float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float square2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = square1 * square2;

    // pattern 21
    // floor 向下取整，分成x段就乘x除x
    // float strength = floor(vUv.x * 10.0) / 10.0;

    // pattern 22
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // strength *= floor(vUv.y * 10.0) / 10.0;

    // pattern 23
    // float strength = random(vUv);

    // pattern 24
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    // float strength = random(gridUv); // 随机数

    // pattern 25
    // 根据x偏移y的值，或者y偏移x的值，来生成随机数
    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0);
    // float strength = random(gridUv); // 随机数

    // pattern 26
    // 获得向量的长度 z = sqrt(x^2 + y^2)
    // float strength = length(vUv);

    // pattern 27
    // float strength = distance(vUv, vec2(0.5)); // 计算到中心点(0.5, 0.5)的距离，sqrt((x-0.5)^2 + (y-0.5)^2)
    // 在几何学中，向量的模长相当于从原点到该向量终点的距离。sqrt(x^2 + y^2)，向量减去0.5，sqrt((x-0.5)^2 + (y-0.5)^2)
    // float strength = length(vUv - 0.5); // 向量xy分别减去0.5

    // pattern 28
    // float strength = 1.0 - distance(vUv, vec2(0.5));

    // pattern 29
    // 可以做星星效果，更改分子的值。但是平面的边缘不等于0，可能在特定的角度可以看到平面
    // float strength = 0.015 / distance(vUv, vec2(0.5));

    // // pattern 30
    // vec2 lightUv = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float strength = 0.015 / distance(lightUv, vec2(0.5));

    // pattern 31
    // vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    // vec2 lightUvY = vec2(vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    // float strength = lightX * lightY;

    // pattern 32

    vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));

    vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    vec2 lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    float strength = lightX * lightY;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
