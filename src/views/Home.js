// import Alert from '@enact/sandstone/Alert';
// import BodyText from '@enact/sandstone/BodyText';
// import Button from '@enact/sandstone/Button';
// import css from './Main.module.less';
// import $L from '@enact/i18n/$L';
// import {useConfigs} from '../hooks/configs';
// import {usePopup} from './HomeState';
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

		// Returns water color based on depth
		vec3 waterCol() {
			float depth = uv.y;
			vec3 baseCol = mix(bottomCol, getSkyCol(), smoothstep(0.3 * depth, 1., depth));

			return baseCol;
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
