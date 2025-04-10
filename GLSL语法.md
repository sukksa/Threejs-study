# GLSL语法

GLSL(OpenGL Shading Language)是用于编写着色器的语言，语法上和C语言类似。需要尾随分号

GLSL没有输出打印，因为不是由CPU处理的，是GPU做的运算，同时处理数百万计的顶点与片段，无法记录日志。

**`GLSL`** 的变量命名方式与 **C** 语言类似，可使用字母，数字以及下划线，不能以数字开头。还需要注意的是，变量名不能以 **`gl_`** 作为前缀，这个是 **`GLSL`** 保留的前缀，用于 **`GLSL`** 的内部变量。

[The Book of Shaders](https://thebookofshaders.com/?lan=ch)

## 数据类型

### 基本数据类型

|  类型   |                             描述                             |
| :-----: | :----------------------------------------------------------: |
| `void`  | 跟 **C** 语言的 `void`类似，表示空类型。作为函数的返回类型，表示这个函数不返回值。 |
| `bool`  | **布尔类型**，`true`或 `false`，以及可以产生布尔型的表达式。 |
|  `int`  |                          有符号整型                          |
| `uint`  |                          无符号整形                          |
| `float` |                            浮点型                            |

float 与 float ，int 与 int之间是可以直接运算的，但 float 与 int 不行。它们需要进行一次显示转换，即要么把float转成int: int(1.0) ，要么把int转成float: float(1)，以下表达式都是正确的:

```glsl
int a = int(2.0);
float a = float(2);

int a = int(2.0) * 2 + 1;
float a = float(2) * 6.0 + 2.3;
```

### 向量类型

|       类型        |       描述        |
| :---------------: | :---------------: |
|  vec2,vec3,vec4   |   n维浮点数向量   |
| ivec2,ivec3,ivec4 |    n维整数向量    |
| uvec2,uvec3,uvec4 | n维无符号整数向量 |
| bvec2,vbec3,bvec4 |    n维布尔向量    |

声明一个二维浮点数向量，并且必须赋值，如果只有一个值会同时作用与所有。

```glsl
vec2 foo = vec2(1.0, 2.0);
vec2 foo2 = vec2(0.0); // vec2 foo2 = vec2(0.0, 0.0);
```

高维向量可以直接从低维向量取值，`bar`的xy会取`foo`的值

```glsl
vec2 foo = vec2(1.0, 2.0);
vec3 bar = vec3(foo, 0.0); // vec3 bar = vec3(foo.x, foo.y, 0.0);
```

GLSL 中的向量(vec2,vec3,vec4)往往有特殊的含义，比如可能代表了一个空间坐标(x,y,z,w)，或者代表了一个颜色(r,g,b,a)，再或者代表一个纹理坐标(s,t,p,q) 。所以GLSL提供了一些更人性化的分量访问方式.

`vector.xyzw` 其中 xyzw 可以任意组合

`vector.rgba` 其中 rgba 可以任意组合

`vector.stpq` 其中 stpq 可以任意组合

```glsl
vec4 v = vec4(1.0, 2.0, 3.0, 4.0);
float x = v.x; // 1.0
float x1 = v.r; // 1.0
float x2 = v[0]; // 1.0

vec3 xyz = v.xyz; // vec3(1.0,2.0,3.0)
vec3 xyz1 = vec(v[0], v[1], v[2]); // vec3(1.0,2.0,3.0)
vec3 rgb = v.rgb; // vec3(1.0,2.0,3.0)

vec2 bar = v.xz; // vec2(1.0, 3.0);
vec2 baz = v.zy; // vec2(3.0, 2.0);
```

### 矩阵类型

|      类型      |                     描述                     |
| :------------: | :------------------------------------------: |
| mat2 或 mat2x2 |             2x2的浮点数矩阵类型              |
| mat3 或 mat3x3 |             3x3的浮点数矩阵类型              |
| mat4 或 mat4x4 |             4x4的浮点数矩阵类型              |
|     mat2x3     | 2列3行的浮点矩阵（OpenGL的矩阵是列主顺序的） |
|     mat2x4     |               2列4行的浮点矩阵               |
|     mat3x2     |               3列2行的浮点矩阵               |
|     mat3x4     |               3列4行的浮点矩阵               |
|     mat4x2     |               4列2行的浮点矩阵               |
|     mat4x3     |               4列3行的浮点矩阵               |

## 函数

GLSL 中函数不能够递归调用，且必须声明返回值类型（无返回值时声明为 void）。

### 自定义函数

自定义函数规则和C语言差不多，每个shader中必须有一个main函数。

```glsl
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;

float add(float a, float b){
  return a + b;
}

void fun(){
  // ...
}

void main() {
  float result = add(1.0, 2.0)
  fun()
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
```

### 内置函数