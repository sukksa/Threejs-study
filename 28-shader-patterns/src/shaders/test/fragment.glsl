#define PI 3.1415926535897932384626433832795 
varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec2 fade(vec2 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}
float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 *
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main() {
    // pattern 1
    // gl_FragColor = vec4(vUv, 1.0, 1.0);

    // pattern 2
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

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

    // pattern 8
    // float strength = mod(vUv.y * 10.0, 1.0);
/*     // if 会影响性能
    if(strength < 0.5) {
        strength = 0.0;
    } else {
        strength = 1.0;
    } 

    strength = strength < 0.5 ? 0.0 : 1.0; // 三元运算符 */

    // strength = step(0.5, strength); // 超过阈值0.5，返回1.0，否则返回0.0

    // pattern 9
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

    float barX = step(0.4, 1.0);
    barX *= step(0.8, mod(vUv.y + 0.4, 1.0));
    float barY = step(0.4, 1.0);
    barY *= step(0.8, mod(vUv.x + 0.4, 1.0));
    float strength = barX + barY+0.1;

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
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
    // vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    // vec2 lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    // float strength = lightX * lightY;

    // // pattern 33
    // float strength = step(0.25, distance(vUv, vec2(0.5)));

    // pattern 34
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // pattern 35
    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // pattern 36
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // pattern 37
    // vec2 wavedUv = vec2(vUv.x, vUv.y + sin(vUv.x * 30.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // pattern 38
    // vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // pattern 40
    // vec2 wavedUv = vec2(vUv.x + sin(vUv.y * 100.0) * 0.1, vUv.y + sin(vUv.x * 100.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));

    // pattern 41
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;

    // pattern 42
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5 );
    // float strength = angle;

    // pattern 43
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = angle;

    // pattern 44
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 20.0;
    // angle = mod(angle, 1.0);
    // float strength = angle;

    // pattern 45
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = sin(angle * 100.0);
    // float radius = 0.25 + sinusoid * 0.01;
    // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius)); // 计算到中心点(0.5, 0.5)的距离，sqrt((x-0.5)^2 + (y-0.5)^2)

    // pattern 46 perlin noise 
    // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
    // 生成随机性、云朵，对面的倒影等等
    // float strength = cnoise(vUv * 10.0);

    // pattern 47
    // cnoise 返回正数和负数
    // float strength = step(0.0, cnoise(vUv * 10.0));

    // pattern 48
    // cnoise 返回正数和负数
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));

    // pattern 49
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // pattern 49
    // float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));

    // Clamp the strength to the range [0.0, 1.0]
    // 当strength超过了1，混合是第三个值会超过1，颜色的值被计算到更大的范围，所以需要限制界限
    // strength = clamp(strength, 0.0, 1.0); // 限制范围在0-1之间

    // // mix color
    // vec3 blackColor = vec3(0.0); // black
    // vec3 uvColor = vec3(vUv, 1.0);
    // vec3 mixedColor = mix(blackColor, uvColor, strength); // 混合颜色
    // gl_FragColor = vec4(mixedColor, 1.0); 

    // black and white
    gl_FragColor = vec4(vec3(strength), 1.0);
}
