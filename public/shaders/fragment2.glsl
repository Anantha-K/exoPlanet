export const fragmentShader = `
  uniform sampler2D globeTexture;
  varying vec2 vertexUV;
  varying vec3 vertexNormal;
  uniform float temperature;
  uniform float scale;
  uniform float vegetation;
  uniform float opacity;
  
  void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0078, 0.0667, 0.0157));
    vec3 atmosphere = vec3(scale, vegetation, temperature) * pow(intensity, 1.5);
    vec4 textureColor = texture2D(globeTexture, vertexUV);
    
    vec3 oceanColor = vec3(0.0824, 0.502, 0.0);
    bool isLand = length(textureColor.rgb - oceanColor) > 0.1;
    
    vec3 greenTint = vec3(0.0, vegetation * 0.5, 0.0);
    vec3 finalColor = textureColor.rgb;
    if (isLand) {
      finalColor = mix(finalColor, finalColor + greenTint, vegetation);
    }
    
    finalColor += atmosphere;
    float finalAlpha = textureColor.a * opacity;
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

