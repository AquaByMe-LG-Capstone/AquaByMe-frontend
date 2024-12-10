import { useCallback, useState, useEffect } from 'react';
import Button from '@enact/sandstone/Button';
import { fabric } from 'fabric';
import { CirclePicker } from 'react-color';
import useAuth from '../hooks/useAuth';
import CONFIG from '../config';
import axios from 'axios';
import canvasImage from "../assets/fishBowlCanvas.png";
import titleImage from "../assets/LetsDraw.png";

const Sketch = () => {
	const [canvas, setCanvas] = useState(null);
	const [bgColor] = useState("#00ff0000");

	// 그리기/선택 모드 구분
	const [activeTool, setActiveTool] = useState("draw");

	// 브러쉬 초기 설정
	const [lineWidth, setLineWidth] = useState(1);
	const [brushColor, setBrushColor] = useState("#00000");

	// 팔레트 토클
	const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

	useEffect(() => {
		const initCanvas =
			new fabric.Canvas('canvas', {
				width: 1800,
				height: 1200,
				backgroundColor: 'transparent',
				isDrawingMode: true,
			});

		initCanvas.freeDrawingBrush.color = brushColor;
		initCanvas.freeDrawingBrush.width = lineWidth;
		setCanvas(initCanvas);

		fabric.Image.fromURL(canvasImage, (img) => {
			img.scaleToWidth(initCanvas.width);
			img.scaleToHeight(initCanvas.height);
			img.selectable = false;
			img.evented = false;
		});
		return () => {
			initCanvas.dispose();
		};
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (canvas) {
			if (activeTool === "draw") {
				canvas.isDrawingMode = true;
				canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
				canvas.freeDrawingBrush.color = brushColor;
				canvas.freeDrawingBrush.width = lineWidth;
				canvas.contextTop.globalCompositeOperation = "source-over";
			} else if (activeTool === "erase") {
				canvas.isDrawingMode = true;
				canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
				canvas.freeDrawingBrush.color = "rgba(0, 0, 0, 0)";
				canvas.freeDrawingBrush.width = lineWidth;
				canvas.contextTop.globalCompositeOperation = "source-over";
			} else {
				canvas.isDrawingMode = false;
				canvas.selection = activeTool === "select";
				canvas.forEachObject((obj) => (obj.selectable = activeTool === "select"));
			}
			canvas.renderAll();
		}
	}, [activeTool, canvas, brushColor, lineWidth]);

	//MARK: - 두께 설정
	useEffect(() => {
		if (canvas) {
			canvas.freeDrawingBrush.width = lineWidth;
		}
	}, [lineWidth, canvas]);

	const clearCanvas = useCallback(() => {
		if (canvas) {
			canvas.clear();
			canvas.setBackgroundColor("#00ff0000", canvas.renderAll.bind(canvas));
		}
	}, [canvas]);

	//MARK: - 색상 설정
	const changeBrushColor = useCallback(
		(color) => {
			const selectedColor = color.hex;
			setBrushColor(selectedColor);
			if (canvas) {
				canvas.freeDrawingBrush.color = selectedColor;
				canvas.isDrawingMode = true;
				setActiveTool("draw");
			}
		},
		[canvas]);

	const toggleColorPicker = useCallback(() => {
		setIsColorPickerVisible((prev) => !prev);
	}, []);

	//MARK: - 객체 삭제
	const deleteSelectedObjects = useCallback(() => {
		if (canvas) {
			const activeObjects = canvas.getActiveObjects();
			activeObjects.forEach((object) => {
				canvas.remove(object);
			});
			canvas.discardActiveObject();
			canvas.renderAll();
		}
	}, [canvas]);

	//MARK: - 업로드
	const uploadDrawing = useCallback(() => {
		if (canvas) {
			const drawingSVG = canvas.toSVG()
			const removeBackgroundSVG = drawingSVG.replace(/<rect[^>]*fill="[^"]+"[^>]*><\/rect>/g, '');
			const stringFromSVG = removeBackgroundSVG.toString();
			const authToken = window.localStorage.getItem('authToken');

			const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/sticker/`;
			const data = JSON.stringify({ svg: stringFromSVG });

			axios.post(url, data, {
				headers: {
					'Authorization': `Token ${authToken}`,
					'Content-Type': 'application/json',
				},
			})
				.then((resp) => {
					console.log('Post drawing SVG successful:', resp.data);
					clearCanvas()
				})
				.catch((error) => {
					console.error('Signup error:', error.message);
				});
		}

	}, [canvas, useAuth]);

	//MARK: - 레이아웃
	const buttons = [
		{ icon: "trash", onClick: clearCanvas },
		{ icon: "edit", onClick: () => setActiveTool("draw") },
		{ icon: "eraser", onClick: () => setActiveTool("erase") },
		{ icon: "movecursor", onClick: () => setActiveTool("select") },
		{ icon: "closex", onClick: deleteSelectedObjects },
		// { icon: "colorpicker", onClick: toggleColorPicker },
		{ icon: "folderupper", onClick: uploadDrawing },
	];

	const styles = {
		
		container: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			width: "100%",
			height: "100%",
			backgroundColor: "#FFFFFF",
		},
		titleImage: {
			marginTop: "0px",
			maxWidth: "1500px",
		},
		controls: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			marginTop: "40px",
			gap: "3px",
		},
		button: {
			padding: "10px 10px",             // 버튼 내부 여백
			width: "160px",               // 버튼 너비
			height: "160px",              // 버튼 높이
			borderRadius: "50%",         // 완벽한 원형 버튼
			backgroundColor: "#FFE893",  // 배경색
			color: "#FBB4A5",            // 텍스트 색상
			border: "none",              // 테두리 없음
			cursor: "pointer",           // 마우스를 올렸을 때 포인터 커서
			display: "flex",             // 내용 정렬을 위해 flexbox 사용
			justifyContent: "center",    // 아이콘을 수평 중앙 정렬
			alignItems: "center",        // 아이콘을 수직 중앙 정렬
			fontSize: "5px",            // 아이콘 크기 조정
			overflow: "hidden",
		},
		sliderContainer: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			gap: "20px",
		},
		slider: {
			width: "500px",
		},
		colorPicker: {
			display: "inline-block",
			zIndex: 10,
		},
		canvasWrapper: {
			position: "relative",
			width: "100%",
			maxWidth: "1800px",
			height: "1300px",
			marginTop: "5px",
		},
		backgroundImage: {
			position: "absolute",
			top: "0",
			left: "0",
			width: "100%",
			height: "100%",
			zIndex: 1,
		},
		canvas: {
			position: "absolute",
			top: "0",
			left: "0",
			width: "100%",
			height: "100%",
			zIndex: 2,
		},
	};

	return (
		<div style={styles.container}>
			{/* 타이틀 이미지 */}
			<img src={titleImage} alt="Title" style={styles.titleImage} />

			{/* 버튼과 슬라이더 영역 */}
			<div style={styles.controls}>
				{/* 버튼 */}
				{buttons.map(({ icon, onClick }, index) => (
					<Button
						key={index}
						icon={icon}
						iconOnly
						onClick={onClick}
						style={styles.button}
					/>
				))}

				{/* 슬라이더 */}
				<div style={styles.sliderContainer}>
					<input
						type="range"
						min="1"
						max="50"
						step="5"
						value={lineWidth}
						onChange={(e) => setLineWidth(Number(e.target.value))}
						style={styles.slider}
					/>
					<div style={styles.colorPicker}>
						<CirclePicker color={brushColor} onChangeComplete={changeBrushColor} />
					</div>
				</div>
			</div>

			{/* 캔버스 영역 */}
			<div style={styles.canvasWrapper}>
				<img src={canvasImage} alt="Canvas Background" style={styles.backgroundImage} />
				<canvas id="canvas" style={styles.canvas} />
			</div>
		</div>
	);
};

export default Sketch;