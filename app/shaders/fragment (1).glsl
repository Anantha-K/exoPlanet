
uniform sampler2D globeTexture;
varying vec2 vertexUV; //vec2
varying vec3 vertexNormal;
uniform  float temperature;
uniform float scale;
uniform float vegetation;

void main(){
//gl frag color is R G B
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0667, 0.0549, 0.0078));
   vec3 atmosphere = vec3(scale, vegetation, temperature)* pow(intensity,1.5);//atmosphere colour// 0.0863 0.1098 0.1098
    
    gl_FragColor= vec4(atmosphere +texture2D(globeTexture,vertexUV ).xyz, 1.0);
    
    // - for hot earth no life no veg
    // + for normal
    // *low water more distance from sun
    // / for ice planet
}