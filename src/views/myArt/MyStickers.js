import { VirtualGridList } from '@enact/sandstone/VirtualList';
import React, { useState, useCallback } from 'react';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import CONFIG from '../../config';
import axios from 'axios';
import titleImage from "../../assets/myart.png";
import styles from "../style/ButtonStyle.module.less";

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
                    marginBottom: "50px",
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
        <>
            {/* 상단 타이틀 이미지 */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    width: "1200px", // 고정된 너비
                    height: "200px", // 고정된 높이
                    margin: "0 auto", // 중앙 정렬
                    padding: "20px 0",
                }}
            >
                <img src={titleImage} alt="Title" style={{ maxWidth: "100%" }} />
            </div>
    
            {/* 버튼과 그리드 리스트 컨테이너 */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "1200px", // 고정된 너비
                    height: "800px", // 고정된 높이
                    overflow: "auto",
                    backgroundColor: "#FFFFFF",
                    margin: "20px auto", // 중앙 정렬
                    border: "1px solid #ddd",
                    padding: "10px",
                }}
            >
                {/* 상단 버튼 컨테이너 */}
                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        justifyContent: "center", // 버튼 중앙 정렬
                        alignItems: "center",
                        marginBottom: "30px", // 버튼과 리스트 사이 간격
                    }}
                >
                    {/* 개별 버튼 */}
                    <Button
                        icon="trash"
                        iconOnly
                        onClick={removeSticker}
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
                            transition: "none",
                        }}
                    />
    
                    <Button
                        icon="folderupper"
                        iconOnly
                        onClick={showToggle}
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
                            transition: "none",
                        }}
                    />
                </div>
    
                {/* 구분선 */}
                <div
                    style={{
                        width: "100%",
                        height: "2px",
                        backgroundColor: "#ddd",
                        margin: "10px 0",
                    }}
                ></div>
    
                {/* 스티커 리스트 */}
                {stickers.length > 0 ? (
                    <VirtualGridList
                        dataSize={stickers.length}
                        direction="vertical"
                        itemRenderer={itemRenderer}
                        itemSize={{
                            minHeight: 200,
                            minWidth: 200,
                        }}
                        scrollMode="native"
                        spacing={20}
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
        </>
    );
};

export default MyStickers;