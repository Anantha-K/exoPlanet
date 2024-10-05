
varying vec3 vertexNormal;
uniform float atmoTemp;

void main(){
//gl frag color is R G B
    float intensity = pow(0.8-dot(vertexNormal, vec3(0.051, 0.0, 1.0)), 2.0);

    gl_FragColor= vec4(atmoTemp, 0.7098, 0.8706, 1.0)*intensity;

}