/* eslint-disable */
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from '@enact/sandstone/Button';
import styles from './Home.css'
import CONFIG from "../../config";
import axios from "axios";
import { fabric } from 'fabric';

const Home = () => {
	// Load the stickers from the server
	const authToken = window.localStorage.getItem('authToken');
	const [shownStickers, setShownStickers] = useState([]);

	const loadDrawing = useCallback(() => {
		const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/gallery/`;

		axios.get(url, {
			headers: {
				'Authorization': `Token ${authToken}`,
			},
		})
			.then((resp) => {
				const allStickers = resp.data;
				const shown = allStickers.filter((sticker) => sticker.shows === true);

				setShownStickers(shown);
			})
			.catch((error) => {
				console.error('Error loading drawing:', error.message);
			});
	}, [authToken]);

	React.useEffect(() => {
		loadDrawing();
	}, [loadDrawing]);

	// Fullscreen-related logic
	const containerRef = useRef(null);
	const [isFullScreen, setIsFullScreen] = useState(false);

	const enterFullscreen = () => {
		if (containerRef.current) {
			if (containerRef.current.requestFullscreen) {
				containerRef.current.requestFullscreen();
			} else if (containerRef.current.webkitRequestFullscreen) {
				containerRef.current.webkitRequestFullscreen();
			} else if (containerRef.current.mozRequestFullScreen) {
				containerRef.current.mozRequestFullScreen();
			} else if (containerRef.current.msRequestFullscreen) {
				containerRef.current.msRequestFullscreen();
			}
		}
	};

	const exitFullscreen = () => {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	};

	const toggleFullscreen = () => {
		if (document.fullscreenElement) {
			setIsFullScreen(false);
			exitFullscreen();
		} else {
			setIsFullScreen(true);
			enterFullscreen();
		}
	};

	// Actual aquarium (Fabric.js canvas)
	const aquariumRef = useRef(null);

	useEffect(() => {
		const canvas = new fabric.Canvas(aquariumRef.current);

		const setCanvasSize = () => {
			const width = isFullScreen ? window.innerWidth : window.innerWidth * 0.8;
			const height = isFullScreen ? window.innerHeight : window.innerHeight * 0.87;
			aquariumRef.current.width = width;
			aquariumRef.current.height = height;
			canvas.setWidth(width);
			canvas.setHeight(height);
			canvas.renderAll();
		};

		setCanvasSize();

		// Create water background gradient
		const waterColor = new fabric.Gradient({
			type: 'linear',
			coords: { x1: 0, y1: 0, x2: 0, y2: canvas.height },
			colorStops: [
				{ offset: 0, color: 'white' },
				{ offset: 0.5, color: '#BBEBFF' },
				{ offset: 1, color: '#76D6FF' },
			],
		});

		canvas.setBackgroundColor(waterColor, canvas.renderAll.bind(canvas));

		// Function to create fish in a grid layout
		const createFishGrid = () => {
			const cols = 5; // Number of columns in the grid
			const rows = Math.ceil(shownStickers.length / cols); // Number of rows based on the number of stickers

			let xOffset = 100; // Initial X position
			let yOffset = 100; // Initial Y position

			shownStickers.forEach((sticker, index) => {
				const svgData = sticker.sticker.svg;
				fabric.loadSVGFromString(svgData, (objects, options) => {
					const fish = fabric.util.groupSVGElements(objects, options);
					fish.set({
						left: xOffset,
						top: yOffset,
						originX: 'center',
						originY: 'center',
						selectable: false,
					});

					fish.scale(0.2);
					canvas.add(fish);
					canvas.renderAll();

					// Update the offset for the next fish in the grid
					xOffset += 300; // Move right for the next fish

					if ((index + 1) % cols === 0) {
						// Move down to the next row after a full row is placed
						xOffset = 300; // Reset X to start of the row
						yOffset += 30; // Move down for the next row
					}
				});
			});
		};

		// Create the fish in a grid layout after stickers are loaded
		if (shownStickers.length > 0) {
			createFishGrid();
		}

	}, [isFullScreen, shownStickers]);

	return (
		<>
			<div ref={containerRef}>
				<canvas ref={aquariumRef} />
				<Button
					className={styles.fsButton}
					backgroundOpacity="transparent"
					size="small"
					icon="fullscreen"
					onClick={toggleFullscreen}
				/>
			</div>
		</>
	);
};

export default Home;
