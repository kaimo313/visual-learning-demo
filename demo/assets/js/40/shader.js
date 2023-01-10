export const vertex = `
    precision highp float;
    precision highp int;

    attribute vec3 position;
    attribute vec3 normal;
    attribute vec4 color;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec4 vColor;

    uniform vec3 pointLightPosition; //点光源位置

    void main() {
        vNormal = normalize(normalMatrix * normal);

        vUv = uv;
        vColor = color;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const fragment = `
    precision highp float;
    precision highp int;

    varying vec3 vNormal;
    varying vec4 vColor;

    uniform sampler2D tMap;
    varying vec2 vUv;

    uniform vec2 uResolution;

    void main() {
        vec4 color = vColor;
        vec4 texColor = texture2D(tMap, vUv);
        vec2 st = gl_FragCoord.xy / uResolution;

        float alpha = texColor.a;
        color.rgb = mix(color.rgb, texColor.rgb, alpha);
        color.rgb = mix(texColor.rgb, color.rgb, clamp(color.a / max(0.0001, texColor.a), 0.0, 1.0));
        color.a = texColor.a + (1.0 - texColor.a) * color.a;

        float d = distance(st, vec2(0.5));

        gl_FragColor.rgb = color.rgb + 0.3 * pow((1.0 - d), 3.0);
        gl_FragColor.a = color.a;
    }
`;

export const skyVertex = `
    precision highp float;
    precision highp int;

    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    uniform mat3 normalMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const skyFragment = `
    precision highp float;
    precision highp int;
    varying vec2 vUv;

    highp float random(vec2 co)
    {
        highp float a = 12.9898;
        highp float b = 78.233;
        highp float c = 43758.5453;
        highp float dt= dot(co.xy ,vec2(a,b));
        highp float sn= mod(dt,3.14);
        return fract(sin(sn) * c);
    }

    // Value Noise by Inigo Quilez - iq/2013
    // https://www.shadertoy.com/view/lsf3WH
    highp float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix( mix( random( i + vec2(0.0,0.0) ),
            random( i + vec2(1.0,0.0) ), u.x),
            mix( random( i + vec2(0.0,1.0) ),
            random( i + vec2(1.0,1.0) ), u.x), u.y);
    }

    void main() {
        gl_FragColor.rgb = vec3(1.0);
        gl_FragColor.a = step(0.93, noise(vUv * 6000.0));
    }
`;

export const beamVertx = `
    precision highp float;
    precision highp int;

    attribute vec3 position;
    attribute vec3 normal;
    attribute vec4 color;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    varying vec3 vNormal;
    varying vec4 vColor;

    uniform vec4 ambientColor; // 环境光
    uniform float uHeight;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        vec3 ambient = ambientColor.rgb * color.rgb;// 计算环境光反射颜色
        float height = 0.5 - position.z / uHeight;
        vColor = vec4(ambient + 0.3 * sin(height), color.a * height);
        vec3 P = position;
        P.xy *= 2.0 - pow(height, 3.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.0);
    }
`;

export const beamFrag = `
    precision highp float;
    precision highp int;

    varying vec3 vNormal;
    varying vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
`;

export const spotVertex = `
    precision highp float;
    precision highp int;

    attribute vec4 position;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    uniform float uWidth;
    uniform float uSpeed;
    uniform float uHeight;

    varying vec2 st;

    void main() {
        float s = 0.0 + (0.2 * uWidth * position.w);
        vec3 P = vec3(s * position.xy, 0.0);
        st = P.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.0);
    }
`;

export const spotFragment = `
    precision highp float;
    precision highp int;

    uniform vec2 uResolution;
    uniform vec3 uColor;
    uniform float uWidth;

    varying vec2 st;

    void main() {
        float d = distance(st, vec2(0));
        gl_FragColor.rgb = uColor + 1.5 * (0.2 * uWidth - 2.0 * d);
        gl_FragColor.a = 1.0;
    }
`;

export const markerVertex = `
    precision highp float;
    precision highp int;

    attribute vec4 position;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    uniform float uTime;
    uniform float uWidth;
    uniform float uSpeed;
    uniform float uHeight;

    varying float time;

    void main() {
        time = mod(uTime, 1.5 / uSpeed) * uSpeed + position.z - 1.0;
        float d = clamp(0.0, uWidth * mix(1.0, 0.5, min(1.0, uHeight)), time);
        float s = d + (0.1 * position.w);
        vec3 P = vec3(s * position.xy, uHeight * time);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.0);
    }
`;

export const markerFragment = `
    precision highp float;
    precision highp int;

    uniform vec2 uResolution;
    uniform vec3 uColor;

    varying float time;

    void main() {
        float t = clamp(0.0, 1.0, time);
        gl_FragColor.rgb = uColor;
        gl_FragColor.a = 1.0 - t;
    }
`;