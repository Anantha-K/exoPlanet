uniform sampler2D landTexture;

varying vec2 vertexUV; //vec2
varying vec3 vertexNormal;

void main(){
//gl frag color is R G B
    float intensity = 1.05 - dot(vertexNormal, vec3(0.9098, 0.7922, 0.051));
    vec3 land = vec3(0.0157, 0.0039, 0.0039)* pow(intensity,1.5);//atmosphere colour

    gl_FragColor= vec4(land +texture2D(landTexture,vertexUV ).xyz, 1.0);

}