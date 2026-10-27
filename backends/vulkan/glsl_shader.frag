#version 450 core
layout(location = 0) out vec4 fColor;

layout(set=0, binding=0) uniform sampler2D sTexture;

layout(location = 0) in struct {
    vec4 Color;
    vec2 UV;
} In;

vec3 SRGBToLinear(vec3 color)
{
    bvec3 cutoff = lessThanEqual(color, vec3(0.04045));
    vec3 lower = color / 12.92;
    vec3 upper = pow((color + 0.055) / 1.055, vec3(2.4));
    return mix(upper, lower, cutoff);
}

vec3 LinearToSRGB(vec3 color)
{
    color = max(color, vec3(0.0));
    bvec3 cutoff = lessThanEqual(color, vec3(0.0031308));
    vec3 lower = color * 12.92;
    vec3 upper = 1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055;
    return mix(upper, lower, cutoff);
}

void main()
{
    vec4 textureColor = texture(sTexture, In.UV.st);
    vec3 linearColor = SRGBToLinear(In.Color.rgb) * textureColor.rgb;
    fColor = vec4(LinearToSRGB(linearColor), In.Color.a * textureColor.a);
}
