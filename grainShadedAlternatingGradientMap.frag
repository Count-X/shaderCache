#version 450
// Grain Shaded Gradient Map by Markus Linnanen aka. Count-X & Webscum

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex0;
uniform vec2 u_tex0resolution;

out vec4 outColor;

vec3 A0 = vec3(0.149,0.141,0.912);
vec3 B0 = vec3(1.000,0.833,0.224);
vec3 A1 = vec3(1.0, .22, 0.1);
vec3 B1 = vec3(.33, .11, .82);

float grainIntensity = 0.05;
float posterizeGrades = 6.0;

vec3 interpolateBetweenTwoColors( in vec3 firstColor, in vec3 secondColor, in float x){
    float red = firstColor.r + (x * (secondColor.r - firstColor.r));
    float green = firstColor.g + (x * (secondColor.g - firstColor.g));
    float blue = firstColor.b + (x * (secondColor.b - firstColor.b));

    return vec3(red, green, blue);
}

vec3 interpolateBetweenFourColors( in vec3 firstFirstColor, in vec3 firstSecondColor, in vec3 secondFirstColor, in vec3 secondSecondColor, in float x, in float speed){
    vec3 col0 = interpolateBetweenTwoColors(firstFirstColor,firstSecondColor, sin(u_time * speed));
    vec3 col1 = interpolateBetweenTwoColors(secondFirstColor, secondSecondColor, sin(u_time * speed));
    float red = col0.r + (x * (col1.r - col0.r));
    float green = col0.g + (x * (col1.g - col0.g));
    float blue = col0.b + (x * (col1.b - col0.b));

    return vec3(red, green, blue);
}

// Posterization or posterisation of an image is the conversion of
// a continuous gradation of tone to several regions of fewer tones,
// causing abrupt changes from one tone to another.
//
// Inteded to be used with grayscaled renders on my implementation
// No idea if this effect is actually what posterize does but it looks similar
// If not i would call this a clip step
float posterize(in float colorToPost, in float grades){
    float colorsGrade = round(grades * colorToPost);
    return 1.0 * (colorsGrade / grades);
}

// Credit to patrio gonzales
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(13.9898,18.233)))*
       85400.5453123 * sin(u_time * .1));
}

float imageGreyScale(in sampler2D ref){
    vec3 texColor = texture(ref, gl_FragCoord.xy/u_resolution.xy).rgb;
    return (texColor.r + texColor.g + texColor.b) / 3.0;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float grayscaledPosterizedImg = posterize(imageGreyScale(u_tex0) + (random(st) * grainIntensity), posterizeGrades);
    vec4 interpolatedColor = vec4(vec3(interpolateBetweenFourColors(A0, A1, B0, B1, grayscaledPosterizedImg, 0.2)), 1.);
    
    //vec3 cr = smoothstep(A,B, vec3(n));

    outColor = interpolatedColor;
}

