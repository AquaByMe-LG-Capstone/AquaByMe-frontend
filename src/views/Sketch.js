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

	// Undo/Redo
	const [state, setState] = useState([]); 
	const [redoState, setRedoState] = useState([]);
	const [currentStateIndex, setCurrentStateIndex] = useState(-1); 

	// 그리기/선택 모드 구분
	const [activeTool, setActiveTool] = useState("select");

	// 브러쉬 초기 설정
	const [lineWidth, setLineWidth] = useState(1);
	const [brushColor, setBrushColor] = useState("#00000");

	// 팔레트 토클
	// const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

	useEffect(() => {
		const initCanvas =
			new fabric.Canvas('canvas', {
				width: 1800,
				height: 1200,
				backgroundColor: 'transparent',
				isDrawingMode: true,
			});
		
		fabric.Image.fromURL(canvasImage, (img) => {
			img.scaleToWidth(initCanvas.width);
			img.scaleToHeight(initCanvas.height);
			img.selectable = false;
			img.evented = false;
		});

		setCanvas(initCanvas);
		setState([initCanvas.toJSON()]);
        setCurrentStateIndex(0);

		return () => {
			initCanvas.dispose();
		};
		// eslint-disable-next-line
	}, []);

	//MARK: - 두께 설정
	useEffect(() => {
		if (canvas) {
			canvas.freeDrawingBrush.width = lineWidth;
		}
	}, [lineWidth, canvas]);

	// 캔버스 상태 저장
	useEffect(() => {
		if (canvas) {
			const saveState = (event) => {
                const currentState = canvas.toJSON();

				if (activeTool === "draw") {
					console.log("드로잉 작업 발생! Redo 상태 초기화");
					setRedoState([]);
				}

				// Undo 이후 새로운 작업 O
                if (currentStateIndex < state.length - 1) {
                    const updatedState = [...state.slice(0, currentStateIndex + 1), currentState];
                    setState(updatedState);
                    setCurrentStateIndex(updatedState.length - 1);
					console.log("UNDO 이후 새로운 작업")
                } else {

					// Undo 이후 새로운 작업 X
                    const updatedState = [...state, currentState];
                    setState(updatedState);
                    setCurrentStateIndex(updatedState.length - 1);
					console.log("UNDO 이후 암것도 안함")
                }
            };

            canvas.on("object:added", saveState);
            canvas.on("object:modified", saveState);
            canvas.on("object:removed", saveState);

            return () => {
                canvas.off("object:added", saveState);
                canvas.off("object:modified", saveState);
                canvas.off("object:removed", saveState);
            };
        }
    }, [canvas, state, currentStateIndex]);

	// Undo 기능
	const undo = () => {
		if (currentStateIndex > 0) {
			const previousState = state[currentStateIndex - 1];
			setRedoState([state[currentStateIndex], ...redoState]);
			canvas.loadFromJSON(previousState, () => {
				canvas.renderAll();
				setCurrentStateIndex(currentStateIndex - 1);
			});
		}
	};

	// Redo 기능
	const redo = () => {
        if (redoState.length > 0) {
            const nextState = redoState[0];
            setRedoState(redoState.slice(1));
            setState([...state, nextState]);
            setCurrentStateIndex(currentStateIndex + 1);

            canvas.loadFromJSON(nextState, () => {
                canvas.renderAll();
            });
        }
    };

	//MARK: - Trash 기능 설정
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

	// const toggleColorPicker = useCallback(() => {
	// 	setIsColorPickerVisible((prev) => !prev);
	// }, []);

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
		{ icon: "undo", onClick: undo },
		{ icon: "redo", onClick: redo },
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
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between", // 위와 아래 사이 공간 분배
				alignItems: "center",
				width: "100vw", // 전체 화면 너비
				height: "100vh", // 전체 화면 높이
				backgroundColor: "#FFFFFF",
				margin: "0",
				padding: "20px", // 전체 패딩
				boxSizing: "border-box", // 패딩 포함
			}}
		>
			{/* 타이틀 이미지 */}
			<img
				src={titleImage}
				alt="Title"
				style={{
					maxWidth: "90%", // 너비 조정
					maxHeight: "150px", // 고정된 높이
					marginBottom: "20px",
				}}
			/>
	
			{/* 버튼과 슬라이더 영역 */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					maxWidth: "1200px",
					padding: "10px",
				}}
			>
				{/* 버튼 */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: "20px", // 버튼 간격
						marginBottom: "20px",
					}}
				>
					{buttons.map(({ icon, onClick }, index) => (
						<Button
							key={index}
							icon={icon}
							iconOnly
							onClick={onClick}
							style={{
								width: "100px",
								height: "100px",
								borderRadius: "50%",
								backgroundColor: "#FFE893",
								color: "#FBB4A5",
								border: "none",
								cursor: "pointer",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								fontSize: "14px",
								overflow: "hidden",
							}}
						/>
					))}
				</div>
	
				{/* 슬라이더 */}
				<div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
					<input
						type="range"
						min="1"
						max="50"
						step="5"
						value={lineWidth}
						onChange={(e) => setLineWidth(Number(e.target.value))}
						style={{
							width: "300px",
							height: "5px",
							borderRadius: "5px",
						}}
					/>
					<div>
						<CirclePicker color={brushColor} onChangeComplete={changeBrushColor} />
					</div>
				</div>
			</div>
	
			{/* 캔버스 영역 */}
			<div
				style={{
					position: "relative",
					width: "50%",
					flex: "1", // 빈 공간 채우기
					marginTop: "20px",
					borderRadius: "8px",
					backgroundColor: "#FFFFF",
				}}
			>
				<img
					src={canvasImage}
					alt="Canvas Background"
					style={{
						position: "absolute",
						top: "0",
						left: "0",
						width: "100%",
						height: "95%",
						zIndex: 1,
					}}
				/>
				<canvas
					id="canvas"
					style={{
						position: "absolute",
						top: "0",
						left: "0",
						width: "100%",
						height: "100%",
						zIndex: 2,
					}}
				/>
			</div>
		</div>
	);
};

export default Sketch;