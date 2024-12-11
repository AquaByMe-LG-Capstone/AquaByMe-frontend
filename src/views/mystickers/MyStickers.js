import { VirtualGridList } from '@enact/sandstone/VirtualList';
import React, { useState, useCallback } from 'react';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import CONFIG from '../../config';
import axios from 'axios';
import titleImage from "../../assets/myart.png";

const MyStickers = () => {
    const authToken = window.localStorage.getItem('authToken');

    const [stickers, setStickers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState([]);

    const loadDrawing = useCallback(() => {
        const authToken = window.localStorage.getItem('authToken');
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/sticker/`;

        axios.get(url, {
            headers: {
                'Authorization': `Token ${authToken}`,
            },
        })
            .then((resp) => {
                console.log('Post drawing SVG successful:', resp.data, "🧑🏻‍💻");
                setStickers(resp.data);
            })
            .catch((error) => {
                console.error('Error loading drawing:', error.message, "😍");
            });

    }, []);

    React.useEffect(() => {
        console.log("Loading stickers...");
        loadDrawing();
    }, [loadDrawing]);

    React.useEffect(() => {
        console.log("Updated stickers:", stickers);
    }, [stickers]);

    const toggleSelection = (index) => {
        setSelectedIndex((prevIndexes) => {
            if (prevIndexes.includes(index)) {
                return prevIndexes.filter((i) => i !== index);
            } else {
                return [...prevIndexes, index];
            }
        });
    };

    const showToggle = () => {
        const indexPath = selectedIndex
        const currentId = stickers[indexPath].id
        const currentShows = stickers[indexPath].shows
        const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/sticker/${currentId}`;

        const data = { shows: !currentShows }
        axios.put(url, data, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                console.log(`Sticker ${currentId} updated successfully:`);
                //MARK: - 수정하는 로직 연결
            })
            .catch(() => {
                console.error(`Error updating sticker ${currentId}:`);
            });
    }

    const removeSticker = () => {
        const updatedStickers = [...stickers];

        selectedIndex.forEach((index) => {
            const currentId = stickers[index].id;
            const url = `http://${CONFIG.ipAddress}:${CONFIG.port}/sticker/${currentId}`;

            axios.delete(url, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((resp) => {
                })
                .catch((error) => {
                    console.error(`Error sending sticker ${currentId}:`, error.message);
                });
        });

        const remainingStickers = updatedStickers.filter((_, index) => !selectedIndex.includes(index));
        setStickers(remainingStickers);
        setSelectedIndex([]);
    };

    const itemRenderer = ({ index, ...rest }) => {
        const sticker = stickers[index];

        if (!sticker) {
            console.log("마이스티커가 없어요!\n")
            return null;
        }

        // fields = ['id', 'svg', 'creator', 'created'] 

        const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sticker.svg)}`;

        return (
            <div
                {...rest}
                onClick={() => toggleSelection(index)}
                style={{
                    padding: "0px",
                    position: "relative",
                    backgroundColor: "#EFF6FF",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "black",
                    fontSize: "30px",
                    marginTop: "100px",
                    borderRadius: "50%",
                    border: selectedIndex.includes(index) ? "7px solid #ff7bbf" : "1px solid #ccc",
                    cursor: "pointer",
                    overflow: "hidden",
                }}
            >
                <img
                    src={svgDataUrl}
                    alt={"Sticker"}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                    }}
                />
            </div>
        );
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#FFFFFF",
                margin: "0",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            {/* 타이틀 이미지 */}
            <img
                src={titleImage}
                alt="Title"
                style={{
                    maxWidth: "100%",
                    maxHeight: "250px",
                    marginBottom: "30px",
                }}
            />

            {/* 버튼과 그리드 리스트 컨테이너 */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "1300px", // 고정된 너비
                    height: "1000px", // 고정된 높이 줄임
                    overflow: "auto",
                    backgroundColor: "#FFFFFF",
                    margin: "20px auto", // 중앙 정렬
                    padding: "10px",
                }}
            >
                {/* 상단 버튼 컨테이너 */}
                <div
                    style={{
                        display: "flex",
                        gap: "15px", // 버튼 간 간격 줄임
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "10px", // 버튼과 리스트 사이 간격 줄임
                    }}
                >
                    {/* 개별 버튼 */}
                    <Button
                        icon="trash"
                        iconOnly
                        onClick={removeSticker}
                        style={{
                            width: "70px",
                            height: "70px",
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
                            transition: "none",
                        }}
                    />

                    {/* <Button
                        icon="check"
                        iconOnly
                        onClick={showToggle}
                        style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                            backgroundColor: "#FFE893",
                            color: "#FBB4A5",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "14px", // 폰트 크기 줄임
                            overflow: "hidden",
                            transition: "none",
                        }}
                    /> */}
                </div>

                {/* 구분선 */}
                <div
                    style={{
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#ddd",
                        margin: "10px 0",
                        marginBottom: "5px"
                    }}
                ></div>

                {/* 스티커 리스트 */}
                {stickers.length > 0 ? (
                    <VirtualGridList
                        dataSize={stickers.length}
                        direction="vertical"
                        itemRenderer={itemRenderer}
                        itemSize={{
                            minHeight: 150,
                            minWidth: 150,
                        }}
                        scrollMode="native"
                        spacing={15} // 간격 줄임
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    />
                ) : (
                    <BodyText size="small" style={{ textAlign: "center" }}>
                        스티커를 그려보세요!
                    </BodyText>
                )}
            </div>
        </div>
    );
};

export default MyStickers;