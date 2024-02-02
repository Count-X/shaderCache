#ifdef GL_ES
precision mediump float;
#endif
#extension GL_EXT_gpu_shader4 : enable

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 color;

void main(){
    float colNum = round(sin((gl_FragCoord.y + u_time * 25.0)/ 50) + .5) + .0;
    gl_FragColor = vec4(vec3(colNum) * color,  .5);
}