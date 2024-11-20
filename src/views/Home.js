import React from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";

const shaders = Shaders.create({
	aquarium: {
		frag: GLSL`
		precision highp float;
		varying vec2 uv;
		uniform float u_time;

		// Color of bottom water
		const vec3 bottomCol = vec3(0.0588, 0.3098, 0.5647);

		// Colors for different times of the day
		const vec3 morningCol = vec3(0.8078, 0.8863, 1.0);  // Soft blue (morning)
		const vec3 noonCol = vec3(0.6157, 0.8078, 1.0);     // Bright blue (noon)
		const vec3 eveningCol = vec3(1.0, 0.6745, 0.5137);  // Orange-pink (evening)
		const vec3 nightCol = vec3(0.0863, 0.0863, 0.2667);    // Dark blue (night)

		// number of waves
		const int waveCnt = 4;

		// Returns sky color based on time
		vec3 getSkyCol() {
			// vvvvvvv will be a uniform var??? vvvvvvvv
			float dayTime = mod(u_time / 60.0, 1.0);

			// Smooth blend for each phase of the day
			float morningToNoon = smoothstep(0.0, 0.25, dayTime) * (1.0 - smoothstep(0.25, 0.5, dayTime));
			float noonToEvening = smoothstep(0.25, 0.5, dayTime) * (1.0 - smoothstep(0.5, 0.75, dayTime));
			float eveningToNight = smoothstep(0.5, 0.75, dayTime) * (1.0 - smoothstep(0.75, 1.0, dayTime));
			float nightToMorning = smoothstep(0.75, 1.0, dayTime) * (1.0 - smoothstep(0.0, 0.25, dayTime));

			// Combine weights and interpolate colors
			vec3 dayColor = morningCol * morningToNoon +
				noonCol * noonToEvening +
				eveningCol * eveningToNight +
				nightCol * nightToMorning;

			return dayColor;
		}
		
		float waveComponent(vec2 uv, vec3 look) {
			float waveFreq = 5.0;
			vec2 p = uv * waveFreq;
			float t = u_time * 3.0; // Time variable for wave animation

			// Wave contributions
			float bump = sin(p.x * 2.0 + t + sin(p.y * 0.73 + t));
			bump += sin(p.x * 1.43 + t) * 0.5;

			float u = dot(look, vec3(0., 1., 0.));
			bump *= u * smoothstep(9., 1., u);
			bump *= smoothstep(0.5, 1., u) * 0.5;

			return bump;
		}

		// Returns water color based on depth
		vec3 waterCol() {
			float depth = uv.y;
			vec3 color = mix(bottomCol, getSkyCol(), smoothstep(0.3 * depth, 1., depth));

			// calculate and add waves at the top
			vec2 uv2 = uv * 2.0 - 1.0;
			uv2.y *= uv.y / uv.x; // Correct for aspect ratio

			// Compute wave height at the current position
			vec3 lookVec = vec3(0., 0.634, 0.);
			float waveHeight = 0.;
			float bobFactor = 0.08 * (cos(u_time * 0.2) + 1.);

			for(int i = 0; i < waveCnt; i++) {
				float offsetFactor = float(i);
				float wave = waveComponent(uv2 + vec2(0.1 * offsetFactor, 1. / (offsetFactor + 2.)), lookVec) - 0.16 * offsetFactor;
				waveHeight += smoothstep(0.016, 0., abs(wave - uv2.y + 1.2 + 0.2 * offsetFactor));
			}

			color += 0.3 * waveHeight * vec3(0.1, 0.2, 0.4);
			return color;
		}

		void main() {
			gl_FragColor = vec4(waterCol(), 1.0);
		}`
	}
});

class Aquarium extends React.Component {
	render() {
		const { u_time } = this.props;
		return <Node shader={shaders.aquarium} uniforms={{ u_time }} />;
	}
}

const Home = () => {
	return (
		<>
			<Surface width={'100vw'} height={'100vh'}>
				<Aquarium u_time={100} /> {/* u_time will be some sort of time variable */}
			</Surface>
		</>
	);
};

export default Home;
